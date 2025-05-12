import React from 'react';
import Head from 'next/head';
import Footer from '@/components/footer/Footer';
import Header from '@/components/navbar/header/Header';
import HeaderLinks from '@/components/navbar/headerLinks/HeaderLinks';
import { ColorType } from '@/utils/colorUtils';

interface SiteLayoutProps {
    children: React.ReactNode;
    headerColor?: ColorType;
}

const SiteLayout: React.FC<SiteLayoutProps> = ({
    children,
    headerColor = 'transparent'
}) => {
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
            </Head>
            <Header
                brand="SIPP Karhutla"
                rightLinks={<HeaderLinks />}
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