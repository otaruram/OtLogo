import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const BillingPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [billing, setBilling] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
      return;
    }
    if (status === 'authenticated') {
      const fetchBilling = async () => {
        setLoading(true);
        const res = await fetch('/api/user/billing');
        if (res.ok) {
          setBilling(await res.json());
        }
        setLoading(false);
      };
      fetchBilling();
    }
  }, [status, router]);

  if (status === 'loading' || loading) return <div>Loading...</div>;
  if (!billing.length) return <div>No billing history found.</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Billing History</h2>
      <ul>
        {billing.map((item: any) => (
          <li key={item.id} className="mb-2">
            {item.description || 'Purchase'} - {item.amount || item.pricePaid} {item.currency || ''} ({item.createdAt ? new Date(item.createdAt).toLocaleString() : '-'})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BillingPage;
