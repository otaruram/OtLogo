import { Github, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
    const socialLinks = [
        {
            name: "LinkedIn",
            href: "https://www.linkedin.com/in/otaruram/",
            Icon: Linkedin
        },
        {
            name: "GitHub",
            href: "https://github.com/otaruram",
            Icon: Github
        },
        {
            name: "Email",
            href: "mailto:otaruna61@gmail.com",
            Icon: Mail
        },
    ];

    return (
        <footer className="bg-gray-100 border-t border-gray-200">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} OtLogo. All Rights Reserved.</p>
                <div className="flex items-center space-x-4">
                    {socialLinks.map(({ name, href, Icon }) => (
                        <Link key={name} href={href} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-brand-text transition-colors">
                           <Icon className="h-6 w-6" />
                           <span className="sr-only">{name}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </footer>
    );
};

export default Footer; 