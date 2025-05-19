import React from 'react';
import SiteLayout from '@/components/layout/siteLayout/SiteLayout';
import Penugasan from '@/components/penugasan/Penugasan';
import CustomHead from '@/components/layout/customHead/CustomHead';
import { ProtectRoute } from '@/context/auth';
import Loader from '@/components/loader/Loader';

interface PenugasanPageProps { }

const PenugasanPage: React.FC<PenugasanPageProps> = () => {
    return (
        <SiteLayout >
            <CustomHead
                title='Daftar Penugasan'
                description='Kelola daftar penugasan patroli yang telah dibuat'
            >
                <div>
                    <Penugasan />
                </div>
            </CustomHead>
        </SiteLayout>
    );
};

export default ProtectRoute(PenugasanPage, false, true);