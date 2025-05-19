// pages/index.tsx
import React, { useState, useEffect } from 'react';
import MainPageContent from '@/components/mainPageContent/MainPageContent';
import CustomHead from '@/components/layout/customHead/CustomHead';
import PreLoader from '@/components/preLoader/PreLoader';

export default function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const [assetsLoaded, setAssetsLoaded] = useState(false);
    const [timerComplete, setTimerComplete] = useState(false);

    const criticalAssets = [
        '/favicon.ico',
    ];

    const handleAssetsLoaded = () => {
        setAssetsLoaded(true);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimerComplete(true);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (timerComplete && assetsLoaded) {
            setIsLoading(false);
        }
    }, [timerComplete, assetsLoaded]);

    return (
        <CustomHead
            title='Home'
            description='Platform monitoring lapangan berbasis GIS'
        >
            {isLoading ? (
                <PreLoader
                    finishLoading={handleAssetsLoaded}
                    loadingAssets={criticalAssets}
                    minDuration={500}
                />
            ) : (
                <div>
                    <MainPageContent />
                </div>
            )}
        </CustomHead>
    );
}