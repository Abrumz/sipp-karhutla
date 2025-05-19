import React from 'react';
import CustomHead from '@/components/layout/customHead/CustomHead';
import PatroliContentWrapper from '@/components/patroli/Patroli';

export default function PatroliPage() {
    return (
        <CustomHead
            title='Patroli'
            description='Platform visualisasi data monitoring patroli dan pemadaman kebakaran hutan dan lahan'
        >
            <div>
                <PatroliContentWrapper />
            </div>
        </CustomHead>
    );
}