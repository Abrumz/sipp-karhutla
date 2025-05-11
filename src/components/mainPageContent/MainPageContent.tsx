import React, { useEffect, useState, useMemo } from 'react';
import moment from 'moment';
import 'moment/locale/id';
import SiteLayout from '@/components/layout/siteLayout/SiteLayout';
import MapContainer from '@/components/maps/MapPatroli';
import useAuth from '@/context/auth';
import { getPatroli } from '@/services';
import { Calendar, User, Truck, Users, Flame, X, ChevronDown, Map, Menu, ChevronUp } from 'lucide-react';

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
    };

    const toggleMobileStats = () => {
        setIsMobileStatsExpanded(!isMobileStatsExpanded);
    };

    const formattedDate = useMemo(() => {
        return moment(date).locale('id').format('D MMMM YYYY');
    }, [date]);

    return (
        <SiteLayout>
            <div>
                <div className="relative py-5 px-4 mb-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-lg"></div>
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-indigo-500 rounded-full"></div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-green-500 rounded-full"></div>

                    <div className="relative flex items-center justify-center text-center">
                        <Map className="text-indigo-600 w-8 h-8 mr-3" />
                        <div>
                            <h1 className="text-3xl font-bold  ">
                                Sebaran Data Patroli & Pemadaman Karhutla
                            </h1>
                        </div>
                    </div>
                </div>

                <div className={`relative ${isMobileView && isMobileStatsExpanded ? 'h-2/3' : 'flex-grow'} w-full transition-all duration-300 overflow-hidden mb-2.5`}>
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
                        <div className="flex px-4 justify-between items-center gap-2 z-10 mb-2">
                            <div
                                className="flex items-center cursor-pointer bg-white rounded-xl shadow-md px-3 py-2 transition-all duration-200 hover:shadow-lg flex-1 justify-center"
                            >
                                <input
                                    type="date"
                                    value={date.format('YYYY-MM-DD')}
                                    onChange={handleDateChange}
                                />
                            </div>

                            <div className="flex items-center bg-indigo-600 text-white rounded-xl shadow-md px-3 py-2 flex-1 ml-2 justify-center">
                                <span className="font-medium text-sm">Total: {loading ? '...' : totalPatrols}</span>
                            </div>
                        </div>
                    )}

                    {!isMobileView && (
                        <div className="absolute bottom-4 left-4 right-4 flex justify-center items-center gap-2 z-10">
                            <div
                                className="flex items-center cursor-pointer bg-white rounded-xl shadow-lg px-3 py-2 transition-all duration-200 hover:shadow-xl justify-center"
                            >
                                <input
                                    type="date"
                                    value={date.format('YYYY-MM-DD')}
                                    onChange={handleDateChange}
                                />
                            </div>

                            <div className="flex items-center bg-indigo-600 text-white rounded-xl shadow-lg px-3 py-2">
                                <span className="font-medium">Total: {loading ? '...' : totalPatrols}</span>
                            </div>
                        </div>
                    )}
                </div>

                <div
                    className={`
                        ${isMobileView ? 'w-full z-10 transition-all duration-300 ' : 'w-full'}
                        ${isMobileView && !isMobileStatsExpanded ? 'h-0' : isMobileView ? 'h-1/3' : 'h-auto'}
                    `}
                    style={{ backgroundColor: '#f5f5f5' }}
                >
                    <div
                        className={`
                            ${isMobileView ? 'grid grid-cols-2 gap-0' : 'grid grid-cols-4 gap-0'}
                            ${isMobileView && !isMobileStatsExpanded ? 'opacity-0 h-0' : 'opacity-100 w-full'}
                            transition-all duration-300
                        `}
                        style={{ backgroundColor: '#f5f5f5' }}
                    >
                        <div className="relative overflow-hidden bg-blue-50 py-4 px-4">
                            <div className="flex flex-col">
                                <div className="flex items-center mb-2">
                                    <div className={`${isMobileView ? 'h-8 w-8' : 'h-10 w-10'} rounded-full flex items-center justify-center mr-2`} style={{ backgroundColor: '#6991fd' }}>
                                        <User className={`${isMobileView ? 'h-4 w-4' : 'h-5 w-5'} text-white`} />
                                    </div>
                                    <h3 className={`${isMobileView ? 'text-l' : 'text-base'} font-semibold text-gray-800`}>Patroli Mandiri</h3>
                                </div>

                                {loading ? (
                                    <div className="flex justify-center h-8 items-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-300 border-t-blue-600"></div>
                                    </div>
                                ) : (
                                    <div className={`${isMobileView ? 'text-3xl pl-10' : 'text-5xl pl-14'} font-bold`} style={{ color: '#6991fd' }}>
                                        {patrolCounter.mandiri}
                                    </div>
                                )}
                            </div>
                            <div className={`absolute top-0 right-0 ${isMobileView ? 'h-16 w-16' : 'h-20 w-20'} rounded-bl-full opacity-30`} style={{ backgroundColor: '#6991fd' }}></div>
                        </div>

                        <div className="relative overflow-hidden bg-pink-50 py-4 px-4">
                            <div className="flex flex-col">
                                <div className="flex items-center mb-2">
                                    <div className={`${isMobileView ? 'h-8 w-8' : 'h-10 w-10'} rounded-full flex items-center justify-center mr-2`} style={{ backgroundColor: '#E853C4' }}>
                                        <Truck className={`${isMobileView ? 'h-4 w-4' : 'h-5 w-5'} text-white`} />
                                    </div>
                                    <h3 className={`${isMobileView ? 'text-l' : 'text-base'} font-semibold text-gray-800`}>Patroli Rutin</h3>
                                </div>

                                {loading ? (
                                    <div className="flex justify-center h-8 items-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-pink-300 border-t-pink-600"></div>
                                    </div>
                                ) : (
                                    <div className={`${isMobileView ? 'text-3xl pl-10' : 'text-5xl pl-14'} font-bold`} style={{ color: '#E853C4' }}>
                                        {patrolCounter.rutin}
                                    </div>
                                )}
                            </div>
                            <div className={`absolute top-0 right-0 ${isMobileView ? 'h-16 w-16' : 'h-20 w-20'} rounded-bl-full opacity-30`} style={{ backgroundColor: '#E853C4' }}></div>
                        </div>

                        <div className="relative overflow-hidden bg-green-50 py-4 px-4">
                            <div className="flex flex-col">
                                <div className="flex items-center mb-2">
                                    <div className={`${isMobileView ? 'h-8 w-8' : 'h-10 w-10'} rounded-full flex items-center justify-center mr-2`} style={{ backgroundColor: '#04F512' }}>
                                        <Users className={`${isMobileView ? 'h-4 w-4' : 'h-5 w-5'} text-white`} />
                                    </div>
                                    <h3 className={`${isMobileView ? 'text-l' : 'text-base'} font-semibold text-gray-800`}>Patroli Terpadu</h3>
                                </div>

                                {loading ? (
                                    <div className="flex justify-center h-8 items-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-green-300 border-t-green-600"></div>
                                    </div>
                                ) : (
                                    <div className={`${isMobileView ? 'text-3xl pl-10' : 'text-5xl pl-14'} font-bold`} style={{ color: '#04F512' }}>
                                        {patrolCounter.terpadu}
                                    </div>
                                )}
                            </div>
                            <div className={`absolute top-0 right-0 ${isMobileView ? 'h-16 w-16' : 'h-20 w-20'} rounded-bl-full opacity-30`} style={{ backgroundColor: '#04F512' }}></div>
                        </div>

                        <div className="relative overflow-hidden bg-red-50 py-4 px-4">
                            <div className="flex flex-col">
                                <div className="flex items-center mb-2">
                                    <div className={`${isMobileView ? 'h-8 w-8' : 'h-10 w-10'} rounded-full flex items-center justify-center mr-2`} style={{ backgroundColor: '#ff4444' }}>
                                        <Flame className={`${isMobileView ? 'h-4 w-4' : 'h-5 w-5'} text-white`} />
                                    </div>
                                    <h3 className={`${isMobileView ? 'text-l' : 'text-base'} font-semibold text-gray-800`}>Pemadaman</h3>
                                </div>

                                {loading ? (
                                    <div className="flex justify-center h-8 items-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-red-300 border-t-red-600"></div>
                                    </div>
                                ) : (
                                    <div className={`${isMobileView ? 'text-3xl pl-10' : 'text-5xl pl-14'} font-bold`} style={{ color: '#ff4444' }}>
                                        {patrolCounter.padam}
                                    </div>
                                )}
                            </div>
                            <div className={`absolute top-0 right-0 ${isMobileView ? 'h-16 w-16' : 'h-20 w-20'} rounded-bl-full opacity-30`} style={{ backgroundColor: '#ff4444' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </SiteLayout >
    );
};

export default FrontPage;