import React from 'react';
import SiteLayout from '@/components/layout/siteLayout/SiteLayout';
import BerkasPenugasan from '@/components/penugasan/berkas/Berkas';
import CustomHead from '@/components/layout/customHead/CustomHead';
import { ProtectRoute } from '@/context/auth';
import Loader from '@/components/loader/Loader';

interface BerkasPenugasanPageProps { }

const BerkasPenugasanPage: React.FC<BerkasPenugasanPageProps> = () => {
    return (
        <SiteLayout >
            <CustomHead
                title='Upload Berkas Excel Penugasan'
                description='Unggah berkas Excel penugasan patroli untuk membuat penugasan baru'
            >
                <div>
                    <BerkasPenugasan />
                </div>
            </CustomHead>
        </SiteLayout>
    );
};

export default ProtectRoute(BerkasPenugasanPage, false, true);