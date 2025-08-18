import React from 'react';
import useAuth from '@/context/auth'
import { SuratTugasData } from '@/interfaces'
import { getAllPenugasan, deletePenugasan } from '@/services'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

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
                <h3 className="text-lg font-semibold text-black-800 mb-2">{title}</h3>
                <p className="text-l text-black-500 leading-relaxed">{description}</p>
            </div>
        </div>
    );
};

const columns = [
    { title: 'Jenis Patroli', field: 'type' },
    { title: 'Nomor Surat Tugas', field: 'number' },
    { title: 'Tanggal Mulai', field: 'startDate' },
    { title: 'Tanggal Selesai', field: 'finishDate' }
]

interface PenugasanProps { }

const Penugasan: React.FC<PenugasanProps> = () => {
    const router = useRouter()
    const { isAuthenticated, user } = useAuth()
    const [penugasan, setPenugasan] = useState<SuratTugasData[]>([])
    const [showAlert, setShowAlert] = useState(false)
    const [alertSuccess, setAlertSuccess] = useState(true)
    const [loading, setLoading] = useState(true)
    const [deleteCondition, setDeleteCondition] = useState(false)
    const deleteRole = [0, 6]
    const [alertType, setAlertType] = useState<'success' | 'info' | 'warning' | 'error'>('success')
    const [alertMessage, setAlertMessage] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<SuratTugasData | null>(null)
    const [editFormData, setEditFormData] = useState<Partial<SuratTugasData>>({})

    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllPenugasan()
            setPenugasan(data)
            setLoading(false)

            if (deleteRole.includes(user.roleLevel)) {
                setDeleteCondition(true)
            }
        }
        if (isAuthenticated) fetchData()
    }, [isAuthenticated, user])

    const showAlertMessage = (isSuccess: boolean, message: string) => {
        setAlertType(isSuccess ? 'success' : 'error');
        setAlertMessage(message);
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
        }, 3000);
    };

    const handleDelete = async (rowData: SuratTugasData, index: number) => {
        try {
            const result = await deletePenugasan(rowData)
            if (result.success) {
                const dataDelete = [...penugasan]
                dataDelete.splice(index, 1)
                setPenugasan(dataDelete)
                showAlertMessage(true, 'Hapus data penugasan berhasil')
            } else {
                showAlertMessage(false, result.message as string)
            }
        } catch (error) {
            showAlertMessage(false, 'Terjadi kesalahan saat menghapus data')
        }
    }

    const openEditModal = (item: SuratTugasData) => {
        setEditingItem(item);
        setEditFormData({ ...item });
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingItem(null);
        setEditFormData({});
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = async () => {
        // Edit functionality would go here
        closeEditModal();
    };

    const getFilteredData = (data: SuratTugasData[], searchTerm: string) => {
        if (!searchTerm) return data;

        return data.filter(item => {
            const searchLower = searchTerm.toLowerCase();
            return (
                (item.type && item.type.toLowerCase().includes(searchLower)) ||
                (item.number && item.number.toLowerCase().includes(searchLower)) ||
                (item.startDate && item.startDate.toLowerCase().includes(searchLower)) ||
                (item.finishDate && item.finishDate.toLowerCase().includes(searchLower))
            );
        });
    };

    const filteredData = getFilteredData(penugasan, searchTerm);
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

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="bg-gray-50 min-h-full p-6">
            {showAlert && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-md flex justify-between items-center shadow-lg ${alertType === 'success' ? 'bg-green-50 text-green-800 border-l-4 border-green-500' :
                    alertType === 'error' ? 'bg-red-50 text-red-800 border-l-4 border-red-500' :
                        alertType === 'warning' ? 'bg-yellow-50 text-yellow-800 border-l-4 border-yellow-500' :
                            'bg-blue-50 text-blue-800 border-l-4 border-blue-500'
                    }`}>
                    <p>{alertMessage}</p>
                    <button
                        onClick={() => {
                            setShowAlert(false);
                            setAlertMessage('');
                        }}
                        className="ml-4 text-black-500 hover:text-black-700"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            )}

            {isEditModalOpen && editingItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-black-800">Edit Penugasan</h3>
                            <button
                                onClick={closeEditModal}
                                className="text-black-500 hover:text-black-700"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>

                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-black-700 mb-1">Jenis Patroli</label>
                                <input
                                    type="text"
                                    name="type"
                                    value={editFormData.type || editingItem.type}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-black-700"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-black-700 mb-1">Nomor Surat Tugas</label>
                                <input
                                    type="text"
                                    name="number"
                                    value={editFormData.number || editingItem.number}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-black-700"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-black-700 mb-1">Tanggal Mulai</label>
                                <input
                                    type="text"
                                    name="startDate"
                                    value={editFormData.startDate || editingItem.startDate}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-black-700"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-black-700 mb-1">Tanggal Selesai</label>
                                <input
                                    type="text"
                                    name="finishDate"
                                    value={editFormData.finishDate || editingItem.finishDate}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-black-700"
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-black-700 bg-white hover:bg-gray-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleEditSubmit}
                                    className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="header-primary text-white p-8 rounded-xl mb-8 shadow-md">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-3xl font-bold mb-2">Daftar Penugasan</h1>
                    <p className="text-lg opacity-90">
                        Kelola daftar penugasan patroli yang telah dibuat
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6 bg-white rounded-xl shadow mb-8">
                <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div>
                        <h3 className="font-semibold text-black-800 mb-2">Informasi Surat Tugas</h3>
                        <p className="text-l text-black-600 leading-relaxed">
                            Halaman ini menampilkan detail tim yang termasuk dalam surat tugas.
                            Anda dapat mencari tim patroli spesifik menggunakan kolom pencarian.
                            Untuk melihat detail penugasan, klik ikon <span className="inline-flex items-center"><svg className="h-3 w-3 mx-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></span>,
                            dan untuk menghapus data, klik ikon <span className="inline-flex items-center"><svg className="h-3 w-3 mx-1 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></span>.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mb-8">
                {loading ? (
                    <div className="bg-white p-8 rounded-xl shadow flex justify-center items-center">
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mb-4"></div>
                            <p className="text-black-600">Memuat data penugasan...</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <div className="p-4 border-b">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <h3 className="text-lg font-semibold text-black-800">
                                    Daftar Penugasan
                                </h3>
                                <div className="flex gap-4">
                                    <div className="relative">
                                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                        </svg>
                                        <input
                                            type="text"
                                            placeholder="Cari penugasan..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 pr-4 py-2 w-full md:w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    {user.roleLevel === 6 && (
                                        <Link href="penugasan/berkas">
                                            <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                                </svg>
                                                Tambah Penugasan
                                            </button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {columns.map((column) => (
                                            <th key={column.field} scope="col" className="px-6 py-3 text-left text-l font-medium text-black-500 uppercase tracking-wider">
                                                {column.title}
                                            </th>
                                        ))}
                                        <th scope="col" className="px-6 py-3 text-right text-l font-medium text-black-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {paginatedData.length > 0 ? (
                                        paginatedData.map((item, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-l text-black-800">{item.type}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-l text-black-800">{item.number}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-l text-black-800">{item.startDate}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-l text-black-800">{item.finishDate}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-l font-medium">
                                                    <div className="flex justify-end items-center space-x-2">
                                                        <button
                                                            onClick={() => router.push(`/penugasan/detail?noSK=${item.number}`)}
                                                            className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-md transition-colors"
                                                            title="Buka Detail Surat Tugas"
                                                        >
                                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                                            </svg>
                                                        </button>
                                                        {deleteCondition && (
                                                            <button
                                                                onClick={() => {
                                                                    if (window.confirm('Apakah Anda yakin ingin menghapus daftar tersebut?')) {
                                                                        handleDelete(item, index);
                                                                    }
                                                                }}
                                                                className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors"
                                                                title="Hapus"
                                                            >
                                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                                </svg>
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-4 text-center text-l text-black-500">
                                                {searchTerm ? 'Tidak ada data yang sesuai dengan pencarian' : 'Tidak ada data penugasan'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {filteredData.length > 0 && (
                            <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
                                <div className="text-l text-black-500 mb-2 sm:mb-0 flex items-center gap-2">
                                    <span>Menampilkan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} dari {filteredData.length} data</span>
                                    <div className="flex items-center ml-4">
                                        <span className="text-black-600 mr-2">Tampilkan:</span>
                                        <select
                                            value={itemsPerPage}
                                            onChange={handleItemsPerPageChange}
                                            className="border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="5">5</option>
                                            <option value="10">10</option>
                                            <option value="15">15</option>
                                            <option value="20">20</option>
                                            <option value="25">25</option>
                                            <option value="50">50</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={handlePrevPage}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-md border border-gray-300 bg-white text-black-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                        </svg>
                                    </button>
                                    <div className="flex items-center">
                                        <span className="px-3 py-1 text-black-700 bg-gray-100 rounded-md">
                                            {currentPage}
                                        </span>
                                        <span className="mx-2 text-black-600">dari</span>
                                        <span className="px-3 py-1 text-black-700 bg-gray-100 rounded-md">
                                            {totalPages || 1}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages || totalPages === 0}
                                        className="p-2 rounded-md border border-gray-300 bg-white text-black-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Penugasan;