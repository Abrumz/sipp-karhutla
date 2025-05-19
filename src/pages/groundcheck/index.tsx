import React from 'react';
import SiteLayout from '@/components/layout/siteLayout/SiteLayout';
import GroundCheck from '@/components/groundCheck/GroundCheck';
import Loader from '@/components/loader/Loader';
import { ProtectRoute } from '@/context/auth';
import useAuth from '@/context/auth';
import CustomHead from '@/components/layout/customHead/CustomHead';

interface GroundCheckPageProps { }

const GroundCheckPage: React.FC<GroundCheckPageProps> = () => {
    const { isAuthenticated, user } = useAuth();

    return !isAuthenticated ? (
        <Loader />
    ) : (
        <SiteLayout>
            <CustomHead
                title='Ground Check Titik Panas'
                description='Platform pengelolaan pengguna modul ground check titik panas kebakaran hutan dan lahan'
            >
                <GroundCheck user={user} />
            </CustomHead>
        </SiteLayout>
    );
};

export default ProtectRoute(GroundCheckPage);