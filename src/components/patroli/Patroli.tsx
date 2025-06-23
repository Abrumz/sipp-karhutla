'use client';

import React, { useEffect, useState, useMemo, ReactNode } from 'react';
import moment from 'moment';
import 'moment/locale/id';
import { useRouter } from 'next/navigation';
import SiteLayout from '@/components/layout/siteLayout/SiteLayout';
// import MapPatroliContainer from '@/components/maps/MapPatroli';
import useAuth from '@/context/auth';
import Loader from '@/components/loader/Loader';
import { getPatroli } from '@/services';
import {
    Calendar,
    User,
    Truck,
    Users,
    Flame,
    ChevronDown,
    Map as MapIcon,
    ChevronUp,
    Download as CloudDownloadIcon
} from 'lucide-react';

import { PatrolData, PatrolListData } from '@/interfaces/data';
import dynamic from 'next/dynamic';

const MapPatroliContainer = dynamic(() => import('@/components/maps/MapPatroli'), {
    ssr: false,
    loading: () => (
        <div className="flex justify-center items-center h-full">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-blue-600 font-medium ml-4">Memuat Peta...</p>
        </div>
    )
});

interface TableColumn {
    title: string;
    field: keyof PatrolListData;
}

interface ProtectRouteProps {
    children: ReactNode;
}

const columns: TableColumn[] = [
    { title: 'Tanggal', field: 'patrolDate' },
    { title: 'Daerah Operasi', field: 'operationRegion' },
    { title: 'Daerah Patroli', field: 'patrolRegion' }
];

const DataTable: React.FC<{
    title: string;
    columns: TableColumn[];
    data: PatrolListData[];
    loading: boolean;
}> = ({ title, columns, data, loading }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const filteredData = data.filter(item => {
        return Object.values(item).some(
            value => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const paginatedData = filteredData.slice(
        currentPage * rowsPerPage,
        (currentPage + 1) * rowsPerPage
    );

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    return (
        <div className="my-8">
            <div className="flex items-center mb-4">
                <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
                <h3 className="text-xl font-bold text-black-800">{title}</h3>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <input
                        type="text"
                        placeholder="Pencarian"
                        className="w-full md:w-64 p-2 border border-gray-300 rounded"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {columns.map((column, index) => (
                                    <th
                                        key={index}
                                        className="px-6 py-3 text-left text-l font-medium text-black-500 uppercase tracking-wider"
                                    >
                                        {column.title}
                                    </th>
                                ))}
                                <th className="px-6 py-3 text-left text-l font-medium text-black-500 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, index) => (
                                    <tr key={`loading-row-${index}`}>
                                        {columns.map((_, colIndex) => (
                                            <td key={`loading-cell-${colIndex}`} className="px-6 py-4 whitespace-nowrap">
                                                <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4"></div>
                                            </td>
                                        ))}
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="animate-pulse h-4 bg-gray-200 rounded w-28 ml-auto"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                paginatedData.map((row, rowIndex) => (
                                    <tr key={rowIndex} className="capitalize hover:bg-gray-50 transition-colors">
                                        {columns.map((column, colIndex) => (
                                            <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-l text-black-500">
                                                {row[column.field] !== null && row[column.field] !== undefined
                                                    ? String(row[column.field])
                                                    : ''}
                                            </td>
                                        ))}
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-l font-medium">
                                            <button
                                                onClick={() => window.open(row.reportLink)}
                                                className="text-blue-600 hover:text-blue-900 flex items-center justify-center md:justify-end"
                                            >
                                                <CloudDownloadIcon className="h-5 w-5 mr-1" />
                                                <span>Download</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            {!loading && paginatedData.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={columns.length + 1}
                                        className="px-6 py-4 text-center text-l text-black-500"
                                    >
                                        Tidak ada data
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center">
                        <select
                            className="mr-2 p-2 border border-gray-300 rounded"
                            value={rowsPerPage}
                            onChange={(e) => {
                                setRowsPerPage(Number(e.target.value));
                                setCurrentPage(0);
                            }}
                        >
                            {[10, 25, 50, 100].map(pageSize => (
                                <option key={pageSize} value={pageSize}>
                                    {pageSize}
                                </option>
                            ))}
                        </select>
                        <span className="text-l text-black-700">Baris</span>
                    </div>

                    <div className="flex items-center">
                        <span className="text-l text-black-700 mr-4">
                            {filteredData.length > 0 ?
                                `${currentPage * rowsPerPage + 1}-${Math.min((currentPage + 1) * rowsPerPage, filteredData.length)} dari ${filteredData.length}` :
                                '0 data'}
                        </span>

                        <div className="flex space-x-2">
                            <button
                                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                                disabled={currentPage === 0}
                                className={`${currentPage === 0
                                    ? 'bg-gray-200 cursor-not-allowed'
                                    : 'bg-white hover:bg-gray-100'} p-1 rounded border border-gray-300`}
                            >
                                <span className="sr-only">Previous</span>
                                &laquo;
                            </button>

                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                                disabled={currentPage >= totalPages - 1}
                                className={`${currentPage >= totalPages - 1
                                    ? 'bg-gray-200 cursor-not-allowed'
                                    : 'bg-white hover:bg-gray-100'} p-1 rounded border border-gray-300`}
                            >
                                <span className="sr-only">Next</span>
                                &raquo;
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProtectRoute: React.FC<ProtectRouteProps> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, loading, router]);

    if (loading || !isAuthenticated) {
        return <Loader />;
    }

    return <>{children}</>;
};

const PatroliContent: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const [loading, setLoading] = useState<boolean>(true);
    const [date, setDate] = useState<moment.Moment>(moment());
    const [isMobileView, setIsMobileView] = useState<boolean>(false);
    const [isMobileStatsExpanded, setIsMobileStatsExpanded] = useState<boolean>(true);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);

    const [mandiriCounter, setMandiriCounter] = useState(0);
    const [rutinCounter, setRutinCounter] = useState(0);
    const [terpaduCounter, setTerpaduCounter] = useState(0);
    const [padamCounter, setPadamCounter] = useState(0);
    const [mandiri, setMandiri] = useState<PatrolListData[]>([]);
    const [rutin, setRutin] = useState<PatrolListData[]>([]);
    const [terpadu, setTerpadu] = useState<PatrolListData[]>([]);
    const [padam, setPadam] = useState<PatrolListData[]>([]);
    const [spots, setSpots] = useState<PatrolData[]>([]);

    const totalPatrols = useMemo(() => {
        return mandiriCounter + rutinCounter + terpaduCounter + padamCounter;
    }, [mandiriCounter, rutinCounter, terpaduCounter, padamCounter]);

    const formattedDate = useMemo(() => {
        return moment(date).locale('id').format('D MMMM YYYY');
    }, [date]);

    useEffect(() => {
        const updatePatroli = async () => {
            try {
                const patroliData = await getPatroli(date.format('D-M-YYYY'));
                setSpots(patroliData.patroliSpots);
                setMandiriCounter(patroliData.counter.mandiri);
                setRutinCounter(patroliData.counter.rutin);
                setTerpaduCounter(patroliData.counter.terpadu);
                setPadamCounter(patroliData.counter.padam);
                setMandiri(patroliData.patroliMandiri);
                setRutin(patroliData.patroliRutin);
                setTerpadu(patroliData.patroliTerpadu);
                setPadam(patroliData.pemadaman);
            } catch (error) {
                console.error('Error fetching patrol data:', error);
            } finally {
                setLoading(false);
            }
        };

        setLoading(true);
        if (isAuthenticated) updatePatroli();
    }, [date, isAuthenticated]);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobileView(mobile);

            if (!mobile) {
                setIsMobileStatsExpanded(true);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value ? moment(e.target.value) : moment();
        setDate(newDate);
        setIsDatePickerOpen(false);
    };

    const toggleMobileStats = () => {
        setIsMobileStatsExpanded(!isMobileStatsExpanded);
    };

    const incrementDate = () => {
        setDate(moment(date).add(1, 'days'));
    };

    const decrementDate = () => {
        setDate(moment(date).subtract(1, 'days'));
    };

    const goToToday = () => {
        setDate(moment());
    };

    if (!isAuthenticated) return null;

    return (
        <SiteLayout>
            <div className="bg-gray-50 ">
                <div className="header-primary relative py-6 px-4 mb-6 overflow-hidden text-white rounded-b-lg shadow-lg">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -mt-20 -mr-20"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full -mb-20 -ml-20"></div>

                    <div className="relative flex flex-col items-center justify-center text-center z-10">
                        <div className="flex items-center mb-2">
                            <MapIcon className="text-white w-8 h-8 mr-3" />
                            <h1 className="text-3xl font-bold">
                                Sebaran Data Patroli & Pemadaman
                            </h1>
                        </div>
                        <p className="text-blue-100 text-l max-w-2xl">
                            Platform visualisasi data monitoring patroli dan pemadaman kebakaran hutan dan lahan
                        </p>
                    </div>
                </div>

                <div className="container mx-auto px-4">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center space-x-2 bg-white rounded-xl shadow-md p-2 flex-grow md:flex-grow-0">
                            <button
                                onClick={decrementDate}
                                className="p-2 rounded-lg hover:bg-gray-100 transition"
                                aria-label="Previous day"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <div className="relative">
                                <button
                                    onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                                    className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                                >
                                    <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                                    <span className="text-black-800 font-medium">{formattedDate}</span>
                                </button>

                                {isDatePickerOpen && (
                                    <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl p-2 z-50">
                                        <input
                                            type="date"
                                            value={date.format('YYYY-MM-DD')}
                                            onChange={handleDateChange}
                                            className="p-2 border rounded"
                                        />
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={incrementDate}
                                className="p-2 rounded-lg hover:bg-gray-100 transition"
                                aria-label="Next day"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>

                            <button
                                onClick={goToToday}
                                className="ml-1 px-3 py-1 text-l text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
                            >
                                Hari Ini
                            </button>
                        </div>

                        <div className="flex items-center text-white rounded-xl shadow-md px-4 py-3 bg-gradient-primary">
                            <div className="flex flex-col items-center">
                                <span className="text-l text-blue-100">Total Aktivitas</span>
                                <span className="font-bold text-2xl">
                                    {loading ?
                                        <div className="animate-pulse w-8 h-6 bg-white/20 rounded"></div>
                                        : totalPatrols
                                    }
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="relative h-[400px] md:h-[500px] w-full">
                                <MapPatroliContainer
                                    center={{
                                        lat: -1.5,
                                        lng: 117.384
                                    }}
                                    zoom={isMobileView ? 4.5 : 5.1}
                                    spots={spots}
                                    isLoggedin={isAuthenticated}
                                />

                                {loading && (
                                    <div className="absolute inset-0 bg-white bg-opacity-70 z-20 flex flex-col items-center justify-center">
                                        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                                        <p className="text-blue-600 font-medium">Memuat data peta...</p>
                                    </div>
                                )}

                                {isMobileView && (
                                    <div className="absolute bottom-4 right-4 z-10">
                                        <button
                                            onClick={toggleMobileStats}
                                            className="bg-white p-2 rounded-full shadow-lg"
                                        >
                                            {isMobileStatsExpanded ? <ChevronDown /> : <ChevronUp />}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={`
                          ${isMobileView && !isMobileStatsExpanded ? 'h-0 opacity-0 overflow-hidden' : 'h-auto opacity-100'}
                          transition-all duration-300 bg-white rounded-xl shadow-md overflow-hidden
                        `}>
                            <div className="p-4 text-white bg-gradient-primary">
                                <h2 className="text-xl font-bold">Statistik Data</h2>
                                <p className="text-blue-100 text-l">Aktivitas {formattedDate}</p>
                            </div>

                            <div className="grid grid-cols-1 divide-y">
                                <div className="p-4 hover:bg-blue-50 transition-colors duration-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#6991fd' }}>
                                                <User className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-black-800">Patroli Mandiri</h3>
                                                <p className="text-l text-gray-700">Dilakukan oleh individu petugas</p>
                                            </div>
                                        </div>
                                        {loading ? (
                                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-300 border-t-blue-600"></div>
                                        ) : (
                                            <div className="text-3xl font-bold" style={{ color: '#6991fd' }}>
                                                {mandiriCounter}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-4 hover:bg-pink-50 transition-colors duration-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#E853C4' }}>
                                                <Truck className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-black-800">Patroli Rutin</h3>
                                                <p className="text-l text-gray-700">Patroli terjadwal rutin</p>
                                            </div>
                                        </div>
                                        {loading ? (
                                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-pink-300 border-t-pink-600"></div>
                                        ) : (
                                            <div className="text-3xl font-bold" style={{ color: '#E853C4' }}>
                                                {rutinCounter}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-4 hover:bg-green-50 transition-colors duration-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#04F512' }}>
                                                <Users className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-black-800">Patroli Terpadu</h3>
                                                <p className="text-l text-gray-700">Kolaborasi antar instansi</p>
                                            </div>
                                        </div>
                                        {loading ? (
                                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-green-300 border-t-green-600"></div>
                                        ) : (
                                            <div className="text-3xl font-bold" style={{ color: '#04F512' }}>
                                                {terpaduCounter}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-4 hover:bg-red-50 transition-colors duration-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#ff4444' }}>
                                                <Flame className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-black-800">Pemadaman</h3>
                                                <p className="text-l text-gray-700">Aktivitas pemadaman kebakaran</p>
                                            </div>
                                        </div>
                                        {loading ? (
                                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-red-300 border-t-red-600"></div>
                                        ) : (
                                            <div className="text-3xl font-bold" style={{ color: '#ff4444' }}>
                                                {padamCounter}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="bg-white rounded-xl shadow-md p-4">
                            <h3 className="text-lg font-semibold text-black-800 mb-2">Tentang Data</h3>
                            <p className="text-black-600 text-l">
                                Data patroli dan pemadaman kebakaran hutan dan lahan bersumber dari laporan petugas di lapangan.
                                Visualisasi ini membantu memahami distribusi aktivitas pencegahan dan penanganan karhutla di seluruh Indonesia.
                            </p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                            <h2 className="text-xl font-bold text-black-800 mb-4">Detail Data Aktivitas</h2>
                            <div className="border-t border-gray-200 pt-4">
                                <DataTable title="Data Patroli Mandiri" columns={columns} data={mandiri} loading={loading} />
                                <DataTable title="Data Patroli Rutin" columns={columns} data={rutin} loading={loading} />
                                <DataTable title="Data Patroli Terpadu" columns={columns} data={terpadu} loading={loading} />
                                <DataTable title="Data Pemadaman" columns={columns} data={padam} loading={loading} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SiteLayout>
    );
};

const PatroliContentWrapper: React.FC = () => {
    return (
        <ProtectRoute>
            <PatroliContent />
        </ProtectRoute>
    );
};

export default PatroliContentWrapper;