import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { createPrediction } from "@/lib/predictions";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { z } from "zod";
import Replicate from 'replicate';

const predictionRequestSchema = z.object({
  prompt: z.string().min(2, { message: "Prompt must be at least 2 characters long" }),
  image: z.string().url().optional(),
});

const MODEL_VERSION_FLUX_LOGO = "366f3ca1cbb40257daa290ed1f5078749cc490e037b189b0564d7fe5a30c066a";
const MODEL_VERSION_IDEOGRAM = "67ed00e8999fecd32035074fa0f2e9a31ee03b57a8415e6a5e2f93a242ddd8d2";
const MODEL_UPSCALER = "f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.id) {
    return res.status(401).json({ detail: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    try {
      // Check user credits
      const user = await prisma.user.findUnique({ where: { id: session.user.id } });
      if (!user || (user.credits ?? 0) < 1) {
        return res.status(402).json({ detail: 'Not enough credits' });
      }

      // Decrement credits
      await prisma.user.update({
        where: { id: session.user.id },
        data: { credits: { decrement: 1 } },
      });

      const { prompt } = req.body;
      const replicatePrediction = await replicate.predictions.create({
        version: MODEL_VERSION_IDEOGRAM,
        input: { prompt },
        webhook: `${process.env.NGROK_HOST}/api/webhooks/replicate`,
        webhook_events_filter: ["completed"]
      });

      if (replicatePrediction?.error) {
        return res.status(500).json({ detail: replicatePrediction.error });
      }

      // Save the initial prediction to our database
      const dbPrediction = await prisma.prediction.create({
        data: {
          id: replicatePrediction.id,
          userId: session.user.id,
          status: replicatePrediction.status,
          input: replicatePrediction.input,
          version: replicatePrediction.version,
          created_at: new Date(replicatePrediction.created_at),
        }
      });

      res.status(201).json(dbPrediction);
    } catch (error) {
      console.error('Prediction failed:', error);
      res.status(500).json({ detail: 'Failed to start prediction' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 