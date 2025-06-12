import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useTranslation } from 'next-i18next';
import { FiDownload, FiDollarSign, FiFileText, FiClock, FiDatabase } from 'react-icons/fi';
import AccountLayout from '@/components/AccountLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Extend the jsPDF type to include autoTable
declare module 'jspdf' {
    interface jsPDF {
        autoTable: (options: any) => jsPDF;
    }
}

type HistoryItem = {
    id: string;
    date: string;
    time: string;
    type: 'purchase' | 'usage';
    description: string;
    amount: string | number;
    credits?: number;
    provider?: string;
    currency?: string;
    pricePaid?: number;
    originalDate: Date;
};

const BillingHistoryPage = () => {
    const { data: session } = useSession();
    const { t } = useTranslation('common');
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [purchasesRes, usageRes] = await Promise.all([
                    fetch('/api/billing/purchases'),
                    fetch('/api/billing/usage'),
                ]);

                if (!purchasesRes.ok || !usageRes.ok) {
                    throw new Error('Failed to load billing history');
                }

                const purchasesData = await purchasesRes.json();
                const usageData = await usageRes.json();

                const combinedHistory: HistoryItem[] = [
                    ...purchasesData.map((p: any) => ({
                        id: p.id,
                        date: p.date,
                        time: p.time,
                        type: 'purchase' as 'purchase',
                        description: `${p.credits} Credits Pack`,
                        amount: p.price,
                        credits: p.credits,
                        provider: p.provider,
                        currency: p.currency,
                        pricePaid: parseFloat(p.price.replace(/[^0-9.-]+/g,"")),
                        originalDate: new Date(p.originalDate), 
                    })),
                    ...usageData.map((u: any) => ({
                        id: u.id,
                        date: u.date,
                        time: u.time,
                        type: 'usage' as 'usage',
                        description: u.prompt,
                        amount: `-1 Credit`,
                        originalDate: new Date(u.originalDate),
                    })),
                ];
                
                combinedHistory.sort((a, b) => new Date(b.originalDate).getTime() - new Date(a.originalDate).getTime());

                setHistory(combinedHistory.slice(0, 100));
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const generateInvoice = (item: HistoryItem) => {
        if (item.type !== 'purchase' || !item.pricePaid) return;
        const doc = new jsPDF();
        const taxRate = 0.05;
        const subtotal = item.pricePaid;
        const tax = subtotal * taxRate;
        const total = subtotal + tax;

        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('OtLog Inc.', 14, 22);
        
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('INVOICE', 200, 22, { align: 'right' });

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('BILL TO', 14, 50);
        doc.setFont('helvetica', 'normal');
        doc.text(session?.user?.name || 'Valued User', 14, 56);
        doc.text(session?.user?.email || '', 14, 61);

        const detailsX = 140;
        doc.setFont('helvetica', 'bold');
        doc.text('Invoice #:', detailsX, 50);
        doc.text('Invoice Date:', detailsX, 56);
        doc.setFont('helvetica', 'normal');
        doc.text(item.id, detailsX + 30, 50);
        doc.text(item.date, detailsX + 30, 56);

        doc.autoTable({
            startY: 75,
            head: [['QTY', 'DESCRIPTION', 'UNIT PRICE', 'AMOUNT']],
            body: [['1', item.description, `$${subtotal.toFixed(2)}`, `$${subtotal.toFixed(2)}`]],
            theme: 'grid',
            headStyles: { fillColor: [22, 22, 22] },
        });

        const finalY = (doc as any).lastAutoTable.finalY;
        doc.setFontSize(10);
        doc.text('Subtotal', 145, finalY + 10);
        doc.text(`Sales Tax ${(taxRate * 100).toFixed(1)}%`, 145, finalY + 16);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('TOTAL', 145, finalY + 24);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(`$${subtotal.toFixed(2)}`, 200, finalY + 10, { align: 'right' });
        doc.text(`$${tax.toFixed(2)}`, 200, finalY + 16, { align: 'right' });
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`$${total.toFixed(2)}`, 200, finalY + 24, { align: 'right' });
        
        doc.save(`invoice-${item.id}.pdf`);
    };

    const renderIcon = (item: HistoryItem) => {
        const iconClass = "w-6 h-6";
        if (item.type === 'purchase') {
            return (
                <div className="p-3 bg-green-100 rounded-full">
                    <FiDollarSign className={`${iconClass} text-green-600`} />
                </div>
            );
        }
        return (
            <div className="p-3 bg-blue-100 rounded-full">
                <FiFileText className={`${iconClass} text-blue-600`} />
            </div>
        );
    };

    return (
        <AccountLayout>
            <Head>
                <title>{t('billing_history.title', 'Billing History')} - OtLog</title>
            </Head>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">{t('billing_history.header', 'Billing History')}</CardTitle>
                        <CardDescription>{t('billing_history.description', 'View your past purchases and credit usage.')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading && <p className="text-center py-8">{t('loading', 'Loading...')}</p>}
                        {error && <p className="text-center py-8 text-red-500">{error}</p>}
                        {!isLoading && !error && history.length > 0 && (
                            <div className="space-y-1">
                                {history.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {renderIcon(item)}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-800 truncate" title={item.description}>{item.description}</p>
                                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                <FiClock className="w-4 h-4" />
                                                <span>{item.date} at {item.time}</span>
                                            </div>
                                        </div>
                                        <div className="text-right flex items-center space-x-4">
                                            {item.type === 'purchase' ? (
                                                <Badge variant="default" className="bg-primary text-primary-foreground">
                                                    Purchase
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                                                    Usage
                                                </Badge>
                                            )}
                                            <p className={`font-bold w-24 text-right ${item.type === 'purchase' ? 'text-green-600' : 'text-gray-700'}`}>
                                                {item.amount}
                                            </p>
                                            {item.type === 'purchase' ? (
                                                <Button variant="ghost" size="icon" onClick={() => generateInvoice(item)}>
                                                    <FiDownload className="w-5 h-5" />
                                                </Button>
                                            ) : (
                                                <div className="w-9 h-9"></div> // Placeholder for alignment
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                         {!isLoading && !error && history.length === 0 && (
                             <div className="text-center py-16">
                                <FiDatabase className="w-12 h-12 mx-auto text-gray-300" />
                                <h3 className="mt-4 text-lg font-medium">{t('billing_history.no_history', 'No Billing History')}</h3>
                                <p className="mt-1 text-sm text-muted-foreground">{t('billing_history.no_history_desc', 'Your purchases and credit usage will appear here.')}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </AccountLayout>
    );
};

export default BillingHistoryPage; 