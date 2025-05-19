import React from 'react';
import CustomHead from '@/components/layout/customHead/CustomHead';
import FAQ from '@/components/faq/FAQ';

export default function FAQPage() {
    return (
        <CustomHead
            title='FAQ'
            description='Panduan untuk mengatasi masalah umum pada Sistem Informasi Patroli Pencegahan Kebakaran Hutan dan Lahan (SIPP Karhutla)'
        >
            <div>
                <FAQ />
            </div>
        </CustomHead>
    );
}