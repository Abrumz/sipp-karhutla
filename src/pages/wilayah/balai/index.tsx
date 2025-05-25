import React from 'react';
import SiteLayout from '@/components/layout/siteLayout/SiteLayout';
import Balai from '@/components/wilayah/balai/Balai';
import Loader from '@/components/loader/Loader';
import { ProtectRoute } from '@/context/auth';
import useAuth from '@/context/auth';
import CustomHead from '@/components/layout/customHead/CustomHead';

interface BalaiPageProps { }

const BalaiPage: React.FC<BalaiPageProps> = () => {
    const { isAuthenticated } = useAuth();

    return !isAuthenticated ? (
        <Loader />
    ) : (
        <SiteLayout>
            <CustomHead
                title='Detail Balai'
                description='Platform visualisasi data monitoring laporan patroli dan pemadaman kebakaran hutan dan lahan' children={undefined} />
            <Balai />
        </SiteLayout>
    );
};

export default ProtectRoute(BalaiPage, false, true);