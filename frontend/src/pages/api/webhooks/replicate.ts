import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const prediction = req.body;

  if (prediction.status === "succeeded") {
    const originalPrediction = await prisma.prediction.findUnique({
      where: { id: prediction.id }
    });

    if (originalPrediction && originalPrediction.userId) {
      // Perbarui prediksi
      await prisma.prediction.update({
        where: { id: prediction.id },
        data: {
          status: prediction.status,
          output: prediction.output,
          completed_at: prediction.completed_at,
          webhook_completed: true,
        },
      });

      // Ambil prompt dari input
      const prompt = (originalPrediction.input as any)?.prompt || 'Untitled Logo';
      const imageUrl = prediction.output?.[0];

      if (imageUrl) {
        // Buat entri logo baru
        await prisma.logo.create({
          data: {
            predictionId: prediction.id,
            prompt: prompt,
            imageUrl: imageUrl,
            status: 'completed',
            createdAt: new Date(),
            userId: originalPrediction.userId,
          }
        });
      }
    }
  } else if (
    prediction.status === "failed" ||
    prediction.status === "canceled"
  ) {
    await prisma.prediction.update({
      where: {
        id: prediction.id,
      },
      data: {
        status: prediction.status,
        error: prediction.error,
        completed_at: prediction.completed_at,
        webhook_completed: true,
      },
    });
  }

  res.status(200).json({ message: "Webhook received" });
} 