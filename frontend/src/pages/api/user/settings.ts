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
    // Only select fields that exist in the User model
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, email: true, name: true, image: true, bio: true, language: true, credits: true, createdAt: true }
    });
    return res.status(200).json(user || {});
  }

  if (req.method === 'PUT') {
    // Only update fields that exist in the User model
    const { name, image, bio, language } = req.body;
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: { name, image, bio, language },
      select: { id: true, email: true, name: true, image: true, bio: true, language: true, credits: true, createdAt: true }
    });
    return res.status(200).json(user);
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
