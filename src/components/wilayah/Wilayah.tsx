import React, { useEffect, useState } from 'react';
import { MapPin, Map, Globe, Info } from 'lucide-react';
import { getWilayahList } from '@/services';
import { URLapiV2 } from '@/api';
import NavBtnGroup from '@/components/wilayah/NavBtnGroup';
import useAuth from '@/context/auth';

interface RegionData {
    id: string;
    kode: string;
    desa: string;
    kecamatan: string;
    kabupaten: string;
    provinsi: string;
}

interface TableState {
    page: number;
    pageSize: number;
    totalCount: number;
    data: RegionData[];
    loading: boolean;
    search: string;
}

const InfoCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
}> = ({ icon, title, description }) => {
    return (
        <div className="bg-white rounded-lg p-6 shadow">
            <div className="flex items-start gap-4">
                <div className="text-blue-600">
                    {icon}
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
                    <p className="text-gray-600">{description}</p>
                </div>
            </div>
        </div>
    );
};

const Wilayah: React.FC = () => {
    const { isAuthenticated } = useAuth();
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

    const fetchData = async () => {
        try {
            await getWilayahList(tableState, setTableState, URLapiV2);
        } catch (error) {
            console.error("Error fetching data:", error);
            setAlertType('error');
            setAlertMessage('Gagal memuat data wilayah');
            setShowAlert(true);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchData();
        }
    }, [isAuthenticated, tableState.page, tableState.pageSize]);

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
        const searchValue = e.target.value;
        setTableState(prev => ({ ...prev, search: searchValue }));

        // Debounce search
        const timeoutId = setTimeout(() => {
            fetchData();
        }, 500);

        return () => clearTimeout(timeoutId);
    };

    const closeAlert = () => setShowAlert(false);

    const hasData = Array.isArray(tableState.data) && tableState.data.length > 0;
    const totalPages = Math.ceil(tableState.totalCount / tableState.pageSize) || 1;
    const fromRecord = hasData ? (tableState.page * tableState.pageSize) + 1 : 0;
    const toRecord = hasData ? Math.min((tableState.page + 1) * tableState.pageSize, tableState.totalCount) : 0;

    return (
        <div className="bg-gray-50 min-h-full">
            {/* Alert */}
            {showAlert && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-md flex justify-between items-center shadow-lg ${alertType === 'success'
                    ? 'bg-green-50 text-green-800 border-l-4 border-green-500'
                    : 'bg-red-50 text-red-800 border-l-4 border-red-500'
                    }`}>
                    <p>{alertMessage}</p>
                    <button
                        onClick={closeAlert}
                        className="ml-4 text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            )}

            {/* Header Banner */}
            <div className="bg-blue-600 text-white p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-center mb-2">Data Wilayah</h1>
                    <p className="text-center text-blue-100">
                        Kelola data wilayah berdasarkan kode wilayah, desa, kecamatan, kabupaten, dan provinsi
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-4">
                {/* Navigation Tabs */}
                <div className="mb-6">
                    <NavBtnGroup page="wilayah" />
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <InfoCard
                        icon={<MapPin className="w-6 h-6" />}
                        title="Data Wilayah Terpadu"
                        description="Informasi lengkap wilayah kerja berdasarkan tingkat administratif"
                    />
                    <InfoCard
                        icon={<Map className="w-6 h-6" />}
                        title="Cakupan Area"
                        description="Definisi wilayah kerja untuk penanggulangan kebakaran hutan dan lahan"
                    />
                    <InfoCard
                        icon={<Globe className="w-6 h-6" />}
                        title="Pemetaan Wilayah"
                        description="Distribusi area rawan kebakaran berdasarkan wilayah administratif"
                    />
                </div>

                {/* Search and Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                    <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-b">
                        <div className="relative w-full sm:w-64">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                            <input
                                type="text"
                                placeholder="Pencarian"
                                value={tableState.search}
                                onChange={handleSearch}
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="flex items-center">
                            <span className="text-gray-600 mr-2">Tampilkan:</span>
                            <select
                                value={tableState.pageSize}
                                onChange={handlePageSizeChange}
                                className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                            <span className="text-gray-600 ml-2">Baris</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {tableState.loading ? (
                            <div className="flex justify-center items-center p-8">
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mb-4"></div>
                                    <p className="text-gray-600">Memuat data wilayah...</p>
                                </div>
                            </div>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode Wilayah</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Desa/Kelurahan</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kecamatan</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kabupaten</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provinsi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {hasData ? (
                                        tableState.data.map((region, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{region.kode || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{region.desa || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{region.kecamatan || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{region.kabupaten || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{region.provinsi || '-'}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                                {tableState.search ? 'Tidak ada data yang sesuai dengan pencarian' : 'Tidak ada data wilayah'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>

                    <div className="px-4 py-3 bg-white border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
                        <div className="text-sm text-gray-700 mb-2 sm:mb-0">
                            Menampilkan {fromRecord}-{toRecord} dari {tableState.totalCount} hasil
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => handlePageChange(tableState.page - 1)}
                                disabled={tableState.page === 0}
                                className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                &laquo;
                            </button>
                            <input
                                type="text"
                                value={tableState.page + 1}
                                readOnly
                                className="w-12 border-t border-b border-gray-300 text-center py-2 text-sm text-gray-700"
                            />
                            <button
                                onClick={() => handlePageChange(tableState.page + 1)}
                                disabled={tableState.page >= totalPages - 1}
                                className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                &raquo;
                            </button>
                        </div>
                    </div>
                </div>

                {/* Info Box */}
                <div className="bg-white rounded-lg p-6 shadow mb-8">
                    <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-2">Informasi Penggunaan</h3>
                            <p className="text-gray-600">
                                Halaman ini menampilkan seluruh data wilayah yang terdaftar dalam sistem. Anda dapat mencari wilayah spesifik menggunakan kolom pencarian.
                                Data wilayah mencakup kode wilayah, desa/kelurahan, kecamatan, kabupaten, dan provinsi. Gunakan fitur paginasi di bawah tabel untuk melihat
                                lebih banyak data wilayah.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Wilayah;