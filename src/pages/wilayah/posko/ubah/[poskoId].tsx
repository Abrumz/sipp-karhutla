import React from 'react';
import SiteLayout from '@/components/layout/siteLayout/SiteLayout';
import UbahPosko from '@/components/wilayah/posko/ubah/Ubah';
import Loader from '@/components/loader/Loader';
import { ProtectRoute } from '@/context/auth';
import useAuth from '@/context/auth';
import CustomHead from '@/components/layout/customHead/CustomHead';
import { useRouter } from 'next/router';

interface UbahPoskoPageProps { }

const UbahPoskoPage: React.FC<UbahPoskoPageProps> = () => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const { poskoId } = router.query;

    return !isAuthenticated ? (
        <Loader />
    ) : (
        <SiteLayout>
            <CustomHead
                title='Ubah Posko'
                description='Platform pengelolaan data posko pengendalian kebakaran hutan dan lahan'
            >
                <UbahPosko poskoId={poskoId as string} />
            </CustomHead>
        </SiteLayout>
    );
};

export default ProtectRoute(UbahPoskoPage, false, true);