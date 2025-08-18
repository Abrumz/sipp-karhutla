import React from 'react';
import SiteLayout from '@/components/layout/siteLayout/SiteLayout';
import PelaporanRentangTanggal from '@/components/pelaporan/rentangTanggal/RentangTanggal';
import CustomHead from '@/components/layout/customHead/CustomHead';

export default function PelaporanRentangTanggalPage() {
    return (
        <SiteLayout >
            <CustomHead
                title='Kegiatan Patroli'
                description='Platform visualisasi data monitoring patroli dan pemadaman kebakaran hutan dan lahan'
            >
                <div>
                    <PelaporanRentangTanggal />
                </div>
            </CustomHead>
        </SiteLayout>
    );
}