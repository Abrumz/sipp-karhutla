import React from 'react';
import SiteLayout from '@/components/layout/siteLayout/SiteLayout';
import Posko from '@/components/wilayah/posko/Posko';
import Loader from '@/components/loader/Loader';
import { ProtectRoute } from '@/context/auth';
import useAuth from '@/context/auth';
import CustomHead from '@/components/layout/customHead/CustomHead';

interface PoskoPageProps { }

const PoskoPage: React.FC<PoskoPageProps> = () => {
    const { isAuthenticated } = useAuth();

    return !isAuthenticated ? (
        <Loader />
    ) : (
        <SiteLayout>
            <CustomHead
                title='Data Posko'
                description='Platform visualisasi data posko pengendalian kebakaran hutan dan lahan'
            >
                <Posko />
            </CustomHead>
        </SiteLayout>
    );
};

export default ProtectRoute(PoskoPage, false, true);