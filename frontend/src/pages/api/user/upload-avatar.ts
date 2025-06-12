import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import prisma from '@/lib/prisma';
import { upload, cloudinary } from '@/lib/cloudinary';
import { Readable } from 'stream';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

// Helper to disable Next.js body parsing, so we can use multer
export const config = {
    api: {
        bodyParser: false,
    },
};

const uploadMiddleware = upload.single('profilePicture');

export default async function handler(req: NextApiRequest & { file?: Express.Multer.File }, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // @ts-ignore
    uploadMiddleware(req, res, async (err) => {
        if (err) {
            console.error('Multer error:', err);
            return res.status(500).json({ message: 'File upload failed' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        try {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: "profile_pictures", resource_type: "image" },
                async (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
                    if (error || !result) {
                        console.error('Cloudinary upload error:', error);
                        return res.status(500).json({ message: 'Image upload to Cloudinary failed' });
                    }
                    
                    const updatedUser = await prisma.user.update({
                        where: { id: session.user.id },
                        data: { image: result.secure_url },
                    });
                    
                    res.status(200).json({ imageUrl: updatedUser.image });
                }
            );

            const readableStream = new Readable();
            readableStream.push(req.file.buffer);
            readableStream.push(null);
            readableStream.pipe(uploadStream);

        } catch (error) {
            console.error('Profile picture update error:', error);
            res.status(500).json({ message: 'Failed to update profile picture' });
        }
    });
} 