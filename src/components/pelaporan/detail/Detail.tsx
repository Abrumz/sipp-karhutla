import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import useAuth from '@/context/auth'
import { getSKLaporanDetail, deleteLaporan } from '@/services'
import { CloudDownload, ExternalLink, FileText, Info, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { apiV2URL } from '@/api'
import Loader from '@/components/loader/Loader'

interface SuratTugasLaporanData {
    id_laporan_header: string;
    nama_daops: string;
    nama_daerah_patroli: string;
    nama_ketua: string;
    tanggal_patroli: string;
    tableData?: any;
}

interface InfoCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    color: 'blue' | 'indigo' | 'purple';
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, description, color }) => {
    const colorClasses = {
        blue: 'text-blue-600 bg-blue-50',
        indigo: 'text-indigo-600 bg-indigo-50',
        purple: 'text-purple-600 bg-purple-50'
    };

    return (
        <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className={`p-3 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
                {icon}
            </div>
            <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
                <p className="text-l text-gray-500 leading-relaxed">{description}</p>
            </div>
        </div>
    );
};

const DetailLaporan: React.FC = () => {
    const { isAuthenticated, user } = useAuth()
    const router = useRouter()
    const { noSK } = router.query
    const [laporan, setLaporan] = useState<SuratTugasLaporanData[]>([])
    const [showAlert, setShowAlert] = useState<boolean>(false)
    const [alertSuccess, setAlertSuccess] = useState<boolean>(true)
    const [canDelete, setCanDelete] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    const [alertMessage, setAlertMessage] = useState<string>('')
    const [alertType, setAlertType] = useState<'success' | 'error'>('success')
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [itemsPerPage, setItemsPerPage] = useState<number>(5)

    const delete_role = [0, 6]

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            if (noSK) {
                const data = await getSKLaporanDetail(noSK.toString())
                setLaporan(data)
                setLoading(false)

                if (delete_role.includes(user.roleLevel)) {
                    setCanDelete(true)
                }
            }
        }
        if (isAuthenticated) fetchData()
    }, [isAuthenticated, noSK, user])

    const handleDelete = async (rowData: SuratTugasLaporanData): Promise<void> => {
        if (window.confirm('Apakah Anda yakin ingin menghapus laporan tersebut?')) {
            try {
                const result = await deleteLaporan(rowData)
                if (result.success) {
                    const dataDelete = [...laporan]
                    const index = laporan.findIndex(item => item.id_laporan_header === rowData.id_laporan_header)
                    if (index !== -1) {
                        dataDelete.splice(index, 1)
                        setLaporan(dataDelete)
                    }
                    setAlertSuccess(true)
                    setAlertMessage('Hapus data Laporan berhasil')
                    setShowAlert(true)
                } else {
                    setAlertType('error')
                    setAlertSuccess(false)
                    setAlertMessage(result.message as string)
                    setShowAlert(true)
                }
            } catch (error) {
                setAlertType('error')
                setAlertSuccess(false)
                setAlertMessage('Terjadi kesalahan saat menghapus laporan')
                setShowAlert(true)
            }
        }
    }

    const handleEdit = (rowData: SuratTugasLaporanData): void => {
        router.push(`/pelaporan/ubah/${rowData.id_laporan_header}`)
    }

    const handleDownload = (rowData: SuratTugasLaporanData): void => {
        window.open(apiV2URL + `/karhutla/download/${rowData.id_laporan_header}`)
    }

    const filteredData = laporan.filter(item => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (item.nama_daops && item.nama_daops.toLowerCase().includes(searchLower)) ||
            (item.nama_daerah_patroli && item.nama_daerah_patroli.toLowerCase().includes(searchLower)) ||
            (item.nama_ketua && item.nama_ketua.toLowerCase().includes(searchLower)) ||
            (item.tanggal_patroli && item.tanggal_patroli.toLowerCase().includes(searchLower))
        );
    });

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const handlePrevPage = (): void => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = (): void => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    if (!isAuthenticated) return <Loader />;

    return (
        <div className="bg-gray-50 min-h-full p-6">
            <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-8 rounded-xl mb-8 shadow-md">
                <div className="max-w-5xl mx-auto text-center">
                    <h1 className="text-3xl font-bold mb-2">Detail Laporan: {noSK}</h1>
                    <p className="text-lg opacity-90">
                        Laporan dari surat tugas yang telah dikeluarkan
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 max-w-5xl mx-auto">
                <InfoCard
                    icon={<FileText size={20} />}
                    title="Laporan Terstruktur"
                    description="Data laporan lengkap dari patroli berdasarkan surat tugas"
                    color="blue"
                />
                <InfoCard
                    icon={<CloudDownload size={20} />}
                    title="Unduh Laporan"
                    description="Unduh laporan lengkap dengan format yang terstruktur dan mudah dibaca"
                    color="indigo"
                />
                <InfoCard
                    icon={<ExternalLink size={20} />}
                    title="Akses Detail"
                    description="Ubah atau lihat detail dari setiap laporan yang tersedia"
                    color="purple"
                />
            </div>

            <div className="max-w-5xl mx-auto mb-8">
                {showAlert && (
                    <div className={`mb-4 p-4 rounded-lg ${alertSuccess ? 'bg-green-100 border border-green-200 text-green-700' : 'bg-red-100 border border-red-200 text-red-700'}`}>
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Info className="h-5 w-5" />
                            </div>
                            <div className="ml-3">
                                <p className="text-l font-medium">{alertMessage}</p>
                            </div>
                            <div className="ml-auto pl-3">
                                <div className="-mx-1.5 -my-1.5">
                                    <button
                                        type="button"
                                        className={`inline-flex rounded-md p-1.5 ${alertSuccess ? 'bg-green-100 text-green-500 hover:bg-green-200' : 'bg-red-100 text-red-500 hover:bg-red-200'}`}
                                        onClick={() => setShowAlert(false)}
                                    >
                                        <span className="sr-only">Dismiss</span>
                                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="bg-white p-8 rounded-xl shadow flex justify-center items-center">
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-600">Memuat data laporan...</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <div className="p-4 border-b">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <h3 className="text-lg font-semibold text-gray-800">Daftar Laporan</h3>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Cari laporan..."
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
                                        <th scope="col" className="px-6 py-3 text-left text-l font-medium text-gray-500 uppercase tracking-wider">Nama Daops</th>
                                        <th scope="col" className="px-6 py-3 text-left text-l font-medium text-gray-500 uppercase tracking-wider">Daerah Patroli</th>
                                        <th scope="col" className="px-6 py-3 text-left text-l font-medium text-gray-500 uppercase tracking-wider">Ketua</th>
                                        <th scope="col" className="px-6 py-3 text-left text-l font-medium text-gray-500 uppercase tracking-wider">Tanggal Patroli</th>
                                        <th scope="col" className="px-6 py-3 text-right text-l font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {paginatedData.length > 0 ? (
                                        paginatedData.map((row, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-l text-gray-800">{row.nama_daops || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-l text-gray-800">{row.nama_daerah_patroli || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-l text-gray-800">{row.nama_ketua || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-l text-gray-800">{row.tanggal_patroli || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-l font-medium">
                                                    <div className="flex justify-end items-center space-x-2">
                                                        <button
                                                            onClick={() => handleEdit(row)}
                                                            className="p-1.5 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-md transition-colors"
                                                            title="Ubah Data Laporan"
                                                        >
                                                            <ExternalLink className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDownload(row)}
                                                            className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-md transition-colors"
                                                            title="Download Laporan"
                                                        >
                                                            <CloudDownload className="h-4 w-4" />
                                                        </button>
                                                        {canDelete && (
                                                            <button
                                                                onClick={() => handleDelete(row)}
                                                                className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors"
                                                                title="Hapus Laporan"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-4 text-center text-l text-gray-500">
                                                {searchTerm ? 'Tidak ada data yang sesuai dengan pencarian' : 'Tidak ada data laporan'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {filteredData.length > 0 && (
                            <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
                                <div className="text-l text-gray-500 mb-2 sm:mb-0">
                                    Menampilkan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} dari {filteredData.length} laporan
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={handlePrevPage}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
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
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow mb-8">
                <div className="flex items-start gap-3">
                    <Info size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Informasi Penggunaan</h3>
                        <p className="text-l text-gray-600 leading-relaxed">
                            Halaman ini menampilkan seluruh laporan dari surat tugas dengan nomor {noSK}.
                            Anda dapat mencari laporan spesifik menggunakan kolom pencarian.
                            Untuk mengubah data laporan, klik ikon <span className="inline-flex items-center"><ExternalLink className="h-3 w-3 mx-1" /></span>,
                            dan untuk mengunduh laporan, klik ikon <span className="inline-flex items-center"><CloudDownload className="h-3 w-3 mx-1" /></span>.
                            {canDelete && (
                                <span> Untuk menghapus laporan, klik ikon <span className="inline-flex items-center"><Trash2 className="h-3 w-3 mx-1" /></span>.</span>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DetailLaporan