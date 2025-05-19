import React, { useState } from 'react';
import Loader from '@/components/loader/Loader';
import useAuth, { ProtectRoute } from '@/context/auth';
import { CloudDownload, AlertCircle, X, FileText, BarChart2, Calendar, Info, Clock } from 'lucide-react';
import { downloadLaporanRingkasan } from '@/services';

const DateInputComponent: React.FC<{
    id: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    min?: string;
    max?: string;
}> = ({
    id,
    label,
    value,
    onChange,
    min,
    max
}) => {
        return (
            <div className="space-y-2">
                <label className="block text-gray-700 text-l font-medium" htmlFor={id}>
                    {label}
                </label>
                <input
                    type="date"
                    id={id}
                    value={value}
                    onChange={onChange}
                    min={min}
                    max={max}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-l focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
            </div>
        );
    };

const InfoCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
}> = ({ icon, title, description, color }) => {
    const colorClasses = {
        blue: 'text-blue-600 bg-blue-50',
        indigo: 'text-indigo-600 bg-indigo-50',
        purple: 'text-purple-600 bg-purple-50'
    };

    return (
        <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className={`p-3 rounded-lg flex items-center justify-center ${colorClasses[color as keyof typeof colorClasses]}`}>
                {icon}
            </div>
            <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
                <p className="text-l text-gray-500 leading-relaxed">{description}</p>
            </div>
        </div>
    );
};

const LaporanRingkasan = () => {
    const { isAuthenticated, user } = useAuth();
    const [startDate, setStartDate] = useState(formatDateForInput(new Date()));
    const [endDate, setEndDate] = useState(formatDateForInput(new Date()));
    const [show, setShow] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Helper function to format date for input type="date"
    function formatDateForInput(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Helper function to parse input date string to Date object
    function parseInputDate(dateString: string): Date {
        return new Date(dateString);
    }

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStartDate = e.target.value;
        setStartDate(newStartDate);

        // If endDate is earlier than startDate, update endDate
        if (newStartDate > endDate) {
            setEndDate(newStartDate);
        }
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndDate(e.target.value);
    };

    const handleCloseAlert = () => {
        setShow(false);
    };

    const handleDownload = async () => {
        if (!startDate || !endDate) {
            setAlertMessage('Silakan pilih tanggal mulai dan tanggal selesai');
            setShow(true);
            return;
        }

        if (startDate > endDate) {
            setAlertMessage('Tanggal mulai tidak boleh lebih besar dari tanggal selesai');
            setShow(true);
            return;
        }

        setIsLoading(true);

        try {
            const organizationCode = user?.organization ? btoa(user.organization) : '';
            const result = await downloadLaporanRingkasan(
                parseInputDate(startDate),
                parseInputDate(endDate),
                organizationCode
            );

            if (!result.success) {
                setAlertMessage(Array.isArray(result.message) ? result.message.join(', ') : result.message || 'Terjadi kesalahan saat mengunduh laporan');
                setShow(true);
            }
        } catch (error) {
            setAlertMessage('Terjadi kesalahan saat mengunduh laporan');
            setShow(true);
            console.error('Download error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAuthenticated) return <Loader />;

    return (
        <div className="bg-gray-50 min-h-full p-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-8 rounded-xl mb-8 shadow-md">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl font-bold mb-2">Laporan Ringkasan</h1>
                    <p className="text-lg opacity-90">
                        Download dan analisis data kebakaran hutan dan lahan berdasarkan rentang waktu
                    </p>
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto">
                <InfoCard
                    icon={<FileText size={20} />}
                    title="Dokumentasi Komprehensif"
                    description="Laporan lengkap dengan data kebakaran, lokasi, luas area, dan status penanganan"
                    color="blue"
                />
                <InfoCard
                    icon={<Calendar size={20} />}
                    title="Analisis Periode Spesifik"
                    description="Pilih rentang tanggal khusus untuk mendapatkan wawasan yang lebih mendalam"
                    color="indigo"
                />
                <InfoCard
                    icon={<BarChart2 size={20} />}
                    title="Statistik & Tren"
                    description="Visualisasi data terstruktur untuk memudahkan pengambilan keputusan"
                    color="purple"
                />
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-xl shadow max-w-4xl mx-auto mb-8">
                <div className="p-8">
                    {/* Download Section Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <Clock className="h-8 w-8 text-blue-500 bg-blue-50 p-1.5 rounded-lg" />
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-1">Rentang Tanggal Laporan</h2>
                            <p className="text-gray-500">Pilih rentang tanggal untuk mengunduh laporan ringkasan data</p>
                        </div>
                    </div>

                    {/* Alert */}
                    {show && (
                        <div className="mb-6 bg-red-50 border border-red-100 p-4 rounded-lg text-red-700 animate-fade-in">
                            <div className="flex items-start">
                                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-red-500" />
                                <p className="flex-grow text-l">{alertMessage}</p>
                                <button
                                    onClick={handleCloseAlert}
                                    className="text-red-400 hover:text-red-700 p-1 transition-colors"
                                    aria-label="Close alert"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Date Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <DateInputComponent
                            id="start-date"
                            label="Tanggal Mulai"
                            value={startDate}
                            onChange={handleStartDateChange}
                            max={formatDateForInput(new Date())}
                        />

                        <DateInputComponent
                            id="end-date"
                            label="Tanggal Selesai"
                            value={endDate}
                            onChange={handleEndDateChange}
                            min={startDate}
                            max={formatDateForInput(new Date())}
                        />
                    </div>

                    {/* Note */}
                    <div className="flex items-start gap-3 p-4 bg-gray-100 rounded-lg mb-6">
                        <Info size={18} className="text-gray-600 flex-shrink-0 mt-0.5" />
                        <p className="text-l text-gray-600 leading-relaxed">
                            Laporan akan berisi data kejadian kebakaran, titik hotspot, luas area terdampak, dan status penanganan dalam periode yang dipilih.
                        </p>
                    </div>

                    {/* Button */}
                    <div className="flex justify-center">
                        <button
                            onClick={handleDownload}
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg shadow hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-30 transition-all w-full md:w-auto flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Memproses...
                                </>
                            ) : (
                                <>
                                    <CloudDownload className="mr-2 h-5 w-5" />
                                    Download Laporan
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Usage Guide */}
            <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">Cara Penggunaan Laporan</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold text-lg mb-4">1</div>
                        <div>
                            <h4 className="font-semibold text-base text-gray-700 mb-2">Pilih Rentang Tanggal</h4>
                            <p className="text-l text-gray-500">Tentukan periode waktu laporan yang ingin diunduh</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold text-lg mb-4">2</div>
                        <div>
                            <h4 className="font-semibold text-base text-gray-700 mb-2">Download Laporan</h4>
                            <p className="text-l text-gray-500">Klik tombol Download Laporan dan tunggu proses selesai</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold text-lg mb-4">3</div>
                        <div>
                            <h4 className="font-semibold text-base text-gray-700 mb-2">Analisis Data</h4>
                            <p className="text-l text-gray-500">Buka file laporan untuk melihat data dan statistik lengkap</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProtectRoute(LaporanRingkasan);