import React, { useEffect, useState } from 'react';
import { MapPin, Users, Activity, AlertCircle, X } from 'lucide-react';
import {
    addKorwil,
    deleteKorwil,
    getAllKorwil,
    getAllDaops,
    updateKorwil
} from '@/services';
import useAuth from '@/context/auth';
import NavBtnGroup from '@/components/wilayah/NavBtnGroup';
import Swal from 'sweetalert2';

interface KorwilData {
    id: string;
    nama: string;
    kode: string;
    m_daops_id: string;
    tableData?: {
        id: number;
    };
}

interface DaopsData {
    id: string;
    name: string;
    code?: string;
}

type RegionType = {
    [name: string]: string;
};

const generateDaopsLookup = async (): Promise<RegionType> => {
    const data: RegionType = {};
    const wilayah = await getAllDaops();
    wilayah.forEach((item: DaopsData) => {
        data[item.id] = `${item.name}`;
    });
    return data;
};

const Korwil: React.FC = () => {
    const { isAuthenticated, user } = useAuth();
    const [daopsLookup, setDaopsLookup] = useState<RegionType>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [deletePermission, setDeletePermission] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(5);
    const [editingKorwil, setEditingKorwil] = useState<KorwilData | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [newKorwil, setNewKorwil] = useState<KorwilData>({
        id: '',
        nama: '',
        kode: '',
        m_daops_id: ''
    });

    const deleteRoles = [0, 1, 2];

    const [values, setValues] = useState<{
        korwil: KorwilData[];
    }>({
        korwil: []
    });

    useEffect(() => {
        const fetchData = async () => {
            const wilayahLookup = await generateDaopsLookup();
            setDaopsLookup(wilayahLookup);

            if (deleteRoles.includes(user.roleLevel)) {
                setDeletePermission(true);
            }

            const data = await getAllKorwil();
            setValues({ korwil: data });
            setLoading(false);
        };

        if (isAuthenticated) fetchData();
    }, [isAuthenticated]);

    const handleAddKorwil = async () => {
        if (!newKorwil.nama || !newKorwil.kode || !newKorwil.m_daops_id) {
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
            const result = await addKorwil(newKorwil);
            if (result.success) {
                const data = await getAllKorwil();
                setValues({ korwil: data });
                setIsAdding(false);
                setNewKorwil({
                    id: '',
                    nama: '',
                    kode: '',
                    m_daops_id: ''
                });
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Data koordinator wilayah berhasil ditambahkan',
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
            console.error("Error adding Korwil:", error);
            Swal.fire({
                icon: 'error',
                title: 'Terjadi Kesalahan',
                text: 'Gagal menambah data koordinator wilayah',
                confirmButtonColor: '#3085d6',
                customClass: {
                    popup: 'swal-large-text',
                    title: 'text-xl',
                    htmlContainer: 'text-lg'
                }
            });
        }
    };

    const handleUpdateKorwil = async () => {
        if (!editingKorwil) return;

        if (!editingKorwil.nama || !editingKorwil.kode || !editingKorwil.m_daops_id) {
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
            const oldData = values.korwil.find(k => k.id === editingKorwil.id);
            if (!oldData) return;

            const result = await updateKorwil(editingKorwil, oldData);
            if (result.success) {
                const dataUpdate = [...values.korwil];
                const index = dataUpdate.findIndex(k => k.id === editingKorwil.id);
                dataUpdate[index] = editingKorwil;

                setValues({ korwil: dataUpdate });
                setIsEditing(false);
                setEditingKorwil(null);
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Data koordinator wilayah berhasil diubah',
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
            console.error("Error updating Korwil:", error);
            Swal.fire({
                icon: 'error',
                title: 'Terjadi Kesalahan',
                text: 'Gagal mengubah data koordinator wilayah',
                confirmButtonColor: '#3085d6',
                customClass: {
                    popup: 'swal-large-text',
                    title: 'text-xl',
                    htmlContainer: 'text-lg'
                }
            });
        }
    };

    const handleDeleteKorwil = async (korwilData: KorwilData) => {
        const result = await Swal.fire({
            icon: 'warning',
            title: 'Konfirmasi Hapus',
            text: 'Apakah Anda yakin ingin menghapus data koordinator wilayah ini?',
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
                const deleteResult = await deleteKorwil(korwilData);
                if (deleteResult.success) {
                    const dataDelete = [...values.korwil];
                    const index = dataDelete.findIndex(k => k.id === korwilData.id);
                    dataDelete.splice(index, 1);

                    setValues({ korwil: dataDelete });
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil!',
                        text: 'Data koordinator wilayah berhasil dihapus',
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
                console.error("Error deleting Korwil:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Terjadi Kesalahan',
                    text: 'Gagal menghapus data koordinator wilayah',
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

    const filteredData = values.korwil.filter(korwil => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (korwil.nama && korwil.nama.toLowerCase().includes(searchLower)) ||
            (korwil.kode && korwil.kode.toLowerCase().includes(searchLower)) ||
            (daopsLookup[korwil.m_daops_id] && daopsLookup[korwil.m_daops_id].toLowerCase().includes(searchLower))
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

    const handleNewKorwilChange = (prop: keyof KorwilData) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setNewKorwil({ ...newKorwil, [prop]: e.target.value });
    };

    const handleEditKorwilChange = (prop: keyof KorwilData) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        if (!editingKorwil) return;
        setEditingKorwil({ ...editingKorwil, [prop]: e.target.value });
    };

    return (
        <div className="bg-gray-50 min-h-full p-6">
            <div className="header-primary text-white p-8 rounded-xl mb-8 shadow-md">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl font-bold mb-2">Data Korwil</h1>
                    <p className="text-xl opacity-90">
                        Kelola data koordinator wilayah (korwil)
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
                                Halaman ini menampilkan seluruh data koordinator wilayah yang terdaftar dalam sistem.
                                Anda dapat mencari korwil spesifik menggunakan kolom pencarian.
                                Untuk mengedit data korwil, klik ikon <span className="inline-flex items-center"><svg className="h-4 w-4 mx-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg> Ubah</span>,
                                dan untuk menghapus data, klik ikon <span className="inline-flex items-center"><svg className="h-4 w-4 mx-1 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg> Hapus</span>.
                            </p>
                            <p className="text-base text-black-700 mt-2 leading-relaxed">
                                Petunjuk penggunaan:
                            </p>
                            <ul className="mt-2 text-base text-black-700 space-y-1 list-disc list-inside">
                                <li>Gunakan kolom pencarian untuk mencari koordinator wilayah tertentu</li>
                                <li>Klik tombol "Tambah Korwil" untuk menambahkan data baru</li>
                                <li>Gunakan ikon edit untuk mengubah data dan ikon hapus untuk menghapus data</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <NavBtnGroup page="korwil" />
                </div>

                <div className="bg-white rounded-xl shadow p-6 mb-8">
                    {loading ? (
                        <div className="flex justify-center items-center p-8">
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mb-4"></div>
                                <p className="text-base text-black-600">Memuat data korwil...</p>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                <div className="relative w-full md:w-64">
                                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Cari korwil..."
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
                                            <option value="5">5</option>
                                            <option value="10">10</option>
                                            <option value="15">15</option>
                                            <option value="20">20</option>
                                            <option value="25">25</option>
                                        </select>
                                        <span className="text-base text-black-600 ml-2">Baris</span>
                                    </div>

                                    <button
                                        onClick={() => setIsAdding(true)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 text-base rounded-lg flex items-center transition-colors"
                                        disabled={!deletePermission}
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                        </svg>
                                        Tambah Korwil
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-sm font-medium text-black-500 uppercase tracking-wider">Nama Korwil</th>
                                            <th className="px-6 py-3 text-left text-sm font-medium text-black-500 uppercase tracking-wider">Kode Korwil</th>
                                            <th className="px-6 py-3 text-left text-sm font-medium text-black-500 uppercase tracking-wider">Daops</th>
                                            <th className="px-6 py-3 text-left text-sm font-medium text-black-500 uppercase tracking-wider">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {paginatedData.length > 0 ? (
                                            paginatedData.map((korwil) => (
                                                <tr key={korwil.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-base text-black-800">{korwil.nama || '-'}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base text-black-800">{korwil.kode || '-'}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base text-black-800">{daopsLookup[korwil.m_daops_id] || '-'}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-base text-black-800">
                                                        {deletePermission && (
                                                            <div className="flex space-x-2">
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingKorwil(korwil);
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
                                                                    onClick={() => handleDeleteKorwil(korwil)}
                                                                    className="p-1 text-red-600 hover:text-red-800 transition-colors"
                                                                    title="Hapus"
                                                                >
                                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
                                                    {searchTerm ? 'Tidak ada data yang sesuai dengan pencarian' : 'Tidak ada data korwil'}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                                <div className="px-4 py-3 bg-white border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center mt-4">
                                    <div className="text-base text-black-700 mb-2 sm:mb-0">
                                        Menampilkan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} dari {filteredData.length} hasil
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
                            <h4 className="text-xl font-semibold text-black-800">Tambah Koordinator Wilayah</h4>
                            <button
                                className="text-black-500 hover:text-black-700"
                                onClick={() => setIsAdding(false)}
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="px-6 py-4">
                            <div className="mb-4">
                                <label className="block text-black-700 text-base font-bold mb-2 text-left" htmlFor="nama">
                                    Nama Korwil
                                </label>
                                <input
                                    id="nama"
                                    type="text"
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-base text-black-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newKorwil.nama}
                                    onChange={handleNewKorwilChange('nama')}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-black-700 text-base font-bold mb-2 text-left" htmlFor="kode">
                                    Kode Korwil
                                </label>
                                <input
                                    id="kode"
                                    type="text"
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-base text-black-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newKorwil.kode}
                                    onChange={handleNewKorwilChange('kode')}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-black-700 text-base font-bold mb-2 text-left" htmlFor="daops">
                                    Daerah Operasi
                                </label>
                                <select
                                    id="daops"
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-base text-black-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newKorwil.m_daops_id}
                                    onChange={handleNewKorwilChange('m_daops_id')}
                                    required
                                >
                                    <option value="">Pilih Daerah Operasi</option>
                                    {Object.entries(daopsLookup).map(([id, name]) => (
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
                                onClick={handleAddKorwil}
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isEditing && editingKorwil && (
                <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg w-full max-w-md mx-4 md:mx-auto shadow-xl">
                        <div className="flex justify-between items-center px-6 py-4 border-b">
                            <h4 className="text-xl font-semibold text-black-800">Edit Koordinator Wilayah</h4>
                            <button
                                className="text-black-500 hover:text-black-700"
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditingKorwil(null);
                                }}
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="px-6 py-4">
                            <div className="mb-4">
                                <label className="block text-black-700 text-base font-bold mb-2 text-left" htmlFor="edit-nama">
                                    Nama Korwil
                                </label>
                                <input
                                    id="edit-nama"
                                    type="text"
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-base text-black-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={editingKorwil.nama}
                                    onChange={handleEditKorwilChange('nama')}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-black-700 text-base font-bold mb-2 text-left" htmlFor="edit-kode">
                                    Kode Korwil
                                </label>
                                <input
                                    id="edit-kode"
                                    type="text"
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-base text-black-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={editingKorwil.kode}
                                    onChange={handleEditKorwilChange('kode')}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-black-700 text-base font-bold mb-2 text-left" htmlFor="edit-daops">
                                    Daerah Operasi
                                </label>
                                <select
                                    id="edit-daops"
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-base text-black-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={editingKorwil.m_daops_id}
                                    onChange={handleEditKorwilChange('m_daops_id')}
                                    required
                                >
                                    <option value="">Pilih Daerah Operasi</option>
                                    {Object.entries(daopsLookup).map(([id, name]) => (
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
                                    setEditingKorwil(null);
                                }}
                            >
                                Batal
                            </button>
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 text-base rounded transition-colors"
                                onClick={handleUpdateKorwil}
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

export default Korwil;