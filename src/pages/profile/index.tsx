import React from 'react';
import CustomHead from '@/components/layout/customHead/CustomHead';
import Profile from '@/components/profile/Profile';
import SiteLayout from '@/components/layout/siteLayout/SiteLayout';
import { ProtectRoute } from '@/context/auth';

function ProfilePage() {
    return (
        <CustomHead
            title='Profil Pengguna'
            description='Kelola informasi akun dan kata sandi di SIPP Karhutla'
        >
            <SiteLayout scrollChange={true}>
                <Profile />
            </SiteLayout>
        </CustomHead>
    );
}

export default ProtectRoute(ProfilePage);