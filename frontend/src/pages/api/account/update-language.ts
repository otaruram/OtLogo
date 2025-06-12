import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user?.id) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    const { language } = req.body;
    if (!language || typeof language !== 'string') {
        return res.status(400).json({ message: 'Language code is required.' });
    }

    try {
        await prisma.user.update({
            where: {
                id: session.user.id,
            },
            data: {
                language: language,
            },
        });
        res.status(200).json({ message: 'Language updated successfully' });
    } catch (error) {
        console.error('Failed to update language:', error);
        res.status(500).json({ message: 'Failed to update language' });
    }
} 