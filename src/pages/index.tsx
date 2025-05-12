import MainPageContent from '@/components/mainPageContent/MainPageContent'
import CustomHead from '@/components/layout/customHead/CustomHead'
import React from 'react'

export default function Home() {
    return (
        <CustomHead
            title='Home'
            description='Platform monitoring lapangan berbasis GIS'
        >
            <div >
                <MainPageContent />
            </div>
        </CustomHead>
    )
}