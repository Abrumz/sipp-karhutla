import React, { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useAuth from '@/context/auth';
import { BalaiData, DaopsData, RoleData, UserData } from '@/interfaces';
import {
    addNonPatroliUser,
    deleteUser,
    getAllBalai,
    getAllDaops,
    getAllUsers,
    getNonPatroliRoles
} from '@/services';
import { isBalaiRole, isDaopsRole, isPusatRole } from '@/utils';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const columns = [
    { title: 'Nama', field: 'name' },
    { title: 'No Registrasi/NIP', field: 'registrationNumber' },
    { title: 'Email', field: 'email' },
    { title: 'Nomor HP', field: 'phoneNumber' }
];

interface DataPenggunaProps {
    alertQuery?: string;
}

const DataPengguna: React.FC<DataPenggunaProps> = ({ alertQuery }) => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    const [roleType, setRoleType] = useState('pusat');
    const [openModal, setOpenModal] = useState(false);
    const [modalUser, setModalUser] = useState({
        id: '',
        name: '',
        email: '',
        role: '',
        organization: ''
    });
    const [daops, setDaops] = useState<DaopsData[]>([]);
    const [balai, setBalai] = useState<BalaiData[]>([]);
    const [roles, setRoles] = useState<RoleData[]>([]);
    const [users, setUsers] = useState<UserData[]>([]);
    const [showAlert, setShowAlert] = useState(false);
    const [loading, setLoading] = useState(true);
    const [alertType, setAlertType] = useState<'success' | 'info' | 'warning' | 'error'>('success');
    const [alertMessage, setAlertMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const handleRoleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        if (isPusatRole(parseInt(event.target.value, 10))) {
            setRoleType('pusat');
            setModalUser({
                ...modalUser,
                role: event.target.value,
                organization: 'KLHK'
            });
        } else {
            if (isBalaiRole(parseInt(event.target.value, 10))) {
                setRoleType('balai');
            } else if (isDaopsRole(parseInt(event.target.value, 10))) {
                setRoleType('daops');
            }
            setModalUser({
                ...modalUser,
                role: event.target.value,
                organization: ''
            });
        }
    };

    const handleChange = (prop: string) => (
        event: ChangeEvent<HTMLSelectElement | HTMLInputElement>
    ) => {
        setModalUser({ ...modalUser, [prop]: event.target.value });
    };

    const handleFormSubmit = async () => {
        const result = await addNonPatroliUser(modalUser);
        if (result.success) {
            setAlertType('success');
            setAlertMessage('Tambah hak akses pengguna berhasil');
            setShowAlert(true);
        } else {
            setAlertType('error');
            setAlertMessage(result.message as string);
            setShowAlert(true);
        }
        setOpenModal(false);
        setModalUser({
            id: '',
            name: '',
            email: '',
            role: '',
            organization: ''
        });
        setRoleType('pusat');
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const roles = await getNonPatroliRoles();
                const daops = await getAllDaops();
                const balai = await getAllBalai();
                setRoles(roles);
                setDaops(daops);
                setBalai(balai);

                console.log(roles);

                const data = await getAllUsers();
                setUsers(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        if (alertQuery) {
            setAlertMessage(alertQuery as string);
            setShowAlert(true);
            setAlertType('success');
        }
        if (isAuthenticated) fetchData();
    }, [isAuthenticated, alertQuery]);

    const handleDeleteUser = async (userData: UserData) => {
        try {
            const result = await deleteUser(userData);
            if (result && result.success) {
                const dataDelete = [...users];
                const index = users.findIndex(user => user.id === userData.id);
                dataDelete.splice(index, 1);
                setUsers(dataDelete);
                setAlertType('success');
                setAlertMessage('Hapus data pengguna berhasil');
                setShowAlert(true);
                return result;
            } else if (result) {
                setAlertType('error');
                setAlertMessage(result.message as string);
                setShowAlert(true);
                return result;
            } else {
                setAlertType('error');
                setAlertMessage('Terjadi kesalahan saat menghapus data');
                setShowAlert(true);
                return { success: false };
            }
        } catch (error) {
            console.error(error);
            setAlertType('error');
            setAlertMessage('Terjadi kesalahan saat menghapus data');
            setShowAlert(true);
            return { success: false };
        }
    };

    const filteredData = users.filter(user => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (user.name && user.name.toLowerCase().includes(searchLower)) ||
            (user.registrationNumber && user.registrationNumber.toLowerCase().includes(searchLower)) ||
            (user.email && user.email.toLowerCase().includes(searchLower)) ||
            (user.phoneNumber && user.phoneNumber.toLowerCase().includes(searchLower))
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

            <div className="header-primary text-white p-8 rounded-xl mb-8 shadow-md">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-3xl font-bold mb-2">Manajemen Data Pengguna</h1>
                    <p className="text-lg opacity-90">
                        Kelola data pengguna sistem dan atur hak akses sesuai dengan peran
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6 bg-white rounded-xl shadow mb-8">
                <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div>
                        <h3 className="font-semibold text-black-800 mb-2">Informasi Penggunaan</h3>
                        <p className="text-l text-black-600 leading-relaxed">
                            Halaman ini menampilkan seluruh pengguna yang terdaftar dalam sistem.
                            Anda dapat mencari pengguna spesifik menggunakan kolom pencarian.
                            Untuk mengedit data pengguna, klik ikon <span className="inline-flex items-center"><svg className="h-3 w-3 mx-1 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></span>,
                            untuk menambah hak akses, klik ikon <span className="inline-flex items-center"><svg className="h-3 w-3 mx-1 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg></span>,
                            dan untuk menghapus data, klik ikon <span className="inline-flex items-center"><svg className="h-3 w-3 mx-1 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></span>.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mb-8">
                {loading ? (
                    <div className="bg-white p-8 rounded-xl shadow flex justify-center items-center">
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 border-4 border-t-green-500 border-green-200 rounded-full animate-spin mb-4"></div>
                            <p className="text-black-600">Memuat data pengguna...</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <div className="p-4 border-b">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <h3 className="text-lg font-semibold text-black-800">Daftar Pengguna</h3>
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                        </svg>
                                        <input
                                            type="text"
                                            placeholder="Cari pengguna..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 pr-4 py-2 w-full md:w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            router.push('/pengguna/tambah');
                                        }}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                        </svg>
                                        Tambah Pengguna
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {columns.map((column, index) => (
                                            <th key={index} scope="col" className="px-6 py-3 text-left text-l font-medium text-black-500 uppercase tracking-wider">
                                                {column.title}
                                            </th>
                                        ))}
                                        <th scope="col" className="px-6 py-3 text-right text-l font-medium text-black-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {paginatedData.length > 0 ? (
                                        paginatedData.map((user, index) => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-l text-black-800">{user.name || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-l text-black-800">{user.registrationNumber || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-l text-black-800">{user.email || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-l text-black-800">{user.phoneNumber || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-l font-medium">
                                                    <div className="flex justify-end items-center space-x-2">
                                                        <button
                                                            onClick={() => router.push(`/pengguna/ubah/${user.id}`)}
                                                            className="p-1.5 text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50 rounded-md transition-colors"
                                                            title="Ubah Data Pengguna"
                                                        >
                                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setModalUser({
                                                                    ...modalUser,
                                                                    id: user.id.toString(),
                                                                    name: user.name,
                                                                    email: user.email
                                                                });
                                                                setOpenModal(true);
                                                            }}
                                                            className="p-1.5 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-md transition-colors"
                                                            title="Tambah Hak Akses Pengguna"
                                                        >
                                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                Swal.fire({
                                                                    title: 'Konfirmasi',
                                                                    text: 'Yakin akan menghapus data ini? ',
                                                                    icon: 'warning',
                                                                    showCancelButton: true,
                                                                    confirmButtonColor: '#10b981',
                                                                    cancelButtonColor: '#ef4444',
                                                                    confirmButtonText: 'Ya, hapus!',
                                                                    cancelButtonText: 'Batal',
                                                                    customClass: {
                                                                        confirmButton: 'swal2-confirm bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded mr-2',
                                                                        cancelButton: 'swal2-cancel bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded'
                                                                    },
                                                                    buttonsStyling: false
                                                                }).then(async (result) => {
                                                                    if (result.isConfirmed) {
                                                                        const response = await handleDeleteUser(user);
                                                                        if (response && response.success) {
                                                                            Swal.fire({
                                                                                title: 'Berhasil!',
                                                                                text: 'Data berhasil dihapus',
                                                                                icon: 'success',
                                                                                confirmButtonColor: '#10b981',
                                                                                confirmButtonText: 'OK',
                                                                                customClass: {
                                                                                    confirmButton: 'swal2-confirm bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded'
                                                                                },
                                                                                buttonsStyling: false
                                                                            });
                                                                        }
                                                                    }
                                                                });
                                                            }}
                                                            className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors"
                                                            title="Hapus Data Pengguna"
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
                                            <td colSpan={5} className="px-6 py-4 text-center text-l text-black-500">
                                                {searchTerm ? 'Tidak ada data yang sesuai dengan pencarian' : 'Tidak ada data pengguna'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {filteredData.length > 0 && (
                            <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
                                <div className="text-l text-black-500 mb-2 sm:mb-0 flex items-center gap-2">
                                    <span>Menampilkan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} dari {filteredData.length} pengguna</span>
                                    <div className="flex items-center ml-4">
                                        <span className="text-black-600 mr-2">Tampilkan:</span>
                                        <select
                                            value={itemsPerPage}
                                            onChange={handleItemsPerPageChange}
                                            className="border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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

            {openModal && (
                <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg w-full max-w-md mx-4 md:mx-auto shadow-xl">
                        <div className="flex justify-between items-center px-6 py-4 border-b">
                            <h4 className="text-lg font-semibold text-black-800">Tambah Hak Akses</h4>
                            <button
                                className="text-black-500 hover:text-black-700"
                                onClick={() => setOpenModal(false)}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>

                        <div className="px-6 py-4">
                            <div className="mb-4">
                                <label className="block text-black-700 text-sm font-bold mb-2 text-left" htmlFor="name">
                                    Nama
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    disabled
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-black-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                                    value={modalUser.name}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-black-700 text-sm font-bold mb-2 text-left" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    disabled
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-black-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                                    value={modalUser.email}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-black-700 text-sm font-bold mb-2 text-left" htmlFor="role">
                                    Hak Akses
                                </label>
                                <select
                                    id="role"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-black-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
                                    value={modalUser.role}
                                    onChange={handleRoleChange}
                                    required
                                >
                                    <option value="">Pilih Hak Akses</option>
                                    {roles.map((role) => (
                                        <option key={role.level} value={role.id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {roleType === 'pusat' ? null : roleType === 'balai' ? (
                                <div className="mb-4">
                                    <label className="block text-black-700 text-sm font-bold mb-2 text-left" htmlFor="balai">
                                        Balai
                                    </label>
                                    <select
                                        id="balai"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-black-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                                        value={modalUser.organization}
                                        onChange={handleChange('organization')}
                                        disabled
                                        required
                                    >
                                        <option value="">Pilih Balai</option>
                                        {balai.map((b) => (
                                            <option key={b.id} value={b.code}>
                                                {b.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                <div className="mb-4">
                                    <label className="block text-black-700 text-sm font-bold mb-2 text-left" htmlFor="daops">
                                        Daerah Operasi
                                    </label>
                                    <select
                                        id="daops"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-black-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                                        value={modalUser.organization}
                                        onChange={handleChange('organization')}
                                        disabled
                                        required
                                    >
                                        <option value="">Pilih Daerah Operasi</option>
                                        {daops.map((d) => (
                                            <option key={d.id} value={d.code}>
                                                {d.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        <div className="px-6 py-4 border-t text-center flex justify-center space-x-4">
                            <button
                                className="bg-gray-300 hover:bg-gray-400 text-black-800 font-bold py-2 px-4 rounded transition-colors"
                                onClick={() => setOpenModal(false)}
                            >
                                Batal
                            </button>
                            <button
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
                                onClick={handleFormSubmit}
                            >
                                Tambah Hak Akses
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataPengguna;