import React from 'react';
import SiteLayout from '@/components/layout/siteLayout/SiteLayout';
import UbahPengguna from '@/components/groundCheck/ubah/Ubah';
import Loader from '@/components/loader/Loader';
import { ProtectRoute } from '@/context/auth';
import useAuth from '@/context/auth';
import CustomHead from '@/components/layout/customHead/CustomHead';
import { useRouter } from 'next/router';

interface UbahPenggunaGroundcheckPageProps { }

const UbahPenggunaGroundcheckPage: React.FC<UbahPenggunaGroundcheckPageProps> = () => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const { userid } = router.query;

    return !isAuthenticated ? (
        <Loader />
    ) : (
        <SiteLayout>
            <CustomHead
                title='Ubah Pengguna Ground Check'
                description='Platform pengelolaan pengguna modul ground check titik panas kebakaran hutan dan lahan'
            >
                <UbahPengguna userid={userid as string} />
            </CustomHead>
        </SiteLayout>
    );
};

export default ProtectRoute(UbahPenggunaGroundcheckPage, false, true);