import React from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react';

const UnauthorizedContent: React.FC = () => {
    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex flex-col items-center justify-center px-4 py-6">
            <div className="w-full max-w-lg">
                <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 transform hover:shadow-2xl">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-500 rounded-full opacity-10 blur-2xl"></div>
                    <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-orange-500 rounded-full opacity-10 blur-2xl"></div>

                    <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 text-white text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -mt-10 -mr-10"></div>
                            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white rounded-full -mb-10 -ml-10"></div>
                        </div>

                        <div className="relative">
                            <div className="inline-flex items-center justify-center p-3 bg-white bg-opacity-20 rounded-full mb-4">
                                <AlertTriangle className="h-8 w-8 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold mb-1">Akses Ditolak</h1>
                            <p className="text-red-100">Anda tidak memiliki hak akses yang cukup untuk mengakses halaman ini</p>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-6">
                            <p className="text-red-700">
                                Halaman yang Anda coba akses memerlukan tingkat akses yang lebih tinggi dari yang Anda miliki saat ini. Silakan hubungi administrator sistem jika Anda memerlukan akses ke halaman ini.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 mt-6">
                            <button
                                onClick={() => window.history.back()}
                                className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200 py-3 px-4 rounded-xl transition-colors duration-300"
                            >
                                <ArrowLeft className="h-5 w-5" />
                                <span>Kembali</span>
                            </button>

                            <Link
                                href="/patroli"
                                className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                            >
                                <Home className="h-5 w-5" />
                                <span>Halaman Utama</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-6 text-center text-gray-500 text-sm">
                    <p>Jika Anda yakin seharusnya memiliki akses, silakan <a href="mailto:karhutla.ipb@apps.ipb.ac.id" className="text-blue-600 hover:text-blue-800 font-medium">hubungi tim dukungan</a></p>
                </div>
            </div>
        </div>
    );
};

export default UnauthorizedContent;