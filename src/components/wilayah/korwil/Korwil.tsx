import React, { useEffect, useState } from 'react';
import { MapPin, Users, Activity } from 'lucide-react';
import {
    addKorwil,
    deleteKorwil,
    getAllKorwil,
    getAllDaops,
    updateKorwil
} from '@/services';
import useAuth from '@/context/auth';
import NavBtnGroup from '@/components/wilayah/NavBtnGroup';

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
                <p className="text-l text-gray-500 leading-relaxed">{description}</p>
            </div>
        </div>
    );
};

const Korwil: React.FC = () => {
    const { isAuthenticated, user } = useAuth();
    const [daopsLookup, setDaopsLookup] = useState<RegionType>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [deletePermission, setDeletePermission] = useState<boolean>(false);
    const [showAlert, setShowAlert] = useState<boolean>(false);
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
        alertMessage: string;
        successAlert: boolean;
    }>({
        korwil: [],
        alertMessage: '',
        successAlert: true
    });

    const closeAlert = () => setShowAlert(false);

    const showAlertMessage = () => {
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
        }, 3000);
    };

    useEffect(() => {
        const fetchData = async () => {
            const wilayahLookup = await generateDaopsLookup();
            setDaopsLookup(wilayahLookup);

            if (deleteRoles.includes(user.roleLevel)) {
                setDeletePermission(true);
            }

            const data = await getAllKorwil();
            setValues({ ...values, korwil: data });
            setLoading(false);
        };

        if (isAuthenticated) fetchData();
    }, [isAuthenticated]);

    const handleAddKorwil = async () => {
        try {
            const result = await addKorwil(newKorwil);
            if (result.success) {
                const data = await getAllKorwil();
                setValues({
                    ...values,
                    korwil: data,
                    alertMessage: 'Tambah Korwil Berhasil',
                    successAlert: true
                });
                setIsAdding(false);
                setNewKorwil({
                    id: '',
                    nama: '',
                    kode: '',
                    m_daops_id: ''
                });
            } else {
                setValues({
                    ...values,
                    alertMessage: `Tambah Korwil Gagal, ${result.message}`,
                    successAlert: false
                });
            }
            showAlertMessage();
        } catch (error) {
            console.error("Error adding Korwil:", error);
            setValues({
                ...values,
                alertMessage: 'Tambah Korwil Gagal',
                successAlert: false
            });
            showAlertMessage();
        }
    };

    const handleUpdateKorwil = async () => {
        if (!editingKorwil) return;

        try {
            const oldData = values.korwil.find(k => k.id === editingKorwil.id);
            if (!oldData) return;

            const result = await updateKorwil(editingKorwil, oldData);
            if (result.success) {
                const dataUpdate = [...values.korwil];
                const index = dataUpdate.findIndex(k => k.id === editingKorwil.id);
                dataUpdate[index] = editingKorwil;

                setValues({
                    ...values,
                    korwil: dataUpdate,
                    alertMessage: 'Update Korwil Berhasil',
                    successAlert: true
                });
                setIsEditing(false);
                setEditingKorwil(null);
            } else {
                setValues({
                    ...values,
                    alertMessage: `Update Korwil Gagal, ${result.message}`,
                    successAlert: false
                });
            }
            showAlertMessage();
        } catch (error) {
            console.error("Error updating Korwil:", error);
            setValues({
                ...values,
                alertMessage: 'Update Korwil Gagal',
                successAlert: false
            });
            showAlertMessage();
        }
    };

    const handleDeleteKorwil = async (korwilData: KorwilData) => {
        if (window.confirm('Yakin hapus data ini ?')) {
            try {
                const result = await deleteKorwil(korwilData);
                if (result.success) {
                    const dataDelete = [...values.korwil];
                    const index = dataDelete.findIndex(k => k.id === korwilData.id);
                    dataDelete.splice(index, 1);

                    setValues({
                        ...values,
                        korwil: dataDelete,
                        alertMessage: 'Hapus Korwil Berhasil',
                        successAlert: true
                    });
                } else {
                    setValues({
                        ...values,
                        alertMessage: `Hapus Korwil Gagal, ${result.message}`,
                        successAlert: false
                    });
                }
                showAlertMessage();
            } catch (error) {
                console.error("Error deleting Korwil:", error);
                setValues({
                    ...values,
                    alertMessage: 'Hapus Korwil Gagal',
                    successAlert: false
                });
                showAlertMessage();
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
            {showAlert && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-md flex justify-between items-center shadow-lg ${values.successAlert
                    ? 'bg-green-50 text-green-800 border-l-4 border-green-500'
                    : 'bg-red-50 text-red-800 border-l-4 border-red-500'
                    }`}>
                    <p>{values.alertMessage}</p>
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

            <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-8 rounded-xl mb-8 shadow-md">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-3xl font-bold mb-2">Data Korwil</h1>
                    <p className="text-lg opacity-90">
                        Kelola data koordinator wilayah pencegahan kebakaran hutan dan lahan
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mb-6">
                <NavBtnGroup page="korwil" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 max-w-7xl mx-auto">
                <InfoCard
                    icon={<MapPin className="w-5 h-5" />}
                    title="Koordinator Wilayah"
                    description="Data koordinator wilayah untuk setiap daerah operasi (Daops)"
                    color="blue"
                />
                <InfoCard
                    icon={<Users className="w-5 h-5" />}
                    title="Pengelolaan Wilayah"
                    description="Definisi pembagian wilayah kerja untuk penanggulangan kebakaran"
                    color="indigo"
                />
                <InfoCard
                    icon={<Activity className="w-5 h-5" />}
                    title="Koordinasi Pencegahan"
                    description="Pengelompokan wilayah untuk koordinasi pencegahan kebakaran"
                    color="purple"
                />
            </div>

            <div className="max-w-7xl mx-auto mb-8">
                {loading ? (
                    <div className="bg-white p-8 rounded-xl shadow flex justify-center items-center">
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-600">Memuat data korwil...</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <div className="p-4 border-b">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <h3 className="text-lg font-semibold text-gray-800">Daftar Koordinator Wilayah</h3>
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                        </svg>
                                        <input
                                            type="text"
                                            placeholder="Cari korwil..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 pr-4 py-2 w-full md:w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <button
                                        onClick={() => setIsAdding(true)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                                        disabled={!deletePermission}
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                        </svg>
                                        Tambah Korwil
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-l font-medium text-gray-500 uppercase tracking-wider">Nama Korwil</th>
                                        <th className="px-6 py-3 text-left text-l font-medium text-gray-500 uppercase tracking-wider">Kode Korwil</th>
                                        <th className="px-6 py-3 text-left text-l font-medium text-gray-500 uppercase tracking-wider">Daops</th>
                                        <th className="px-6 py-3 text-right text-l font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {paginatedData.length > 0 ? (
                                        paginatedData.map((korwil) => (
                                            <tr key={korwil.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-l text-gray-800">{korwil.nama || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-l text-gray-800">{korwil.kode || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-l text-gray-800">{daopsLookup[korwil.m_daops_id] || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-l font-medium">
                                                    {deletePermission && (
                                                        <div className="flex justify-end items-center space-x-2">
                                                            <button
                                                                onClick={() => {
                                                                    setEditingKorwil(korwil);
                                                                    setIsEditing(true);
                                                                }}
                                                                className="p-1.5 text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50 rounded-md transition-colors"
                                                                title="Ubah Data Korwil"
                                                            >
                                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                                                </svg>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteKorwil(korwil)}
                                                                className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors"
                                                                title="Hapus Data Korwil"
                                                            >
                                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
                                            <td colSpan={4} className="px-6 py-4 text-center text-l text-gray-500">
                                                {searchTerm ? 'Tidak ada data yang sesuai dengan pencarian' : 'Tidak ada data korwil'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {filteredData.length > 0 && (
                            <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
                                <div className="text-l text-gray-500 mb-2 sm:mb-0 flex items-center gap-2">
                                    <span>Menampilkan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} dari {filteredData.length} korwil</span>
                                    <div className="flex items-center ml-4">
                                        <span className="text-gray-600 mr-2">Tampilkan:</span>
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
                                        </select>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={handlePrevPage}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                        </svg>
                                    </button>
                                    <div className="flex items-center">
                                        <span className="px-3 py-1 text-gray-700 bg-gray-100 rounded-md">
                                            {currentPage}
                                        </span>
                                        <span className="mx-2 text-gray-600">dari</span>
                                        <span className="px-3 py-1 text-gray-700 bg-gray-100 rounded-md">
                                            {totalPages || 1}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages || totalPages === 0}
                                        className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
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

            <div className="max-w-7xl mx-auto p-6 bg-white rounded-xl shadow mb-8">
                <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Informasi Penggunaan</h3>
                        <p className="text-l text-gray-600 leading-relaxed">
                            Halaman ini menampilkan seluruh data koordinator wilayah yang terdaftar dalam sistem.
                            Anda dapat mencari korwil spesifik menggunakan kolom pencarian.
                            Untuk mengedit data korwil, klik ikon <span className="inline-flex items-center"><svg className="h-3 w-3 mx-1 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></span>,
                            dan untuk menghapus data, klik ikon <span className="inline-flex items-center"><svg className="h-3 w-3 mx-1 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></span>.
                        </p>
                    </div>
                </div>
            </div>

            {/* Modal for Adding Korwil */}
            {isAdding && (
                <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg w-full max-w-md mx-4 md:mx-auto shadow-xl">
                        <div className="flex justify-between items-center px-6 py-4 border-b">
                            <h4 className="text-lg font-semibold text-gray-800">Tambah Koordinator Wilayah</h4>
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => setIsAdding(false)}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>

                        <div className="px-6 py-4">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="nama">
                                    Nama Korwil
                                </label>
                                <input
                                    id="nama"
                                    type="text"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newKorwil.nama}
                                    onChange={handleNewKorwilChange('nama')}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="kode">
                                    Kode Korwil
                                </label>
                                <input
                                    id="kode"
                                    type="text"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newKorwil.kode}
                                    onChange={handleNewKorwilChange('kode')}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="daops">
                                    Daerah Operasi
                                </label>
                                <select
                                    id="daops"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition-colors"
                                onClick={() => setIsAdding(false)}
                            >
                                Batal
                            </button>
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
                                onClick={handleAddKorwil}
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for Editing Korwil */}
            {isEditing && editingKorwil && (
                <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg w-full max-w-md mx-4 md:mx-auto shadow-xl">
                        <div className="flex justify-between items-center px-6 py-4 border-b">
                            <h4 className="text-lg font-semibold text-gray-800">Edit Koordinator Wilayah</h4>
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditingKorwil(null);
                                }}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>

                        <div className="px-6 py-4">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="edit-nama">
                                    Nama Korwil
                                </label>
                                <input
                                    id="edit-nama"
                                    type="text"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={editingKorwil.nama}
                                    onChange={handleEditKorwilChange('nama')}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="edit-kode">
                                    Kode Korwil
                                </label>
                                <input
                                    id="edit-kode"
                                    type="text"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={editingKorwil.kode}
                                    onChange={handleEditKorwilChange('kode')}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="edit-daops">
                                    Daerah Operasi
                                </label>
                                <select
                                    id="edit-daops"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition-colors"
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditingKorwil(null);
                                }}
                            >
                                Batal
                            </button>
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
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