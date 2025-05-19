import React from 'react';
import SiteLayout from '@/components/layout/siteLayout/SiteLayout';
import DataPengguna from '@/components/pengguna/DataPengguna';
import CustomHead from '@/components/layout/customHead/CustomHead';
import { ProtectRoute } from '@/context/auth';
import { useRouter } from 'next/router';

interface PenggunaPageProps { }

const PenggunaPage: React.FC<PenggunaPageProps> = () => {
    const router = useRouter();
    const { alert } = router.query;

    return (
        <SiteLayout>
            <CustomHead
                title='Manajemen Data Pengguna'
                description='Kelola data pengguna sistem dan atur hak akses sesuai dengan peran dan tanggung jawab'
            >
                <div>
                    <DataPengguna alertQuery={alert as string} />
                </div>
            </CustomHead>
        </SiteLayout>
    );
};

export default ProtectRoute(PenggunaPage, false, true);