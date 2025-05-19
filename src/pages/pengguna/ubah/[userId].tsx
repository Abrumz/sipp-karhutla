import React from 'react';
import SiteLayout from '@/components/layout/siteLayout/SiteLayout';
import Ubah from '@/components/pengguna/ubah/UserID';
import CustomHead from '@/components/layout/customHead/CustomHead';
import { ProtectRoute } from '@/context/auth';
import { useRouter } from 'next/router';
import ErrorPage from 'next/error';

interface UbahPenggunaPageProps { }

const UbahPenggunaPage: React.FC<UbahPenggunaPageProps> = () => {
    const router = useRouter();
    const { userId } = router.query;

    // If userId is not available yet or is not a string, return a loading state
    if (!userId || typeof userId !== 'string') {
        return (
            <SiteLayout>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
                </div>
            </SiteLayout>
        );
    }

    return (
        <SiteLayout>
            <CustomHead
                title='Ubah Data Pengguna'
                description='Perbarui informasi data pengguna dalam sistem'
            >
                <div>
                    <Ubah userId={userId} />
                </div>
            </CustomHead>
        </SiteLayout>
    );
};

export default ProtectRoute(UbahPenggunaPage, false, true);