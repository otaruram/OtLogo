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
        const { prediction } = req.body;

        if (!prediction || !prediction.id || !prediction.input?.prompt || !prediction.output?.[0]) {
            return res.status(400).json({ message: 'Invalid prediction data provided.' });
        }
        
        const savedLogo = await prisma.logo.create({
            data: {
                predictionId: prediction.id,
                prompt: prediction.input.prompt,
                imageUrl: prediction.output[0],
                status: prediction.status,
                createdAt: new Date(prediction.created_at),
                userId: session.user.id, 
            },
        });

        res.status(200).json({ message: 'Logo saved successfully', logo: savedLogo });

    } catch (error) {
        console.error('Failed to save logo:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
} 