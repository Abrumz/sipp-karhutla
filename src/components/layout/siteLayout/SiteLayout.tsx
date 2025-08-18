import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Footer from '@/components/footer/Footer';
import Header from '@/components/navbar/header/Header';
import HeaderLinks from '@/components/navbar/headerLinks/HeaderLinks';
import { ColorType } from '@/utils/colorUtils';

interface SiteLayoutProps {
    children: React.ReactNode;
    headerColor?: ColorType;
    scrollChange?: boolean;
}

const SiteLayout: React.FC<SiteLayoutProps> = ({
    children,
    headerColor = 'white'
}) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideIn {
                from { transform: translateX(-100%); }
                to { transform: translateX(0); }
            }
            
            @keyframes slideDown {
                from { max-height: 0; opacity: 0; }
                to { max-height: 500px; opacity: 1; }
            }
            
            /* Make sure mobile menu takes full height */
            .mobile-menu {
                height: 100vh;
                overflow-y: auto;
            }
            
            /* Transitions for menu items */
            .menu-item-transition {
                transition: background-color 0.2s ease;
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <Head>
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />
                <meta name="msapplication-TileColor" content="#ffffff" />
                <meta name="theme-color" content="#ffffff" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            </Head>

            <Header
                brand={
                    <span className="flex items-center gap-2">
                        <img
                            src="/favicon.ico"
                            alt="Logo"
                            className="w-7 h-7"
                        />
                        SIPP Karhutla
                    </span>
                }
                rightLinks={<HeaderLinks headerColor={headerColor} />}
                fixed
                color={headerColor}
            />

            <main className="flex-grow">
                {children}
            </main>

            <Footer />
        </div>
    );
};

export default SiteLayout;