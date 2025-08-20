'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import moment from 'moment';
import 'moment/locale/id';
import SiteLayout from '@/components/layout/siteLayout/SiteLayout';
import Loader from '@/components/loader/Loader';
import useAuth from '@/context/auth';
import { HotspotAPI } from '@/api';
import { Map as MapIcon, Flame, ChevronDown, ChevronUp } from 'lucide-react';
import dynamic from 'next/dynamic';

const MapWithNoSSR = dynamic(() => import('@/components/maps/MapHotspot'), {
    ssr: false,
    loading: () => (
        <div className="flex justify-center items-center h-full">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-blue-600 font-medium ml-4">Memuat Peta...</p>
        </div>
    )
});

interface HotspotItem {
    lat: string;
    lon: string;
    conf: string;
    sat: string;
    tanggal: string;
    detail?: {
        tanggal: string;
        latitude: string;
        longitude: string;
        confidence: string;
        kawasan: string;
        desa: string;
        kecamatan: string;
        'kota/kabupaten': string;
        provinsi: string;
    };
}

const styles = {
    low: 'var(--bs-low)',
    medium: 'var(--bs-medium)',
    high: 'var(--bs-high)',
};

const Hotspot: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const [hotspot, setHotspot] = useState<HotspotItem[]>([]);
    const [date, setDate] = useState(moment());
    const [accessTime, setAccessTime] = useState(moment());
    const [isValidating, setValidating] = useState(true);
    const [sateliteType, setSateliteType] = useState('SEMUA');
    const [isLoaded, setIsLoaded] = useState(false);
    const [isMobileView, setIsMobileView] = useState(false);
    const [isMobileStatsExpanded, setIsMobileStatsExpanded] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 300);
        return () => clearTimeout(timer);
    }, []);

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

    useEffect(() => {
        const fetchData = async () => {
            setValidating(true);
            try {
                const responseData = await HotspotAPI.get<HotspotItem[]>('');

                setAccessTime(moment());
                const hotspotData = Array.isArray(responseData) ? responseData : [];

                const filteredData = hotspotData.filter((item: HotspotItem) => {
                    if (sateliteType !== 'SEMUA') {
                        return item?.sat?.includes(sateliteType);
                    }
                    return true;
                });

                setHotspot(filteredData);

            } catch (error) {
                console.error('Error fetching hotspot data:', error);
                setHotspot([]);
            } finally {
                setValidating(false);
            }
        };

        if (isAuthenticated) {
            fetchData();
        } else {
            setValidating(false);
            setHotspot([]);
        }
    }, [isAuthenticated, sateliteType]);

    const handleSateliteTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSateliteType(event.target.value);
    };

    const toggleMobileStats = () => {
        setIsMobileStatsExpanded(!isMobileStatsExpanded);
    };

    const formattedDate = date.locale('id').format('D MMMM YYYY');

    return !isAuthenticated ? (
        <Loader />
    ) : (
        <SiteLayout>
            <div className="bg-gray-50">
                <div className="header-primary relative py-6 px-4 mb-6 overflow-hidden text-white rounded-b-lg">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -mt-20 -mr-20"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full -mb-20 -ml-20"></div>
                    <div className="relative flex flex-col items-center justify-center text-center z-10">
                        <div className="flex items-center mb-2">
                            <Flame className="text-white w-8 h-8 mr-3" />
                            <h1 className="text-3xl font-bold">
                                SIPONGI Live Update
                            </h1>
                        </div>
                        <p className="text-blue-100 text-l max-w-2xl">
                            Sistem Monitoring Data Titik Panas Kebakaran Hutan dan Lahan (24 Jam Terakhir)
                        </p>
                    </div>
                </div>

                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        <div className={`bg-white rounded-xl shadow-md overflow-hidden ${isLoaded ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>
                            <div className="p-4 bg-gradient-primary text-white">
                                <h2 className="text-xl font-bold flex items-center">
                                    <Flame className="h-5 w-5 mr-2" />
                                    Informasi
                                </h2>
                                <p className="text-blue-100 text-l">Data diakses pada: {accessTime.format('DD MMMM YYYY HH:mm')}</p>
                            </div>
                            <div className="p-4">
                                <div className="mb-4 flex items-center transform hover:scale-105 transition-transform duration-300">
                                    <div className="h-10 w-10 rounded-full flex items-center justify-center mr-3 bg-red-500">
                                        <Flame className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-black-800">Jumlah Titik Panas (24 Jam Terakhir)</h3>
                                        {isValidating ? (
                                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-300 border-t-blue-600"></div>
                                        ) : (
                                            <div className="text-3xl font-bold text-red-500">
                                                {hotspot.length}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-4 transform hover:translate-y-[-2px] transition-transform duration-300">
                                    <label htmlFor="satelite" className="block text-l font-medium text-black-700 mb-1">
                                        Filter Satelit
                                    </label>
                                    <select
                                        id="satelite"
                                        name="type"
                                        value={sateliteType}
                                        onChange={handleSateliteTypeChange}
                                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-l focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-300 hover:shadow-md"
                                    >
                                        <option value="SEMUA">SEMUA SATELIT</option>
                                        <option value="SNPP">SNPP</option>
                                        <option value="MODIS">MODIS</option>
                                        <option value="NOAA20">NOAA20</option>
                                    </select>
                                </div>

                                <div className="bg-blue-50 p-4 rounded-lg hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                                    <h3 className="text-l font-semibold text-blue-800 mb-2">Tingkat Kepercayaan</h3>
                                    <div className="flex items-center mb-2 hover:bg-blue-100 p-1 rounded transition-colors duration-200">
                                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: styles.low }}></div>
                                        <span className="text-l text-black-700 ml-2">Rendah</span>
                                    </div>
                                    <div className="flex items-center mb-2 hover:bg-blue-100 p-1 rounded transition-colors duration-200">
                                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: styles.medium }}></div>
                                        <span className="text-l text-black-700 ml-2">Sedang</span>
                                    </div>
                                    <div className="flex items-center hover:bg-blue-100 p-1 rounded transition-colors duration-200">
                                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: styles.high }}></div>
                                        <span className="text-l text-black-700 ml-2">Tinggi</span>
                                    </div>
                                </div>
                                <br></br>
                                {/* <h3 className="font-medium text-black-800">Rentang Data</h3>
                                <p className="text-black-600 text-l">24 Jam Terakhir</p> */}
                            </div>
                        </div>

                        <div className={`lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden ${isLoaded ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
                            <div className="relative h-[400px] md:h-full w-full">
                                {isValidating ? (
                                    <div className="flex justify-center items-center h-full">
                                        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                                        <p className="text-blue-600 font-medium ml-3">Memuat data peta...</p>
                                    </div>
                                ) : (
                                    <MapWithNoSSR
                                        center={{
                                            lat: -1.5,
                                            lng: 117.384
                                        }}
                                        zoom={isMobileView ? 4.5 : 5.1}
                                        hotspots={hotspot}
                                    />
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
                    </div>
                    <div className={`mb-8 ${isLoaded ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.5s' }}>
                        <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow duration-300">
                            <h3 className="text-lg font-semibold text-black-800 mb-2 flex items-center">
                                <MapIcon className="h-5 w-5 mr-2 text-blue-600" />
                                Tentang Data
                            </h3>
                            <p className="text-black-600 text-l">
                                Data titik panas menampilkan semua data dalam 24 jam terakhir yang bersumber dari berbagai satelit, termasuk SNPP, MODIS, dan NOAA20.
                                Sumber data dari Sipongi+ (Sistem Pemantauan Karhutla){" "}
                                <a
                                    href="https://sipongi.menlhk.go.id/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline hover:text-blue-800"
                                >
                                    https://sipongi.menlhk.go.id/
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </SiteLayout>
    );
};

export default Hotspot;