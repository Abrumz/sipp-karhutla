import React from 'react';
import SiteLayout from '@/components/layout/siteLayout/SiteLayout';
import HakAkses from '@/components/pengguna/hakAkses/HakAkses';
import CustomHead from '@/components/layout/customHead/CustomHead';
import { ProtectRoute } from '@/context/auth';

interface HakAksesPageProps { }

const HakAksesPage: React.FC<HakAksesPageProps> = () => {
    return (
        <SiteLayout>
            <CustomHead
                title='Manajemen Hak Akses'
                description='Kelola hak akses pengguna berdasarkan kategori dan tingkat otoritas dalam sistem'
            >
                <div>
                    <HakAkses />
                </div>
            </CustomHead>
        </SiteLayout>
    );
};

export default ProtectRoute(HakAksesPage, false, true);