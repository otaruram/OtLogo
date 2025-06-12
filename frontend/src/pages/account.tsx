import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import AccountLayout from '@/components/AccountLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfilePage from './account/profile';
import BillingPage from './account/billing';
import SettingsPage from './account/settings';

const AccountPage = () => {
    return (
        <>
            <Head>
                <title>My Account - OtLogo</title>
                <meta name="description" content="Manage your account, profile, and settings." />
            </Head>
            <AccountLayout>
                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="billing">Billing</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>
                    <TabsContent value="profile" className="mt-6">
                        <ProfilePage />
                    </TabsContent>
                    <TabsContent value="billing" className="mt-6">
                        <BillingPage />
                    </TabsContent>
                    <TabsContent value="settings" className="mt-6">
                        <SettingsPage />
                    </TabsContent>
                </Tabs>
            </AccountLayout>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }
    return { props: { session } };
};

export default AccountPage;