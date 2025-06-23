import React, { useState, useEffect, ChangeEvent, useRef, useCallback } from 'react';
import { ArrowLeft, AlertCircle, Plus, X, Check } from 'lucide-react';
import { useRouter } from 'next/router';
import { getAllDaops, getAllKecamatan, getDetailPosko, updatePosko } from '@/services';
import { DaopsData, RegionData } from '@/interfaces/data';
import Swal from 'sweetalert2';

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

interface KecamatanPaginationParams {
    page: number;
    limit: number;
    hasMore: boolean;
}

const UbahPosko: React.FC<UbahPoskoProps> = ({ poskoId }) => {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [pageLoading, setPageLoading] = useState<boolean>(true);
    const [daopsOptionData, setDaopsOptionData] = useState<DaopsData[]>([]);
    const [kecamatan, setKecamatan] = useState<RegionData[]>([]);
    const [kecamatanLoading, setKecamatanLoading] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [showKecamatanTable, setShowKecamatanTable] = useState<boolean>(false);
    const kecamatanTableRef = useRef<HTMLDivElement>(null);
    const [kecamatanPagination, setKecamatanPagination] = useState<KecamatanPaginationParams>({
        page: 1,
        limit: 20,
        hasMore: true
    });
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Data posko berhasil diubah',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    customClass: {
                        popup: 'swal-large-text',
                        title: 'text-xl',
                        htmlContainer: 'text-lg'
                    }
                }).then(() => {
                    router.push('/wilayah/posko');
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
                setValues({
                    ...values,
                    showAlert: true,
                    alertMessage: result.message as string
                });
            }
        } catch (error) {
            console.error("Error updating posko:", error);
            Swal.fire({
                icon: 'error',
                title: 'Terjadi Kesalahan',
                text: 'Gagal mengubah data posko',
                confirmButtonColor: '#3085d6',
                customClass: {
                    popup: 'swal-large-text',
                    title: 'text-xl',
                    htmlContainer: 'text-lg'
                }
            });
            setValues({
                ...values,
                showAlert: true,
                alertMessage: 'Terjadi kesalahan saat mengubah data posko'
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchKecamatanData = useCallback(async (resetData = false, searchQuery = '') => {
        if (!kecamatanPagination.hasMore && !resetData) return;

        try {
            setKecamatanLoading(true);

            const newPage = resetData ? 1 : kecamatanPagination.page;

            const response = await getAllKecamatan({
                page: newPage,
                limit: kecamatanPagination.limit,
                search: searchQuery
            });

            const newKecamatan = response || [];
            const hasMore = newKecamatan.length === kecamatanPagination.limit;

            setKecamatan(prev => resetData ? newKecamatan : [...prev, ...newKecamatan]);
            setKecamatanPagination({
                page: newPage + 1,
                limit: kecamatanPagination.limit,
                hasMore
            });
        } catch (error) {
            console.error("Error fetching kecamatan data:", error);
            setValues({
                ...values,
                showAlert: true,
                alertMessage: 'Gagal memuat data kecamatan'
            });
        } finally {
            setKecamatanLoading(false);
        }
    }, [kecamatanPagination, values]);

    const handleScroll = useCallback(() => {
        if (kecamatanTableRef.current && !kecamatanLoading) {
            const { scrollTop, scrollHeight, clientHeight } = kecamatanTableRef.current;

            if (scrollTop + clientHeight >= scrollHeight - 50 && kecamatanPagination.hasMore) {
                fetchKecamatanData();
            }
        }
    }, [fetchKecamatanData, kecamatanLoading, kecamatanPagination.hasMore]);

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchTerm(query);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            setKecamatanPagination({
                page: 1,
                limit: kecamatanPagination.limit,
                hasMore: true
            });
            setKecamatan([]);
            fetchKecamatanData(true, query);
        }, 300);
    };

    useEffect(() => {
        if (showKecamatanTable && kecamatanTableRef.current) {
            const tableElement = kecamatanTableRef.current;
            tableElement.addEventListener('scroll', handleScroll);

            return () => {
                tableElement.removeEventListener('scroll', handleScroll);
            };
        }
    }, [showKecamatanTable, handleScroll]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setPageLoading(true);

                const daopsData = await getAllDaops();
                setDaopsOptionData(daopsData);

                if (showKecamatanTable) {
                    fetchKecamatanData(true);
                }

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

        fetchInitialData();
    }, [poskoId]);

    useEffect(() => {
        if (showKecamatanTable && kecamatan.length === 0 && !kecamatanLoading) {
            fetchKecamatanData(true, searchTerm);
        }
    }, [showKecamatanTable, kecamatan.length, kecamatanLoading, fetchKecamatanData, searchTerm]);

    const handleSelectKecamatan = (item: RegionData) => {
        setValues({
            ...values,
            kecamatan: item.id,
            textfieldValue: item.name,
            showTextfield: true
        });
        setShowKecamatanTable(false);
    };

    return (
        <div className="bg-gray-50 min-h-full p-6">
            {values.showAlert && (
                <div className="fixed top-4 right-4 z-50 p-4 rounded-md flex justify-between items-center shadow-lg bg-yellow-50 text-yellow-800 border-l-4 border-yellow-500">
                    <p className="text-base">{values.alertMessage}</p>
                    <button
                        onClick={() => setValues({ ...values, showAlert: false })}
                        className="ml-4 text-black-500 hover:text-black-700"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
            )}

            <div className="header-primary text-white p-8 rounded-xl mb-8 shadow-md">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl font-bold mb-2">Ubah Posko</h1>
                    <p className="text-xl opacity-90">
                        Perbarui data posko pengendalian kebakaran hutan dan lahan
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
                                Halaman ini digunakan untuk mengubah data posko yang sudah ada. Isi nama posko dan pilih daops yang sesuai.
                                Anda juga dapat mengganti kecamatan tempat posko berada dari daftar yang tersedia.
                            </p>
                            <p className="text-base text-black-700 mt-2 leading-relaxed">
                                Petunjuk penggunaan:
                            </p>
                            <ul className="mt-2 text-base text-black-700 space-y-1 list-disc list-inside">
                                <li>Perbarui informasi posko yang sudah ada dalam sistem</li>
                                <li>Pastikan semua informasi telah diisi dengan lengkap dan benar</li>
                                <li>Pilih kecamatan sesuai dengan area operasional posko</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {pageLoading ? (
                    <div className="flex justify-center items-center p-12">
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mb-4"></div>
                            <p className="text-base text-black-600">Memuat data posko...</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="text-xl font-semibold text-black-800 mb-6">Form Ubah Posko</h2>

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
                                    <select
                                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                <label className="block text-base font-medium text-black-700 mb-2">
                                    Kecamatan <span className="text-red-500">*</span>
                                </label>

                                {values.showTextfield ? (
                                    <div>
                                        <div className="flex items-center mb-2">
                                            <input
                                                type="text"
                                                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg bg-gray-50"
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
                                                setKecamatan([]);
                                                setKecamatanPagination({
                                                    page: 1,
                                                    limit: 20,
                                                    hasMore: true
                                                });
                                            }}
                                            className="text-base text-blue-600 hover:text-blue-800 hover:underline"
                                        >
                                            Ganti Kecamatan
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowKecamatanTable(true);
                                                setKecamatan([]);
                                                setKecamatanPagination({
                                                    page: 1,
                                                    limit: 20,
                                                    hasMore: true
                                                });
                                            }}
                                            className="px-4 py-3 text-base bg-blue-50 text-blue-600 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors flex items-center gap-2"
                                        >
                                            <Plus className="w-5 h-5" />
                                            <span>Pilih Kecamatan</span>
                                        </button>
                                    </div>
                                )}

                                {showKecamatanTable && (
                                    <div className="mt-4 border rounded-lg overflow-hidden">
                                        <div className="p-4 bg-gray-50 border-b">
                                            <h3 className="text-lg font-medium text-black-800 mb-4">Pilih Kecamatan</h3>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="Cari kecamatan..."
                                                    className="w-full pl-10 pr-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    value={searchTerm}
                                                    onChange={handleSearchChange}
                                                />
                                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                                </svg>
                                            </div>
                                        </div>

                                        <div
                                            ref={kecamatanTableRef}
                                            className="max-h-96 overflow-y-auto"
                                        >
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50 sticky top-0 z-10">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-sm font-medium text-black-500 uppercase tracking-wider">Kecamatan</th>
                                                        <th className="px-6 py-3 text-left text-sm font-medium text-black-500 uppercase tracking-wider">Aksi</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {kecamatan.length > 0 ? (
                                                        kecamatan.map((item) => (
                                                            <tr key={item.id} className="hover:bg-gray-50">
                                                                <td className="px-6 py-4 whitespace-nowrap text-base text-black-800">{item.name}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-base text-black-800">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleSelectKecamatan(item)}
                                                                        className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-1 text-base"
                                                                    >
                                                                        <Plus className="w-5 h-5" />
                                                                        <span>Pilih</span>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan={2} className="px-6 py-4 text-center text-base text-black-500">
                                                                {kecamatanLoading ? 'Memuat data...' : (searchTerm ? 'Tidak ada data yang sesuai dengan pencarian' : 'Tidak ada data kecamatan')}
                                                            </td>
                                                        </tr>
                                                    )}
                                                    {kecamatanLoading && (
                                                        <tr>
                                                            <td colSpan={2} className="px-6 py-4 text-center">
                                                                <div className="flex justify-center">
                                                                    <div className="w-6 h-6 border-2 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                    {!kecamatanLoading && kecamatan.length > 0 && !kecamatanPagination.hasMore && (
                                                        <tr>
                                                            <td colSpan={2} className="px-6 py-4 text-center text-base text-black-500">
                                                                Semua data telah dimuat
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
                                                className="px-4 py-2 text-base bg-gray-200 text-black-800 rounded hover:bg-gray-300 transition-colors mr-2"
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
                                        'Ubah Posko'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

        </div>
    );
};

export default UbahPosko;