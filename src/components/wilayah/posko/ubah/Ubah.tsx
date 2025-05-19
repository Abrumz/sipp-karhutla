import React, { useState, useEffect, ChangeEvent } from 'react';
import { ArrowLeft, AlertCircle, Plus, X, Check } from 'lucide-react';
import { useRouter } from 'next/router';
import { getAllDaops, getAllKecamatan, getDetailPosko, updatePosko } from '@/services';
import { DaopsData, RegionData } from '@/interfaces/data';

interface UbahPoskoProps {
    poskoId?: string;
}

interface FormValues {
    id: string;
    oldName: string;
    name: string;
    daops: string;
    kecamatan: string;
    alertMessage: string;
    showTextfield: boolean;
    textfieldValue: string;
    showAlert: boolean;
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
                <p className="text-gray-500 leading-relaxed">{description}</p>
            </div>
        </div>
    );
};

const UbahPosko: React.FC<UbahPoskoProps> = ({ poskoId }) => {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [pageLoading, setPageLoading] = useState<boolean>(true);
    const [daopsOptionData, setDaopsOptionData] = useState<DaopsData[]>([]);
    const [kecamatan, setKecamatan] = useState<RegionData[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [showKecamatanTable, setShowKecamatanTable] = useState<boolean>(false);

    const [values, setValues] = useState<FormValues>({
        id: '',
        oldName: '',
        name: '',
        daops: '',
        kecamatan: '',
        alertMessage: '',
        showTextfield: false,
        textfieldValue: '',
        showAlert: false
    });

    const handleChange = (prop: keyof FormValues) => (
        event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleFormSubmit = async () => {
        if (!values.name || !values.daops || !values.kecamatan) {
            setValues({
                ...values,
                showAlert: true,
                alertMessage: 'Semua field harus diisi'
            });
            return;
        }

        setLoading(true);
        try {
            const result = await updatePosko(values, values.oldName);
            if (result.success) {
                router.push('/wilayah/posko?message=Data posko berhasil diubah');
            } else {
                setValues({
                    ...values,
                    showAlert: true,
                    alertMessage: result.message as string
                });
            }
        } catch (error) {
            console.error("Error updating posko:", error);
            setValues({
                ...values,
                showAlert: true,
                alertMessage: 'Terjadi kesalahan saat mengubah data posko'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setPageLoading(true);
                const [daopsData, kecamatanData] = await Promise.all([
                    getAllDaops(),
                    getAllKecamatan()
                ]);

                setDaopsOptionData(daopsData);
                setKecamatan(kecamatanData);

                if (poskoId) {
                    const poskoData = await getDetailPosko(poskoId);
                    if (poskoData) {
                        setValues({
                            ...values,
                            id: poskoData.id,
                            oldName: poskoData.name,
                            name: poskoData.name,
                            daops: poskoData.daopsId,
                            kecamatan: poskoData.kecamatanId,
                            showTextfield: true,
                            textfieldValue: poskoData.kecamatan
                        });
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setValues({
                    ...values,
                    showAlert: true,
                    alertMessage: 'Gagal memuat data'
                });
            } finally {
                setPageLoading(false);
            }
        };

        fetchData();
    }, [poskoId]);

    const handleSelectKecamatan = (item: RegionData) => {
        setValues({
            ...values,
            kecamatan: item.id,
            textfieldValue: item.name,
            showTextfield: true
        });
        setShowKecamatanTable(false);
    };

    const filteredKecamatan = kecamatan.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-gray-50 min-h-full p-6">
            {/* Alert */}
            {values.showAlert && (
                <div className="fixed top-4 right-4 z-50 p-4 rounded-md flex justify-between items-center shadow-lg bg-yellow-50 text-yellow-800 border-l-4 border-yellow-500">
                    <p>{values.alertMessage}</p>
                    <button
                        onClick={() => setValues({ ...values, showAlert: false })}
                        className="ml-4 text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Header Banner */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-8 rounded-xl mb-8 shadow-md">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-3xl font-bold mb-2">Ubah Posko</h1>
                    <p className="text-lg opacity-90">
                        Perbarui data posko pengendalian kebakaran hutan dan lahan
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
                        icon={<AlertCircle className="w-5 h-5" />}
                        title="Ubah Data Posko"
                        description="Perbarui informasi posko yang sudah ada dalam sistem"
                        color="blue"
                    />
                    <InfoCard
                        icon={<Check className="w-5 h-5" />}
                        title="Data Lengkap"
                        description="Pastikan semua informasi telah diisi dengan lengkap dan benar"
                        color="indigo"
                    />
                    <InfoCard
                        icon={<Plus className="w-5 h-5" />}
                        title="Pemilihan Area"
                        description="Pilih kecamatan sesuai dengan area operasional posko"
                        color="purple"
                    />
                </div>

                {pageLoading ? (
                    <div className="flex justify-center items-center p-12">
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-600">Memuat data posko...</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Form Ubah Posko</h2>

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
                                    <select
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={values.daops}
                                        onChange={handleChange('daops')}
                                        required
                                    >
                                        <option value="" disabled>Pilih Daops</option>
                                        {daopsOptionData.map((option) => (
                                            <option key={option.id} value={option.id}>
                                                {option.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kecamatan <span className="text-red-500">*</span>
                                </label>

                                {values.showTextfield ? (
                                    <div>
                                        <div className="flex items-center mb-2">
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                                value={values.textfieldValue}
                                                disabled
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setValues({
                                                    ...values,
                                                    kecamatan: '',
                                                    textfieldValue: '',
                                                    showTextfield: false
                                                });
                                                setShowKecamatanTable(true);
                                            }}
                                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                        >
                                            Ganti Kecamatan
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() => setShowKecamatanTable(true)}
                                            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors flex items-center gap-2"
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span>Pilih Kecamatan</span>
                                        </button>
                                    </div>
                                )}

                                {showKecamatanTable && (
                                    <div className="mt-4 border rounded-lg overflow-hidden">
                                        <div className="p-4 bg-gray-50 border-b">
                                            <h3 className="text-lg font-medium text-gray-800 mb-4">Pilih Kecamatan</h3>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="Cari kecamatan..."
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                />
                                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                                </svg>
                                            </div>
                                        </div>

                                        <div className="max-h-96 overflow-y-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kecamatan</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {filteredKecamatan.length > 0 ? (
                                                        filteredKecamatan.map((item) => (
                                                            <tr key={item.id} className="hover:bg-gray-50">
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{item.name}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleSelectKecamatan(item)}
                                                                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
                                                                    >
                                                                        <Plus className="w-4 h-4" />
                                                                        <span>Pilih</span>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan={2} className="px-6 py-4 text-center text-sm text-gray-500">
                                                                {searchTerm ? 'Tidak ada data yang sesuai dengan pencarian' : 'Tidak ada data kecamatan'}
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="p-4 border-t bg-gray-50 flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => setShowKecamatanTable(false)}
                                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors mr-2"
                                            >
                                                Batal
                                            </button>
                                        </div>
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
                                        'Ubah Posko'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="mt-8 p-6 bg-white rounded-xl shadow">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-2">Informasi Penggunaan</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Halaman ini digunakan untuk mengubah data posko yang sudah ada. Isi nama posko dan pilih daops yang sesuai.
                                Anda juga dapat mengganti kecamatan tempat posko berada dari daftar yang tersedia. Pastikan semua data yang dimasukkan sudah benar sebelum menyimpan.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UbahPosko;