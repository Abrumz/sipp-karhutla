import React from 'react';
import SiteLayout from '@/components/layout/siteLayout/SiteLayout';
import Korwil from '@/components/wilayah/korwil/Korwil';
import Loader from '@/components/loader/Loader';
import { ProtectRoute } from '@/context/auth';
import useAuth from '@/context/auth';
import CustomHead from '@/components/layout/customHead/CustomHead';

interface KorwilPageProps { }

const KorwilPage: React.FC<KorwilPageProps> = () => {
    const { isAuthenticated } = useAuth();

    return !isAuthenticated ? (
        <Loader />
    ) : (
        <SiteLayout>
            <CustomHead
                title='Detail Korwil'
                description='Platform visualisasi data monitoring laporan patroli dan pemadaman kebakaran hutan dan lahan'
            >
                <Korwil />
            </CustomHead>
        </SiteLayout>
    );
};

export default ProtectRoute(KorwilPage, false, true);