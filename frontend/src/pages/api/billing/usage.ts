import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const usageHistory = await prisma.prediction.findMany({
      where: {
        userId: session.user.id,
        status: 'succeeded', // Hanya tampilkan yang berhasil
      },
      orderBy: {
        created_at: 'desc',
      },
      select: {
        id: true,
        created_at: true,
        input: true,
      },
      take: 50, // Batasi 50 catatan terakhir
    });

    // Format data agar lebih mudah digunakan di frontend
    const formattedHistory = usageHistory.map(p => ({
        id: p.id,
        date: p.created_at.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
        time: p.created_at.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        prompt: (p.input as any)?.prompt || 'No prompt provided',
        cost: 1 // Asumsikan setiap generasi berbiaya 1 kredit
    }));

    res.status(200).json(formattedHistory);
  } catch (error) {
    console.error('Failed to fetch usage history:', error);
    res.status(500).json({ message: 'Failed to fetch usage history' });
  }
} 