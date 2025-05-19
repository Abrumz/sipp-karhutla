import ForgotPassword from '@/components/forgotPassword/ForgotPassword'
import CustomHead from '@/components/layout/customHead/CustomHead'
import React from 'react'
import loginBgImage from '@/assets/img/login-bg-2.png'

export default function ForgotPasswordPage() {
    return (
        <CustomHead
            title='Lupa Kata Sandi'
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

                {/* Feature Highlights */}
                <div className="hidden lg:block absolute left-10 bottom-10 max-w-l bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-l border border-white/10">
                    <div className="flex items-start space-x-3">
                        <div className="p-1.5 bg-blue-500/30 rounded-full text-blue-100">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-5h2a1 1 0 00.9-.5l4-5.5a1 1 0 00-.2-1.4 1 1 0 00-1.3.1l-5 5.5H11v-5z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-l font-medium text-white">Reset Kata Sandi dengan Aman</h3>
                            <p className="text-l text-blue-100/80 mt-1">Perubahan kata sandi dilakukan dengan langkah-langkah terenkripsi.</p>
                        </div>
                    </div>
                </div>

                <div className="hidden lg:block absolute right-10 top-10 max-w-l bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-l border border-white/10">
                    <div className="flex items-start space-x-3">
                        <div className="p-1.5 bg-indigo-500/30 rounded-full text-indigo-100">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v-1l1-1-1-1H3v-1l1-1-1-1V8a6 6 0 1112 0zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-l font-medium text-white">Keamanan Tingkat Tinggi</h3>
                            <p className="text-l text-indigo-100/80 mt-1">Akses sistem dilindungi dengan protokol keamanan terbaru.</p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 w-full max-w-md">
                    <ForgotPassword />

                    <div className="text-center mt-6 text-white/70 text-l">
                        © {new Date().getFullYear()} SIPP Karhutla. All rights reserved.
                    </div>
                </div>
            </div>
        </CustomHead>
    )
}