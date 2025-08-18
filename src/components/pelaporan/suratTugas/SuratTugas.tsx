import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useAuth, { ProtectRoute } from '@/context/auth';
import Loader from '@/components/loader/Loader';
import { getAllPenugasan } from '@/services';
import { CloudDownload, ExternalLink, Search, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import Swal from 'sweetalert2';

interface SuratTugasData {
    id: string;
    type: string;
    number: string;
    startDate: string;
    finishDate: string;
    reportLink: string;
}

const SuratTugasTable: React.FC<{
    data: SuratTugasData[];
    onDetail: (suratTugas: SuratTugasData) => void;
    onDownload: (suratTugas: SuratTugasData) => void;
}> = ({ data, onDetail, onDownload }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const filteredData = data.filter(item => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (item.type && item.type.toLowerCase().includes(searchLower)) ||
            (item.number && item.number.toLowerCase().includes(searchLower)) ||
            (item.startDate && item.startDate.toLowerCase().includes(searchLower)) ||
            (item.finishDate && item.finishDate.toLowerCase().includes(searchLower))
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

    return (
        <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="p-4 border-b">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="text-lg font-semibold text-black-800">Daftar Surat Tugas</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black-400" />
                        <input
                            type="text"
                            placeholder="Cari surat tugas..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full md:w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-l font-medium text-black-500 uppercase tracking-wider">Jenis Patroli</th>
                            <th scope="col" className="px-6 py-3 text-left text-l font-medium text-black-500 uppercase tracking-wider">Nomor Surat Tugas</th>
                            <th scope="col" className="px-6 py-3 text-left text-l font-medium text-black-500 uppercase tracking-wider">Tanggal Mulai</th>
                            <th scope="col" className="px-6 py-3 text-left text-l font-medium text-black-500 uppercase tracking-wider">Tanggal Selesai</th>
                            <th scope="col" className="px-6 py-3 text-right text-l font-medium text-black-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedData.length > 0 ? (
                            paginatedData.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-l text-black-800">{item.type || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-l text-black-800">{item.number || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-l text-black-800">{item.startDate || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-l text-black-800">{item.finishDate || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-l font-medium">
                                        <div className="flex justify-end items-center space-x-2">
                                            <button
                                                onClick={() => onDetail(item)}
                                                className="p-1.5 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-md transition-colors"
                                                title="Buka Detail Laporan"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => onDownload(item)}
                                                className="p-1.5 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-md transition-colors"
                                                title="Download Laporan"
                                            >
                                                <CloudDownload className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-l text-black-500">
                                    {searchTerm ? 'Tidak ada data yang sesuai dengan pencarian' : 'Tidak ada data surat tugas'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {filteredData.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
                    <div className="text-l text-black-500 mb-2 sm:mb-0 flex items-center gap-2">
                        <span>Menampilkan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} dari {filteredData.length} surat tugas</span>
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
                            <ChevronLeft className="h-4 w-4" />
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
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const PelaporanSuratTugas: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const [penugasan, setPenugasan] = useState<SuratTugasData[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllPenugasan();
                setPenugasan(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error fetching data:", error);
                setPenugasan([]);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) fetchData();
    }, [isAuthenticated]);

    const handleDetail = (suratTugas: SuratTugasData) => {
        if (suratTugas && suratTugas.number) {
            router.push(`/pelaporan/detail?noSK=${suratTugas.number}`);
        }
    };

    const handleDownload = async (suratTugas: SuratTugasData) => {
        if (!suratTugas || !suratTugas.reportLink) return;

        try {
            const loadingAlert = Swal.fire({
                title: 'Memproses...',
                text: 'Sedang menyiapkan laporan untuk diunduh',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000);

            const response = await fetch(suratTugas.reportLink, {
                method: 'GET',
                credentials: 'include',
                signal: controller.signal,
                cache: 'no-store',
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const reader = response.body?.getReader();
            const contentLength = +(response.headers.get('Content-Length') || '0');

            let receivedLength = 0;
            const chunks = [];

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();

                    if (done) {
                        break;
                    }

                    chunks.push(value);
                    receivedLength += value.length;

                    if (contentLength > 0) {
                        const percentComplete = Math.round((receivedLength / contentLength) * 100);
                        Swal.update({
                            text: `Sedang menyiapkan laporan untuk diunduh (${percentComplete}%)`
                        });
                    }
                }
            }

            const blob = new Blob(chunks);

            let filename = `Laporan-${suratTugas.number}.xlsx`;
            const contentDisposition = response.headers.get('Content-Disposition');
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="(.+)"|filename=([^;]+)/i);
                if (filenameMatch) {
                    filename = filenameMatch[1] || filenameMatch[2];
                }
            }

            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = downloadUrl;
            a.download = filename;
            document.body.appendChild(a);

            await Swal.close();

            a.click();

            window.URL.revokeObjectURL(downloadUrl);
            document.body.removeChild(a);

            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Laporan telah berhasil diunduh.',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true
            });
        } catch (error) {
            console.error("Download error:", error);

            let errorMessage = 'Terjadi kesalahan saat mengunduh laporan.';

            if (error instanceof DOMException && error.name === 'AbortError') {
                errorMessage = 'Waktu pengunduhan habis. Silakan coba lagi.';
            } else if (error instanceof Error) {
                if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                    errorMessage = 'Koneksi jaringan terputus. Periksa koneksi internet Anda.';
                }
            }

            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: errorMessage,
                showConfirmButton: false,
                showCancelButton: true,
                cancelButtonText: 'Tutup',
                cancelButtonColor: '#3085d6 !important',
                customClass: {
                    popup: 'swal-large-text',
                    title: 'text-xl',
                    cancelButton: 'swal2-confirm'
                },
                buttonsStyling: true
            });
        }
    };

    if (!isAuthenticated) return <Loader />;

    return (
        <div className="bg-gray-50 min-h-full p-6">
            <div className="header-primary text-white p-8 rounded-xl mb-8 shadow-md">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-3xl font-bold mb-2">Rekapitulasi Laporan Per Surat Tugas</h1>
                    <p className="text-lg opacity-90">
                        Akses dan download laporan berdasarkan surat tugas patroli yang telah diterbitkan
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6 bg-white rounded-xl shadow mb-8">
                <div className="flex items-start gap-3">
                    <Info size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-black-800 mb-2">Informasi Penggunaan</h3>
                        <p className="text-l text-black-600 leading-relaxed">
                            Halaman ini menampilkan seluruh laporan berdasarkan surat tugas patroli yang telah diterbitkan.
                            Anda dapat mencari surat tugas spesifik menggunakan kolom pencarian.
                            Untuk melihat detail laporan, klik ikon <span className="inline-flex items-center"><ExternalLink className="h-3 w-3 mx-1" /></span>,
                            dan untuk mengunduh laporan, klik ikon <span className="inline-flex items-center"><CloudDownload className="h-3 w-3 mx-1" /></span>.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mb-8">
                {loading ? (
                    <div className="bg-white p-8 rounded-xl shadow flex justify-center items-center">
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 border-4 border-t-green-500 border-green-200 rounded-full animate-spin mb-4"></div>
                            <p className="text-black-600">Memuat data surat tugas...</p>
                        </div>
                    </div>
                ) : (
                    <SuratTugasTable
                        data={penugasan}
                        onDetail={handleDetail}
                        onDownload={handleDownload}
                    />
                )}
            </div>
        </div>
    );
};

export default ProtectRoute(PelaporanSuratTugas);