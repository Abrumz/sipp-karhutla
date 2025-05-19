import React, { useState, useEffect } from 'react';
import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { AuthProvider, AuthWrapper } from '@/context/auth';
import PreLoader from '@/components/preLoader/PreLoader';

export default function MyApp({ Component, pageProps }: AppProps) {
    const [loading, setLoading] = useState(true);
    const [isFirstVisit, setIsFirstVisit] = useState(true);

    useEffect(() => {
        const hasVisited = sessionStorage.getItem('hasVisitedApp');

        if (hasVisited) {
            setIsFirstVisit(false);
            setLoading(false);
        } else {
            sessionStorage.setItem('hasVisitedApp', 'true');
            setIsFirstVisit(true);

            const imagesToPreload = [
                '/favicon.ico',
            ];

            imagesToPreload.forEach(src => {
                const img = new Image();
                img.src = src;
            });
        }
    }, []);

    const handleFinishLoading = () => {
        setLoading(false);
    };

    return (
        <AuthProvider>
            {loading && isFirstVisit ? (
                <PreLoader
                    finishLoading={handleFinishLoading}
                />
            ) : (
                <AuthWrapper>
                    <Component {...pageProps} />
                </AuthWrapper>
            )}
        </AuthProvider>
    );
}