import React from 'react';
import SiteLayout from '@/components/layout/siteLayout/SiteLayout';
import TambahPosko from '@/components/wilayah/posko/tambah/Tambah';
import Loader from '@/components/loader/Loader';
import { ProtectRoute } from '@/context/auth';
import useAuth from '@/context/auth';
import CustomHead from '@/components/layout/customHead/CustomHead';

interface TambahPoskoPageProps { }

const TambahPoskoPage: React.FC<TambahPoskoPageProps> = () => {
    const { isAuthenticated } = useAuth();

    return !isAuthenticated ? (
        <Loader />
    ) : (
        <CustomHead
            title='Tambah Posko'
            description='Platform monitoring lapangan berbasis GIS'
        >
            <SiteLayout>
                <TambahPosko />
            </SiteLayout>
        </CustomHead>
    );
};

export default ProtectRoute(TambahPoskoPage, false, true); 