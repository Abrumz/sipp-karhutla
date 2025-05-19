import React from 'react';
import SiteLayout from '@/components/layout/siteLayout/SiteLayout';
import LaporanRingkasan from '@/components/pelaporan/laporanRingkasan/LaporanRingkasan';
import CustomHead from '@/components/layout/customHead/CustomHead';

export default function PelaporanRingkasanPage() {
    return (
        <SiteLayout>
            <CustomHead
                title='Laporan Ringkasan'
                description='Platform visualisasi data monitoring patroli dan pemadaman kebakaran hutan dan lahan'
            >
                <div>
                    <LaporanRingkasan />
                </div>
            </CustomHead>
        </SiteLayout>
    );
} 