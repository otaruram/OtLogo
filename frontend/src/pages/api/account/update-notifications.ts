import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const session = await getSession({ req });
    if (!session || !session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { marketing, activity, security } = req.body;

    // In a real app, you would save these preferences to your database
    // e.g., await prisma.user.update({ where: { id: session.user.id }, data: { notifications: { marketing, activity, security } } });

    console.log(`Notification settings updated for ${session.user.email}:`, req.body);
    
    // Here you could also trigger real emails based on changes.
    // For example, if security notifications were just enabled, send a confirmation.
    
    res.status(200).json({ message: 'Notification settings updated successfully.' });
} 