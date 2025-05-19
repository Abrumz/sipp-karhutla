import React, { useState, useEffect, ChangeEvent } from 'react';
import { AlertCircle, Eye, EyeOff, Plus, X, Trash, Search } from 'lucide-react';
import { useRouter } from 'next/router';
import {
    updateUserGroundCheck,
    getDataUserGc,
    getAllProvinsi,
    getAllKabupaten,
    getAllKecamatanGc,
    getDaops
} from '@/services';

interface UbahPenggunaProps {
    userid?: string;
}

const toTitleCase = (phrase: string): string => {
    return phrase
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
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
                <p className="text-gray-500 leading-relaxed">{description}</p>
            </div>
        </div>
    );
};

const UbahPengguna: React.FC<UbahPenggunaProps> = ({ userid }) => {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [pageLoading, setPageLoading] = useState<boolean>(true);

    // Data untuk dropdown
    const [daopsList, setDaopsList] = useState<any[]>([]);
    const [provinceList, setProvinceList] = useState<any[]>([]);
    const [kabupatenList, setKabupatenList] = useState<any[]>([]);
    const [kecamatanList, setKecamatanList] = useState<any[]>([]);

    // Selected values
    const [daops, setDaops] = useState<string>('');
    const [province, setProvince] = useState<string>('');
    const [kabupaten, setKabupaten] = useState<string>('');
    const [kecamatan, setKecamatan] = useState<string>('');
    const [startDate, setStartDate] = useState<Date>(new Date());

    // Anggota
    const [stateAnggota, setStateAnggota] = useState<string>('');
    const [tblData, setTblData] = useState<{ name: string, action: string }[]>([]);

    // Form values
    const [values, setValues] = useState({
        id: '',
        name: '',
        email: '',
        password: '',
        cPassword: '',
        provinsi: '',
        kabupaten: '',
        patroli: '',
        daops: '',
        startDate: '',
        anggota: '',
        errorMessage: '',
        showDialog: false,
        showPassword: false,
        successDialog: true
    });

    // Alert
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [alertType, setAlertType] = useState<'success' | 'error'>('success');

    // Dropdown search and state
    const [provinsiSearch, setProvinsiSearch] = useState<string>('');
    const [kabupatenSearch, setKabupatenSearch] = useState<string>('');
    const [kecamatanSearch, setKecamatanSearch] = useState<string>('');
    const [daopsSearch, setDaopsSearch] = useState<string>('');

    const [showProvinsiDropdown, setShowProvinsiDropdown] = useState<boolean>(false);
    const [showKabupatenDropdown, setShowKabupatenDropdown] = useState<boolean>(false);
    const [showKecamatanDropdown, setShowKecamatanDropdown] = useState<boolean>(false);
    const [showDaopsDropdown, setShowDaopsDropdown] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!userid) return;

            try {
                setPageLoading(true);

                // Fetch user data
                const result = await getDataUserGc(userid);

                if (result.success) {
                    // Fetch all required dropdown data
                    const [dataProvinsi, dataDaops] = await Promise.all([
                        getAllProvinsi(),
                        getDaops()
                    ]);

                    setProvinceList(dataProvinsi);
                    setDaopsList(dataDaops);

                    const { data: user } = result;

                    if (user) {
                        // Set initial values from user data
                        setValues({
                            ...values,
                            id: userid,
                            name: user.nama,
                            email: user.email,
                            password: '',
                            cPassword: '',
                            provinsi: user.provinsi,
                            kabupaten: user.kabupaten,
                            patroli: user.patroli,
                            daops: user.daops,
                            startDate: user.tanggal,
                            anggota: user.anggota
                        });

                        // Set selected values for dropdown state
                        setProvince(user.provinsi);
                        setKabupaten(user.kabupaten);
                        setKecamatan(user.patroli);
                        setDaops(user.daops);

                        // Fetch dependent dropdown data
                        const dataKabupaten = await getAllKabupaten(user.provinsi);
                        setKabupatenList(dataKabupaten);

                        const dataKecamatan = await getAllKecamatanGc(user.kabupaten);
                        setKecamatanList(dataKecamatan);

                        // Set anggota table data
                        if (Array.isArray(user.anggota)) {
                            const anggotaData = user.anggota.map((name: any) => ({ name, action: '' }));
                            setTblData(anggotaData);
                        }
                    }
                } else {
                    setAlertMessage('Gagal memuat data pengguna');
                    setAlertType('error');
                    setShowAlert(true);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setAlertMessage('Terjadi kesalahan saat memuat data');
                setAlertType('error');
                setShowAlert(true);
            } finally {
                setPageLoading(false);
            }
        };

        fetchData();
    }, [userid]);

    const handleChange = (prop: string) => (
        event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleStartDateChange = (event: ChangeEvent<HTMLInputElement>) => {
        const date = new Date(event.target.value);
        setValues({
            ...values,
            startDate: event.target.value
        });
        setStartDate(date);
    };

    const handleProvinceChange = async (provinceId: string, provinceName: string) => {
        try {
            const data = await getAllKabupaten(provinceId);
            setValues({ ...values, provinsi: provinceId, kabupaten: '', patroli: '' });
            setKabupatenList(data);
            setProvince(provinceId);
            setKabupaten('');
            setKecamatan('');
            setKecamatanList([]);
            setShowProvinsiDropdown(false);
        } catch (error) {
            console.error("Error fetching kabupaten:", error);
            setAlertMessage('Gagal memuat data kabupaten');
            setAlertType('error');
            setShowAlert(true);
        }
    };

    const handleKabupatenChange = async (kabupatenId: string, kabupatenName: string) => {
        try {
            const data = await getAllKecamatanGc(kabupatenId);
            setValues({ ...values, kabupaten: kabupatenId, patroli: '' });
            setKecamatanList(data);
            setKabupaten(kabupatenId);
            setKecamatan('');
            setShowKabupatenDropdown(false);
        } catch (error) {
            console.error("Error fetching kecamatan:", error);
            setAlertMessage('Gagal memuat data kecamatan');
            setAlertType('error');
            setShowAlert(true);
        }
    };

    const handleKecamatanChange = (kecamatanId: string, kecamatanName: string) => {
        setValues({ ...values, patroli: kecamatanId });
        setKecamatan(kecamatanId);
        setShowKecamatanDropdown(false);
    };

    const handleDaopsChange = (daopsName: string) => {
        setValues({ ...values, daops: daopsName });
        setDaops(daopsName);
        setShowDaopsDropdown(false);
    };

    const validateForm = (): boolean => {
        if (!values.name) {
            setAlertMessage('Nama Ketua tidak boleh kosong');
            setAlertType('error');
            setShowAlert(true);
            return false;
        }

        if (!values.email) {
            setAlertMessage('Email Ketua tidak boleh kosong');
            setAlertType('error');
            setShowAlert(true);
            return false;
        }

        if (values.password && values.password !== values.cPassword) {
            setAlertMessage('Password dan Konfirmasi Password harus sama');
            setAlertType('error');
            setShowAlert(true);
            return false;
        }

        if (!values.provinsi || !values.kabupaten || !values.patroli || !values.daops || !values.startDate) {
            setAlertMessage('Semua field harus diisi');
            setAlertType('error');
            setShowAlert(true);
            return false;
        }

        return true;
    };

    const handleFormSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);

        try {
            const result = await updateUserGroundCheck(values);
            if (result.success) {
                setAlertMessage('Ubah Pengguna Ground Check Berhasil');
                setAlertType('success');
                setShowAlert(true);
                setTimeout(() => {
                    router.push('/groundcheck');
                }, 2000);
            } else {
                setAlertMessage(result.message as string);
                setAlertType('error');
                setShowAlert(true);
            }
        } catch (error) {
            console.error("Error updating user:", error);
            setAlertMessage('Terjadi kesalahan saat mengubah data pengguna');
            setAlertType('error');
            setShowAlert(true);
        } finally {
            setLoading(false);
        }
    };

    const moreAnggota = () => {
        if (!stateAnggota.trim()) return;

        const newAnggota = [...tblData, { name: stateAnggota, action: '' }];
        setTblData(newAnggota);
        setStateAnggota('');

        const dataAnggota = newAnggota.map(a => a.name);
        const joinAnggota = dataAnggota.join(',');
        setValues({ ...values, anggota: joinAnggota });
    };

    const deleteAnggota = (index: number) => {
        const updatedData = tblData.filter((_, i) => i !== index);
        setTblData(updatedData);

        const dataAnggota = updatedData.map(a => a.name);
        const joinAnggota = dataAnggota.join(',');
        setValues({ ...values, anggota: joinAnggota });
    };

    const closeAlert = () => setShowAlert(false);

    // Filter arrays for search
    const filteredProvinsi = provinceList.filter(item =>
        item.nama_wilayah.toLowerCase().includes(provinsiSearch.toLowerCase())
    );

    const filteredKabupaten = kabupatenList.filter(item =>
        item.nama_wilayah.toLowerCase().includes(kabupatenSearch.toLowerCase())
    );

    const filteredKecamatan = kecamatanList.filter(item =>
        item.nama_wilayah.toLowerCase().includes(kecamatanSearch.toLowerCase())
    );

    const filteredDaops = daopsList.filter(item =>
        item.nama_daops.toLowerCase().includes(daopsSearch.toLowerCase())
    );

    // Get selected item names for display
    const getSelectedProvinsiName = () => {
        const found = provinceList.find(item => item.kode_wilayah === province);
        return found ? toTitleCase(found.nama_wilayah) : "Pilih Provinsi";
    };

    const getSelectedKabupatenName = () => {
        const found = kabupatenList.find(item => item.kode_wilayah === kabupaten);
        return found ? toTitleCase(found.nama_wilayah) : "Pilih Kabupaten";
    };

    const getSelectedKecamatanName = () => {
        const found = kecamatanList.find(item => item.kode_wilayah === kecamatan);
        return found ? toTitleCase(found.nama_wilayah) : "Pilih Daerah Patroli";
    };

    return (
        <div className="bg-gray-50 min-h-full p-6">
            {/* Alert */}
            {showAlert && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-md flex justify-between items-center shadow-lg ${alertType === 'success'
                    ? 'bg-green-50 text-green-800 border-l-4 border-green-500'
                    : 'bg-red-50 text-red-800 border-l-4 border-red-500'
                    }`}>
                    <p>{alertMessage}</p>
                    <button
                        onClick={closeAlert}
                        className="ml-4 text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Header Banner */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-8 rounded-xl mb-8 shadow-md">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-3xl font-bold mb-2">Ubah Pengguna Ground Check</h1>
                    <p className="text-lg opacity-90">
                        Perbarui data pengguna ground check titik panas
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mb-8">
                <button
                    onClick={() => router.push('/groundcheck')}
                    className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                    <X className="w-4 h-4" />
                    <span>Batal dan Kembali</span>
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    <InfoCard
                        icon={<AlertCircle className="w-5 h-5" />}
                        title="Data Akun"
                        description="Isi data akun pengguna termasuk email dan password"
                        color="blue"
                    />
                    <InfoCard
                        icon={<AlertCircle className="w-5 h-5" />}
                        title="Wilayah Kerja"
                        description="Tentukan wilayah kerja petugas untuk melakukan ground check"
                        color="indigo"
                    />
                    <InfoCard
                        icon={<AlertCircle className="w-5 h-5" />}
                        title="Tim Patroli"
                        description="Kelola anggota tim yang akan membantu petugas utama"
                        color="purple"
                    />
                </div>

                {pageLoading ? (
                    <div className="flex justify-center items-center p-12 bg-white rounded-xl shadow">
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-600">Memuat data pengguna...</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Form Ubah Pengguna</h2>

                        <form className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nama Ketua <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Masukkan nama ketua"
                                        value={values.name}
                                        onChange={handleChange('name')}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Ketua <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Masukkan email ketua"
                                        value={values.email}
                                        onChange={handleChange('email')}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Password <span className="text-gray-400 text-xs">(Kosongkan jika tidak ingin mengubah)</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={values.showPassword ? 'text' : 'password'}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                                            placeholder="Masukkan password baru (opsional)"
                                            value={values.password}
                                            onChange={handleChange('password')}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setValues({ ...values, showPassword: !values.showPassword })}
                                        >
                                            {values.showPassword ? (
                                                <EyeOff className="h-5 w-5 text-gray-400" />
                                            ) : (
                                                <Eye className="h-5 w-5 text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Konfirmasi Password <span className="text-gray-400 text-xs">(Kosongkan jika tidak ingin mengubah)</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={values.showPassword ? 'text' : 'password'}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                                            placeholder="Masukkan konfirmasi password baru (opsional)"
                                            value={values.cPassword}
                                            onChange={handleChange('cPassword')}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setValues({ ...values, showPassword: !values.showPassword })}
                                        >
                                            {values.showPassword ? (
                                                <EyeOff className="h-5 w-5 text-gray-400" />
                                            ) : (
                                                <Eye className="h-5 w-5 text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Provinsi Dropdown */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Provinsi <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg flex justify-between items-center cursor-pointer"
                                            onClick={() => setShowProvinsiDropdown(!showProvinsiDropdown)}
                                        >
                                            <span className={province ? "text-gray-900" : "text-gray-500"}>
                                                {getSelectedProvinsiName()}
                                            </span>
                                            <svg className={`h-5 w-5 text-gray-400 transition-transform ${showProvinsiDropdown ? "transform rotate-180" : ""}`}
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                            </svg>
                                        </div>

                                        {showProvinsiDropdown && (
                                            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md overflow-auto border border-gray-200">
                                                <div className="sticky top-0 bg-white p-2 border-b border-gray-200">
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            placeholder="Cari provinsi..."
                                                            value={provinsiSearch}
                                                            onChange={(e) => setProvinsiSearch(e.target.value)}
                                                            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    </div>
                                                </div>

                                                <ul className="py-1">
                                                    {filteredProvinsi.length > 0 ? (
                                                        filteredProvinsi.map((option) => (
                                                            <li
                                                                key={option.kode_wilayah}
                                                                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-700"
                                                                onClick={() => handleProvinceChange(option.kode_wilayah, option.nama_wilayah)}
                                                            >
                                                                {toTitleCase(option.nama_wilayah)}
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li className="px-4 py-2 text-sm text-gray-500 text-center">
                                                            {provinsiSearch ? 'Tidak ada data yang sesuai dengan pencarian' : 'Tidak ada data provinsi'}
                                                        </li>
                                                    )}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Kabupaten Dropdown */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Kabupaten <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div
                                            className={`w-full px-4 py-2 border border-gray-300 rounded-lg flex justify-between items-center ${province ? "cursor-pointer" : "bg-gray-100 cursor-not-allowed"}`}
                                            onClick={() => province && setShowKabupatenDropdown(!showKabupatenDropdown)}
                                        >
                                            <span className={kabupaten ? "text-gray-900" : "text-gray-500"}>
                                                {getSelectedKabupatenName()}
                                            </span>
                                            <svg className={`h-5 w-5 text-gray-400 transition-transform ${showKabupatenDropdown ? "transform rotate-180" : ""}`}
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                            </svg>
                                        </div>

                                        {showKabupatenDropdown && province && (
                                            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md overflow-auto border border-gray-200">
                                                <div className="sticky top-0 bg-white p-2 border-b border-gray-200">
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            placeholder="Cari kabupaten..."
                                                            value={kabupatenSearch}
                                                            onChange={(e) => setKabupatenSearch(e.target.value)}
                                                            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    </div>
                                                </div>

                                                <ul className="py-1">
                                                    {filteredKabupaten.length > 0 ? (
                                                        filteredKabupaten.map((option) => (
                                                            <li
                                                                key={option.kode_wilayah}
                                                                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-700"
                                                                onClick={() => handleKabupatenChange(option.kode_wilayah, option.nama_wilayah)}
                                                            >
                                                                {toTitleCase(option.nama_wilayah)}
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li className="px-4 py-2 text-sm text-gray-500 text-center">
                                                            {kabupatenSearch ? 'Tidak ada data yang sesuai dengan pencarian' : 'Tidak ada data kabupaten'}
                                                        </li>
                                                    )}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Daops Dropdown */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Daops <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg flex justify-between items-center cursor-pointer"
                                            onClick={() => setShowDaopsDropdown(!showDaopsDropdown)}
                                        >
                                            <span className={daops ? "text-gray-900" : "text-gray-500"}>
                                                {daops || "Pilih Daops"}
                                            </span>
                                            <svg className={`h-5 w-5 text-gray-400 transition-transform ${showDaopsDropdown ? "transform rotate-180" : ""}`}
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                            </svg>
                                        </div>

                                        {showDaopsDropdown && (
                                            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md overflow-auto border border-gray-200">
                                                <div className="sticky top-0 bg-white p-2 border-b border-gray-200">
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            placeholder="Cari daops..."
                                                            value={daopsSearch}
                                                            onChange={(e) => setDaopsSearch(e.target.value)}
                                                            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    </div>
                                                </div>

                                                <ul className="py-1">
                                                    {filteredDaops.length > 0 ? (
                                                        filteredDaops.map((option) => (
                                                            <li
                                                                key={option.nama_daops}
                                                                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-700"
                                                                onClick={() => handleDaopsChange(option.nama_daops)}
                                                            >
                                                                {option.nama_daops}
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li className="px-4 py-2 text-sm text-gray-500 text-center">
                                                            {daopsSearch ? 'Tidak ada data yang sesuai dengan pencarian' : 'Tidak ada data daops'}
                                                        </li>
                                                    )}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Daerah Patroli Dropdown */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Daerah Patroli <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div
                                            className={`w-full px-4 py-2 border border-gray-300 rounded-lg flex justify-between items-center ${kabupaten ? "cursor-pointer" : "bg-gray-100 cursor-not-allowed"}`}
                                            onClick={() => kabupaten && setShowKecamatanDropdown(!showKecamatanDropdown)}
                                        >
                                            <span className={kecamatan ? "text-gray-900" : "text-gray-500"}>
                                                {getSelectedKecamatanName()}
                                            </span>
                                            <svg className={`h-5 w-5 text-gray-400 transition-transform ${showKecamatanDropdown ? "transform rotate-180" : ""}`}
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                            </svg>
                                        </div>

                                        {showKecamatanDropdown && kabupaten && (
                                            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md overflow-auto border border-gray-200">
                                                <div className="sticky top-0 bg-white p-2 border-b border-gray-200">
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            placeholder="Cari daerah patroli..."
                                                            value={kecamatanSearch}
                                                            onChange={(e) => setKecamatanSearch(e.target.value)}
                                                            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    </div>
                                                </div>

                                                <ul className="py-1">
                                                    {filteredKecamatan.length > 0 ? (
                                                        filteredKecamatan.map((option) => (
                                                            <li
                                                                key={option.kode_wilayah}
                                                                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-700"
                                                                onClick={() => handleKecamatanChange(option.kode_wilayah, option.nama_wilayah)}
                                                            >
                                                                {toTitleCase(option.nama_wilayah)}
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li className="px-4 py-2 text-sm text-gray-500 text-center">
                                                            {kecamatanSearch ? 'Tidak ada data yang sesuai dengan pencarian' : 'Tidak ada data daerah patroli'}
                                                        </li>
                                                    )}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tanggal <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={values.startDate}
                                        onChange={handleStartDateChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tambah Anggota
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Nama anggota"
                                            value={stateAnggota}
                                            onChange={(e) => setStateAnggota(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={moreAnggota}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span>Tambah</span>
                                        </button>
                                    </div>

                                    {tblData.length > 0 && (
                                        <div className="mt-4 border rounded-lg overflow-hidden">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Anggota</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {tblData.map((row, index) => (
                                                        <tr key={index} className="hover:bg-gray-50">
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{row.name}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => deleteAnggota(index)}
                                                                    className="p-1 text-red-600 hover:text-red-800 transition-colors"
                                                                    title="Hapus"
                                                                >
                                                                    <Trash className="w-5 h-5" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-center mt-8">
                                <button
                                    type="button"
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors w-full md:w-64"
                                    onClick={handleFormSubmit}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="w-5 h-5 border-2 border-r-transparent border-white rounded-full animate-spin mr-2"></div>
                                            <span>Memproses...</span>
                                        </div>
                                    ) : (
                                        'Ubah Pengguna'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="mt-8 p-6 bg-white rounded-xl shadow">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-2">Informasi Penggunaan</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Halaman ini digunakan untuk mengubah data pengguna yang memiliki akses ke modul ground check titik panas.
                                Anda dapat memperbarui informasi pengguna, wilayah kerja, dan daftar anggota tim. Kosongkan kolom password
                                jika Anda tidak ingin mengubah password pengguna.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UbahPengguna;