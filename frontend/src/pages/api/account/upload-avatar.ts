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
    
    // In a real application, you would use a library like `formidable` or `multer`
    // to handle the file upload, then stream it to a cloud storage service
    // like AWS S3, Google Cloud Storage, or Vercel Blob Storage.

    console.log("Mock Avatar Upload Request Received for user:", session.user.email);
    console.log("Request body (first 100 chars):", JSON.stringify(req.body).substring(0, 100));


    // For this mock, we'll just pretend the upload was successful and
    // return a placeholder image URL. We'll use a fun placeholder service.
    const mockImageUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${session.user.email}`;

    // Here, you would also update the user's record in your database
    // with the new avatar URL. e.g., prisma.user.update(...)

    res.status(200).json({ imageUrl: mockImageUrl });
}

// You need to disable the default body parser for file uploads to work correctly
// with libraries that stream the request body.
export const config = {
    api: {
        bodyParser: false,
    },
}; 