import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion';
import { useSession, signIn, signOut } from 'next-auth/react';
import { FiMenu, FiX, FiLogIn, FiUserPlus, FiCreditCard } from 'react-icons/fi';
import { useTranslation } from 'next-i18next';
import { useCredits } from '@/contexts/CreditsContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Home,
    Tag,
    GalleryThumbnails,
    UserSquare,
    LogOut,
    Settings,
    User,
    LifeBuoy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const Header = () => {
    const { t, i18n } = useTranslation('common');
    const { data: session, status } = useSession();
    const [isNavOpen, setIsNavOpen] = useState(false);
    const { credits } = useCredits();
    const { scrollY } = useScroll();
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsNavOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious();
        if (previous !== undefined && latest > previous && latest > 150) {
            setHidden(true);
        } else {
            setHidden(false);
        }
    })

    const isAuthenticated = status === 'authenticated';

    const navLinks = [
        { href: "/", label: t('home'), icon: Home },
        { href: "/pricing", label: t('pricing'), icon: Tag },
        { href: "/gallery", label: t('gallery'), icon: GalleryThumbnails },
    ];

    return (
        <TooltipProvider>
            <motion.header 
                variants={{
                    visible: { y: 0 },
                    hidden: { y: "-100%" }
                }}
                animate={hidden ? "hidden" : "visible"}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
            >
                <div className="container flex h-14 items-center">
                    <Link href="/" className="mr-6 flex items-center" onClick={(e) => { e.preventDefault(); setIsNavOpen(true); }}>
                        <span className="text-3xl md:text-4xl font-extrabold text-blue-600">OtLogo</span>
                    </Link>

                    <div className="flex flex-1 items-center justify-end space-x-3">
                        {session ? (
                            <>
                                <Link href="/pricing">
                                    <Button>{t('buyCredits')}</Button>
                                </Link>
                                <span className="font-semibold">{t('credits')}: {credits}</span>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Avatar className="cursor-pointer">
                                            <AvatarImage src={session.user?.image || ''} alt={session.user?.name || 'User'} />
                                            <AvatarFallback>{session.user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <DropdownMenuLabel>{session.user?.name}</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <Link href="/account/profile">
                                            <DropdownMenuItem className="cursor-pointer">
                                                <User className="mr-2 h-4 w-4" />
                                                <span>{t('profile')}</span>
                                            </DropdownMenuItem>
                                        </Link>
                                        <Link href="/account/settings">
                                            <DropdownMenuItem className="cursor-pointer">
                                                <Settings className="mr-2 h-4 w-4" />
                                                <span>{t('settings')}</span>
                                            </DropdownMenuItem>
                                        </Link>
                                        <Link href="/account/billing-history">
                                            <DropdownMenuItem className="cursor-pointer">
                                                <FiCreditCard className="mr-2 h-4 w-4" />
                                                <span>{t('billing')}</span>
                                            </DropdownMenuItem>
                                        </Link>
                                        <Link href="/help">
                                            <DropdownMenuItem className="cursor-pointer">
                                                <LifeBuoy className="mr-2 h-4 w-4" />
                                                <span>{t('help')}</span>
                                            </DropdownMenuItem>
                                        </Link>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-red-500">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>{t('logout')}</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <nav className="space-x-2 flex items-center">
                                <Link href="/login" passHref legacyBehavior>
                                    <Button variant="outline" className="font-semibold px-5 py-2 rounded-lg border-2 border-brand-neon text-brand-neon hover:bg-brand-neon hover:text-white transition-all duration-150 shadow-none">
                                        {t('signIn', 'Sign in')}
                                    </Button>
                                </Link>
                                <Link href="/register" passHref legacyBehavior>
                                    <Button className="font-semibold px-5 py-2 rounded-lg bg-brand-neon text-white border-2 border-brand-neon hover:bg-white hover:text-brand-neon transition-all duration-150 shadow-none ml-2">
                                        {t('signUp', 'Sign up')}
                                    </Button>
                                </Link>
                            </nav>
                        )}
                        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsNavOpen(true)}>
                            <svg strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"><path d="M3 5H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M3 12H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M3 19H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                            <span className="sr-only">Toggle Menu</span>
                        </Button>
                    </div>
                </div>
            </motion.header>
            <MobileNav isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
        </TooltipProvider>
    );
};

const MobileNav = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const { t, i18n } = useTranslation('common');
    const { data: session } = useSession();

    const commonItems = [
        { name: t('home'), path: '/', icon: <Home /> },
        { name: t('pricing'), path: '/pricing', icon: <FiCreditCard /> },
        { name: t('gallery'), path: '/gallery', icon: <GalleryThumbnails /> }
    ];

    const authItems = [
        { name: t('settings'), path: '/account/settings', icon: <Settings /> },
    ];

    const unauthItems = [
        { name: t('login'), path: '/api/auth/signin', icon: <FiLogIn /> },
        { name: t('signup'), path: '/register', icon: <FiUserPlus /> },
    ];
    
    const menuItems = session ? [...commonItems, ...authItems] : [...commonItems, ...unauthItems];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                     <motion.div
                        className="fixed inset-0 bg-black/50 z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.div
                        className="fixed top-0 left-0 h-full w-80 bg-yellow-400 p-6 z-50 border-r-2 border-brand-text shadow-hard-lg"
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                         <div className="flex justify-between items-center mb-10">
                            <h2 className="text-2xl font-bold">Menu</h2>
                            <button onClick={onClose} className="p-2 hover:text-brand-neon">
                                <FiX size={24} />
                            </button>
                        </div>
                         <nav>
                            <ul className="space-y-4">
                                {menuItems.map(item => (
                                    <li key={item.path}>
                                        <Link href={item.path} onClick={onClose} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white hover:text-brand-neon font-medium text-lg text-gray-700">
                                            {item.icon}
                                            <span>{item.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                             {session && (
                                <>
                                    <hr className="my-6 border-gray-200" />
                                    <button onClick={() => signOut()} className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-red-500 hover:text-white font-medium text-lg text-red-500">
                                        <LogOut />
                                        <span>{t('logout')}</span>
                                    </button>
                                </>
                            )}
                            <hr className="my-6 border-gray-200" />
                            <div className="space-y-2">
                                <p className="font-semibold text-lg">Language</p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => i18n.changeLanguage('en')}
                                        className={`px-4 py-2 rounded-lg font-medium ${i18n.language === 'en' ? 'bg-white text-brand-text' : 'bg-white/60'}`}
                                    >
                                        EN
                                    </button>
                                    <button
                                        onClick={() => i18n.changeLanguage('id')}
                                        className={`px-4 py-2 rounded-lg font-medium ${i18n.language === 'id' ? 'bg-white text-brand-text' : 'bg-white/60'}`}
                                    >
                                        ID
                                    </button>
                                </div>
                            </div>
                        </nav>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Header;