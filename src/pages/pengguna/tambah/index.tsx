import React from 'react';
import SiteLayout from '@/components/layout/siteLayout/SiteLayout';
import Tambah from '@/components/pengguna/tambah/Tambah';
import CustomHead from '@/components/layout/customHead/CustomHead';
import { ProtectRoute } from '@/context/auth';

interface TambahPenggunaPageProps { }

const TambahPenggunaPage: React.FC<TambahPenggunaPageProps> = () => {
    return (
        <SiteLayout>
            <CustomHead
                title='Tambah Pengguna'
                description='Daftarkan pengguna baru dan atur hak akses sesuai dengan peran dan tanggung jawab'
            >
                <div>
                    <Tambah />
                </div>
            </CustomHead>
        </SiteLayout>
    );
};

export default ProtectRoute(TambahPenggunaPage, false, true);