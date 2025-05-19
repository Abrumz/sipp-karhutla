import React from 'react';
import SiteLayout from '@/components/layout/siteLayout/SiteLayout';
import Wilayah from '@/components/wilayah/Wilayah';
import Loader from '@/components/loader/Loader';
import { ProtectRoute } from '@/context/auth';
import useAuth from '@/context/auth';
import CustomHead from '@/components/layout/customHead/CustomHead';

interface WilayahPageProps { }

const WilayahPage: React.FC<WilayahPageProps> = () => {
    const { isAuthenticated } = useAuth();

    return !isAuthenticated ? (
        <Loader />
    ) : (
        <SiteLayout>
            <CustomHead
                title='Detail Posko'
                description='Platform visualisasi data monitoring laporan patroli dan pemadaman kebakaran hutan dan lahan'
            >
                <Wilayah />
            </CustomHead>
        </SiteLayout>
    );
};

export default ProtectRoute(WilayahPage, false, true);