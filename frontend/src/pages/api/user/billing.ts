import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.email) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Ambil semua transaksi billing user
  if (req.method === 'GET') {
    // Use the correct model: purchaseHistory (not purchase)
    const purchases = await prisma.purchaseHistory.findMany({
        where: { user: { email: session.user.email } },
        orderBy: { createdAt: 'desc' },
        include: { user: true }
    });
    // Filter only purchases for the current user (by email)
    const filtered = purchases.filter(p => p.user?.email === session.user.email);
    return res.status(200).json(filtered);
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
