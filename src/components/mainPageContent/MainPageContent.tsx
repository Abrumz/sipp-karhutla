import React, { useEffect, useState, useMemo } from 'react';
import moment from 'moment';
import 'moment/locale/id';
import SiteLayout from '@/components/layout/siteLayout/SiteLayout';
import MapContainer from '@/components/maps/MapPatroli';
import useAuth from '@/context/auth';
import { getPatroli } from '@/services';
import { Calendar, User, Truck, Users, Flame, ChevronDown, Map, Menu, ChevronUp } from 'lucide-react';

interface PatrolCounter {
    mandiri: number;
    rutin: number;
    terpadu: number;
    padam: number;
}

interface MapContainerProps {
    center: {
        lat: number;
        lng: number;
    };
    zoom: number;
    spots: any[];
    isLoggedin: boolean;
}

const FrontPage: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const [date, setDate] = useState<moment.Moment>(moment());
    const [loading, setLoading] = useState<boolean>(true);
    const [patrolCounter, setPatrolCounter] = useState<PatrolCounter>({
        rutin: 0,
        mandiri: 0,
        terpadu: 0,
        padam: 0
    });
    const [spots, setSpots] = useState<any[]>([]);
    const [isMobileView, setIsMobileView] = useState<boolean>(false);
    const [isMobileStatsExpanded, setIsMobileStatsExpanded] = useState<boolean>(true);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);

    const totalPatrols = useMemo(() => {
        return patrolCounter.mandiri + patrolCounter.rutin + patrolCounter.terpadu + patrolCounter.padam;
    }, [patrolCounter]);

    useEffect(() => {
        const updatePatroli = async (): Promise<void> => {
            try {
                const patroliData = await getPatroli(date.format('D-M-YYYY'));
                setSpots(patroliData.patroliSpots);
                setPatrolCounter({
                    mandiri: patroliData.counter.mandiri,
                    rutin: patroliData.counter.rutin,
                    terpadu: patroliData.counter.terpadu,
                    padam: patroliData.counter.padam
                });
            } catch (error) {
                console.error('Error fetching patrol data:', error);
            } finally {
                setLoading(false);
            }
        };

        setLoading(true);
        updatePatroli();
    }, [date]);

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

    const formattedDate = useMemo(() => {
        return moment(date).locale('id').format('D MMMM YYYY');
    }, [date]);

    const incrementDate = () => {
        setDate(moment(date).add(1, 'days'));
    };

    const decrementDate = () => {
        setDate(moment(date).subtract(1, 'days'));
    };

    const goToToday = () => {
        setDate(moment());
    };

    return (
        <SiteLayout>
            <div className="bg-gray-50">
                {/* Header dengan animasi subtle */}
                <div className="relative py-6 px-4 mb-6 overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-b-lg shadow-lg">
                    {/* Background patterns */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -mt-20 -mr-20"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full -mb-20 -ml-20"></div>

                    <div className="relative flex flex-col items-center justify-center text-center z-10">
                        <div className="flex items-center mb-2">
                            <Map className="text-white w-8 h-8 mr-3" />
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
                    {/* Date selector & total counter */}
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center space-x-2 bg-white rounded-xl shadow-md p-2 flex-grow md:flex-grow-0">
                            <button
                                onClick={decrementDate}
                                className="p-2 rounded-lg hover:bg-gray-100 transition"
                                aria-label="Previous day"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <div className="relative">
                                <button
                                    onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                                    className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                                >
                                    <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                                    <span className="text-gray-800 font-medium">{formattedDate}</span>
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
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

                        <div className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl shadow-md px-4 py-3">
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

                    {/* Main content area with card styling */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        {/* Map card */}
                        <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="relative h-[400px] md:h-[500px] w-full">
                                <MapContainer
                                    center={{
                                        lat: -1.5,
                                        lng: 117.384
                                    }}
                                    zoom={isMobileView ? 4.5 : 5.1}
                                    spots={spots}
                                    isLoggedin={isAuthenticated}
                                />

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

                        {/* Stats summary card */}
                        <div className={`
                            ${isMobileView && !isMobileStatsExpanded ? 'h-0 opacity-0 overflow-hidden' : 'h-auto opacity-100'}
                            transition-all duration-300 bg-white rounded-xl shadow-md overflow-hidden
                        `}>
                            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                                <h2 className="text-xl font-bold">Statistik Data</h2>
                                <p className="text-blue-100 text-l">Aktivitas {formattedDate}</p>
                            </div>

                            <div className="grid grid-cols-1 divide-y">
                                {/* Patroli Mandiri */}
                                <div className="p-4 hover:bg-blue-50 transition-colors duration-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#6991fd' }}>
                                                <User className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-800">Patroli Mandiri</h3>
                                                <p className="text-l text-gray-500">Dilakukan oleh individu petugas</p>
                                            </div>
                                        </div>
                                        {loading ? (
                                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-300 border-t-blue-600"></div>
                                        ) : (
                                            <div className="text-3xl font-bold" style={{ color: '#6991fd' }}>
                                                {patrolCounter.mandiri}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Patroli Rutin */}
                                <div className="p-4 hover:bg-pink-50 transition-colors duration-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#E853C4' }}>
                                                <Truck className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-800">Patroli Rutin</h3>
                                                <p className="text-l text-gray-500">Patroli terjadwal rutin</p>
                                            </div>
                                        </div>
                                        {loading ? (
                                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-pink-300 border-t-pink-600"></div>
                                        ) : (
                                            <div className="text-3xl font-bold" style={{ color: '#E853C4' }}>
                                                {patrolCounter.rutin}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Patroli Terpadu */}
                                <div className="p-4 hover:bg-green-50 transition-colors duration-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#04F512' }}>
                                                <Users className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-800">Patroli Terpadu</h3>
                                                <p className="text-l text-gray-500">Kolaborasi antar instansi</p>
                                            </div>
                                        </div>
                                        {loading ? (
                                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-green-300 border-t-green-600"></div>
                                        ) : (
                                            <div className="text-3xl font-bold" style={{ color: '#04F512' }}>
                                                {patrolCounter.terpadu}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Pemadaman */}
                                <div className="p-4 hover:bg-red-50 transition-colors duration-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#ff4444' }}>
                                                <Flame className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-800">Pemadaman</h3>
                                                <p className="text-l text-gray-500">Aktivitas pemadaman kebakaran</p>
                                            </div>
                                        </div>
                                        {loading ? (
                                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-red-300 border-t-red-600"></div>
                                        ) : (
                                            <div className="text-3xl font-bold" style={{ color: '#ff4444' }}>
                                                {patrolCounter.padam}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="bg-white rounded-xl shadow-md p-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Tentang Data</h3>
                            <p className="text-gray-600 text-l">
                                Data patroli dan pemadaman kebakaran hutan dan lahan bersumber dari laporan petugas di lapangan.
                                Visualisasi ini membantu memahami distribusi aktivitas pencegahan dan penanganan karhutla di seluruh Indonesia.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </SiteLayout>
    );
};

export default FrontPage;