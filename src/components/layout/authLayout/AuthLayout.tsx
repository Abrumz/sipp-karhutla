import React, { JSX } from 'react'
import Header from "@/components/navbar/header/Header"

export default function AuthLayout(props: { children: JSX.Element }) {
    return (
        <div>
            <Header fixed color="transparent" brand="SIPP Karhutla" />
            <div
                className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-no-repeat bg-cover bg-top"
                style={{
                    backgroundImage: `url(${'/sipp-karhutla/login-bg-2.png'})`
                }}
            >
                {props.children}
            </div>
        </div>
    )
}