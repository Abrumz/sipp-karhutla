import React, { ChangeEvent, useEffect, useState } from 'react';
import { MapPin, AlertCircle, ArrowLeft, Plus, X } from 'lucide-react';
import { useRouter } from 'next/router';
import { addPosko, getAllDaops, getAllKecamatan } from '@/services';
import Swal from 'sweetalert2';

interface DaopsData {
    id: string;
    code: string;
    name: string;
}

interface RegionData {
    id: string;
    name: string;
    code?: string;
}

interface FormValues {
    name: string;
    daops: string;
    kecamatan: string;
    showTextfield: boolean;
    textfieldValue: string;
    showDaopsField: boolean;
    daopsTextValue: string;
}

const TambahPosko: React.FC = () => {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [daopsOptionData, setDaopsOptionData] = useState<DaopsData[]>([]);
    const [kecamatan, setKecamatan] = useState<RegionData[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchDaopsTerm, setSearchDaopsTerm] = useState<string>('');
    const [visibleKecamatanCount, setVisibleKecamatanCount] = useState<number>(30);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

    const [values, setValues] = useState<FormValues>({
        name: '',
        daops: '',
        kecamatan: '',
        showTextfield: false,
        textfieldValue: '',
        showDaopsField: false,
        daopsTextValue: ''
    });

    const handleChange = (prop: keyof FormValues) => (
        event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleFormSubmit = async () => {
        if (!values.name || !values.daops || !values.kecamatan) {
            Swal.fire({
                icon: 'warning',
                title: 'Peringatan',
                text: 'Semua field harus diisi',
                confirmButtonColor: '#3085d6',
                customClass: {
                    popup: 'swal-large-text',
                    title: 'text-xl',
                    htmlContainer: 'text-lg'
                }
            });
            return;
        }

        setLoading(true);
        try {
            const result = await addPosko(values);
            if (result.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Data posko berhasil ditambahkan',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    customClass: {
                        popup: 'swal-large-text',
                        title: 'text-xl',
                        htmlContainer: 'text-lg'
                    }
                }).then(() => {
                    resetForm();
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: result.message as string,
                    confirmButtonColor: '#3085d6',
                    customClass: {
                        popup: 'swal-large-text',
                        title: 'text-xl',
                        htmlContainer: 'text-lg'
                    }
                });
            }
        } catch (error) {
            console.error("Error adding posko:", error);
            Swal.fire({
                icon: 'error',
                title: 'Terjadi Kesalahan',
                text: 'Gagal menambah data posko',
                confirmButtonColor: '#3085d6',
                customClass: {
                    popup: 'swal-large-text',
                    title: 'text-xl',
                    htmlContainer: 'text-lg'
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setValues({
            name: '',
            daops: '',
            kecamatan: '',
            showTextfield: false,
            textfieldValue: '',
            showDaopsField: false,
            daopsTextValue: ''
        });
    };

    const filteredKecamatan = kecamatan.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const visibleKecamatan = filteredKecamatan.slice(0, visibleKecamatanCount);

    const handleLoadMoreKecamatan = () => {
        setIsLoadingMore(true);
        setTimeout(() => {
            setVisibleKecamatanCount(prev => prev + 30);
            setIsLoadingMore(false);
        }, 300);
    };

    const handleKecamatanScroll = (e: React.UIEvent<HTMLUListElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollHeight - scrollTop - clientHeight < 50 && !isLoadingMore && visibleKecamatan.length < filteredKecamatan.length) {
            handleLoadMoreKecamatan();
        }
    };

    const filteredDaops = daopsOptionData.filter(item =>
        item.name.toLowerCase().includes(searchDaopsTerm.toLowerCase())
    );

    useEffect(() => {
        const setOptionData = async () => {
            const daops = await getAllDaops();
            const kecamatanData = await getAllKecamatan({ page: 1, limit: 100, search: '' });
            setDaopsOptionData(daops);
            setKecamatan(kecamatanData);
        };
        setOptionData();
    }, []);

    useEffect(() => {
        if (!values.showTextfield) {
            setTimeout(() => {
                setVisibleKecamatanCount(30);
            }, 300);
        }
    }, [values.showTextfield]);

    return (
        <div className="bg-gray-50 min-h-full p-6">
            <div className="header-primary text-white p-8 rounded-xl mb-8 shadow-md">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl font-bold mb-2">Tambah Posko</h1>
                    <p className="text-xl opacity-90">
                        Tambahkan data posko pengendalian kebakaran hutan dan lahan
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mb-8">
                <button
                    onClick={() => router.push('/wilayah/posko')}
                    className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors text-base"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Kembali ke Daftar Posko</span>
                </button>

                <div className="bg-white rounded-xl shadow p-6 mb-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-semibold text-black-800 text-xl mb-3">Informasi Penggunaan</h3>
                            <p className="text-base text-black-700 leading-relaxed">
                                Halaman ini digunakan untuk menambahkan data posko baru. Isi nama posko dan pilih daops yang sesuai.
                                Kemudian, pilih kecamatan tempat posko berada dari daftar yang tersedia.
                            </p>
                            <p className="text-base text-black-700 mt-2 leading-relaxed">
                                Petunjuk penggunaan:
                            </p>
                            <ul className="mt-2 text-base text-black-700 space-y-1 list-disc list-inside">
                                <li>Tambahkan informasi posko baru ke dalam sistem</li>
                                <li>Pastikan semua informasi telah diisi dengan lengkap dan benar</li>
                                <li>Pilih kecamatan sesuai dengan area operasional posko</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold text-black-800 mb-6">Form Tambah Posko</h2>

                    <form className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-base font-medium text-black-700 mb-2">
                                    Nama Posko <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Masukkan nama posko"
                                    value={values.name}
                                    onChange={handleChange('name')}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-base font-medium text-black-700 mb-2">
                                    Daops <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div
                                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent flex justify-between items-center cursor-pointer"
                                        onClick={() => setValues({ ...values, showDaopsField: !values.showDaopsField })}
                                    >
                                        <span className={values.daopsTextValue ? "text-black-900" : "text-black-500"}>
                                            {values.daopsTextValue || "Pilih Daops"}
                                        </span>
                                        <svg className={`h-5 w-5 text-black-400 transition-transform ${values.showDaopsField ? "transform rotate-180" : ""}`}
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </div>

                                    {values.showDaopsField && (
                                        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md overflow-auto border border-gray-200">
                                            <div className="sticky top-0 bg-white p-2 border-b border-gray-200">
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        placeholder="Cari daops..."
                                                        value={searchDaopsTerm}
                                                        onChange={(e) => setSearchDaopsTerm(e.target.value)}
                                                        className="w-full pl-10 pr-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                    <svg
                                                        className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black-400"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                                    </svg>
                                                </div>
                                            </div>

                                            <ul className="py-1">
                                                {filteredDaops.length > 0 ? (
                                                    filteredDaops.map((item) => (
                                                        <li
                                                            key={item.id}
                                                            className="px-6 py-4 hover:bg-blue-50 cursor-pointer text-base text-black-700"
                                                            onClick={() => {
                                                                setValues({
                                                                    ...values,
                                                                    daops: item.id,
                                                                    daopsTextValue: item.name,
                                                                    showDaopsField: false
                                                                });
                                                            }}
                                                        >
                                                            {item.name}
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className="px-6 py-4 text-base text-black-500 text-center">
                                                        {searchDaopsTerm ? 'Tidak ada data yang sesuai dengan pencarian' : 'Tidak ada data daops'}
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                                {values.daopsTextValue && (
                                    <div className="mt-2 flex items-center">
                                        <span className="text-base text-green-600 flex items-center">
                                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            Daops {values.daopsTextValue} dipilih
                                        </span>
                                        <button
                                            type="button"
                                            className="ml-2 text-base text-blue-600 hover:text-blue-800 hover:underline"
                                            onClick={() => {
                                                setValues({
                                                    ...values,
                                                    daops: '',
                                                    daopsTextValue: '',
                                                    showDaopsField: true
                                                });
                                            }}
                                        >
                                            Ganti
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-base font-medium text-black-700 mb-2">
                                Kecamatan <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div
                                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent flex justify-between items-center cursor-pointer"
                                    onClick={() => setValues({ ...values, showTextfield: !values.showTextfield })}
                                >
                                    <span className={values.textfieldValue ? "text-black-900" : "text-black-500"}>
                                        {values.textfieldValue || "Pilih Kecamatan"}
                                    </span>
                                    <svg className={`h-5 w-5 text-black-400 transition-transform ${values.showTextfield ? "transform rotate-180" : ""}`}
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>

                                {values.showTextfield && (
                                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md overflow-auto border border-gray-200">
                                        <div className="sticky top-0 bg-white p-2 border-b border-gray-200">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="Cari kecamatan..."
                                                    value={searchTerm}
                                                    onChange={(e) => {
                                                        setSearchTerm(e.target.value);
                                                        setVisibleKecamatanCount(30);
                                                    }}
                                                    className="w-full pl-10 pr-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                                <svg
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                                </svg>
                                            </div>
                                        </div>

                                        <ul className="py-1">
                                            {filteredKecamatan.length > 0 ? (
                                                <>
                                                    <ul className="py-1" onScroll={handleKecamatanScroll} style={{ maxHeight: '240px', overflowY: 'auto' }}>
                                                        {visibleKecamatan.map((item) => (
                                                            <li
                                                                key={item.id}
                                                                className="px-6 py-4 hover:bg-blue-50 cursor-pointer text-base text-black-700"
                                                                onClick={() => {
                                                                    setValues({
                                                                        ...values,
                                                                        kecamatan: item.id,
                                                                        textfieldValue: item.name,
                                                                        showTextfield: false
                                                                    });
                                                                }}
                                                            >
                                                                {item.name}
                                                            </li>
                                                        ))}
                                                        {isLoadingMore && (
                                                            <li className="px-6 py-4 text-center">
                                                                <div className="flex justify-center items-center">
                                                                    <div className="w-6 h-6 border-2 border-r-transparent border-blue-500 rounded-full animate-spin mr-2"></div>
                                                                    <span className="text-base text-black-500">Memuat...</span>
                                                                </div>
                                                            </li>
                                                        )}
                                                    </ul>
                                                    {visibleKecamatan.length < filteredKecamatan.length && !isLoadingMore && (
                                                        <li className="px-6 py-4 text-center border-t border-gray-100">
                                                            <button
                                                                className="text-base text-blue-600 hover:text-blue-800"
                                                                onClick={handleLoadMoreKecamatan}
                                                            >
                                                                Muat lebih banyak ({visibleKecamatan.length} dari {filteredKecamatan.length})
                                                            </button>
                                                        </li>
                                                    )}
                                                </>
                                            ) : (
                                                <li className="px-6 py-4 text-base text-black-500 text-center">
                                                    {searchTerm ? 'Tidak ada data yang sesuai dengan pencarian' : 'Tidak ada data kecamatan'}
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            {values.textfieldValue && (
                                <div className="mt-2 flex items-center">
                                    <span className="text-base text-green-600 flex items-center">
                                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        Kecamatan {values.textfieldValue} dipilih
                                    </span>
                                    <button
                                        type="button"
                                        className="ml-2 text-base text-blue-600 hover:text-blue-800 hover:underline"
                                        onClick={() => {
                                            setValues({
                                                ...values,
                                                kecamatan: '',
                                                textfieldValue: '',
                                                showTextfield: true
                                            });
                                        }}
                                    >
                                        Ganti
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-center mt-8">
                            <button
                                type="button"
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors w-full md:w-64 text-lg"
                                onClick={handleFormSubmit}
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-6 h-6 border-2 border-r-transparent border-white rounded-full animate-spin mr-2"></div>
                                        <span>Memproses...</span>
                                    </div>
                                ) : (
                                    'Tambah Posko'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TambahPosko;