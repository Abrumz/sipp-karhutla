import React, { useEffect, useState } from 'react';
import { MapPin, Users, Activity, AlertCircle, X, Edit, Trash, Plus } from 'lucide-react';
import {
    addDaops,
    deleteDaops,
    getAllBalai,
    getAllDaops,
    updateDaops
} from '@/services';
import useAuth from '@/context/auth';
import NavBtnGroup from '@/components/wilayah/NavBtnGroup';
import Swal from 'sweetalert2';

interface DaopsData {
    id: string;
    name: string;
    code: string;
    balaiId: string;
    tableData?: {
        id: number;
    };
}

interface BalaiData {
    id: string;
    name: string;
    code?: string;
}

type RegionType = {
    [name: string]: string;
};

const generateBalaiLookup = async (): Promise<RegionType> => {
    const data: RegionType = {};
    const wilayah = await getAllBalai();
    wilayah.forEach((item: BalaiData) => {
        data[item.id] = item.name;
    });
    return data;
};

const Daops: React.FC = () => {
    const { isAuthenticated, user } = useAuth();
    const [balaiLookup, setBalaiLookup] = useState<RegionType>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [deletePermission, setDeletePermission] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [editingDaops, setEditingDaops] = useState<DaopsData | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [newDaops, setNewDaops] = useState<DaopsData>({
        id: '',
        name: '',
        code: '',
        balaiId: ''
    });

    const deleteRoles = [0, 1, 2];

    const [values, setValues] = useState<{
        daops: DaopsData[];
    }>({
        daops: []
    });

    useEffect(() => {
        const fetchLookupData = async () => {
            const balaiData = await generateBalaiLookup();
            setBalaiLookup(balaiData);

            if (deleteRoles.includes(user.roleLevel)) {
                setDeletePermission(true);
            }
        };

        if (isAuthenticated) fetchLookupData();
    }, [isAuthenticated, user]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllDaops();
                setValues({ daops: data });
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) fetchData();
    }, [isAuthenticated]);

    const handleAddDaops = async () => {
        if (!newDaops.name || !newDaops.code || !newDaops.balaiId) {
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
            const result = await addDaops(newDaops);
            if (result.success) {
                const data = await getAllDaops();
                setValues({ daops: data });
                setIsAdding(false);
                setNewDaops({
                    id: '',
                    name: '',
                    code: '',
                    balaiId: ''
                });
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Data daerah operasi berhasil ditambahkan',
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
            console.error("Error adding Daops:", error);
            Swal.fire({
                icon: 'error',
                title: 'Terjadi Kesalahan',
                text: 'Gagal menambah data daerah operasi',
                confirmButtonColor: '#3085d6',
                customClass: {
                    popup: 'swal-large-text',
                    title: 'text-xl',
                    htmlContainer: 'text-lg'
                }
            });
        }
    };

    const handleUpdateDaops = async () => {
        if (!editingDaops) return;

        if (!editingDaops.name || !editingDaops.code || !editingDaops.balaiId) {
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
            const oldData = values.daops.find(d => d.id === editingDaops.id);
            if (!oldData) return;

            const result = await updateDaops(editingDaops, oldData);
            if (result.success) {
                const dataUpdate = [...values.daops];
                const index = dataUpdate.findIndex(d => d.id === editingDaops.id);
                dataUpdate[index] = editingDaops;

                setValues({ daops: dataUpdate });
                setIsEditing(false);
                setEditingDaops(null);
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Data daerah operasi berhasil diubah',
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
            console.error("Error updating Daops:", error);
            Swal.fire({
                icon: 'error',
                title: 'Terjadi Kesalahan',
                text: 'Gagal mengubah data daerah operasi',
                confirmButtonColor: '#3085d6',
                customClass: {
                    popup: 'swal-large-text',
                    title: 'text-xl',
                    htmlContainer: 'text-lg'
                }
            });
        }
    };

    const handleDeleteDaops = async (daopsData: DaopsData) => {
        const result = await Swal.fire({
            icon: 'warning',
            title: 'Konfirmasi Hapus',
            text: 'Apakah Anda yakin ingin menghapus data daerah operasi ini?',
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
                const deleteResult = await deleteDaops(daopsData);
                if (deleteResult.success) {
                    const dataDelete = [...values.daops];
                    const index = dataDelete.findIndex(d => d.id === daopsData.id);
                    dataDelete.splice(index, 1);

                    setValues({ daops: dataDelete });
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil!',
                        text: 'Data daerah operasi berhasil dihapus',
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
                console.error("Error deleting Daops:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Terjadi Kesalahan',
                    text: 'Gagal menghapus data daerah operasi',
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

    const filteredData = values.daops.filter(daops => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (daops.name && daops.name.toLowerCase().includes(searchLower)) ||
            (daops.code && daops.code.toLowerCase().includes(searchLower)) ||
            (balaiLookup[daops.balaiId] && balaiLookup[daops.balaiId].toLowerCase().includes(searchLower))
        );
    });

    const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
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

    const handleNewDaopsChange = (prop: keyof DaopsData) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setNewDaops({ ...newDaops, [prop]: e.target.value });
    };

    const handleEditDaopsChange = (prop: keyof DaopsData) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        if (!editingDaops) return;
        setEditingDaops({ ...editingDaops, [prop]: e.target.value });
    };

    const fromRecord = paginatedData.length > 0 ? startIndex + 1 : 0;
    const toRecord = Math.min(startIndex + itemsPerPage, filteredData.length);

    return (
        <div className="bg-gray-50 min-h-full p-6">
            <div className="header-primary text-white p-8 rounded-xl mb-8 shadow-md">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl font-bold mb-2">Data Daerah Operasi</h1>
                    <p className="text-xl opacity-90">
                        Kelola data daerah operasi (daops)
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
                                Halaman ini menampilkan seluruh data daerah operasi yang terdaftar dalam sistem.
                                Anda dapat mencari daerah operasi spesifik menggunakan kolom pencarian.
                                Untuk mengedit data daops, klik ikon <span className="inline-flex items-center"><svg className="h-4 w-4 mx-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg> Ubah</span>,
                                dan untuk menghapus data, klik ikon <span className="inline-flex items-center"><svg className="h-4 w-4 mx-1 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg> Hapus</span>.
                            </p>
                            <p className="text-base text-black-700 mt-2 leading-relaxed">
                                Petunjuk penggunaan:
                            </p>
                            <ul className="mt-2 text-base text-black-700 space-y-1 list-disc list-inside">
                                <li>Gunakan kolom pencarian untuk mencari daerah operasi tertentu</li>
                                <li>Klik tombol "Tambah Daops" untuk menambahkan data baru</li>
                                <li>Gunakan ikon edit untuk mengubah data dan ikon hapus untuk menghapus data</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <NavBtnGroup page="daops" />
                </div>

                <div className="bg-white rounded-xl shadow p-6 mb-8">
                    {loading ? (
                        <div className="flex justify-center items-center p-8">
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mb-4"></div>
                                <p className="text-base text-black-600">Memuat data daerah operasi...</p>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                                <div className="relative w-full sm:w-64">
                                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Pencarian"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-3 text-base w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center">
                                        <span className="text-base text-black-600 mr-2">Tampilkan:</span>
                                        <select
                                            value={itemsPerPage}
                                            onChange={handleItemsPerPageChange}
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
                                        onClick={() => setIsAdding(true)}
                                        className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-base"
                                        disabled={!deletePermission}
                                    >
                                        <Plus className="w-5 h-5" />
                                        <span>Tambah Daops</span>
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-sm font-medium text-black-500 uppercase tracking-wider">Daerah Operasi</th>
                                            <th className="px-6 py-3 text-left text-sm font-medium text-black-500 uppercase tracking-wider">Kodefikasi</th>
                                            <th className="px-6 py-3 text-left text-sm font-medium text-black-500 uppercase tracking-wider">Balai</th>
                                            <th className="px-6 py-3 text-left text-sm font-medium text-black-500 uppercase tracking-wider">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {paginatedData.length > 0 ? (
                                            paginatedData.map((daops) => (
                                                <tr key={daops.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-base text-black-800">{daops.name || '-'}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base text-black-800">{daops.code || '-'}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base text-black-800">{balaiLookup[daops.balaiId] || '-'}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base text-black-800">
                                                        {deletePermission && (
                                                            <div className="flex space-x-2">
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingDaops(daops);
                                                                        setIsEditing(true);
                                                                    }}
                                                                    className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                                                                    title="Edit"
                                                                >
                                                                    <Edit className="w-6 h-6" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteDaops(daops)}
                                                                    className="p-1 text-red-600 hover:text-red-800 transition-colors"
                                                                    title="Hapus"
                                                                >
                                                                    <Trash className="w-6 h-6" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-4 text-center text-base text-black-500">
                                                    {searchTerm ? 'Tidak ada data yang sesuai dengan pencarian' : 'Tidak ada data daerah operasi'}
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
                                            onClick={handlePrevPage}
                                            disabled={currentPage === 1}
                                            className="p-2 rounded-md border border-gray-300 bg-white text-black-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                        >
                                            &laquo;
                                        </button>
                                        <input
                                            type="text"
                                            value={currentPage}
                                            readOnly
                                            className="w-12 border-t border-b border-gray-300 text-center py-2 text-base text-black-700"
                                        />
                                        <button
                                            onClick={handleNextPage}
                                            disabled={currentPage >= totalPages}
                                            className="p-2 rounded-md border border-gray-300 bg-white text-black-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                        >
                                            &raquo;
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {isAdding && (
                <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg w-full max-w-md mx-4 md:mx-auto shadow-xl">
                        <div className="flex justify-between items-center px-6 py-4 border-b">
                            <h4 className="text-xl font-semibold text-black-800">Tambah Daerah Operasi</h4>
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
                                    Daerah Operasi
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-base text-black-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newDaops.name}
                                    onChange={handleNewDaopsChange('name')}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-black-700 text-base font-bold mb-2 text-left" htmlFor="code">
                                    Kodefikasi
                                </label>
                                <input
                                    id="code"
                                    type="text"
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-base text-black-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newDaops.code}
                                    onChange={handleNewDaopsChange('code')}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-black-700 text-base font-bold mb-2 text-left" htmlFor="balai">
                                    Balai
                                </label>
                                <select
                                    id="balai"
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-base text-black-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newDaops.balaiId}
                                    onChange={handleNewDaopsChange('balaiId')}
                                    required
                                >
                                    <option value="">Pilih Balai</option>
                                    {Object.entries(balaiLookup).map(([id, name]) => (
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
                                onClick={handleAddDaops}
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isEditing && editingDaops && (
                <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg w-full max-w-md mx-4 md:mx-auto shadow-xl">
                        <div className="flex justify-between items-center px-6 py-4 border-b">
                            <h4 className="text-xl font-semibold text-black-800">Edit Daerah Operasi</h4>
                            <button
                                className="text-black-500 hover:text-black-700"
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditingDaops(null);
                                }}
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="px-6 py-4">
                            <div className="mb-4">
                                <label className="block text-black-700 text-base font-bold mb-2 text-left" htmlFor="edit-name">
                                    Daerah Operasi
                                </label>
                                <input
                                    id="edit-name"
                                    type="text"
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-base text-black-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={editingDaops.name}
                                    onChange={handleEditDaopsChange('name')}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-black-700 text-base font-bold mb-2 text-left" htmlFor="edit-code">
                                    Kodefikasi
                                </label>
                                <input
                                    id="edit-code"
                                    type="text"
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-base text-black-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={editingDaops.code}
                                    onChange={handleEditDaopsChange('code')}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-black-700 text-base font-bold mb-2 text-left" htmlFor="edit-balai">
                                    Balai
                                </label>
                                <select
                                    id="edit-balai"
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-base text-black-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={editingDaops.balaiId}
                                    onChange={handleEditDaopsChange('balaiId')}
                                    required
                                >
                                    <option value="">Pilih Balai</option>
                                    {Object.entries(balaiLookup).map(([id, name]) => (
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
                                    setEditingDaops(null);
                                }}
                            >
                                Batal
                            </button>
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 text-base rounded transition-colors"
                                onClick={handleUpdateDaops}
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

export default Daops;