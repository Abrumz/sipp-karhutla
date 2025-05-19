import React from 'react';
import SiteLayout from '@/components/layout/siteLayout/SiteLayout';
import UbahLaporanId from '@/components/pelaporan/ubah/LaporanId';
import CustomHead from '@/components/layout/customHead/CustomHead';
import { ProtectRoute } from '@/context/auth';

function UbahLaporanPage() {
    return (
        <SiteLayout >
            <CustomHead
                title='Ubah Data Laporan'
                description='Platform visualisasi data monitoring patroli dan pemadaman kebakaran hutan dan lahan'
            >
                <div>
                    <UbahLaporanId />
                </div>
            </CustomHead>
        </SiteLayout>
    );
}

export default ProtectRoute(UbahLaporanPage);