import React, { useState, useEffect } from 'react';
import { Plus, Eye, AlertCircle, Trash, X } from 'lucide-react';
import { useRouter } from 'next/router';
import { getUserGroundcheck, deleteUserGroundcheck } from '@/services';
import { UserGroundcheckData } from '@/interfaces/data';

interface GroundCheckProps {
    user?: any;
}

interface TableState {
    page: number;
    pageSize: number;
    totalCount: number;
    data: UserGroundcheckData[];
    loading: boolean;
    search: string;
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

const GroundCheck: React.FC<GroundCheckProps> = ({ user }) => {
    const router = useRouter();

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
    const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean, id: string | null }>({
        show: false,
        id: null
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getUserGroundcheck();
                setTableState(prev => ({
                    ...prev,
                    data: data,
                    totalCount: data.length,
                    loading: false
                }));
            } catch (error) {
                console.error("Error fetching data:", error);
                setAlertType('error');
                setAlertMessage('Gagal memuat data pengguna ground check');
                setShowAlert(true);
            }
        };

        fetchData();
    }, []);

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
        item.nama?.toLowerCase().includes(tableState.search.toLowerCase()) ||
        item.email?.toLowerCase().includes(tableState.search.toLowerCase()) ||
        item.daops?.toLowerCase().includes(tableState.search.toLowerCase())
    );

    const paginatedData = filteredData.slice(
        tableState.page * tableState.pageSize,
        (tableState.page + 1) * tableState.pageSize
    );

    const handleDelete = async (id: string) => {
        const rowToDelete = tableState.data.find(item => item.id === id);
        if (!rowToDelete) return;

        try {
            const result = await deleteUserGroundcheck(rowToDelete);
            if (result.success) {
                const updatedData = tableState.data.filter(item => item.id !== id);
                setTableState(prev => ({
                    ...prev,
                    data: updatedData,
                    totalCount: updatedData.length
                }));
                setAlertType('success');
                setAlertMessage('Hapus data user ground check berhasil');
                setShowAlert(true);
            } else {
                setAlertType('error');
                setAlertMessage(result.message as string);
                setShowAlert(true);
            }
        } catch (error) {
            console.error("Error deleting data:", error);
            setAlertType('error');
            setAlertMessage('Gagal menghapus data pengguna');
            setShowAlert(true);
        } finally {
            setDeleteConfirm({ show: false, id: null });
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
                    <p>{alertMessage}</p>
                    <button
                        onClick={closeAlert}
                        className="ml-4 text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm.show && (
                <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 max-w-md mx-4 md:mx-auto">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Konfirmasi Hapus</h3>
                        <p className="text-gray-600 mb-6">Apakah Anda yakin ingin menghapus user tersebut?</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setDeleteConfirm({ show: false, id: null })}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => deleteConfirm.id && handleDelete(deleteConfirm.id)}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header Banner */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-8 rounded-xl mb-8 shadow-md">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-3xl font-bold mb-2">Pengguna Ground Check</h1>
                    <p className="text-lg opacity-90">
                        Kelola pengguna modul ground check titik panas
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4">
                {/* Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    <InfoCard
                        icon={<AlertCircle className="w-5 h-5" />}
                        title="Ground Check"
                        description="Pengecekan lapangan terhadap titik panas yang terdeteksi satelit"
                        color="blue"
                    />
                    <InfoCard
                        icon={<AlertCircle className="w-5 h-5" />}
                        title="Pengguna"
                        description="Daftar petugas yang berwenang melakukan ground check titik panas"
                        color="indigo"
                    />
                    <InfoCard
                        icon={<AlertCircle className="w-5 h-5" />}
                        title="Manajemen Akses"
                        description="Atur akses petugas untuk modul pengecekan titik panas"
                        color="purple"
                    />
                </div>

                {/* Search and Table */}
                <div className="bg-white rounded-xl shadow p-6 mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
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

                        <div className="flex items-center space-x-4">
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

                            <button
                                onClick={() => router.push('/groundcheck/tambah')}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Tambah Pengguna</span>
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {tableState.loading ? (
                            <div className="flex justify-center items-center p-8">
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mb-4"></div>
                                    <p className="text-gray-600">Memuat data pengguna...</p>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Daerah Operasi</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {paginatedData.length > 0 ? (
                                            paginatedData.map((user) => (
                                                <tr key={user.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{user.nama}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{user.email}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{user.tanggal}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{user.daops}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => router.push(`/groundcheck/ubah/${user.id}`)}
                                                                className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                                                                title="Detail"
                                                            >
                                                                <Eye className="w-5 h-5" />
                                                            </button>
                                                            <button
                                                                onClick={() => setDeleteConfirm({ show: true, id: user.id })}
                                                                className="p-1 text-red-600 hover:text-red-800 transition-colors"
                                                                title="Hapus"
                                                            >
                                                                <Trash className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                                    {tableState.search ? 'Tidak ada data yang sesuai dengan pencarian' : 'Tidak ada data pengguna'}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                                <div className="px-4 py-3 bg-white border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center mt-4">
                                    <div className="text-sm text-gray-700 mb-2 sm:mb-0">
                                        Menampilkan {fromRecord}-{toRecord} dari {filteredData.length} hasil
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
                        )}
                    </div>
                </div>

                {/* Info Box */}
                <div className="bg-white rounded-xl p-6 shadow mb-8">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-2">Informasi Penggunaan</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Halaman ini menampilkan daftar pengguna yang memiliki akses ke modul ground check titik panas.
                                Anda dapat menambahkan pengguna baru, melihat detail pengguna, atau menghapus akses pengguna yang sudah tidak aktif.
                                Pengguna yang terdaftar akan memiliki akses untuk melaporkan hasil pengecekan lapangan terhadap titik panas yang terdeteksi satelit.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroundCheck;