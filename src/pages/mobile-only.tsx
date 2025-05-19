import React from 'react';
import CustomHead from '@/components/layout/customHead/CustomHead';
import Header from '@/components/navbar/header/Header';
import HeaderLinks from '@/components/navbar/headerLinks/HeaderLinks';
import MobileOnlyContent from '@/components/mobileOnly/MobileOnly';
import { ProtectRoute } from '@/context/auth';

const MobileOnlyPage: React.FC = () => {
    return (
        <CustomHead
            title='Akses Mobile'
            description='Aplikasi ini hanya dapat diakses melalui perangkat mobile untuk peran Anda'
        >
            <Header
                brand="SIPP KARHUTLA"
                color="white"
                fixed
                rightLinks={<HeaderLinks headerColor="white" />}
            />
            <MobileOnlyContent />
        </CustomHead>
    );
};

export default ProtectRoute(MobileOnlyPage);