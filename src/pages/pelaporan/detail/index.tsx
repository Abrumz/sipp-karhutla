import React from 'react';
import SiteLayout from '@/components/layout/siteLayout/SiteLayout';
import DetailLaporan from '@/components/pelaporan/detail/Detail';
import CustomHead from '@/components/layout/customHead/CustomHead';
import { ProtectRoute } from '@/context/auth';

interface DetailPelaporanPageProps { }

const DetailPelaporanPage: React.FC<DetailPelaporanPageProps> = () => {
    return (
        <SiteLayout>
            <CustomHead
                title='Detail Laporan'
                description='Platform visualisasi data monitoring laporan patroli dan pemadaman kebakaran hutan dan lahan'
            >
                <div>
                    <DetailLaporan />
                </div>
            </CustomHead>
        </SiteLayout>
    );
}

export default ProtectRoute(DetailPelaporanPage);