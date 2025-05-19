import React from 'react';
import CustomHead from '@/components/layout/customHead/CustomHead';
import Header from '@/components/navbar/header/Header';
import HeaderLinks from '@/components/navbar/headerLinks/HeaderLinks';
import NotFoundContent from '@/components/notFound/NotFoundContent';

const Custom404 = () => {
    return (
        <CustomHead
            title='Halaman Tidak Ditemukan'
            description='Maaf, halaman yang Anda cari tidak ditemukan'
        >
            <Header
                brand="SIPP KARHUTLA"
                color="white"
                fixed
                rightLinks={<HeaderLinks headerColor="white" />}
            />
            <NotFoundContent />
        </CustomHead>
    );
};

export default Custom404;