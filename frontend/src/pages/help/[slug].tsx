import AccountLayout from '@/components/AccountLayout';
import { useRouter } from 'next/router';
import { FiLoader, FiArrowLeft } from 'react-icons/fi';
import { helpData, Category, Article } from '@/lib/help-articles';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const slugify = (text: string) =>
  text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');

const HelpCategoryPage = ({ category }: { category: Category | null }) => {
    const router = useRouter();

    if (router.isFallback) {
        return (
            <AccountLayout>
                <div className="flex items-center justify-center p-12">
                    <FiLoader className="animate-spin text-4xl text-brand-neon" />
                </div>
            </AccountLayout>
        );
    }
    
    if (!category) {
        return (
             <AccountLayout>
                <div className="text-center">
                    <h1 className="text-4xl font-bold">404 - Category Not Found</h1>
                    <p className="mt-4">We couldn't find the help topic you were looking for.</p>
                     <Link href="/help" className="mt-6 inline-block px-6 py-3 bg-brand-neon text-white font-bold rounded-lg">
                        Back to Help Center
                    </Link>
                </div>
            </AccountLayout>
        )
    }

    return (
        <AccountLayout>
            <div className="max-w-4xl mx-auto">
                 <Link href="/help" className="flex items-center gap-2 text-gray-500 font-bold mb-6 hover:text-brand-neon">
                    <FiArrowLeft />
                    Back to Help Center
                </Link>

                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-brand-text mb-2">
                        {category.name}
                    </h1>
                    <p className="text-lg text-gray-600">{category.description}</p>
                </div>

                <div className="space-y-6">
                    {category.articles.map((article) => (
                         <div key={article.slug} className="bg-white p-8 rounded-lg shadow-hard border-2 border-brand-text">
                            <h2 className="text-2xl font-bold text-brand-text mb-3">{article.title}</h2>
                            <div 
                                className="prose prose-lg max-w-none prose-p:text-gray-700 prose-strong:text-brand-text"
                                dangerouslySetInnerHTML={{ __html: article.content }} 
                            />
                        </div>
                    ))}
                </div>
            </div>
        </AccountLayout>
    );
};

export default HelpCategoryPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params || {};
  
  const category = helpData.find(c => slugify(c.name) === slug) || null;
  
  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? 'en', ['common'])),
      category,
    },
  };
}; 