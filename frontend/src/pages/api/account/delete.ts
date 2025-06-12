import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user || !session.user.id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        await prisma.user.delete({
            where: { id: session.user.id },
        });

        res.status(200).json({ message: 'Account deleted successfully.' });

    } catch (error) {
        console.error('Failed to delete account:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
} 