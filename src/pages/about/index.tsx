import React from 'react';
import CustomHead from '@/components/layout/customHead/CustomHead';
import About from '@/components/about/About';

export default function AboutPage() {
    return (
        <CustomHead
            title='Tentang Sistem'
            description='Sistem Informasi Patroli Pencegahan Kebakaran Hutan dan Lahan (SIPP Karhutla)'
        >
            <div>
                <About />
            </div>
        </CustomHead>
    );
}