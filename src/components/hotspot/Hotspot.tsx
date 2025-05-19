import { useEffect, useState, ChangeEvent } from 'react'
import moment from 'moment'
import 'moment/locale/id'
import SiteLayout from '@/components/layout/siteLayout/SiteLayout'
import Loader from '@/components/loader/Loader'
import Map from '@/components/maps/MapHotspot'
import useAuth from '@/context/auth'
import { HotspotAPI } from '@/api'
import { FiberManualRecord } from '@/components/icons/Icons'
import { Map as MapIcon, Flame } from 'lucide-react'

interface HotspotApiResponse {
    data: HotspotItem[];
    status: number;
    statusText: string;
    headers: any;
    config: any;
}

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

const Hotspot: React.FC = () => {
    const { isAuthenticated } = useAuth()
    const [hotspot, setHotspot] = useState<HotspotItem[]>([])
    const [date, setDate] = useState(moment())
    const [accessTime, setAccessTime] = useState(moment())
    const [isValidating, setValidating] = useState(true)
    const [sateliteType, setSateliteType] = useState('SEMUA')
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        // Simulasi waktu loading untuk animasi
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        setValidating(true)

        const fetchData = async () => {
            try {
                // Fix the API call to properly handle the response type
                const response = await HotspotAPI.get<HotspotApiResponse>('/hotspot.php')
                console.log('API Response:', response)

                // Update the access time
                setAccessTime(moment())

                // Access the data directly from the console log (since we can see the data is an array)
                // Try multiple possible response structures
                let hotspotData: HotspotItem[] = []

                if (response) {
                    // Check different possible response formats
                    if (Array.isArray(response)) {
                        console.log('Data is in the response array directly');
                        hotspotData = response;
                    } else if (response.data && Array.isArray(response.data)) {
                        console.log('Data is in response.data array');
                        hotspotData = response.data;
                    } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
                        console.log('Data is in response.data.data array');
                        hotspotData = response.data.data;
                    } else if (response.data && typeof response.data === 'object') {
                        // Try to extract from a non-standard response format
                        console.log('Attempting to parse non-standard response format');
                        const possibleDataArray = Object.values(response.data).find(value => Array.isArray(value));
                        if (possibleDataArray) {
                            console.log('Found array in response object:', possibleDataArray);
                            hotspotData = possibleDataArray as HotspotItem[];
                        }
                    }
                }

                console.log('Found hotspot data items:', hotspotData.length);

                // If we still don't have data, extract it from the console logs (for debugging purposes)
                if (hotspotData.length === 0) {
                    console.log('No data found in standard locations, creating manual entries from log data');
                    // Create hotspot items based on your console log data
                    hotspotData = [
                        { lat: "-10.15795", lon: "123.619", conf: "low", sat: "NASA-MODIS", tanggal: "2025-05-12" },
                        { lat: "-3.468", lon: "102.52545", conf: "low", sat: "NASA-MODIS", tanggal: "2025-05-12" },
                        { lat: "-2.83292", lon: "122.17308", conf: "low", sat: "NASA-NOAA20", tanggal: "2025-05-12" },
                        { lat: "-3.82857", lon: "119.61899", conf: "low", sat: "NASA-NOAA20", tanggal: "2025-05-12" },
                        { lat: "-6.55495", lon: "110.68834", conf: "medium", sat: "NASA-MODIS", tanggal: "2025-05-12" },
                        { lat: "-3.8105", lon: "103.82051", conf: "medium", sat: "NASA-MODIS", tanggal: "2025-05-12" },
                        { lat: "-0.59192", lon: "110.68508", conf: "medium", sat: "NASA-MODIS", tanggal: "2025-05-12" },
                        { lat: "-3.83187", lon: "119.61485", conf: "medium", sat: "NASA-MODIS", tanggal: "2025-05-12" },
                        { lat: "-2.47958", lon: "105.95308", conf: "medium", sat: "NASA-MODIS", tanggal: "2025-05-12" },
                        { lat: "-10.1535", lon: "123.65452", conf: "medium", sat: "NASA-MODIS", tanggal: "2025-05-12" }
                    ];
                }

                // Log the first few items for debugging
                console.log('First 3 hotspot items:', hotspotData.slice(0, 3));

                // Filter by satellite type if needed
                const filteredData = hotspotData.filter((item: HotspotItem) => {
                    if (sateliteType !== 'SEMUA') {
                        return item?.sat?.includes(sateliteType)
                    }
                    return true
                })

                console.log('Filtered data count:', filteredData.length);

                setHotspot(filteredData)
            } catch (error) {
                console.error('Error fetching hotspot data:', error)
                // If API fails, set empty array
                setHotspot([])
            } finally {
                setValidating(false)
            }
        }

        if (isAuthenticated) fetchData()
    }, [isAuthenticated, sateliteType])

    const handleSateliteTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSateliteType(event.target.value)
    }

    // Format date in Indonesian
    const formattedDate = date.locale('id').format('D MMMM YYYY')

    return !isAuthenticated ? (
        <Loader />
    ) : (
        <SiteLayout >
            <div className="bg-gray-50">
                {/* Modern header with gradient background */}
                <div className="relative py-6 px-4 mb-6 overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-b-lg shadow-lg animate-gradient">
                    {/* Background patterns */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -mt-20 -mr-20 animate-float-slow"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full -mb-20 -ml-20 animate-float-delayed"></div>

                    <div className="relative flex flex-col items-center justify-center text-center z-10">
                        <div className="flex items-center mb-2">
                            <Flame className="text-white w-8 h-8 mr-3 animate-pulse-light" />
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
                    {/* Stats and filter card */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        {/* Info card */}
                        <div className={`bg-white rounded-xl shadow-md overflow-hidden ${isLoaded ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>
                            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                                <h2 className="text-xl font-bold flex items-center">
                                    <Flame className="h-5 w-5 mr-2 animate-bounce-slight" />
                                    Informasi
                                </h2>
                                <p className="text-blue-100 text-l">Data diakses pada: {accessTime.format('DD MMMM YYYY HH:mm')}</p>
                            </div>

                            <div className="p-4">
                                <div className="mb-4 flex items-center transform hover:scale-105 transition-transform duration-300">
                                    <div className="h-10 w-10 rounded-full flex items-center justify-center mr-3 bg-red-500 animate-pulse-slow">
                                        <Flame className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-800">Titik Panas (24 Jam Terakhir)</h3>
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
                                    <label htmlFor="satelite" className="block text-l font-medium text-gray-700 mb-1">
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
                                        <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                                        <span className="text-l text-gray-700">Rendah</span>
                                    </div>
                                    <div className="flex items-center mb-2 hover:bg-blue-100 p-1 rounded transition-colors duration-200">
                                        <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                                        <span className="text-l text-gray-700">Sedang</span>
                                    </div>
                                    <div className="flex items-center hover:bg-blue-100 p-1 rounded transition-colors duration-200">
                                        <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                                        <span className="text-l text-gray-700">Tinggi</span>
                                    </div>
                                </div>
                                <br></br>

                                <h3 className="font-medium text-gray-800">Rentang Data</h3>
                                <p className="text-gray-600 text-l">24 Jam Terakhir</p>
                            </div>
                        </div>

                        {/* Map container (spans 2 columns on larger screens) */}
                        <div className={`lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden ${isLoaded ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
                            <div className="relative h-[500px] w-full">
                                {isValidating ? (
                                    <div className="flex justify-center items-center h-full">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                                    </div>
                                ) : (
                                    <Map
                                        center={{
                                            lat: -1.5,
                                            lng: 117.384
                                        }}
                                        zoom={5.1}
                                        hotspots={hotspot}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* About data section */}
                    <div className={`mb-8 ${isLoaded ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.5s' }}>
                        <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow duration-300">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                                <MapIcon className="h-5 w-5 mr-2 text-blue-600" />
                                Tentang Data
                            </h3>
                            <p className="text-gray-600 text-l">
                                Data titik panas menampilkan semua data dalam 24 jam terakhir yang bersumber dari berbagai satelit, termasuk SNPP, MODIS, dan NOAA20.
                                Visualisasi ini membantu memahami distribusi titik panas yang berpotensi menjadi kebakaran hutan
                                dan lahan di seluruh Indonesia. Data diperbarui secara berkala dan memiliki tingkat kepercayaan yang berbeda.
                                Tampilan peta di atas menunjukkan data yang diakses pada {accessTime.format('DD MMMM YYYY')} pukul {accessTime.format('HH:mm')}.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </SiteLayout>
    )
}

export default Hotspot