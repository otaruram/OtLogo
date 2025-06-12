import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user || !session.user.id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    
    if (newPassword.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { id: session.user.id } });

        if (!user || !user.hashedPassword) {
            // This case handles users who signed up with an OAuth provider
            return res.status(400).json({ message: 'Password change is not available for your account type.' });
        }

        const isPasswordCorrect = await bcrypt.compare(currentPassword, user.hashedPassword);

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Incorrect current password.' });
        }

        const newHashedPassword = await bcrypt.hash(newPassword, 12);

        await prisma.user.update({
            where: { id: session.user.id },
            data: { hashedPassword: newHashedPassword },
        });

        res.status(200).json({ message: 'Password updated successfully.' });

    } catch (error) {
        console.error('Failed to change password:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
} 