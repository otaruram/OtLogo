import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.email) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    // Ambil data user dari Prisma
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, name: true, email: true, image: true, bio: true, createdAt: true }
    });
    return res.status(200).json(user);
  }

  if (req.method === 'PUT') {
    const { name, bio } = req.body;
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: { name, bio },
      select: { id: true, name: true, email: true, image: true, bio: true, createdAt: true }
    });
    return res.status(200).json(user);
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
