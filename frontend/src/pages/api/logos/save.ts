import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from '../auth/[...nextauth]';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { predictionId, prompt, imageUrl } = req.body;

  if (!predictionId || !prompt || !imageUrl) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newLogo = await prisma.logo.create({
      data: {
        predictionId,
        prompt,
        imageUrl,
        userId: session.user.id,
        status: 'completed',
        createdAt: new Date(),
      },
    });
    res.status(201).json(newLogo);
  } catch (error) {
    console.error("Failed to save logo:", error);
    // Cek jika logo sudah ada (berdasarkan predictionId)
    if (error instanceof Error && (error as any).code === 'P2002') {
        return res.status(409).json({ message: 'This logo has already been saved.' });
    }
    res.status(500).json({ message: 'Internal Server Error' });
  }
} 