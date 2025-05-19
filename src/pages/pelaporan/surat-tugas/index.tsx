import React from 'react';
import SiteLayout from '@/components/layout/siteLayout/SiteLayout';
import PelaporanSuratTugas from '@/components/pelaporan/suratTugas/SuratTugas';
import CustomHead from '@/components/layout/customHead/CustomHead';

export default function PelaporanSuratTugasPage() {
    return (
        <SiteLayout>
            <CustomHead
                title='Surat Tugas'
                description='Platform visualisasi data monitoring patroli dan pemadaman kebakaran hutan dan lahan'
            >
                <div>
                    <PelaporanSuratTugas />
                </div>
            </CustomHead>
        </SiteLayout>
    );
}