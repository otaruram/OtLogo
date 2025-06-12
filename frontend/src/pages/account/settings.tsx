import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Head from 'next/head';
import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'next-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { LogOut, KeyRound, Palette, ShieldAlert, Trash2, Sun, Moon, Bell } from 'lucide-react';
import AccountLayout from '@/components/AccountLayout';
import { Switch } from '@/components/ui/switch';
import ClientOnly from '@/components/ClientOnly';

const SettingsPage = () => {
    const { data: session } = useSession();
  const { t, i18n } = useTranslation('common');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordChangeable, setIsPasswordChangeable] = useState(false);
    const [theme, setTheme] = useState('system');
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (session) {
            const checkProvider = async () => {
                try {
                    const response = await fetch('/api/account/check-credentials');
                    if (response.ok) {
                        const data = await response.json();
                        setIsPasswordChangeable(data.hasCredentials);
            }
        } catch (error) {
                    console.error("Failed to check provider:", error)
                }
            };
            checkProvider();
        }
        
        const savedTheme = localStorage.getItem('theme') || 'system';
        setTheme(savedTheme);
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }, [session]);

    const handleThemeChange = (value: string) => {
        setTheme(value);
        localStorage.setItem('theme', value);
        if (value === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        toast.success(t('settings.theme_updated', 'Theme updated!'));
    };

    const handleLanguageChange = (value: string) => {
        i18n.changeLanguage(value);
        toast.success(t('settings.language_updated', 'Language updated!'));
    };

    const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error(t('settings.passwords_no_match', 'Passwords do not match.'));
            return;
        }

        const promise = fetch('/api/account/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
        });

        toast.promise(promise, {
            loading: t('settings.updating_password', 'Updating password...'),
            success: (res) => {
                if (!res.ok) throw new Error(t('settings.password_update_failed', 'Failed to update password.'));
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
                return t('settings.password_updated', 'Password updated successfully!');
            },
            error: (err) => err.message || t('settings.password_update_failed', 'An error occurred.'),
        });
  };

  const handleDeleteAccount = async () => {
    const promise = fetch('/api/user/delete', {
      method: 'DELETE',
    });

    toast.promise(promise, {
      loading: t('settings.deleting_account', 'Deleting your account...'),
      success: (res) => {
        if (!res.ok) {
          throw new Error(t('settings.delete_failed', 'Failed to delete account.'));
        }
        setDeleteModalOpen(false);
        signOut({ callbackUrl: '/login' });
        return t('settings.delete_success', 'Account deleted successfully.');
      },
      error: (err) => err.message || t('settings.delete_failed_generic', 'An error occurred.'),
    });
  }

  return (
    <AccountLayout>
             <Head>
                <title>{t('settings.title', 'Settings')} - OtLog</title>
            </Head>
            <motion.div
                className="space-y-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3"><Palette className="w-6 h-6" /> {t('settings.appearance', 'Appearance')}</CardTitle>
                        <CardDescription>{t('settings.appearance_desc', 'Customize the look and feel of the application.')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-2">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50/50">
                            <label htmlFor="language" className="font-medium">{t('settings.language', 'Language')}</label>
                            <ClientOnly>
                                <Select onValueChange={handleLanguageChange} defaultValue={i18n.language}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder={t('settings.select_language', 'Select language')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="en">English</SelectItem>
                                        <SelectItem value="id">Bahasa Indonesia</SelectItem>
                                    </SelectContent>
                                </Select>
                            </ClientOnly>
            </div>
                         <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50/50">
                            <label className="font-medium">{t('settings.theme', 'Theme')}</label>
                            <div className="flex space-x-2">
                                <Button variant={theme === 'light' ? 'default' : 'outline'} size="icon" onClick={() => handleThemeChange('light')}><Sun className="h-5 w-5"/></Button>
                                <Button variant={theme === 'dark' ? 'default' : 'outline'} size="icon" onClick={() => handleThemeChange('dark')}><Moon className="h-5 w-5"/></Button>
            </div>
          </div>
                    </CardContent>
                </Card>

                {isPasswordChangeable && (
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3"><KeyRound className="w-6 h-6" /> {t('settings.security', 'Security')}</CardTitle>
                            <CardDescription>{t('settings.security_desc', 'Manage your account password.')}</CardDescription>
                        </CardHeader>
                        <form onSubmit={handlePasswordChange}>
                            <CardContent className="space-y-4">
                                <Input type="password" value={currentPassword} onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentPassword(e.target.value)} placeholder={t('settings.current_password', 'Current Password')} required />
                                <Input type="password" value={newPassword} onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)} placeholder={t('settings.new_password', 'New Password')} required minLength={8} />
                                <Input type="password" value={confirmPassword} onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)} placeholder={t('settings.confirm_password', 'Confirm New Password')} required minLength={8} />
                            </CardContent>
                            <CardFooter>
                                <Button type="submit">{t('settings.update_password', 'Update Password')}</Button>
                            </CardFooter>
          </form>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3"><Bell className="w-6 h-6"/> {t('settings.notifications', 'Email Notifications')}</CardTitle>
                        <CardDescription>{t('settings.notifications_desc', 'Manage your email notification settings.')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-2">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50/50">
                    <div>
                                <h4 className="font-medium">{t('settings.new_features.title', 'New features and updates')}</h4>
                                <p className="text-sm text-muted-foreground">{t('settings.new_features.desc', 'Get notified about new features and updates.')}</p>
                    </div>
                            <Switch defaultChecked/>
                </div>
                         <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50/50">
                     <div>
                                <h4 className="font-medium">{t('settings.security_alerts.title', 'Account activity and security alerts')}</h4>
                                <p className="text-sm text-muted-foreground">{t('settings.security_alerts.desc', 'Receive alerts about unusual account activity.')}</p>
                    </div>
                            <Switch defaultChecked/>
                </div>
                    </CardContent>
                </Card>


                <Card className="border-destructive">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-destructive"><ShieldAlert className="w-6 h-6" /> {t('settings.danger_zone', 'Danger Zone')}</CardTitle>
                        <CardDescription>{t('settings.danger_zone_desc', 'These actions are permanent and cannot be undone.')}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:items-center p-4 rounded-lg">
                    <div>
                             <h4 className="font-medium">{t('settings.delete_account', 'Delete My Account')}</h4>
                             <p className="text-sm text-muted-foreground">{t('settings.delete_account_desc', 'Permanently delete your account and all your data.')}</p>
                    </div>
                        <Dialog open={isDeleteModalOpen} onOpenChange={setDeleteModalOpen}>
                            <DialogTrigger asChild>
                                <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" /> {t('settings.delete_account', 'Delete Account')}</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{t('settings.confirm_delete_title', 'Are you absolutely sure?')}</DialogTitle>
                                    <DialogDescription>
                                        {t('settings.confirm_delete_desc', 'This action cannot be undone. This will permanently delete your account and remove your data from our servers.')}
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>{t('cancel', 'Cancel')}</Button>
                                    <Button variant="destructive" onClick={handleDeleteAccount}>{t('settings.confirm_delete_button', 'Yes, delete my account')}</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                     <CardFooter className="flex justify-between items-center p-4 mt-4">
                         <div>
                             <h4 className="font-medium">{t('settings.logout', 'Logout')}</h4>
                             <p className="text-sm text-muted-foreground">{t('settings.logout_desc_short', 'End your current session.')}</p>
                </div>
                        <Button variant="outline" onClick={() => signOut()}><LogOut className="mr-2 h-4 w-4" />{t('settings.logout_now', 'Logout Now')}</Button>
                    </CardFooter>
                </Card>
          </motion.div>
    </AccountLayout>
  );
};

export default SettingsPage;
