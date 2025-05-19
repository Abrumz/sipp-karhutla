import React from 'react';
import SiteLayout from '@/components/layout/siteLayout/SiteLayout';
import Daops from '@/components/wilayah/daops/Daops';
import Loader from '@/components/loader/Loader';
import { ProtectRoute } from '@/context/auth';
import useAuth from '@/context/auth';
import CustomHead from '@/components/layout/customHead/CustomHead';

interface DaopsPageProps { }

const DaopsPage: React.FC<DaopsPageProps> = () => {
    const { isAuthenticated } = useAuth();

    return !isAuthenticated ? (
        <Loader />
    ) : (
        <SiteLayout >
            <CustomHead
                title='Detail Daerah Operasi'
                description='Platform visualisasi data monitoring laporan patroli dan pemadaman kebakaran hutan dan lahan'
            >
                <Daops />
            </CustomHead>
        </SiteLayout>
    );
};

export default ProtectRoute(DaopsPage, false, true);