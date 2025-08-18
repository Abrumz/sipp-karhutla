import React, { useEffect, useState } from 'react';
import { MapPin, Users, Activity, AlertCircle, X } from 'lucide-react';
import {
    addBalai,
    deleteBalai,
    getAllBalai,
    getAllPulau,
    updateBalai
} from '@/services';
import useAuth from '@/context/auth';
import NavBtnGroup from '@/components/wilayah/NavBtnGroup';
import Swal from 'sweetalert2';

interface BalaiData {
    id: string;
    name: string;
    code: string;
    region: string;
    tableData?: {
        id: number;
    };
}

interface RegionData {
    id: string;
    name: string;
    type: string;
    code?: string;
}

type RegionType = {
    [name: string]: string;
};

const generateWilayahLookup = async (): Promise<RegionType> => {
    const data: RegionType = {};
    const wilayah = await getAllPulau();
    wilayah.forEach((item: RegionData) => {
        data[item.id] = `${item.type} ${item.name}`;
    });
    return data;
};

const Balai: React.FC = () => {
    const { isAuthenticated, user } = useAuth();
    const [wilayahLookup, setWilayahLookup] = useState<RegionType>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [deletePermission, setDeletePermission] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(5);
    const [editingBalai, setEditingBalai] = useState<BalaiData | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [newBalai, setNewBalai] = useState<BalaiData>({
        id: '',
        name: '',
        code: '',
        region: ''
    });

    const deleteRoles = [0, 1, 2];

    const [values, setValues] = useState<{
        balai: BalaiData[];
    }>({
        balai: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const wilayahData = await generateWilayahLookup();
                setWilayahLookup(wilayahData);

                if (deleteRoles.includes(user?.roleLevel)) {
                    setDeletePermission(true);
                }

                const data = await getAllBalai();
                setValues({ balai: data });
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated && user) {
            fetchData();
        }
    }, [isAuthenticated, user?.roleLevel]);

    const handleAddBalai = async () => {
        if (!newBalai.name || !newBalai.code || !newBalai.region) {
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

        try {
            const result = await addBalai(newBalai);
            if (result.success) {
                const data = await getAllBalai();
                setValues({ balai: data });
                setIsAdding(false);
                setNewBalai({
                    id: '',
                    name: '',
                    code: '',
                    region: ''
                });
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Data balai berhasil ditambahkan',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    customClass: {
                        popup: 'swal-large-text',
                        title: 'text-xl',
                        htmlContainer: 'text-lg'
                    }
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
            console.error("Error adding Balai:", error);
            Swal.fire({
                icon: 'error',
                title: 'Terjadi Kesalahan',
                text: 'Gagal menambah data balai',
                confirmButtonColor: '#3085d6',
                customClass: {
                    popup: 'swal-large-text',
                    title: 'text-xl',
                    htmlContainer: 'text-lg'
                }
            });
        }
    };

    const handleUpdateBalai = async () => {
        if (!editingBalai) return;

        if (!editingBalai.name || !editingBalai.code || !editingBalai.region) {
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

        try {
            const oldData = values.balai.find(b => b.id === editingBalai.id);
            if (!oldData) return;

            const result = await updateBalai(editingBalai, oldData);
            if (result.success) {
                const dataUpdate = [...values.balai];
                const index = dataUpdate.findIndex(b => b.id === editingBalai.id);
                dataUpdate[index] = editingBalai;

                setValues({ balai: dataUpdate });
                setIsEditing(false);
                setEditingBalai(null);
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Data balai berhasil diubah',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    customClass: {
                        popup: 'swal-large-text',
                        title: 'text-xl',
                        htmlContainer: 'text-lg'
                    }
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
            console.error("Error updating Balai:", error);
            Swal.fire({
                icon: 'error',
                title: 'Terjadi Kesalahan',
                text: 'Gagal mengubah data balai',
                confirmButtonColor: '#3085d6',
                customClass: {
                    popup: 'swal-large-text',
                    title: 'text-xl',
                    htmlContainer: 'text-lg'
                }
            });
        }
    };

    const handleDeleteBalai = async (balaiData: BalaiData) => {
        const result = await Swal.fire({
            icon: 'warning',
            title: 'Konfirmasi Hapus',
            text: 'Apakah Anda yakin ingin menghapus data balai ini?',
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
                const deleteResult = await deleteBalai(balaiData);
                if (deleteResult.success) {
                    const dataDelete = [...values.balai];
                    const index = dataDelete.findIndex(b => b.id === balaiData.id);
                    dataDelete.splice(index, 1);

                    setValues({ balai: dataDelete });
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil!',
                        text: 'Data balai berhasil dihapus',
                        timer: 2000,
                        timerProgressBar: true,
                        showConfirmButton: false,
                        customClass: {
                            popup: 'swal-large-text',
                            title: 'text-xl',
                            htmlContainer: 'text-lg'
                        }
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal',
                        text: deleteResult.message as string,
                        confirmButtonColor: '#3085d6',
                        customClass: {
                            popup: 'swal-large-text',
                            title: 'text-xl',
                            htmlContainer: 'text-lg'
                        }
                    });
                }
            } catch (error) {
                console.error("Error deleting Balai:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Terjadi Kesalahan',
                    text: 'Gagal menghapus data balai',
                    confirmButtonColor: '#3085d6',
                    customClass: {
                        popup: 'swal-large-text',
                        title: 'text-xl',
                        htmlContainer: 'text-lg'
                    }
                });
            }
        }
    };

    const filteredData = values.balai.filter(balai => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (balai.name && balai.name.toLowerCase().includes(searchLower)) ||
            (balai.code && balai.code.toLowerCase().includes(searchLower)) ||
            (wilayahLookup[balai.region] && wilayahLookup[balai.region].toLowerCase().includes(searchLower))
        );
    });

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const handleNewBalaiChange = (prop: keyof BalaiData) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setNewBalai({ ...newBalai, [prop]: e.target.value });
    };

    const handleEditBalaiChange = (prop: keyof BalaiData) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        if (!editingBalai) return;
        setEditingBalai({ ...editingBalai, [prop]: e.target.value });
    };

    return (
        <div className="bg-gray-50 min-h-full p-6">
            <div className="header-primary text-white p-8 rounded-xl mb-8 shadow-md">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl font-bold mb-2">Data Balai</h1>
                    <p className="text-xl opacity-90">
                        Kelola data balai pengendalian kebakaran hutan
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-4">
                <div className="bg-white rounded-xl shadow p-6 mb-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-semibold text-black-800 text-xl mb-3">Informasi Penggunaan</h3>
                            <p className="text-base text-black-700 leading-relaxed">
                                Halaman ini menampilkan seluruh data balai yang terdaftar dalam sistem.
                                Anda dapat mencari balai spesifik menggunakan kolom pencarian.
                                Untuk mengedit data balai, klik ikon <span className="inline-flex items-center"><svg className="h-4 w-4 mx-1 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg> Ubah</span>,
                                dan untuk menghapus data, klik ikon <span className="inline-flex items-center"><svg className="h-4 w-4 mx-1 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg> Hapus</span>.
                            </p>
                            <p className="text-base text-black-700 mt-2 leading-relaxed">
                                Petunjuk penggunaan:
                            </p>
                            <ul className="mt-2 text-base text-black-700 space-y-1 list-disc list-inside">
                                <li>Gunakan kolom pencarian untuk mencari balai tertentu</li>
                                <li>Klik tombol "Tambah Balai" untuk menambahkan data baru</li>
                                <li>Gunakan ikon edit untuk mengubah data dan ikon hapus untuk menghapus data</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <NavBtnGroup page="balai" />
                </div>

                {loading ? (
                    <div className="bg-white p-8 rounded-xl shadow flex justify-center items-center">
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mb-4"></div>
                            <p className="text-base text-black-600">Memuat data balai...</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <div className="p-4 border-b">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <h3 className="text-xl font-semibold text-black-800">Daftar Balai</h3>
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                        </svg>
                                        <input
                                            type="text"
                                            placeholder="Cari balai..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 pr-4 py-3 text-base w-full md:w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <button
                                        onClick={() => setIsAdding(true)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 text-base rounded-lg flex items-center transition-colors"
                                        disabled={!deletePermission}
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                        </svg>
                                        Tambah Balai
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-black-500 uppercase tracking-wider">Nama Balai</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-black-500 uppercase tracking-wider">Kode Balai</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium text-black-500 uppercase tracking-wider">Wilayah</th>
                                        <th className="px-6 py-3 text-right text-sm font-medium text-black-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {paginatedData.length > 0 ? (
                                        paginatedData.map((balai) => (
                                            <tr key={balai.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-base text-black-800">{balai.name || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-base text-black-800">{balai.code || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-base text-black-800">{wilayahLookup[balai.region] || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">
                                                    {deletePermission && (
                                                        <div className="flex justify-end items-center space-x-2">
                                                            <button
                                                                onClick={() => {
                                                                    setEditingBalai(balai);
                                                                    setIsEditing(true);
                                                                }}
                                                                className="p-2 text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50 rounded-md transition-colors"
                                                                title="Ubah Data Balai"
                                                            >
                                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                                                </svg>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteBalai(balai)}
                                                                className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors"
                                                                title="Hapus Data Balai"
                                                            >
                                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-4 text-center text-base text-black-500">
                                                {searchTerm ? 'Tidak ada data yang sesuai dengan pencarian' : 'Tidak ada data balai'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {filteredData.length > 0 && (
                            <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
                                <div className="text-base text-black-500 mb-2 sm:mb-0 flex items-center gap-2">
                                    <span>Menampilkan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} dari {filteredData.length} balai</span>
                                    <div className="flex items-center ml-4">
                                        <span className="text-black-600 mr-2">Tampilkan:</span>
                                        <select
                                            value={itemsPerPage}
                                            onChange={handleItemsPerPageChange}
                                            className="border border-gray-300 rounded-md py-2 px-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="5">5</option>
                                            <option value="10">10</option>
                                            <option value="15">15</option>
                                            <option value="20">20</option>
                                            <option value="25">25</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={handlePrevPage}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-md border border-gray-300 bg-white text-black-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                        </svg>
                                    </button>
                                    <div className="flex items-center">
                                        <span className="px-3 py-2 text-black-700 bg-gray-100 rounded-md text-base">
                                            {currentPage}
                                        </span>
                                        <span className="mx-2 text-black-600 text-base">dari</span>
                                        <span className="px-3 py-2 text-black-700 bg-gray-100 rounded-md text-base">
                                            {totalPages || 1}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages || totalPages === 0}
                                        className="p-2 rounded-md border border-gray-300 bg-white text-black-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {isAdding && (
                <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg w-full max-w-md mx-4 md:mx-auto shadow-xl">
                        <div className="flex justify-between items-center px-6 py-4 border-b">
                            <h4 className="text-xl font-semibold text-black-800">Tambah Balai</h4>
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
                                    Nama Balai
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-base text-black-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newBalai.name}
                                    onChange={handleNewBalaiChange('name')}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-black-700 text-base font-bold mb-2 text-left" htmlFor="code">
                                    Kode Balai
                                </label>
                                <input
                                    id="code"
                                    type="text"
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-base text-black-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newBalai.code}
                                    onChange={handleNewBalaiChange('code')}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-black-700 text-base font-bold mb-2 text-left" htmlFor="region">
                                    Wilayah
                                </label>
                                <select
                                    id="region"
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-base text-black-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newBalai.region}
                                    onChange={handleNewBalaiChange('region')}
                                    required
                                >
                                    <option value="">Pilih Wilayah</option>
                                    {Object.entries(wilayahLookup).map(([id, name]) => (
                                        <option key={id} value={id}>
                                            {name}
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
                                onClick={handleAddBalai}
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isEditing && editingBalai && (
                <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg w-full max-w-md mx-4 md:mx-auto shadow-xl">
                        <div className="flex justify-between items-center px-6 py-4 border-b">
                            <h4 className="text-xl font-semibold text-black-800">Edit Balai</h4>
                            <button
                                className="text-black-500 hover:text-black-700"
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditingBalai(null);
                                }}
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="px-6 py-4">
                            <div className="mb-4">
                                <label className="block text-black-700 text-base font-bold mb-2 text-left" htmlFor="edit-name">
                                    Nama Balai
                                </label>
                                <input
                                    id="edit-name"
                                    type="text"
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-base text-black-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={editingBalai.name}
                                    onChange={handleEditBalaiChange('name')}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-black-700 text-base font-bold mb-2 text-left" htmlFor="edit-code">
                                    Kode Balai
                                </label>
                                <input
                                    id="edit-code"
                                    type="text"
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-base text-black-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={editingBalai.code}
                                    onChange={handleEditBalaiChange('code')}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-black-700 text-base font-bold mb-2 text-left" htmlFor="edit-region">
                                    Wilayah
                                </label>
                                <select
                                    id="edit-region"
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-base text-black-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={editingBalai.region}
                                    onChange={handleEditBalaiChange('region')}
                                    required
                                >
                                    <option value="">Pilih Wilayah</option>
                                    {Object.entries(wilayahLookup).map(([id, name]) => (
                                        <option key={id} value={id}>
                                            {name}
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
                                    setEditingBalai(null);
                                }}
                            >
                                Batal
                            </button>
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 text-base rounded transition-colors"
                                onClick={handleUpdateBalai}
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

export default Balai;