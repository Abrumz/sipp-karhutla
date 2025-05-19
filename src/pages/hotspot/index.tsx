import React from 'react';
import CustomHead from '@/components/layout/customHead/CustomHead';
import Hotspot from '@/components/hotspot/Hotspot';

export default function HotspotPage() {
    return (
        <CustomHead
            title='Sipongi Live Update'
            description='Sistem Monitoring Data Titik Panas Kebakaran Hutan dan Lahan (24 Jam Terakhir)'
        >
            <div>
                <Hotspot />
            </div>
        </CustomHead>
    );
}