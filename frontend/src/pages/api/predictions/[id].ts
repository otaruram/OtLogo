import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getPrediction } from "@/lib/predictions";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "ID is required" });
  }

  try {
    const dbPrediction = await prisma.prediction.findUnique({
      where: { id },
    });

    if (!dbPrediction || dbPrediction.userId !== session.user.id) {
      return res.status(404).json({ message: "Prediction not found" });
    }

    if (dbPrediction.status === "succeeded" || dbPrediction.status === "failed" || dbPrediction.status === "canceled") {
      return res.status(200).json(dbPrediction);
    }

    const replicatePrediction = await getPrediction(id);

    if (replicatePrediction.status !== dbPrediction.status) {
      const updatedDbPrediction = await prisma.prediction.update({
        where: { id },
        data: {
          status: replicatePrediction.status,
          output: replicatePrediction.output,
          metrics: replicatePrediction.metrics,
        },
      });
      return res.status(200).json(updatedDbPrediction);
    }

    res.status(200).json(dbPrediction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch prediction" });
  }
} 