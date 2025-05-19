import React from 'react';
import SiteLayout from '@/components/layout/siteLayout/SiteLayout';
import DetailPenugasan from '@/components/penugasan/detail/Detail';
import CustomHead from '@/components/layout/customHead/CustomHead';
import { ProtectRoute } from '@/context/auth';
import Loader from '@/components/loader/Loader';
import { useRouter } from 'next/router';

interface DetailPenugasanPageProps { }

const DetailPenugasanPage: React.FC<DetailPenugasanPageProps> = () => {
    const router = useRouter();
    const { noSK } = router.query;

    return (
        <SiteLayout >
            <CustomHead
                title={`Detail Surat Tugas: ${noSK || ''}`}
                description="Informasi lengkap tentang anggota tim dalam surat tugas"
            >
                <div>
                    <DetailPenugasan noSK={noSK as string} />
                </div>
            </CustomHead>
        </SiteLayout>
    );
};

export default ProtectRoute(DetailPenugasanPage, false, true);