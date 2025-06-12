import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handleDeleteUser(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    res.setHeader('Allow', 'DELETE');
    return res.status(405).end('Method Not Allowed');
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.id) {
    return res.status(401).json({ message: 'You must be logged in to delete your account.' });
  }

  try {
    const userId = session.user.id;

    // The database schema is set up with cascading deletes,
    // so deleting the user will also delete their related data (accounts, sessions, etc.)
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return res.status(200).json({ message: 'Account deleted successfully.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'An error occurred while deleting your account.' });
  } finally {
    await prisma.$disconnect();
  }
} 