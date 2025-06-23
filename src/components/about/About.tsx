import React, { useState } from 'react';
import moment from 'moment';
import 'moment/locale/id';
import SiteLayout from '@/components/layout/siteLayout/SiteLayout';
import Loader from '@/components/loader/Loader';
import useAuth from '@/context/auth';
import { Info, Map, Book, Mail, Building, Award, FileText, Users } from 'lucide-react';

const About: React.FC = () => {
    const { isAuthenticated } = useAuth();

    return !isAuthenticated ? (
        <Loader />
    ) : (
        <SiteLayout>
            <div className="bg-gray-50 min-h-screen pb-8">
                {/* Header dengan styling header-primary */}
                <div className="header-primary relative py-6 px-4 mb-6 overflow-hidden text-white rounded-b-lg">
                    {/* Background patterns */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -mt-20 -mr-20"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full -mb-20 -ml-20"></div>

                    <div className="relative flex flex-col items-center justify-center text-center z-10">
                        <div className="flex items-center mb-2">
                            <Info className="text-white w-8 h-8 mr-3" />
                            <h1 className="text-3xl font-bold">
                                Tentang Sistem
                            </h1>
                        </div>
                        <p className="text-blue-100 text-lg max-w-2xl">
                            Sistem Informasi Patroli Pencegahan Kebakaran Hutan dan Lahan <br></br>(SIPP Karhutla)
                        </p>
                    </div>
                </div>

                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Informasi Utama */}
                        <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="p-4 bg-gradient-primary text-white">
                                <div className="flex items-center">
                                    <Book className="h-5 w-5 mr-2" />
                                    <h2 className="text-xl font-bold">Deskripsi Sistem</h2>
                                </div>
                            </div>

                            <div className="p-6">
                                <p className="text-base text-black-700 mb-6 leading-relaxed">
                                    Sistem Informasi Patroli Pencegahan Kebakaran Hutan dan Lahan (SIPP Karhutla)
                                    adalah alat bantu dalam kegiatan patroli pencegahan karhutla di Indonesia. Fungsi
                                    utama SIPP Karhutla mencakup:
                                </p>

                                <div className="mb-6 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                                    <div className="flex items-start mb-4">
                                        <div className="bg-blue-600 rounded-full p-2 mr-3 text-white flex-shrink-0">
                                            <Users className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-blue-800">Pengelolaan Data Pengguna</h3>
                                            <p className="text-blue-700">Manajemen data pengguna aplikasi mobile patroli pencegahan karhutla</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="bg-blue-600 rounded-full p-2 mr-3 text-white flex-shrink-0">
                                            <Map className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-blue-800">Monitoring dan Analisis</h3>
                                            <p className="text-blue-700">Pemantauan dan analisis data patroli pencegahan karhutla</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-black-800 mb-3 flex items-center">
                                        <Building className="h-5 w-5 mr-2 text-blue-600" />
                                        Pengembangan Sistem
                                    </h3>
                                    <div className="pl-8 border-l-2 border-blue-100">
                                        <p className="text-black-700 mb-4 leading-relaxed">
                                            SIPP Karhutla dibangun pada tahun 2022 oleh Departemen Ilmu Komputer, Fakultas Matematika dan Ilmu
                                            Pengetahuan Alam, Institut Pertanian Bogor (IPB) bekerja sama dengan Balai Pengendalian
                                            Perubahan Iklim dan Kebakaran Hutan dan Lahan (PPIKHL) Wilayah Sumatra dan
                                            Kalimantan, Direktorat Jenderal Pengendalian Perubahan Iklim, Kementerian Lingkungan
                                            Hidup dan Kehutanan (KLHK), dan Direktorat Pengendalian Kebakaran Hutan dan Lahan KLHK.
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-black-800 mb-3 flex items-center">
                                        <Award className="h-5 w-5 mr-2 text-blue-600" />
                                        Pendanaan
                                    </h3>
                                    <div className="pl-8 border-l-2 border-blue-100">
                                        <p className="text-black-700 mb-4 leading-relaxed">
                                            Pembangunan dan penerapan SIPP Karhutla di Wilayah Sumatera didanai oleh Lembaga
                                            Pengelola Dana Pendidikan (LPDP), Kementerian Keuangan Republik Indonesia.
                                            Sedangkan pengembangan dan penerapan SIPP Karhutla di Kalimantan serta pengadaan
                                            infrastruktur di KLHK didanai oleh International Tropical Timber Organization
                                            (ITTO).
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-black-800 mb-3 flex items-center">
                                        <FileText className="h-5 w-5 mr-2 text-blue-600" />
                                        Regulasi
                                    </h3>
                                    <div className="pl-8 border-l-2 border-blue-100">
                                        <p className="text-black-700 leading-relaxed">
                                            Penggunaan SIPP Karhutla diatur oleh Peraturan Direktur Jenderal Pengendalian
                                            Perubahan Iklim No. P.10/PPI/SET/KUM.1/12/2020 tentang Tata Cara Penggunaan Sistem
                                            Informasi Patroli Pencegahan Kebakaran Hutan dan Lahan (SIPP Karhutla) sebagai acuan
                                            dalam pencegahan kebakaran hutan dan lahan.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Kontak */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="p-4 bg-gradient-primary text-white">
                                <div className="flex items-center">
                                    <Mail className="h-5 w-5 mr-2" />
                                    <h2 className="text-xl font-bold">Informasi Kontak</h2>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex items-start mb-6 hover:bg-blue-50 p-3 rounded-lg transition-colors duration-200">
                                    <div className="bg-blue-600 rounded-full p-2 mr-3 text-white flex-shrink-0">
                                        <Building className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-black-800">Sekolah Sains Data, Matematika, dan Informatika <br></br>IPB Univeristy</h3>
                                        <p className="text-black-600">Jl. Meranti Wing 20 Level V, Bogor, Indonesia 16680</p>
                                    </div>
                                </div>

                                <div className="flex items-start mb-6 hover:bg-blue-50 p-3 rounded-lg transition-colors duration-200">
                                    <div className="bg-blue-600 rounded-full p-2 mr-3 text-white flex-shrink-0">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-black-800">Email</h3>
                                        <p className="text-black-600">karhutla.ipb@apps.ipb.ac.id</p>
                                    </div>
                                </div>

                                {/* <div className="flex items-start hover:bg-blue-50 p-3 rounded-lg transition-colors duration-200">
                                    <div className="bg-blue-600 rounded-full p-2 mr-3 text-white flex-shrink-0">
                                        <Phone className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-black-800">Telepon/Fax</h3>
                                        <p className="text-black-600">0251- 8625584</p>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>

                    {/* Footer Card */}
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                        <div className="flex flex-col md:flex-row items-center justify-between">
                            <div className="flex items-center mb-4 md:mb-0">
                                <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                                    <Info className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-black-800">Punya pertanyaan?</h3>
                                    <p className="text-black-600">Hubungi kami untuk informasi lebih lanjut</p>
                                </div>
                            </div>
                            <a
                                href="mailto:karhutla.ipb@apps.ipb.ac.id"
                                className="bg-gradient-primary text-white py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
                            >
                                <Mail className="h-5 w-5 mr-2" />
                                Hubungi Kami
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </SiteLayout>
    );
};

export default About;