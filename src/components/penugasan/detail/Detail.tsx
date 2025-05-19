import React from 'react';
import useAuth from '@/context/auth';
import { SuratTugasTeamMemberData } from '@/interfaces';
import { getPenugasanDetail } from '@/services';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const columns = [
    { title: 'Tanggal Awal', field: 'startDate' },
    { title: 'Tanggal Akhir', field: 'endDate' },
    { title: 'Nama', field: 'name' },
    { title: 'Nomor Registrasi', field: 'registrationNumber' },
    { title: 'Instansi', field: 'organization' },
    { title: 'Posko', field: 'posko' },
    { title: 'Daops', field: 'daops' }
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

    useEffect(() => {
        const fetchData = async () => {
            if (!skNumber) return;

            const data = await getPenugasanDetail(skNumber);
            setTeamMembers(data);
            setLoading(false);
        };

        if (isAuthenticated) fetchData();
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

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="bg-gray-50 min-h-full p-6">
            <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-8 rounded-xl mb-8 shadow-md">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-3xl font-bold mb-2">Detail Surat Tugas</h1>
                    <p className="text-lg opacity-90">
                        Nomor Surat: {skNumber}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mb-8">
                {loading ? (
                    <div className="bg-white p-8 rounded-xl shadow flex justify-center items-center">
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-600">Memuat data anggota tim...</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <div className="p-4 border-b">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Daftar Anggota Tim
                                </h3>
                                <div className="relative">
                                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Cari anggota tim..."
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
                                        {columns.map((column) => (
                                            <th key={column.field} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {column.title}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {paginatedData.length > 0 ? (
                                        paginatedData.map((item, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{item.startDate}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{item.endDate}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{item.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{item.registrationNumber}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{item.organization}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{item.posko}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{item.daops}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                                                {searchTerm ? 'Tidak ada data yang sesuai dengan pencarian' : 'Tidak ada data anggota tim'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {filteredData.length > 0 && (
                            <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
                                <div className="text-sm text-gray-500 mb-2 sm:mb-0 flex items-center gap-2">
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

            <div className="max-w-7xl mx-auto p-6 bg-white rounded-xl shadow">
                <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Informasi Penggunaan</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Halaman ini menampilkan detail anggota tim yang termasuk dalam surat tugas {skNumber}.
                            Anda dapat mencari anggota spesifik menggunakan kolom pencarian di atas.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailPenugasan;