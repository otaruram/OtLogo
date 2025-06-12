import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '@/lib/prisma';
import { PurchaseHistory } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user?.id) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    try {
        const purchases = await prisma.purchaseHistory.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 50, // Batasi untuk 50 transaksi terakhir
        });

        // Format data agar lebih mudah digunakan di frontend
        const formattedPurchases = purchases.map((p: PurchaseHistory) => ({
            id: p.id,
            date: new Date(p.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
            time: new Date(p.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            provider: p.provider,
            credits: p.creditsAmount,
            price: new Intl.NumberFormat('id-ID', { style: 'currency', currency: p.currency }).format(p.pricePaid),
        }));

        res.status(200).json(formattedPurchases);
    } catch (error) {
        console.error('Failed to fetch purchase history:', error);
        res.status(500).json({ message: 'Failed to fetch purchase history' });
    }
} 