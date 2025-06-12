import { getSession } from 'next-auth/react';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import prisma from '@/lib/prisma';
import Image from 'next/image';
import { Copy, Share2, Download } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { Logo } from '@prisma/client';

type SerializedLogo = Omit<Logo, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
};

export const getServerSideProps: GetServerSideProps<{ logos: SerializedLogo[] }> = async (context) => {
  const session = await getSession(context);

  if (!session || !session.user?.id) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const logos = await prisma.logo.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const serializedLogos = logos.map(logo => ({
    ...logo,
    createdAt: logo.createdAt.toISOString(),
  }));

  return {
    props: { logos: serializedLogos },
  };
};

const MyLogosPage = ({ logos }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  
  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('Image URL copied to clipboard!');
  };

  const handleDownload = async (url: string, prompt: string) => {
    toast.loading('Preparing download...');
    try {
      const response = await fetch(`/api/download-image?url=${encodeURIComponent(url)}`);
      if (!response.ok) throw new Error('Failed to fetch image.');
      
      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = `${prompt.replace(/ /g, '_').slice(0, 20)}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(objectUrl);
      toast.dismiss();
      toast.success('Download started!');
    } catch (error) {
      toast.dismiss();
      toast.error('Could not download the image.');
      console.error(error);
    }
  };

  return (
    <>
      <Toaster position="bottom-center" />
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Logos</h1>
      
      {logos.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg bg-gray-50">
          <p className="text-gray-500 mb-4">You haven't created any logos yet.</p>
          <Link href="/config" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition-colors">
            Generate Your First Logo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {logos.map((logo) => (
            <div key={logo.id} className="group relative border rounded-lg shadow-md bg-white overflow-hidden transition-shadow hover:shadow-xl">
              <div className="relative w-full aspect-square bg-gray-100">
                <Image src={logo.imageUrl} alt={logo.prompt} fill className="object-cover" />
              </div>
              <div className="p-4">
                <p className="font-semibold text-gray-700 truncate" title={logo.prompt}>{logo.prompt}</p>
                <p className="text-sm text-gray-500">
                  {new Date(logo.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <button onClick={() => handleDownload(logo.imageUrl, logo.prompt)} className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-transform hover:scale-110" title="Download">
                  <Download className="w-5 h-5 text-gray-700" />
                </button>
                <button onClick={() => handleCopy(logo.imageUrl)} className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-transform hover:scale-110" title="Copy URL">
                  <Copy className="w-5 h-5 text-gray-700" />
                </button>
                <button onClick={() => navigator.share ? navigator.share({ title: logo.prompt, url: logo.imageUrl }) : handleCopy(logo.imageUrl)} className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-transform hover:scale-110" title="Share">
                   <Share2 className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default MyLogosPage; 