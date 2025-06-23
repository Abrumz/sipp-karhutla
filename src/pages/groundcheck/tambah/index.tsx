import React from 'react';
import SiteLayout from '@/components/layout/siteLayout/SiteLayout';
import TambahPengguna from '@/components/groundCheck/tambah/Tambah';
import Loader from '@/components/loader/Loader';
import { ProtectRoute } from '@/context/auth';
import useAuth from '@/context/auth';
import CustomHead from '@/components/layout/customHead/CustomHead';

interface TambahPenggunaGroundcheckPageProps { }

const TambahPenggunaGroundcheckPage: React.FC<TambahPenggunaGroundcheckPageProps> = () => {
    const { isAuthenticated } = useAuth();

    return !isAuthenticated ? (
        <Loader />
    ) : (
        <SiteLayout >
            <CustomHead
                title='Tambah Pengguna Ground Check'
                description='Platform pengelolaan pengguna modul ground check titik panas kebakaran hutan dan lahan'
            >
                <TambahPengguna />
            </CustomHead>
        </SiteLayout>
    );
};

export default ProtectRoute(TambahPenggunaGroundcheckPage, false, true);