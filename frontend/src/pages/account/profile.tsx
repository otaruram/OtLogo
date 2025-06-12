import { useSession } from 'next-auth/react';
import { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import toast from 'react-hot-toast';

import { FiEdit2, FiUpload, FiSave, FiX } from 'react-icons/fi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import AccountLayout from '@/components/AccountLayout';

const ProfilePage = () => {
    const { data: session, update } = useSession();
    const { t } = useTranslation('common');
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (session?.user) {
            setName(session.user.name ?? '');
            // @ts-ignore
            setBio(session.user.bio ?? 'No bio yet.');
        }
    }, [session]);

    const handleUpdateProfile = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const toastId = toast.loading('Updating profile...');
        try {
            const response = await fetch('/api/user/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, bio }),
            });
            if (!response.ok) throw new Error('Failed to update profile');
            await update({ ...session, user: { ...session?.user, name, bio } });
            toast.success('Profile updated successfully!', { id: toastId });
            setIsEditing(false);
        } catch (error) {
            console.error(error);
            toast.error('An error occurred while updating the profile.', { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('profilePicture', file);
        const uploadToast = toast.loading('Uploading avatar...');

        try {
            const response = await fetch('/api/user/upload-avatar', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Upload failed');
            
            await update({ ...session, user: { ...session?.user, image: data.imageUrl } });
            toast.success('Avatar updated!', { id: uploadToast });
        } catch (error: any) {
            console.error(error);
            toast.error(`Failed to upload avatar: ${error.message}`, { id: uploadToast });
        }
    };
    
    const profilePicture = session?.user?.image || '/placeholder-logo.svg';

    return (
        <AccountLayout>
            <Head>
                <title>{`${t('profile_page.title', 'Profile')} - OtLog`}</title>
            </Head>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-6">
                            <div className="relative group">
                                <Image
                                    src={profilePicture}
                                    alt="Profile"
                                    width={96}
                                    height={96}
                                    className="rounded-full object-cover border-2 border-white shadow-sm"
                                />
                                <motion.div
                                    className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <FiUpload className="text-white w-6 h-6" />
                                </motion.div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleAvatarUpload}
                                    className="hidden"
                                    accept="image/png, image/jpeg"
                                />
                            </div>
                            <div className="flex-1">
                                <CardTitle className="text-2xl font-bold flex items-center">
                                    {session?.user?.name || 'User'}
                                </CardTitle>
                                <CardDescription>{session?.user?.email}</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="icon" onClick={() => fileInputRef.current?.click()} title="Upload Photo">
                                    <FiUpload className="w-5 h-5" />
                                </Button>
                                <Button variant="outline" size="icon" onClick={() => setIsEditing(!isEditing)}>
                                    {isEditing ? <FiX className="w-5 h-5" /> : <FiEdit2 className="w-5 h-5" />}
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form className="space-y-6" onSubmit={handleUpdateProfile}>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('profile_page.nickname', 'Nickname')}
                                </label>
                                <Input 
                                    id="name"
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('profile_page.bio', 'Bio')}
                                </label>
                                <Textarea 
                                    id="bio"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    rows={3}
                                    disabled={!isEditing}
                                />
                            </div>
                            {isEditing && (
                                 <div className="flex justify-end space-x-2 pt-4">
                                    <Button type="button" variant="ghost" onClick={() => setIsEditing(false)} disabled={isLoading}>
                                        {t('cancel', 'Cancel')}
                                    </Button>
                                    <Button type="submit" disabled={isLoading}>
                                        {isLoading ? t('saving', 'Saving...') : <><FiSave className="mr-2 h-4 w-4"/> {t('save_changes', 'Save Changes')}</>}
                                     </Button>
                                </div>
                            )}
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </AccountLayout>
    );
};

export default ProfilePage;