import React, { useEffect, useState } from 'react';
import { MapPin, Users, Activity } from 'lucide-react';
import {
    addBalai,
    deleteBalai,
    getAllBalai,
    getAllPulau,
    updateBalai
} from '@/services';
import useAuth from '@/context/auth';
import NavBtnGroup from '@/components/wilayah/NavBtnGroup';

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

const Balai: React.FC = () => {
    const { isAuthenticated, user } = useAuth();
    const [wilayahLookup, setWilayahLookup] = useState<RegionType>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [deletePermission, setDeletePermission] = useState<boolean>(false);
    const [showAlert, setShowAlert] = useState<boolean>(false);
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
        alertMessage: string;
        successAlert: boolean;
    }>({
        balai: [],
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
            const wilayahData = await generateWilayahLookup();
            setWilayahLookup(wilayahData);

            if (deleteRoles.includes(user.roleLevel)) {
                setDeletePermission(true);
            }

            const data = await getAllBalai();
            setValues({ ...values, balai: data });
            setLoading(false);
        };

        if (isAuthenticated) fetchData();
    }, [isAuthenticated, user]);

    const handleAddBalai = async () => {
        try {
            const result = await addBalai(newBalai);
            if (result.success) {
                const data = await getAllBalai();
                setValues({
                    ...values,
                    balai: data,
                    alertMessage: 'Tambah Balai Berhasil',
                    successAlert: true
                });
                setIsAdding(false);
                setNewBalai({
                    id: '',
                    name: '',
                    code: '',
                    region: ''
                });
            } else {
                setValues({
                    ...values,
                    alertMessage: `Tambah Balai Gagal, ${result.message}`,
                    successAlert: false
                });
            }
            showAlertMessage();
        } catch (error) {
            console.error("Error adding Balai:", error);
            setValues({
                ...values,
                alertMessage: 'Tambah Balai Gagal',
                successAlert: false
            });
            showAlertMessage();
        }
    };

    const handleUpdateBalai = async () => {
        if (!editingBalai) return;

        try {
            const oldData = values.balai.find(b => b.id === editingBalai.id);
            if (!oldData) return;

            const result = await updateBalai(editingBalai, oldData);
            if (result.success) {
                const dataUpdate = [...values.balai];
                const index = dataUpdate.findIndex(b => b.id === editingBalai.id);
                dataUpdate[index] = editingBalai;

                setValues({
                    ...values,
                    balai: dataUpdate,
                    alertMessage: 'Update Balai Berhasil',
                    successAlert: true
                });
                setIsEditing(false);
                setEditingBalai(null);
            } else {
                setValues({
                    ...values,
                    alertMessage: `Update Balai Gagal, ${result.message}`,
                    successAlert: false
                });
            }
            showAlertMessage();
        } catch (error) {
            console.error("Error updating Balai:", error);
            setValues({
                ...values,
                alertMessage: 'Update Balai Gagal',
                successAlert: false
            });
            showAlertMessage();
        }
    };

    const handleDeleteBalai = async (balaiData: BalaiData) => {
        if (window.confirm('Yakin hapus data ini ?')) {
            try {
                const result = await deleteBalai(balaiData);
                if (result.success) {
                    const dataDelete = [...values.balai];
                    const index = dataDelete.findIndex(b => b.id === balaiData.id);
                    dataDelete.splice(index, 1);

                    setValues({
                        ...values,
                        balai: dataDelete,
                        alertMessage: 'Hapus Balai Berhasil',
                        successAlert: true
                    });
                } else {
                    setValues({
                        ...values,
                        alertMessage: `Hapus Balai Gagal, ${result.message}`,
                        successAlert: false
                    });
                }
                showAlertMessage();
            } catch (error) {
                console.error("Error deleting Balai:", error);
                setValues({
                    ...values,
                    alertMessage: 'Hapus Balai Gagal',
                    successAlert: false
                });
                showAlertMessage();
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
                    <h1 className="text-3xl font-bold mb-2">Data Balai</h1>
                    <p className="text-lg opacity-90">
                        Kelola data balai pengendalian kebakaran hutan dan lahan
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mb-6">
                <NavBtnGroup page="balai" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 max-w-7xl mx-auto">
                <InfoCard
                    icon={<MapPin className="w-5 h-5" />}
                    title="Balai Pengendalian"
                    description="Data balai pengendalian kebakaran hutan dan lahan"
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
                    description="Struktur organisasi pusat dalam pencegahan kebakaran"
                    color="purple"
                />
            </div>

            <div className="max-w-7xl mx-auto mb-8">
                {loading ? (
                    <div className="bg-white p-8 rounded-xl shadow flex justify-center items-center">
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-600">Memuat data balai...</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <div className="p-4 border-b">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <h3 className="text-lg font-semibold text-gray-800">Daftar Balai</h3>
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                        </svg>
                                        <input
                                            type="text"
                                            placeholder="Cari balai..."
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
                                        Tambah Balai
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-l font-medium text-gray-500 uppercase tracking-wider">Nama Balai</th>
                                        <th className="px-6 py-3 text-left text-l font-medium text-gray-500 uppercase tracking-wider">Kode Balai</th>
                                        <th className="px-6 py-3 text-left text-l font-medium text-gray-500 uppercase tracking-wider">Wilayah</th>
                                        <th className="px-6 py-3 text-right text-l font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {paginatedData.length > 0 ? (
                                        paginatedData.map((balai) => (
                                            <tr key={balai.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-l text-gray-800">{balai.name || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-l text-gray-800">{balai.code || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-l text-gray-800">{wilayahLookup[balai.region] || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-l font-medium">
                                                    {deletePermission && (
                                                        <div className="flex justify-end items-center space-x-2">
                                                            <button
                                                                onClick={() => {
                                                                    setEditingBalai(balai);
                                                                    setIsEditing(true);
                                                                }}
                                                                className="p-1.5 text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50 rounded-md transition-colors"
                                                                title="Ubah Data Balai"
                                                            >
                                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                                                </svg>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteBalai(balai)}
                                                                className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors"
                                                                title="Hapus Data Balai"
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
                                                {searchTerm ? 'Tidak ada data yang sesuai dengan pencarian' : 'Tidak ada data balai'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {filteredData.length > 0 && (
                            <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
                                <div className="text-l text-gray-500 mb-2 sm:mb-0 flex items-center gap-2">
                                    <span>Menampilkan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} dari {filteredData.length} balai</span>
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
                            Halaman ini menampilkan seluruh data balai yang terdaftar dalam sistem.
                            Anda dapat mencari balai spesifik menggunakan kolom pencarian.
                            Untuk mengedit data balai, klik ikon <span className="inline-flex items-center"><svg className="h-3 w-3 mx-1 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></span>,
                            dan untuk menghapus data, klik ikon <span className="inline-flex items-center"><svg className="h-3 w-3 mx-1 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></span>.
                        </p>
                    </div>
                </div>
            </div>

            {/* Modal for Adding Balai */}
            {isAdding && (
                <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg w-full max-w-md mx-4 md:mx-auto shadow-xl">
                        <div className="flex justify-between items-center px-6 py-4 border-b">
                            <h4 className="text-lg font-semibold text-gray-800">Tambah Balai</h4>
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
                                    Nama Balai
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newBalai.name}
                                    onChange={handleNewBalaiChange('name')}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="code">
                                    Kode Balai
                                </label>
                                <input
                                    id="code"
                                    type="text"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newBalai.code}
                                    onChange={handleNewBalaiChange('code')}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="region">
                                    Wilayah
                                </label>
                                <select
                                    id="region"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition-colors"
                                onClick={() => setIsAdding(false)}
                            >
                                Batal
                            </button>
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
                                onClick={handleAddBalai}
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for Editing Balai */}
            {isEditing && editingBalai && (
                <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg w-full max-w-md mx-4 md:mx-auto shadow-xl">
                        <div className="flex justify-between items-center px-6 py-4 border-b">
                            <h4 className="text-lg font-semibold text-gray-800">Edit Balai</h4>
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditingBalai(null);
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
                                    Nama Balai
                                </label>
                                <input
                                    id="edit-name"
                                    type="text"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={editingBalai.name}
                                    onChange={handleEditBalaiChange('name')}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="edit-code">
                                    Kode Balai
                                </label>
                                <input
                                    id="edit-code"
                                    type="text"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={editingBalai.code}
                                    onChange={handleEditBalaiChange('code')}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="edit-region">
                                    Wilayah
                                </label>
                                <select
                                    id="edit-region"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition-colors"
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditingBalai(null);
                                }}
                            >
                                Batal
                            </button>
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
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