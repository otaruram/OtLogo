import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import Replicate from 'replicate';
import prisma from '@/lib/prisma';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// This is the specific version of the background removal model - lucataco/remove-bg
const MODEL_VERSION = "95fcc2a26d3899cd6c2691c9e261a2c93b64410a975773b4d455434f44230118";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user || !session.user.id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check for sufficient credits
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user || (user.credits ?? 0) < 1) {
        return res.status(402).json({ message: 'Insufficient credits for this action.' });
    }

    try {
        const { imageUrl } = req.body;
        if (!imageUrl) {
            return res.status(400).json({ message: 'Image URL is required.' });
        }

        // The model expects a public URL to an image
        const output = await replicate.run(
            `lucataco/remove-bg:${MODEL_VERSION}`,
            {
                input: {
                    image: imageUrl
                }
            }
        );
        
        // Deduct one credit for the edit
        await prisma.user.update({
            where: { id: session.user.id },
            data: { credits: { decrement: 1 } },
        });

        res.status(200).json({ newImageUrl: output });

    } catch (error) {
        console.error('Replicate API call failed:', error);
        res.status(500).json({ message: 'Failed to start background removal.' });
    }
} 