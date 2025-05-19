import React, { ChangeEvent, useEffect, useState } from 'react';
import { MapPin, AlertCircle, ArrowLeft, Plus, X } from 'lucide-react';
import { useRouter } from 'next/router';
import { addPosko, getAllDaops, getAllKecamatan } from '@/services';

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
    errorMessage: string;
    showTextfield: boolean;
    textfieldValue: string;
    showDaopsField: boolean;
    daopsTextValue: string;
    showDialog: boolean;
    successDialog: boolean;
}

const InfoCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
}> = ({ icon, title, description, color }) => {
    const colorClasses = {
        blue: 'text-blue-600 bg-blue-50',
        indigo: 'text-indigo-600 bg-indigo-50',
        purple: 'text-purple-600 bg-purple-50'
    };

    return (
        <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className={`p-3 rounded-lg flex items-center justify-center ${colorClasses[color as keyof typeof colorClasses]}`}>
                {icon}
            </div>
            <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
                <p className="text-l text-gray-500 leading-relaxed">{description}</p>
            </div>
        </div>
    );
};

const TambahPosko: React.FC = () => {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [daopsOptionData, setDaopsOptionData] = useState<DaopsData[]>([]);
    const [kecamatan, setKecamatan] = useState<RegionData[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchDaopsTerm, setSearchDaopsTerm] = useState<string>('');
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [visibleKecamatanCount, setVisibleKecamatanCount] = useState<number>(30);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

    const [values, setValues] = useState<FormValues>({
        name: '',
        daops: '',
        kecamatan: '',
        errorMessage: '',
        showTextfield: false,
        textfieldValue: '',
        showDaopsField: false,
        daopsTextValue: '',
        showDialog: false,
        successDialog: true
    });

    const handleChange = (prop: keyof FormValues) => (
        event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleFormSubmit = async () => {
        setLoading(true);
        const result = await addPosko(values);
        if (result.success) {
            setValues({ ...values, successDialog: true, showDialog: true });
        } else {
            setValues({
                ...values,
                successDialog: false,
                errorMessage: result.message as string,
                showDialog: true
            });
        }
        setLoading(false);
    };

    const resetForm = () => {
        setValues({
            ...values,
            name: '',
            daops: '',
            kecamatan: '',
            showDialog: false,
            errorMessage: '',
            showTextfield: false,
            textfieldValue: '',
            showDaopsField: false,
            daopsTextValue: ''
        });
    };

    const closeDialog = () => {
        if (values.successDialog) resetForm();
        else setValues({ ...values, showDialog: false });
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

    const closeAlert = () => setShowAlert(false);

    const showAlertMessage = () => {
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
        }, 3000);
    };

    useEffect(() => {
        const setOptionData = async () => {
            const daops = await getAllDaops();
            const kecamatanData = await getAllKecamatan();
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
            {showAlert && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-md flex justify-between items-center shadow-lg ${values.successDialog
                    ? 'bg-green-50 text-green-800 border-l-4 border-green-500'
                    : 'bg-red-50 text-red-800 border-l-4 border-red-500'
                    }`}>
                    <p>{values.errorMessage || (values.successDialog ? 'Tambah Posko Berhasil' : 'Tambah Posko Gagal')}</p>
                    <button
                        onClick={closeAlert}
                        className="ml-4 text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}

            <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-8 rounded-xl mb-8 shadow-md">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-3xl font-bold mb-2">Tambah Posko</h1>
                    <p className="text-lg opacity-90">
                        Tambahkan data posko pengendalian kebakaran hutan dan lahan
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mb-8">
                <button
                    onClick={() => router.push('/wilayah/posko')}
                    className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali ke Daftar Posko</span>
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    <InfoCard
                        icon={<MapPin className="w-5 h-5" />}
                        title="Data Posko"
                        description="Posko adalah pusat komando dan koordinasi untuk pengendalian kebakaran"
                        color="blue"
                    />
                    <InfoCard
                        icon={<MapPin className="w-5 h-5" />}
                        title="Pemilihan Area"
                        description="Pilih kecamatan sesuai dengan area operasional posko"
                        color="indigo"
                    />
                    <InfoCard
                        icon={<MapPin className="w-5 h-5" />}
                        title="Operasional Daops"
                        description="Tentukan daops yang bertanggung jawab terhadap posko"
                        color="purple"
                    />
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Form Tambah Posko</h2>

                    <form className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Posko <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Masukkan nama posko"
                                    value={values.name}
                                    onChange={handleChange('name')}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Daops <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent flex justify-between items-center cursor-pointer"
                                        onClick={() => setValues({ ...values, showDaopsField: !values.showDaopsField })}
                                    >
                                        <span className={values.daopsTextValue ? "text-gray-900" : "text-gray-500"}>
                                            {values.daopsTextValue || "Pilih Daops"}
                                        </span>
                                        <svg className={`h-5 w-5 text-gray-400 transition-transform ${values.showDaopsField ? "transform rotate-180" : ""}`}
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
                                                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                    <svg
                                                        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
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
                                                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-700"
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
                                                    <li className="px-4 py-2 text-sm text-gray-500 text-center">
                                                        {searchDaopsTerm ? 'Tidak ada data yang sesuai dengan pencarian' : 'Tidak ada data daops'}
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                                {values.daopsTextValue && (
                                    <div className="mt-2 flex items-center">
                                        <span className="text-sm text-green-600 flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            Daops {values.daopsTextValue} dipilih
                                        </span>
                                        <button
                                            type="button"
                                            className="ml-2 text-xs text-blue-600 hover:text-blue-800 hover:underline"
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Kecamatan <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent flex justify-between items-center cursor-pointer"
                                    onClick={() => setValues({ ...values, showTextfield: !values.showTextfield })}
                                >
                                    <span className={values.textfieldValue ? "text-gray-900" : "text-gray-500"}>
                                        {values.textfieldValue || "Pilih Kecamatan"}
                                    </span>
                                    <svg className={`h-5 w-5 text-gray-400 transition-transform ${values.showTextfield ? "transform rotate-180" : ""}`}
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
                                                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                                <svg
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
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
                                                                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-700"
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
                                                            <li className="px-4 py-2 text-center">
                                                                <div className="flex justify-center items-center">
                                                                    <div className="w-4 h-4 border-2 border-r-transparent border-blue-500 rounded-full animate-spin mr-2"></div>
                                                                    <span className="text-xs text-gray-500">Memuat...</span>
                                                                </div>
                                                            </li>
                                                        )}
                                                    </ul>
                                                    {visibleKecamatan.length < filteredKecamatan.length && !isLoadingMore && (
                                                        <li className="px-4 py-2 text-center border-t border-gray-100">
                                                            <button
                                                                className="text-xs text-blue-600 hover:text-blue-800"
                                                                onClick={handleLoadMoreKecamatan}
                                                            >
                                                                Muat lebih banyak ({visibleKecamatan.length} dari {filteredKecamatan.length})
                                                            </button>
                                                        </li>
                                                    )}
                                                </>
                                            ) : (
                                                <li className="px-4 py-2 text-sm text-gray-500 text-center">
                                                    {searchTerm ? 'Tidak ada data yang sesuai dengan pencarian' : 'Tidak ada data kecamatan'}
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            {values.textfieldValue && (
                                <div className="mt-2 flex items-center">
                                    <span className="text-sm text-green-600 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        Kecamatan {values.textfieldValue} dipilih
                                    </span>
                                    <button
                                        type="button"
                                        className="ml-2 text-xs text-blue-600 hover:text-blue-800 hover:underline"
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
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors w-full md:w-64"
                                onClick={handleFormSubmit}
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-r-transparent border-white rounded-full animate-spin mr-2"></div>
                                        <span>Memproses...</span>
                                    </div>
                                ) : (
                                    'Tambah Posko'
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-8 p-6 bg-white rounded-xl shadow">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-2">Informasi Penggunaan</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Halaman ini digunakan untuk menambahkan data posko baru. Isi nama posko dan pilih daops yang sesuai.
                                Kemudian, pilih kecamatan tempat posko berada dari daftar yang tersedia. Pastikan semua data yang dimasukkan sudah benar sebelum menyimpan.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {values.showDialog && (
                <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg w-full max-w-md mx-4 md:mx-auto shadow-xl">
                        <div className="flex justify-between items-center px-6 py-4 border-b">
                            <h4 className="text-lg font-semibold text-gray-800">
                                {values.successDialog ? 'Tambah Posko Berhasil' : 'Tambah Posko Gagal'}
                            </h4>
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={closeDialog}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="px-6 py-4 border-b">
                            <div className="text-center">
                                {values.successDialog ? (
                                    <div className="space-y-3">
                                        <button
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors mb-2"
                                            onClick={resetForm}
                                        >
                                            Tambah Posko Lagi
                                        </button>
                                        <button
                                            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition-colors"
                                            onClick={() => router.push('/wilayah/posko')}
                                        >
                                            Kembali ke Halaman Data Posko
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-red-600">{values.errorMessage}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TambahPosko;