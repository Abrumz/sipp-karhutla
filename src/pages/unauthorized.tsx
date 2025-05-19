import React from 'react';
import CustomHead from '@/components/layout/customHead/CustomHead';
import Header from '@/components/navbar/header/Header';
import HeaderLinks from '@/components/navbar/headerLinks/HeaderLinks';
import UnauthorizedContent from '@/components/unauthorize/Unauthorize';
import { ProtectRoute } from '@/context/auth';

const UnauthorizedPage: React.FC = () => {
    return (
        <CustomHead
            title='Akses Ditolak'
            description='Anda tidak memiliki izin untuk mengakses halaman ini'
        >
            <Header
                brand="SIPP KARHUTLA"
                color="white"
                fixed
                rightLinks={<HeaderLinks headerColor="white" />}
            />
            <UnauthorizedContent />
        </CustomHead>
    );
};

export default ProtectRoute(UnauthorizedPage);