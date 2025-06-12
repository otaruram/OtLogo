import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session || !session.user?.email) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  // Cek apakah user memiliki password yang di-hash. 
  // Jika tidak, berarti mereka login via OAuth.
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { hashedPassword: true },
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Jika hashedPassword null atau string kosong, berarti itu akun OAuth
  const isOAuth = !user.hashedPassword;

  res.status(200).json({ isOAuth });
} 