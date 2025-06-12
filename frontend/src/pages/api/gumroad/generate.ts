import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]";

// Map untuk menyimpan permalink Gumroad berdasarkan jumlah kredit
const creditPermalinkMap: { [key: number]: string | undefined } = {
    50: process.env.GUMROAD_PERMALINK_50_CREDITS,
    200: process.env.GUMROAD_PERMALINK_200_CREDITS,
    500: process.env.GUMROAD_PERMALINK_500_CREDITS,
};

// Map untuk nama varian produk di Gumroad
const creditVariantMap: { [key: number]: string } = {
  50: "50 Credits",
  200: "200 Credits",
  500: "500 Credits",
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const session = await getServerSession(req, res, authOptions);
        if (!session || !session.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        
        const { credits } = req.body;
        if (!credits || !creditPermalinkMap.hasOwnProperty(credits)) {
            return res.status(400).json({ message: 'Invalid credit package selected.' });
        }
        
        const gumroadPermalink = creditPermalinkMap[credits];
        const variant = creditVariantMap[credits];

        if (!gumroadPermalink) {
            console.error(`GUMROAD_PERMALINK for ${credits} credits is not set in .env`);
            return res.status(500).json({ message: 'Gumroad product URL is not configured for this package.' });
        }

        // Buat URL Gumroad dengan varian yang sesuai
        const gumroadUrl = `${gumroadPermalink}?variant=${encodeURIComponent(variant)}`;

        res.status(200).json({ purchaseUrl: gumroadUrl });

    } catch (error) {
        console.error('Error generating Gumroad link:', error);
        res.status(500).json({ message: 'Failed to generate Gumroad link' });
    }
} 