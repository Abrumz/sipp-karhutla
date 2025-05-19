import LoginForm from '@/components/login/Login'
import CustomHead from '@/components/layout/customHead/CustomHead'
import React from 'react'
import loginBgImage from '@/assets/img/login-bg-2.png'

export default function Home() {
    return (
        <CustomHead
            title='Login'
            description='SIPP Karhutla'
        >
            <div className="min-h-screen flex items-center justify-center relative px-4 py-12 overflow-hidden">
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: `url(${loginBgImage.src})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat"
                    }}
                ></div>

                <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-900/70 to-indigo-900/70 backdrop-blur-[1px]"></div>

                <div className="absolute inset-0 z-0 overflow-hidden">
                    <div className="absolute right-0 top-0 -mt-10 -mr-10 w-40 h-40 bg-blue-300 rounded-full opacity-20 blur-2xl"></div>
                    <div className="absolute left-0 bottom-0 -mb-10 -ml-10 w-40 h-40 bg-indigo-300 rounded-full opacity-20 blur-2xl"></div>
                    <div className="absolute right-1/4 bottom-1/3 w-64 h-64 bg-blue-200 rounded-full opacity-10 blur-3xl"></div>
                    <div className="absolute left-1/4 top-1/3 w-72 h-72 bg-indigo-200 rounded-full opacity-10 blur-3xl"></div>
                    <div className="absolute inset-0 bg-grid-white/[0.03] bg-[center_top_-1px] [mask-image:linear-gradient(0deg,transparent,black,transparent)]"></div>
                </div>

                {/* Decorative Dots - Adjusted color for visibility */}
                <div className="absolute top-10 left-10 grid grid-cols-3 gap-1 opacity-40">
                    {[...Array(9)].map((_, i) => (
                        <div key={i} className="w-1 h-1 rounded-full bg-blue-200"></div>
                    ))}
                </div>
                <div className="absolute bottom-10 right-10 grid grid-cols-3 gap-1 opacity-40">
                    {[...Array(9)].map((_, i) => (
                        <div key={i} className="w-1 h-1 rounded-full bg-indigo-200"></div>
                    ))}
                </div>

                <div className="hidden lg:block absolute left-10 bottom-10 max-w-l bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-l border border-white/10">
                    <div className="flex items-start space-x-3">
                        <div className="p-1.5 bg-blue-500/30 rounded-full text-blue-100">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-l font-medium text-white">Monitor Lapangan Secara Real-time</h3>
                            <p className="text-l text-blue-100/80 mt-1">Akses data terkini dan analitik lapangan dengan sistem GIS terintegrasi.</p>
                        </div>
                    </div>
                </div>

                <div className="hidden lg:block absolute right-10 top-10 max-w-l bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-l border border-white/10">
                    <div className="flex items-start space-x-3">
                        <div className="p-1.5 bg-indigo-500/30 rounded-full text-indigo-100">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-l font-medium text-white">Pengelolaan Data Terintegrasi</h3>
                            <p className="text-l text-indigo-100/80 mt-1">Koordinasi operasi lapangan dan analisis data menjadi lebih efisien.</p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 w-full max-w-md">
                    <LoginForm />

                    <div className="text-center mt-6 text-white/70 text-l">
                        © {new Date().getFullYear()} SIPP Karhutla. All rights reserved.
                    </div>
                </div>
            </div>
        </CustomHead>
    )
}