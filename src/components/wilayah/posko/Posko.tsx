import React, { useEffect, useState } from 'react';
import { AlertCircle, Trash, Edit, Plus } from 'lucide-react';
import { useRouter } from 'next/router';
import { deletePosko, getAllPosko } from '@/services';
import NavBtnGroup from '@/components/wilayah/NavBtnGroup';

import { PoskoData as PoskoDataApi } from '@/interfaces/data';

interface PoskoData extends PoskoDataApi {
    daops: string;
    kecamatan: string;
}

interface TableState {
    page: number;
    pageSize: number;
    totalCount: number;
    data: PoskoData[];
    loading: boolean;
    search: string;
}

const Posko: React.FC = () => {
    const router = useRouter();
    const { message } = router.query;

    const [tableState, setTableState] = useState<TableState>({
        page: 0,
        pageSize: 10,
        totalCount: 0,
        data: [],
        loading: true,
        search: ''
    });

    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [alertType, setAlertType] = useState<'success' | 'error'>('success');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllPosko();
                setTableState(prev => ({
                    ...prev,
                    data: data,
                    totalCount: data.length,
                    loading: false
                }));
            } catch (error) {
                console.error("Error fetching data:", error);
                setAlertType('error');
                setAlertMessage('Gagal memuat data posko');
                setShowAlert(true);
            }
        };

        if (message) {
            setAlertMessage(message as string);
            setAlertType('success');
            setShowAlert(true);
        }

        fetchData();
    }, [message]);

    const handlePageChange = (newPage: number) => {
        setTableState(prev => ({ ...prev, page: newPage }));
    };

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTableState(prev => ({
            ...prev,
            pageSize: Number(e.target.value),
            page: 0
        }));
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTableState(prev => ({ ...prev, search: e.target.value }));
    };

    const filteredData = tableState.data.filter(item =>
        item.name.toLowerCase().includes(tableState.search.toLowerCase()) ||
        item.daops.toLowerCase().includes(tableState.search.toLowerCase()) ||
        item.kecamatan.toLowerCase().includes(tableState.search.toLowerCase())
    );

    const paginatedData = filteredData.slice(
        tableState.page * tableState.pageSize,
        (tableState.page + 1) * tableState.pageSize
    );

    const handleDelete = async (row: PoskoData) => {
        try {
            // Ensure all required fields for deletePosko are present
            const { id, name, daops, kecamatan, daopsId, kecamatanId } = row as any;
            const result = await deletePosko({
                id,
                name,
                daopsId,
                kecamatanId,
                daops: '',
                kecamatan: ''
            });
            if (result.success) {
                const updatedData = tableState.data.filter(item => item.id !== row.id);
                setTableState(prev => ({
                    ...prev,
                    data: updatedData,
                    totalCount: updatedData.length
                }));
                setAlertType('success');
                setAlertMessage('Hapus data posko berhasil');
                setShowAlert(true);
            } else {
                setAlertType('error');
                setAlertMessage(result.message as string);
                setShowAlert(true);
            }
        } catch (error) {
            console.error("Error deleting data:", error);
            setAlertType('error');
            setAlertMessage('Gagal menghapus data posko');
            setShowAlert(true);
        }
    };

    const closeAlert = () => setShowAlert(false);

    const totalPages = Math.ceil(filteredData.length / tableState.pageSize) || 1;
    const fromRecord = paginatedData.length > 0 ? (tableState.page * tableState.pageSize) + 1 : 0;
    const toRecord = Math.min((tableState.page + 1) * tableState.pageSize, filteredData.length);

    return (
        <div className="bg-gray-50 min-h-full">
            {/* Alert */}
            {showAlert && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-md flex justify-between items-center shadow-lg ${alertType === 'success'
                    ? 'bg-green-50 text-green-800 border-l-4 border-green-500'
                    : 'bg-red-50 text-red-800 border-l-4 border-red-500'
                    }`}>
                    <p className="text-base">{alertMessage}</p>
                    <button
                        onClick={closeAlert}
                        className="ml-4 text-black-500 hover:text-black-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            )}

            {/* Header Banner */}
            <div className="header-primary text-white p-8 rounded-xl mb-8 shadow-md">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl font-bold mb-2">Data Posko</h1>
                    <p className="text-xl opacity-90">
                        Kelola data posko pengendalian kebakaran hutan dan lahan
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-4">
                {/* Informasi yang dipindahkan ke atas */}
                <div className="bg-white rounded-xl shadow p-6 mb-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-semibold text-black-800 text-xl mb-3">Informasi Penggunaan</h3>
                            <p className="text-base text-black-700 leading-relaxed">
                                Halaman ini menampilkan seluruh data posko yang terdaftar dalam sistem. Anda dapat mencari posko spesifik menggunakan kolom pencarian.
                                Data posko mencakup nama posko, daops yang bertanggung jawab, dan kecamatan tempat posko berada.
                            </p>
                            <p className="text-base text-black-700 mt-2 leading-relaxed">
                                Fungsi posko penting dalam pengendalian kebakaran:
                            </p>
                            <ul className="mt-2 text-base text-black-700 space-y-1 list-disc list-inside">
                                <li>Posko adalah pusat komando dan koordinasi untuk pengendalian kebakaran</li>
                                <li>Pilih kecamatan sesuai dengan area operasional posko</li>
                                <li>Tentukan daops yang bertanggung jawab terhadap posko</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="mb-6">
                    <NavBtnGroup page="posko" />
                </div>

                {/* Search and Table */}
                <div className="bg-white rounded-xl shadow p-6 mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                        <div className="relative w-full sm:w-64">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                            <input
                                type="text"
                                placeholder="Pencarian"
                                value={tableState.search}
                                onChange={handleSearch}
                                className="pl-10 pr-4 py-3 text-base w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                                <span className="text-base text-black-600 mr-2">Tampilkan:</span>
                                <select
                                    value={tableState.pageSize}
                                    onChange={handlePageSizeChange}
                                    className="border border-gray-300 rounded-md py-2 px-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                                <span className="text-base text-black-600 ml-2">Baris</span>
                            </div>

                            <button
                                onClick={() => router.push('/wilayah/posko/tambah')}
                                className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-base"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Tambah Posko</span>
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {tableState.loading ? (
                            <div className="flex justify-center items-center p-8">
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mb-4"></div>
                                    <p className="text-base text-black-600">Memuat data posko...</p>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-sm font-medium text-black-500 uppercase tracking-wider">Posko</th>
                                            <th className="px-6 py-3 text-left text-sm font-medium text-black-500 uppercase tracking-wider">Daops</th>
                                            <th className="px-6 py-3 text-left text-sm font-medium text-black-500 uppercase tracking-wider">Kecamatan</th>
                                            <th className="px-6 py-3 text-left text-sm font-medium text-black-500 uppercase tracking-wider">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {paginatedData.length > 0 ? (
                                            paginatedData.map((posko) => (
                                                <tr key={posko.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-base text-black-800">{posko.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base text-black-800">{posko.daops}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base text-black-800">{posko.kecamatan}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base text-black-800">
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => router.push(`/wilayah/posko/ubah/${posko.id}`)}
                                                                className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                                                                title="Edit"
                                                            >
                                                                <Edit className="w-6 h-6" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(posko)}
                                                                className="p-1 text-red-600 hover:text-red-800 transition-colors"
                                                                title="Hapus"
                                                            >
                                                                <Trash className="w-6 h-6" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-4 text-center text-base text-black-500">
                                                    {tableState.search ? 'Tidak ada data yang sesuai dengan pencarian' : 'Tidak ada data posko'}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                                <div className="px-4 py-3 bg-white border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center mt-4">
                                    <div className="text-base text-black-700 mb-2 sm:mb-0">
                                        Menampilkan {fromRecord}-{toRecord} dari {filteredData.length} hasil
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handlePageChange(tableState.page - 1)}
                                            disabled={tableState.page === 0}
                                            className="p-2 rounded-md border border-gray-300 bg-white text-black-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                        >
                                            &laquo;
                                        </button>
                                        <input
                                            type="text"
                                            value={tableState.page + 1}
                                            readOnly
                                            className="w-12 border-t border-b border-gray-300 text-center py-2 text-base text-black-700"
                                        />
                                        <button
                                            onClick={() => handlePageChange(tableState.page + 1)}
                                            disabled={tableState.page >= totalPages - 1}
                                            className="p-2 rounded-md border border-gray-300 bg-white text-black-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                        >
                                            &raquo;
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Posko;