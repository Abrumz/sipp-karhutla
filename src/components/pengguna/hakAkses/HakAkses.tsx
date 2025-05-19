import React, { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useAuth from '@/context/auth';
import { NonPatroliUserData, UserData, KorwilData } from '@/interfaces';
import {
    addPatroliNonLoginUser,
    deleteNonPatroliUser,
    deletePatroliNonLoginUser,
    getAllBalai,
    getAllDaops,
    getNonPatroliRoles,
    getNonPatroliUsers,
    getKorwilUsers,
    getAllKorwilDistinct,
    getPatroliNonLoginRoles,
    getPatroliNonLoginUsers,
    updateNonPatroliUser,
    updatePatroliNonLoginUser
} from '@/services';

type RolesType = {
    [name: number]: string
    [key: string]: string
}

type LookupItemType = {
    [name: string]: string
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
                <p className="text-l text-gray-500 leading-relaxed">{description}</p>
            </div>
        </div>
    );
};

const generateRolesLookup = async () => {
    const daopsRoles: RolesType = {}
    const korwilRoles: RolesType = {}
    const balaiRoles: RolesType = {}
    const patroliNonLoginRoles: RolesType = {}
    const nonPatrolRoles = await getNonPatroliRoles()
    const patrolRoles = await getPatroliNonLoginRoles()
    nonPatrolRoles.forEach((role) => {
        if (role.level <= 3) {
            balaiRoles[role.id] = role.name
        } else if (role.level == 6 || role.level == 7) {
            daopsRoles[role.id] = role.name
        } else if (role.level == 5 || role.level == 4) {
            korwilRoles[role.id] = role.name
        }
    })
    patrolRoles.forEach((role) => {
        patroliNonLoginRoles[role.id] = role.name
    })
    return { daopsRoles, korwilRoles, balaiRoles, patroliNonLoginRoles }
}

const generateDaopsLookup = async () => {
    const daops = await getAllDaops()
    const data: LookupItemType = {}
    daops.forEach((item) => {
        data[item.code] = item.name
    })
    return data
}

const generateKorwilLookup = async () => {
    const korwils = await getAllKorwilDistinct()
    const data: LookupItemType = {}
    korwils.forEach((item) => {
        data[item.kode] = item.nama
    })
    return data
}

const generateBalaiLookup = async () => {
    const balai = await getAllBalai()
    const data: LookupItemType = {}
    balai.forEach((item) => {
        data[item.code] = item.name
    })
    data.KLHK = 'KLHK'
    return data
}

interface TableColumn {
    title: string;
    field: string;
    lookup?: LookupItemType | RolesType;
    editable?: 'always' | 'never' | 'onUpdate' | 'onAdd';
}

interface HakAksesProps { }

const HakAkses: React.FC<HakAksesProps> = () => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    const [daopsState, setDaopsState] = useState<NonPatroliUserData[]>([]);
    const [korwilState, setKorwilState] = useState<NonPatroliUserData[]>([]);
    const [balaiState, setBalaiState] = useState<NonPatroliUserData[]>([]);
    const [patroliNonLogin, setPatroliNonLogin] = useState<UserData[]>([]);

    const [daopsColumn, setDaopsColumn] = useState<TableColumn[]>([]);
    const [korwilColumn, setKorwilColumn] = useState<TableColumn[]>([]);
    const [balaiColumn, setBalaiColumn] = useState<TableColumn[]>([]);

    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState<'success' | 'info' | 'warning' | 'error'>('success');
    const [alertMessage, setAlertMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<NonPatroliUserData | null>(null);
    const [editFormData, setEditFormData] = useState<Partial<NonPatroliUserData>>({});
    const [daopsLookup, setDaopsLookup] = useState<LookupItemType>({});
    const [korwilLookup, setKorwilLookup] = useState<LookupItemType>({});
    const [balaiLookup, setBalaiLookup] = useState<LookupItemType>({});
    const [rolesLookup, setRolesLookup] = useState<{
        daopsRoles: RolesType;
        korwilRoles: RolesType;
        balaiRoles: RolesType;
        patroliNonLoginRoles: RolesType;
    }>({
        daopsRoles: {},
        korwilRoles: {},
        balaiRoles: {},
        patroliNonLoginRoles: {},
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const roles = await generateRolesLookup();
                const daopsLookupData = await generateDaopsLookup();
                const balaiLookupData = await generateBalaiLookup();
                const korwilLookupData = await generateKorwilLookup();

                setRolesLookup(roles);
                setDaopsLookup(daopsLookupData);
                setBalaiLookup(balaiLookupData);
                setKorwilLookup(korwilLookupData);

                const daopsColumns: TableColumn[] = [
                    { title: 'Nama', field: 'name', editable: 'never' },
                    { title: 'No Registrasi/NIP', field: 'registrationNumber', editable: 'never' },
                    { title: 'Email', field: 'email', editable: 'never' },
                    { title: 'Organisasi', field: 'organization', lookup: daopsLookupData },
                    { title: 'Hak Akses', field: 'role', lookup: roles.daopsRoles }
                ];

                const korwilColumns: TableColumn[] = [
                    { title: 'Nama', field: 'name', editable: 'never' },
                    { title: 'No Registrasi/NIP', field: 'registrationNumber', editable: 'never' },
                    { title: 'Email', field: 'email', editable: 'never' },
                    { title: 'Organisasi', field: 'organization', lookup: korwilLookupData },
                    { title: 'Hak Akses', field: 'role', lookup: roles.korwilRoles }
                ];

                const balaiColumns: TableColumn[] = [
                    { title: 'Nama', field: 'name', editable: 'never' },
                    { title: 'No Registrasi/NIP', field: 'registrationNumber', editable: 'never' },
                    { title: 'Email', field: 'email', editable: 'never' },
                    { title: 'Organisasi', field: 'organization', lookup: balaiLookupData },
                    { title: 'Hak Akses', field: 'role', lookup: roles.balaiRoles }
                ];

                setDaopsColumn(daopsColumns);
                setKorwilColumn(korwilColumns);
                setBalaiColumn(balaiColumns);

                const dataNonPatroli = await getNonPatroliUsers();
                const dataPatroliNonLogin = await getPatroliNonLoginUsers();

                setDaopsState(dataNonPatroli.daopsUsers);
                setKorwilState(dataNonPatroli.korwilUsers);
                setBalaiState(dataNonPatroli.balaiUsers);
                setPatroliNonLogin(dataPatroliNonLogin);
            } catch (error) {
                console.error("Error fetching data:", error);
                showAlertMessage(false, "Terjadi kesalahan saat memuat data");
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) fetchData();
    }, [isAuthenticated]);

    const showAlertMessage = (isSuccess: boolean, message: string) => {
        setAlertType(isSuccess ? 'success' : 'error');
        setAlertMessage(message);
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
        }, 3000);
    };

    const handleTabChange = (tabIndex: number) => {
        setActiveTab(tabIndex);
    };

    const handleUpdateDaopsUser = async (newData: NonPatroliUserData, oldData: NonPatroliUserData) => {
        try {
            const result = await updateNonPatroliUser(newData);
            if (result.success) {
                setDaopsState(prevState => {
                    const data = [...prevState];
                    const index = data.findIndex(item => item.id === oldData.id);
                    data[index] = newData;
                    return data;
                });
                showAlertMessage(true, 'Update hak akses daops berhasil');
                return true;
            } else {
                showAlertMessage(false, result.message as string);
                return false;
            }
        } catch (error) {
            console.error(error);
            showAlertMessage(false, 'Terjadi kesalahan saat memperbarui data');
            return false;
        }
    };

    const handleUpdateKorwilUser = async (newData: NonPatroliUserData, oldData: NonPatroliUserData) => {
        try {
            const result = await updateNonPatroliUser(newData);
            if (result.success) {
                setKorwilState(prevState => {
                    const data = [...prevState];
                    const index = data.findIndex(item => item.id === oldData.id);
                    data[index] = newData;
                    return data;
                });
                showAlertMessage(true, 'Update hak akses korwil berhasil');
                return true;
            } else {
                showAlertMessage(false, result.message as string);
                return false;
            }
        } catch (error) {
            console.error(error);
            showAlertMessage(false, 'Terjadi kesalahan saat memperbarui data');
            return false;
        }
    };

    const handleUpdateBalaiUser = async (newData: NonPatroliUserData, oldData: NonPatroliUserData) => {
        try {
            const result = await updateNonPatroliUser(newData);
            if (result.success) {
                setBalaiState(prevState => {
                    const data = [...prevState];
                    const index = data.findIndex(item => item.id === oldData.id);
                    data[index] = newData;
                    return data;
                });
                showAlertMessage(true, 'Update hak akses balai/pusat berhasil');
                return true;
            } else {
                showAlertMessage(false, result.message as string);
                return false;
            }
        } catch (error) {
            console.error(error);
            showAlertMessage(false, 'Terjadi kesalahan saat memperbarui data');
            return false;
        }
    };

    const handleDeleteDaopsUser = async (userData: NonPatroliUserData) => {
        try {
            const result = await deleteNonPatroliUser(userData);
            if (result.success) {
                setDaopsState(prevState => {
                    return prevState.filter(item => item.id !== userData.id);
                });
                showAlertMessage(true, 'Hapus hak akses daops berhasil');
                return true;
            } else {
                showAlertMessage(false, result.message as string);
                return false;
            }
        } catch (error) {
            console.error(error);
            showAlertMessage(false, 'Terjadi kesalahan saat menghapus data');
            return false;
        }
    };

    const handleDeleteKorwilUser = async (userData: NonPatroliUserData) => {
        try {
            const result = await deleteNonPatroliUser(userData);
            if (result.success) {
                setKorwilState(prevState => {
                    return prevState.filter(item => item.id !== userData.id);
                });
                showAlertMessage(true, 'Hapus hak akses korwil berhasil');
                return true;
            } else {
                showAlertMessage(false, result.message as string);
                return false;
            }
        } catch (error) {
            console.error(error);
            showAlertMessage(false, 'Terjadi kesalahan saat menghapus data');
            return false;
        }
    };

    const handleDeleteBalaiUser = async (userData: NonPatroliUserData) => {
        try {
            const result = await deleteNonPatroliUser(userData);
            if (result.success) {
                setBalaiState(prevState => {
                    return prevState.filter(item => item.id !== userData.id);
                });
                showAlertMessage(true, 'Hapus hak akses balai/pusat berhasil');
                return true;
            } else {
                showAlertMessage(false, result.message as string);
                return false;
            }
        } catch (error) {
            console.error(error);
            showAlertMessage(false, 'Terjadi kesalahan saat menghapus data');
            return false;
        }
    };

    const openEditModal = (item: NonPatroliUserData) => {
        setEditingItem(item);
        setEditFormData({ ...item });
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingItem(null);
        setEditFormData({});
    };

    const handleEditSubmit = async () => {
        if (!editingItem || !editFormData) return;

        const newData = { ...editingItem, ...editFormData };
        let success = false;

        switch (activeTab) {
            case 0:
                success = await handleUpdateDaopsUser(newData as NonPatroliUserData, editingItem);
                break;
            case 1:
                success = await handleUpdateKorwilUser(newData as NonPatroliUserData, editingItem);
                break;
            case 2:
                success = await handleUpdateBalaiUser(newData as NonPatroliUserData, editingItem);
                break;
        }

        if (success) {
            closeEditModal();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const getFilteredData = (data: any[], searchTerm: string) => {
        if (!searchTerm) return data;

        return data.filter(item => {
            const searchLower = searchTerm.toLowerCase();
            return (
                (item.name && item.name.toLowerCase().includes(searchLower)) ||
                (item.registrationNumber && item.registrationNumber.toLowerCase().includes(searchLower)) ||
                (item.email && item.email.toLowerCase().includes(searchLower)) ||
                (item.organization && item.organization.toLowerCase().includes(searchLower))
            );
        });
    };

    const getCurrentTabData = () => {
        switch (activeTab) {
            case 0:
                return getFilteredData(daopsState, searchTerm);
            case 1:
                return getFilteredData(korwilState, searchTerm);
            case 2:
                return getFilteredData(balaiState, searchTerm);
            default:
                return [];
        }
    };

    const filteredData = getCurrentTabData();
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

    const getCurrentColumns = () => {
        switch (activeTab) {
            case 0:
                return daopsColumn;
            case 1:
                return korwilColumn;
            case 2:
                return balaiColumn;
            default:
                return [];
        }
    };

    const getCurrentLookup = () => {
        switch (activeTab) {
            case 0:
                return { organization: daopsLookup, role: rolesLookup.daopsRoles };
            case 1:
                return { organization: korwilLookup, role: rolesLookup.korwilRoles };
            case 2:
                return { organization: balaiLookup, role: rolesLookup.balaiRoles };
            default:
                return { organization: {}, role: {} };
        }
    };

    const handleUpdate = (newData: NonPatroliUserData, oldData: NonPatroliUserData) => {
        switch (activeTab) {
            case 0:
                return handleUpdateDaopsUser(newData, oldData);
            case 1:
                return handleUpdateKorwilUser(newData, oldData);
            case 2:
                return handleUpdateBalaiUser(newData, oldData);
            default:
                return Promise.resolve(false);
        }
    };

    const handleDelete = (userData: NonPatroliUserData) => {
        switch (activeTab) {
            case 0:
                return handleDeleteDaopsUser(userData);
            case 1:
                return handleDeleteKorwilUser(userData);
            case 2:
                return handleDeleteBalaiUser(userData);
            default:
                return Promise.resolve(false);
        }
    };

    const tabTitles = ['Daops', 'Korwil', 'Balai/Pusat'];

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
                        className="ml-4 text-gray-500 hover:text-gray-700"
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
                            <h3 className="text-lg font-semibold text-gray-800">Edit Hak Akses</h3>
                            <button
                                onClick={closeEditModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>

                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                                <input
                                    type="text"
                                    value={editingItem.name}
                                    disabled
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-gray-100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">No Registrasi/NIP</label>
                                <input
                                    type="text"
                                    value={editingItem.registrationNumber}
                                    disabled
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-gray-100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={editingItem.email}
                                    disabled
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-gray-100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Organisasi</label>
                                <select
                                    name="organization"
                                    value={editFormData.organization || editingItem.organization}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700"
                                >
                                    {Object.entries(getCurrentLookup().organization).map(([key, value]) => (
                                        <option key={key} value={key}>{value}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Hak Akses</label>
                                <select
                                    name="role"
                                    value={editFormData.role || editingItem.role}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700"
                                >
                                    {Object.entries(getCurrentLookup().role).map(([key, value]) => (
                                        <option key={key} value={key}>{value}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end space-x-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
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

            <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-8 rounded-xl mb-8 shadow-md">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-3xl font-bold mb-2">Manajemen Hak Akses</h1>
                    <p className="text-lg opacity-90">
                        Kelola hak akses pengguna berdasarkan kategori dan tingkat otoritas dalam sistem
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 max-w-7xl mx-auto">
                <InfoCard
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                    }
                    title="Akses Daerah Operasi"
                    description="Kelola hak akses pengguna tingkat Daops sesuai dengan wilayah operasional"
                    color="blue"
                />
                <InfoCard
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                    }
                    title="Akses Koordinator Wilayah"
                    description="Atur tingkat akses untuk koordinator wilayah yang mengelola beberapa Daops"
                    color="indigo"
                />
                <InfoCard
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                        </svg>
                    }
                    title="Akses Balai dan Pusat"
                    description="Kelola hak akses tingkat tinggi untuk administrator balai dan pusat"
                    color="purple"
                />
            </div>

            <div className="max-w-7xl mx-auto mb-8">
                {loading ? (
                    <div className="bg-white p-8 rounded-xl shadow flex justify-center items-center">
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-600">Memuat data hak akses...</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <div className="border-b border-gray-200">
                            <div className="flex flex-wrap -mb-px">
                                {tabTitles.map((title, index) => (
                                    <button
                                        key={index}
                                        className={`inline-block py-4 px-6 font-medium text-center border-b-2 text-sm ${activeTab === index
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                        onClick={() => handleTabChange(index)}
                                    >
                                        {title}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 border-b">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Hak Akses {tabTitles[activeTab]}
                                </h3>
                                <div className="relative">
                                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder={`Cari ${tabTitles[activeTab]}...`}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2 w-full md:w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {getCurrentColumns().map((column, index) => (
                                            <th key={index} scope="col" className="px-6 py-3 text-left text-l font-medium text-gray-500 uppercase tracking-wider">
                                                {column.title}
                                            </th>
                                        ))}
                                        <th scope="col" className="px-6 py-3 text-right text-l font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {paginatedData.length > 0 ? (
                                        paginatedData.map((item, index) => (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                {getCurrentColumns().map((column, colIndex) => (
                                                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-l text-gray-800">
                                                        {column.lookup && column.field in item
                                                            ? column.lookup[item[column.field as keyof typeof item] as string] || item[column.field as keyof typeof item] || '-'
                                                            : item[column.field as keyof typeof item] || '-'}
                                                    </td>
                                                ))}
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-l font-medium">
                                                    <div className="flex justify-end items-center space-x-2">
                                                        <button
                                                            onClick={() => openEditModal(item)}
                                                            className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-md transition-colors"
                                                            title="Edit Hak Akses"
                                                        >
                                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                if (window.confirm('Yakin hapus data ini ?')) {
                                                                    handleDelete(item);
                                                                }
                                                            }}
                                                            className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors"
                                                            title="Hapus Hak Akses"
                                                        >
                                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={getCurrentColumns().length + 1} className="px-6 py-4 text-center text-l text-gray-500">
                                                {searchTerm ? 'Tidak ada data yang sesuai dengan pencarian' : `Tidak ada data ${tabTitles[activeTab]}`}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {filteredData.length > 0 && (
                            <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
                                <div className="text-l text-gray-500 mb-2 sm:mb-0 flex items-center gap-2">
                                    <span>Menampilkan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} dari {filteredData.length} data</span>
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
                                            <option value="50">50</option>
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
                            Halaman ini menampilkan seluruh hak akses pengguna yang terdaftar dalam sistem berdasarkan kategori.
                            Anda dapat mencari pengguna spesifik menggunakan kolom pencarian.
                            Untuk mengedit data hak akses, klik ikon <span className="inline-flex items-center"><svg className="h-3 w-3 mx-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></span>,
                            dan untuk menghapus data, klik ikon <span className="inline-flex items-center"><svg className="h-3 w-3 mx-1 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></span>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HakAkses;