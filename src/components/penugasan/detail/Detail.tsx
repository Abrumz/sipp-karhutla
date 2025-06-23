import React, { useEffect, useState } from 'react';
import useAuth from '@/context/auth';
import { SuratTugasTeamMemberData } from '@/interfaces';
import { getPenugasanDetail } from '@/services';
import { useRouter } from 'next/router';
import EditPenugasan from './Edit';
import TambahPenugasan from './Tambah';

const columns = [
    { title: 'Tanggal Awal', field: 'startDate', responsive: 'md' },
    { title: 'Tanggal Akhir', field: 'endDate', responsive: 'md' },
    { title: 'Nama', field: 'name', responsive: 'all' },
    { title: 'Nomor Registrasi', field: 'registrationNumber', responsive: 'lg' },
    { title: 'Instansi', field: 'organization', responsive: 'lg' },
    { title: 'Posko', field: 'posko', responsive: 'sm' },
    { title: 'Daops', field: 'daops', responsive: 'md' },
    { title: 'Aksi', field: 'actions', responsive: 'all' }
];

interface DetailPenugasanProps {
    noSK?: string;
}

const DetailPenugasan: React.FC<DetailPenugasanProps> = ({ noSK }) => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const skNumber = noSK || (router.query.noSK as string);
    const [teamMembers, setTeamMembers] = useState<SuratTugasTeamMemberData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingMember, setEditingMember] = useState<SuratTugasTeamMemberData | null>(null);
    const [showTambahModal, setShowTambahModal] = useState(false);
    const [screenSize, setScreenSize] = useState('all');

    // Deteksi ukuran layar
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 640) {
                setScreenSize('l');
            } else if (width < 768) {
                setScreenSize('sm');
            } else if (width < 1024) {
                setScreenSize('md');
            } else {
                setScreenSize('lg');
            }
        };

        handleResize(); // Panggil sekali saat komponen dimuat
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Fungsi untuk menentukan apakah kolom harus ditampilkan berdasarkan ukuran layar
    const isColumnVisible = (responsiveBreakpoint: string) => {
        if (responsiveBreakpoint === 'all') return true;
        if (responsiveBreakpoint === 'sm' && ['sm', 'md', 'lg'].includes(screenSize)) return true;
        if (responsiveBreakpoint === 'md' && ['md', 'lg'].includes(screenSize)) return true;
        if (responsiveBreakpoint === 'lg' && screenSize === 'lg') return true;
        return false;
    };

    // Fungsi untuk refresh data
    const refreshData = async () => {
        if (!skNumber) return;
        setLoading(true);
        try {
            const data = await getPenugasanDetail(skNumber);
            setTeamMembers(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated && skNumber) {
            refreshData();
        }
    }, [isAuthenticated, skNumber]);

    const getFilteredData = (data: SuratTugasTeamMemberData[], searchTerm: string) => {
        if (!searchTerm) return data;

        return data.filter(item => {
            const searchLower = searchTerm.toLowerCase();
            return (
                (item.name && item.name.toLowerCase().includes(searchLower)) ||
                (item.registrationNumber && item.registrationNumber.toLowerCase().includes(searchLower)) ||
                (item.organization && item.organization.toLowerCase().includes(searchLower)) ||
                (item.posko && item.posko.toLowerCase().includes(searchLower)) ||
                (item.daops && item.daops.toLowerCase().includes(searchLower))
            );
        });
    };

    const filteredData = getFilteredData(teamMembers, searchTerm);
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

    const handleEditClick = (member: SuratTugasTeamMemberData) => {
        setEditingMember(member);
        setShowEditModal(true);
    };

    const handleTambahClick = () => {
        setShowTambahModal(true);
    };

    // Handler untuk modal Edit success
    const handleEditSuccess = () => {
        setShowEditModal(false);
        setEditingMember(null);
        refreshData();
    };

    // Handler untuk modal Tambah success
    const handleTambahSuccess = () => {
        setShowTambahModal(false);
        refreshData();
    };

    // Fungsi untuk menampilkan informasi detail pada tampilan mobile
    const renderMobileCard = (item: SuratTugasTeamMemberData, index: number) => {
        return (
            <div key={index} className="bg-white p-4 rounded-lg shadow mb-4 border border-gray-200">
                <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg truncate pr-2">{item.name || 'N/A'}</h3>
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md text-l flex-shrink-0"
                        onClick={() => handleEditClick(item)}
                    >
                        Edit
                    </button>
                </div>
                <div className="mt-3 space-y-2">
                    {item.registrationNumber && (
                        <div className="flex flex-col">
                            <span className="text-l text-gray-500">Nomor Registrasi</span>
                            <span className="text-l truncate">{item.registrationNumber}</span>
                        </div>
                    )}
                    {item.organization && (
                        <div className="flex flex-col">
                            <span className="text-l text-gray-500">Instansi</span>
                            <span className="text-l truncate">{item.organization}</span>
                        </div>
                    )}
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                        {item.startDate && (
                            <div className="flex flex-col mb-2 sm:mb-0 sm:w-1/2 sm:pr-2">
                                <span className="text-l text-gray-500">Tanggal Awal</span>
                                <span className="text-l truncate">{item.startDate}</span>
                            </div>
                        )}
                        {item.endDate && (
                            <div className="flex flex-col sm:w-1/2">
                                <span className="text-l text-gray-500">Tanggal Akhir</span>
                                <span className="text-l truncate">{item.endDate}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                        {item.posko && (
                            <div className="flex flex-col mb-2 sm:mb-0 sm:w-1/2 sm:pr-2">
                                <span className="text-l text-gray-500">Posko</span>
                                <span className="text-l truncate">{item.posko}</span>
                            </div>
                        )}
                        {item.daops && (
                            <div className="flex flex-col sm:w-1/2">
                                <span className="text-l text-gray-500">Daops</span>
                                <span className="text-l truncate">{item.daops}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="bg-gray-50 min-h-full p-3 sm:p-6">
            <div className="header-primary text-white p-4 sm:p-8 rounded-xl mb-6 sm:mb-8 shadow-md">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-xl sm:text-3xl font-bold mb-2">Detail Surat Tugas</h1>
                    <p className="text-base sm:text-lg opacity-90 break-all">
                        Nomor Surat: {skNumber || 'N/A'}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow mb-6 sm:mb-8">
                <div className="flex items-start gap-2 sm:gap-3">
                    <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div className="w-full">
                        <h3 className="font-semibold text-black-800 mb-1 sm:mb-2">Informasi Penggunaan</h3>
                        <p className="text-l sm:text-l text-black-600 leading-relaxed">
                            Halaman ini menampilkan detail anggota tim yang termasuk dalam surat tugas:
                        </p>
                        <div className="mt-1 mb-1 p-2 bg-gray-50 rounded-md overflow-hidden">
                            <p className="text-l sm:text-l text-black-800 font-medium break-words">
                                {skNumber || 'N/A'}
                            </p>
                        </div>
                        <p className="text-l sm:text-l text-black-600 leading-relaxed">
                            Anda dapat mencari anggota spesifik menggunakan kolom pencarian di atas.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mb-6 sm:mb-8">
                {loading ? (
                    <div className="bg-white p-4 sm:p-8 rounded-xl shadow flex justify-center items-center">
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mb-3 sm:mb-4"></div>
                            <p className="text-black-600 text-l sm:text-base">Memuat data anggota tim...</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <div className="p-4 border-b">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
                                <h3 className="text-base sm:text-lg font-semibold text-black-800">
                                    Daftar Anggota Tim
                                </h3>
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                    {/* Search Input */}
                                    <div className="relative w-full sm:w-auto">
                                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                        </svg>
                                        <input
                                            type="text"
                                            placeholder="Cari anggota tim..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    {/* Tambah Tim Button */}
                                    <button
                                        onClick={handleTambahClick}
                                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-l font-medium flex items-center justify-center gap-2 transition-colors duration-200 flex-shrink-0"
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                        </svg>
                                        <span className="hidden sm:inline">Tambah Tim</span>
                                        <span className="sm:hidden">Tambah</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Tampilan tabel untuk layar medium ke atas */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {columns.map((column) => (
                                            isColumnVisible(column.responsive) && (
                                                <th key={column.field} scope="col" className="px-6 py-3 text-left text-l font-medium text-black-500 uppercase tracking-wider">
                                                    {column.title}
                                                </th>
                                            )
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {paginatedData.length > 0 ? (
                                        paginatedData.map((item, index) => (
                                            <tr key={`${item.registrationNumber || ''}-${index}`} className="hover:bg-gray-50">
                                                {isColumnVisible('md') && <td className="px-6 py-4 whitespace-nowrap text-l text-black-800">{item.startDate || 'N/A'}</td>}
                                                {isColumnVisible('md') && <td className="px-6 py-4 whitespace-nowrap text-l text-black-800">{item.endDate || 'N/A'}</td>}
                                                <td className="px-6 py-4 whitespace-nowrap text-l text-black-800">{item.name || 'N/A'}</td>
                                                {isColumnVisible('lg') && <td className="px-6 py-4 whitespace-nowrap text-l text-black-800">{item.registrationNumber || 'N/A'}</td>}
                                                {isColumnVisible('lg') && <td className="px-6 py-4 whitespace-nowrap text-l text-black-800">{item.organization || 'N/A'}</td>}
                                                {isColumnVisible('sm') && <td className="px-6 py-4 whitespace-nowrap text-l text-black-800">{item.posko || 'N/A'}</td>}
                                                {isColumnVisible('md') && <td className="px-6 py-4 whitespace-nowrap text-l text-black-800">{item.daops || 'N/A'}</td>}
                                                <td className="px-6 py-4 whitespace-nowrap text-l text-black-800">
                                                    <button
                                                        className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md text-l"
                                                        onClick={() => handleEditClick(item)}
                                                    >
                                                        Edit
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={columns.filter(col => isColumnVisible(col.responsive)).length} className="px-6 py-4 text-center text-l text-black-500">
                                                {searchTerm ? 'Tidak ada data yang sesuai dengan pencarian' : 'Tidak ada data anggota tim'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Tampilan card untuk layar kecil */}
                        <div className="md:hidden">
                            {paginatedData.length > 0 ? (
                                <div className="p-4 space-y-4">
                                    {paginatedData.map((item, index) => renderMobileCard(item, index))}
                                </div>
                            ) : (
                                <div className="p-4 text-center text-l text-black-500">
                                    {searchTerm ? 'Tidak ada data yang sesuai dengan pencarian' : 'Tidak ada data anggota tim'}
                                </div>
                            )}
                        </div>

                        {filteredData.length > 0 && (
                            <div className="px-4 py-3 sm:px-6 sm:py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3">
                                <div className="text-l sm:text-l text-black-500 flex flex-col sm:flex-row items-center gap-2">
                                    <span>Menampilkan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} dari {filteredData.length} data</span>
                                    <div className="flex items-center sm:ml-4 mt-2 sm:mt-0">
                                        <span className="text-black-600 mr-2">Tampilkan:</span>
                                        <select
                                            value={itemsPerPage}
                                            onChange={handleItemsPerPageChange}
                                            className="border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-l"
                                        >
                                            <option value="5">5</option>
                                            <option value="10">10</option>
                                            <option value="15">15</option>
                                            <option value="20">20</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={handlePrevPage}
                                        disabled={currentPage === 1}
                                        className="p-1.5 sm:p-2 rounded-md border border-gray-300 bg-white text-black-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                        </svg>
                                    </button>
                                    <div className="flex items-center text-l sm:text-l">
                                        <span className="px-2 py-0.5 sm:px-3 sm:py-1 text-black-700 bg-gray-100 rounded-md">
                                            {currentPage}
                                        </span>
                                        <span className="mx-1 sm:mx-2 text-black-600">dari</span>
                                        <span className="px-2 py-0.5 sm:px-3 sm:py-1 text-black-700 bg-gray-100 rounded-md">
                                            {totalPages || 1}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages || totalPages === 0}
                                        className="p-1.5 sm:p-2 rounded-md border border-gray-300 bg-white text-black-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal Edit */}
            {showEditModal && editingMember && (
                <EditPenugasan
                    member={editingMember}
                    skNumber={skNumber}
                    onClose={() => {
                        setShowEditModal(false);
                        setEditingMember(null);
                    }}
                    onSuccess={handleEditSuccess}
                />
            )}

            {/* Modal Tambah */}
            {showTambahModal && (
                <TambahPenugasan
                    skNumber={skNumber}
                    onClose={() => setShowTambahModal(false)}
                    onSuccess={handleTambahSuccess} idDaops={''} idSuratTugas={''} />
            )}
        </div>
    );
};

export default DetailPenugasan;