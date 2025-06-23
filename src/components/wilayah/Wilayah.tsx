import React, { useEffect, useState } from 'react';
import { Info, X } from 'lucide-react';
import { getWilayahList, getAllWilayah, addWilayah, updateWilayah, deleteWilayah, REGION_TYPES } from '@/services';
import { URLapiV2 } from '@/api';
import NavBtnGroup from '@/components/wilayah/NavBtnGroup';
import useAuth from '@/context/auth';
import Swal from 'sweetalert2';

interface RegionData {
    id: string;
    code: string;
    name: string;
    type: string;
}

interface DisplayRegionData {
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
    data: DisplayRegionData[];
    loading: boolean;
    search: string;
}

const Wilayah: React.FC = () => {
    const { isAuthenticated, user } = useAuth();
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
    const [deletePermission, setDeletePermission] = useState<boolean>(false);
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editingRegion, setEditingRegion] = useState<RegionData | null>(null);
    const [newRegion, setNewRegion] = useState<RegionData>({
        id: '',
        code: '',
        name: '',
        type: ''
    });

    const deleteRoles = [0]; // Only role 0 has delete permission

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

            // Set delete permission based on user role
            if (user && deleteRoles.includes(user.roleLevel)) {
                setDeletePermission(true);
            }
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

    // Add Region handler
    const handleAddRegion = async () => {
        try {
            const success = await addWilayah({
                nama: newRegion.name,
                kode: newRegion.code,
                tipe: newRegion.type
            });

            if (success) {
                setAlertType('success');
                setAlertMessage('Data wilayah berhasil ditambahkan');
                setShowAlert(true);
                setIsAdding(false);
                fetchData();
                // Reset form
                setNewRegion({
                    id: '',
                    code: '',
                    name: '',
                    type: ''
                });
            } else {
                throw new Error('Failed to add region');
            }
        } catch (error) {
            console.error("Error adding region:", error);
            setAlertType('error');
            setAlertMessage('Gagal menambahkan data wilayah');
            setShowAlert(true);
        }
    };

    // Edit Region handler
    const handleUpdateRegion = async () => {
        if (!editingRegion) return;

        try {
            const success = await updateWilayah({
                id: editingRegion.id,
                nama: editingRegion.name
            });

            if (success) {
                setAlertType('success');
                setAlertMessage('Data wilayah berhasil diperbarui');
                setShowAlert(true);
                setIsEditing(false);
                setEditingRegion(null);
                fetchData();
            } else {
                throw new Error('Failed to update region');
            }
        } catch (error) {
            console.error("Error updating region:", error);
            setAlertType('error');
            setAlertMessage('Gagal memperbarui data wilayah');
            setShowAlert(true);
        }
    };

    // Delete Region handler
    const handleDeleteRegion = async (region: DisplayRegionData) => {
        const result = await Swal.fire({
            icon: 'warning',
            title: 'Konfirmasi Hapus',
            text: 'Apakah Anda yakin ingin menghapus data wilayah ini?',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal',
            customClass: {
                popup: 'swal-large-text',
                title: 'text-xl',
                htmlContainer: 'text-lg'
            }
        });

        if (result.isConfirmed) {
            try {
                const success = await deleteWilayah(region.id);

                if (success) {
                    setAlertType('success');
                    setAlertMessage('Data wilayah berhasil dihapus');
                    setShowAlert(true);
                    fetchData();
                } else {
                    throw new Error('Failed to delete region');
                }
            } catch (error) {
                console.error("Error deleting region:", error);
                setAlertType('error');
                setAlertMessage('Gagal menghapus data wilayah');
                setShowAlert(true);
            }
        }
    };

    const handleNewRegionChange = (prop: keyof RegionData) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setNewRegion({ ...newRegion, [prop]: e.target.value });
    };

    const handleEditRegionChange = (prop: keyof RegionData) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (!editingRegion) return;
        setEditingRegion({ ...editingRegion, [prop]: e.target.value });
    };

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
                    <h1 className="text-4xl font-bold mb-2">Data Wilayah</h1>
                    <p className="text-xl opacity-90">
                        Kelola data wilayah berdasarkan kode wilayah, nama, dan tipe
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-4">
                {/* Informasi yang dipindahkan ke atas */}
                <div className="bg-white rounded-xl shadow p-6 mb-6">
                    <div className="flex items-start gap-3">
                        <Info className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-semibold text-black-800 text-xl mb-3">Informasi Penggunaan</h3>
                            <p className="text-base text-black-700 leading-relaxed">
                                Halaman ini menampilkan seluruh data wilayah yang terdaftar dalam sistem. Anda dapat mencari wilayah spesifik menggunakan kolom pencarian.
                                Data wilayah mencakup kode wilayah, nama, dan tipe wilayah.
                            </p>
                            <p className="text-base text-black-700 mt-2 leading-relaxed">
                                Penggunaan informasi wilayah sangat penting untuk:
                            </p>
                            <ul className="mt-2 text-base text-black-700 space-y-1 list-disc list-inside">
                                <li>Definisi wilayah kerja untuk penanggulangan kebakaran hutan dan lahan</li>
                                <li>Pemetaan area rawan kebakaran berdasarkan wilayah administratif</li>
                                <li>Informasi lengkap wilayah kerja berdasarkan tingkat administratif</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="mb-6">
                    <NavBtnGroup page="wilayah" />
                </div>

                {/* Search and Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                    <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-b">
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

                            {/* Tambah Wilayah Button */}
                            {deletePermission && (
                                <button
                                    onClick={() => setIsAdding(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 text-base rounded-lg flex items-center transition-colors"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                    </svg>
                                    Tambah Wilayah
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {tableState.loading ? (
                            <div className="flex justify-center items-center p-8">
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mb-4"></div>
                                    <p className="text-base text-black-600">Memuat data wilayah...</p>
                                </div>
                            </div>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-black-500 uppercase tracking-wider">Kode Wilayah</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-black-500 uppercase tracking-wider">Desa/Kelurahan</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-black-500 uppercase tracking-wider">Kecamatan</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-black-500 uppercase tracking-wider">Kabupaten</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-black-500 uppercase tracking-wider">Provinsi</th>
                                        {deletePermission && (
                                            <th className="px-6 py-3 text-left text-sm font-medium text-black-500 uppercase tracking-wider">Aksi</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {hasData ? (
                                        tableState.data.map((region, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-base text-black-800">{region.kode || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-base text-black-800">{region.desa || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-base text-black-800">{region.kecamatan || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-base text-black-800">{region.kabupaten || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-base text-black-800">{region.provinsi || '-'}</td>
                                                {deletePermission && (
                                                    <td className="px-6 py-4 whitespace-nowrap text-base text-black-800">
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => {
                                                                    // Convert the display data to editing format
                                                                    setEditingRegion({
                                                                        id: region.id,
                                                                        code: region.kode,
                                                                        name: region.desa, // Using desa as name for compatibility
                                                                        type: 'Desa' // Default type
                                                                    });
                                                                    setIsEditing(true);
                                                                }}
                                                                className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                                                                title="Edit"
                                                            >
                                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                                                </svg>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteRegion(region)}
                                                                className="p-1 text-red-600 hover:text-red-800 transition-colors"
                                                                title="Hapus"
                                                            >
                                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={deletePermission ? 6 : 5} className="px-6 py-4 text-center text-base text-black-500">
                                                {tableState.search ? 'Tidak ada data yang sesuai dengan pencarian' : 'Tidak ada data wilayah'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>

                    <div className="px-4 py-3 bg-white border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
                        <div className="text-base text-black-700 mb-2 sm:mb-0">
                            Menampilkan {fromRecord}-{toRecord} dari {tableState.totalCount} hasil
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
            </div>

            {/* Add Region Modal */}
            {isAdding && (
                <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg w-full max-w-md mx-4 md:mx-auto shadow-xl">
                        <div className="flex justify-between items-center px-6 py-4 border-b">
                            <h4 className="text-xl font-semibold text-black-800">Tambah Data Wilayah</h4>
                            <button
                                className="text-black-500 hover:text-black-700"
                                onClick={() => setIsAdding(false)}
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="px-6 py-4">
                            <div className="mb-4">
                                <label className="block text-black-700 text-base font-bold mb-2 text-left" htmlFor="name">
                                    Nama
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-base text-black-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newRegion.name}
                                    onChange={handleNewRegionChange('name')}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-black-700 text-base font-bold mb-2 text-left" htmlFor="code">
                                    Kode Wilayah
                                </label>
                                <input
                                    id="code"
                                    type="text"
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-base text-black-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newRegion.code}
                                    onChange={handleNewRegionChange('code')}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-black-700 text-base font-bold mb-2 text-left" htmlFor="type">
                                    Tipe
                                </label>
                                <select
                                    id="type"
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-base text-black-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newRegion.type}
                                    onChange={(e) => setNewRegion({ ...newRegion, type: e.target.value })}
                                    required
                                >
                                    <option value="" disabled>Pilih Tipe Wilayah</option>
                                    {REGION_TYPES.map((type, index) => (
                                        <option key={index} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t text-center flex justify-center space-x-4">
                            <button
                                className="bg-gray-300 hover:bg-gray-400 text-black-800 font-bold py-3 px-6 text-base rounded transition-colors"
                                onClick={() => setIsAdding(false)}
                            >
                                Batal
                            </button>
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 text-base rounded transition-colors"
                                onClick={handleAddRegion}
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Region Modal */}
            {isEditing && editingRegion && (
                <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg w-full max-w-md mx-4 md:mx-auto shadow-xl">
                        <div className="flex justify-between items-center px-6 py-4 border-b">
                            <h4 className="text-xl font-semibold text-black-800">Edit Data Wilayah</h4>
                            <button
                                className="text-black-500 hover:text-black-700"
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditingRegion(null);
                                }}
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="px-6 py-4">
                            <div className="mb-4">
                                <label className="block text-black-700 text-base font-bold mb-2 text-left" htmlFor="edit-name">
                                    Nama
                                </label>
                                <input
                                    id="edit-name"
                                    type="text"
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-base text-black-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={editingRegion.name}
                                    onChange={handleEditRegionChange('name')}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-black-700 text-base font-bold mb-2 text-left" htmlFor="edit-code">
                                    Kode Wilayah
                                </label>
                                <input
                                    id="edit-code"
                                    type="text"
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-base text-black-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                                    value={editingRegion.code}
                                    readOnly
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-black-700 text-base font-bold mb-2 text-left" htmlFor="edit-type">
                                    Tipe
                                </label>
                                <select
                                    id="edit-type"
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-base text-black-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                                    value={editingRegion.type}
                                    disabled
                                >
                                    <option value="" disabled>Pilih Tipe Wilayah</option>
                                    {REGION_TYPES.map((type, index) => (
                                        <option key={index} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t text-center flex justify-center space-x-4">
                            <button
                                className="bg-gray-300 hover:bg-gray-400 text-black-800 font-bold py-3 px-6 text-base rounded transition-colors"
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditingRegion(null);
                                }}
                            >
                                Batal
                            </button>
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 text-base rounded transition-colors"
                                onClick={handleUpdateRegion}
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Wilayah;