import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ message: 'Image URL is required' });
  }

  try {
    const imageResponse = await fetch(url);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch the image from the source. Status: ${imageResponse.status}`);
    }

    const contentType = imageResponse.headers.get('content-type') || 'application/octet-stream';
    const blob = await imageResponse.blob();
    const buffer = Buffer.from(await blob.arrayBuffer());

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', 'attachment; filename="logo.png"');
    res.setHeader('Content-Length', buffer.length);
    
    res.status(200).send(buffer);

  } catch (error) {
    console.error('Image download proxy error:', error);
    res.status(500).json({ message: 'Failed to download image' });
  }
} 