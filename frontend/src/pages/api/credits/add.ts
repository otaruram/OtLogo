import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

// This endpoint would typically be protected by a secret key or webhook signature
// For simplicity, we're just checking for a valid user session.

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const session = await getSession({ req });
  if (!session || !session.user?.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { amount } = req.body;

  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ message: 'Invalid amount' });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        credits: {
          increment: amount,
        },
      },
    });

    res.status(200).json({ newCredits: updatedUser.credits });
  } catch (error) {
    console.error('Failed to add credits:', error);
    res.status(500).json({ message: 'Failed to add credits' });
  }
} 