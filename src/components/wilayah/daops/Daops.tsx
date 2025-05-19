import React, { useEffect, useState } from 'react';
import { MapPin, Users, Activity } from 'lucide-react';
import {
    addDaops,
    deleteDaops,
    getAllBalai,
    getAllDaops,
    updateDaops
} from '@/services';
import useAuth from '@/context/auth';
import NavBtnGroup from '@/components/wilayah/NavBtnGroup';

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

const Daops: React.FC = () => {
    const { isAuthenticated, user } = useAuth();
    const [balaiLookup, setBalaiLookup] = useState<RegionType>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [deletePermission, setDeletePermission] = useState<boolean>(false);
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(5);
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
        alertMessage: string;
        successAlert: boolean;
    }>({
        daops: [],
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
            const data = await getAllDaops();
            setValues({ ...values, daops: data });
            setLoading(false);
        };

        if (isAuthenticated) fetchData();
    }, [isAuthenticated]);

    const handleAddDaops = async () => {
        try {
            const result = await addDaops(newDaops);
            if (result.success) {
                const data = await getAllDaops();
                setValues({
                    ...values,
                    daops: data,
                    alertMessage: 'Tambah Daerah Operasi Berhasil',
                    successAlert: true
                });
                setIsAdding(false);
                setNewDaops({
                    id: '',
                    name: '',
                    code: '',
                    balaiId: ''
                });
            } else {
                setValues({
                    ...values,
                    alertMessage: `Tambah Daerah Operasi Gagal, ${result.message}`,
                    successAlert: false
                });
            }
            showAlertMessage();
        } catch (error) {
            console.error("Error adding Daops:", error);
            setValues({
                ...values,
                alertMessage: 'Tambah Daerah Operasi Gagal',
                successAlert: false
            });
            showAlertMessage();
        }
    };

    const handleUpdateDaops = async () => {
        if (!editingDaops) return;

        try {
            const oldData = values.daops.find(d => d.id === editingDaops.id);
            if (!oldData) return;

            const result = await updateDaops(editingDaops, oldData);
            if (result.success) {
                const dataUpdate = [...values.daops];
                const index = dataUpdate.findIndex(d => d.id === editingDaops.id);
                dataUpdate[index] = editingDaops;

                setValues({
                    ...values,
                    daops: dataUpdate,
                    alertMessage: 'Update Daerah Operasi Berhasil',
                    successAlert: true
                });
                setIsEditing(false);
                setEditingDaops(null);
            } else {
                setValues({
                    ...values,
                    alertMessage: `Update Daerah Operasi Gagal, ${result.message}`,
                    successAlert: false
                });
            }
            showAlertMessage();
        } catch (error) {
            console.error("Error updating Daops:", error);
            setValues({
                ...values,
                alertMessage: 'Update Daerah Operasi Gagal',
                successAlert: false
            });
            showAlertMessage();
        }
    };

    const handleDeleteDaops = async (daopsData: DaopsData) => {
        if (window.confirm('Yakin hapus data ini ?')) {
            try {
                const result = await deleteDaops(daopsData);
                if (result.success) {
                    const dataDelete = [...values.daops];
                    const index = dataDelete.findIndex(d => d.id === daopsData.id);
                    dataDelete.splice(index, 1);

                    setValues({
                        ...values,
                        daops: dataDelete,
                        alertMessage: 'Hapus Daerah Operasi Berhasil',
                        successAlert: true
                    });
                } else {
                    setValues({
                        ...values,
                        alertMessage: `Hapus Daerah Operasi Gagal, ${result.message}`,
                        successAlert: false
                    });
                }
                showAlertMessage();
            } catch (error) {
                console.error("Error deleting Daops:", error);
                setValues({
                    ...values,
                    alertMessage: 'Hapus Daerah Operasi Gagal',
                    successAlert: false
                });
                showAlertMessage();
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
                    <h1 className="text-3xl font-bold mb-2">Data Daerah Operasi</h1>
                    <p className="text-lg opacity-90">
                        Kelola data daerah operasi pencegahan kebakaran hutan dan lahan
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mb-6">
                <NavBtnGroup page="daops" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 max-w-7xl mx-auto">
                <InfoCard
                    icon={<MapPin className="w-5 h-5" />}
                    title="Daerah Operasi"
                    description="Data daerah operasi untuk setiap balai pengendalian kebakaran"
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
                    description="Struktur organisasi operasional dalam pencegahan kebakaran"
                    color="purple"
                />
            </div>

            <div className="max-w-7xl mx-auto mb-8">
                {loading ? (
                    <div className="bg-white p-8 rounded-xl shadow flex justify-center items-center">
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-600">Memuat data daerah operasi...</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <div className="p-4 border-b">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <h3 className="text-lg font-semibold text-gray-800">Daftar Daerah Operasi</h3>
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                        </svg>
                                        <input
                                            type="text"
                                            placeholder="Cari daerah operasi..."
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
                                        Tambah Daops
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-l font-medium text-gray-500 uppercase tracking-wider">Daerah Operasi</th>
                                        <th className="px-6 py-3 text-left text-l font-medium text-gray-500 uppercase tracking-wider">Kodefikasi</th>
                                        <th className="px-6 py-3 text-left text-l font-medium text-gray-500 uppercase tracking-wider">Balai</th>
                                        <th className="px-6 py-3 text-right text-l font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {paginatedData.length > 0 ? (
                                        paginatedData.map((daops) => (
                                            <tr key={daops.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-l text-gray-800">{daops.name || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-l text-gray-800">{daops.code || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-l text-gray-800">{balaiLookup[daops.balaiId] || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-l font-medium">
                                                    {deletePermission && (
                                                        <div className="flex justify-end items-center space-x-2">
                                                            <button
                                                                onClick={() => {
                                                                    setEditingDaops(daops);
                                                                    setIsEditing(true);
                                                                }}
                                                                className="p-1.5 text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50 rounded-md transition-colors"
                                                                title="Ubah Data Daops"
                                                            >
                                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                                                </svg>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteDaops(daops)}
                                                                className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors"
                                                                title="Hapus Data Daops"
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
                                                {searchTerm ? 'Tidak ada data yang sesuai dengan pencarian' : 'Tidak ada data daerah operasi'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {filteredData.length > 0 && (
                            <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
                                <div className="text-l text-gray-500 mb-2 sm:mb-0 flex items-center gap-2">
                                    <span>Menampilkan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} dari {filteredData.length} daerah operasi</span>
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
                            Halaman ini menampilkan seluruh data daerah operasi yang terdaftar dalam sistem.
                            Anda dapat mencari daerah operasi spesifik menggunakan kolom pencarian.
                            Untuk mengedit data daerah operasi, klik ikon <span className="inline-flex items-center"><svg className="h-3 w-3 mx-1 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></span>,
                            dan untuk menghapus data, klik ikon <span className="inline-flex items-center"><svg className="h-3 w-3 mx-1 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></span>.
                        </p>
                    </div>
                </div>
            </div>

            {/* Modal for Adding Daops */}
            {isAdding && (
                <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg w-full max-w-md mx-4 md:mx-auto shadow-xl">
                        <div className="flex justify-between items-center px-6 py-4 border-b">
                            <h4 className="text-lg font-semibold text-gray-800">Tambah Daerah Operasi</h4>
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
                                <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="name">
                                    Daerah Operasi
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newDaops.name}
                                    onChange={handleNewDaopsChange('name')}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="code">
                                    Kodefikasi
                                </label>
                                <input
                                    id="code"
                                    type="text"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newDaops.code}
                                    onChange={handleNewDaopsChange('code')}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="balai">
                                    Balai
                                </label>
                                <select
                                    id="balai"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition-colors"
                                onClick={() => setIsAdding(false)}
                            >
                                Batal
                            </button>
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
                                onClick={handleAddDaops}
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for Editing Daops */}
            {isEditing && editingDaops && (
                <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg w-full max-w-md mx-4 md:mx-auto shadow-xl">
                        <div className="flex justify-between items-center px-6 py-4 border-b">
                            <h4 className="text-lg font-semibold text-gray-800">Edit Daerah Operasi</h4>
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditingDaops(null);
                                }}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>

                        <div className="px-6 py-4">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="edit-name">
                                    Daerah Operasi
                                </label>
                                <input
                                    id="edit-name"
                                    type="text"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={editingDaops.name}
                                    onChange={handleEditDaopsChange('name')}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="edit-code">
                                    Kodefikasi
                                </label>
                                <input
                                    id="edit-code"
                                    type="text"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={editingDaops.code}
                                    onChange={handleEditDaopsChange('code')}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="edit-balai">
                                    Balai
                                </label>
                                <select
                                    id="edit-balai"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition-colors"
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditingDaops(null);
                                }}
                            >
                                Batal
                            </button>
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
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