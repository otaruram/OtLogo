import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    // We don't throw an error if the user is not logged in,
    // as we still want to allow non-logged-in users to change the language.
    // The preference just won't be saved for them.
    return res.status(200).json({ message: 'User not logged in. Language preference not saved.' });
  }

  const { language } = req.body;

  if (!language || typeof language !== 'string') {
      return res.status(400).json({ message: 'Language code is required.' });
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { language },
    });
    res.status(200).json({ message: 'Language updated successfully' });
  } catch (error) {
    console.error('Failed to update language:', error);
    res.status(500).json({ message: 'Failed to update language' });
  }
} 