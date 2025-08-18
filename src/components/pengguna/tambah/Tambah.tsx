import React, { ChangeEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useAuth from '@/context/auth';
import { RoleData } from '@/interfaces';
import { addUser, getNonPatroliRoles } from '@/services';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface TambahProps { }

const Tambah: React.FC<TambahProps> = () => {
    const { isAuthenticated, user } = useAuth();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState<RoleData[]>([]);
    const [roleType, setRoleType] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [dialogSuccess, setDialogSuccess] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const [formData, setFormData] = useState({
        registrationNumber: '',
        name: '',
        email: '',
        phoneNumber: '',
        password: '',
        cPassword: '',
        r_role_id: ''
    });

    const handleChange = (prop: string) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement> | string) => {
        if (prop === 'phoneNumber') {
            let value = event as string;

            if (value && !value.startsWith('+')) {
                value = '+' + value;
            }

            if (value === '+' || value === '') {
                value = '';
            }

            setFormData({
                ...formData,
                [prop]: value
            });
        } else {
            const inputEvent = event as ChangeEvent<HTMLInputElement | HTMLSelectElement>;
            setFormData({
                ...formData,
                [prop]: inputEvent.target.value
            });

            if (prop === 'r_role_id') {
                setRoleType(inputEvent.target.value);
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const resetForm = () => {
        setFormData({
            registrationNumber: '',
            name: '',
            email: '',
            phoneNumber: '',
            password: '',
            cPassword: '',
            r_role_id: ''
        });
        setRoleType('');
        setShowDialog(false);
    };

    const closeDialog = () => {
        if (dialogSuccess) {
            resetForm();
        } else {
            setShowDialog(false);
        }
    };

    const validateForm = () => {
        if (!formData.registrationNumber.trim()) {
            alert('Nomor Registrasi/NIP tidak boleh kosong');
            return false;
        }
        if (!formData.name.trim()) {
            alert('Nama tidak boleh kosong');
            return false;
        }
        if (!formData.email.trim()) {
            alert('Email tidak boleh kosong');
            return false;
        }
        if (!formData.phoneNumber.trim()) {
            alert('Nomor Telepon tidak boleh kosong');
            return false;
        }
        if (!formData.password) {
            alert('Password tidak boleh kosong');
            return false;
        }
        if (formData.password !== formData.cPassword) {
            alert('Konfirmasi Password tidak sama');
            return false;
        }
        if (!formData.r_role_id) {
            alert('Hak Akses harus dipilih');
            return false;
        }
        return true;
    };

    const handleFormSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const result = await addUser(formData);
            if (result.success) {
                setDialogSuccess(true);
                setShowDialog(true);
            } else {
                setDialogSuccess(false);
                setErrorMessage(result.message as string);
                setShowDialog(true);
            }
        } catch (error) {
            console.error("Error adding user:", error);
            setDialogSuccess(false);
            setErrorMessage("Terjadi kesalahan saat menambahkan pengguna");
            setShowDialog(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedRoles = await getNonPatroliRoles();
                setRoles(fetchedRoles);
            } catch (error) {
                console.error("Error fetching roles:", error);
            }
        };

        if (isAuthenticated) fetchData();
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="bg-gray-50 min-h-full p-6">
            <div className="header-primary text-white p-8 rounded-xl mb-8 shadow-md">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="flex justify-start mb-4">
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center px-3 py-1 rounded-md bg-green-600 text-sm font-medium text-white hover:bg-green-700 transition duration-150 ease-in-out"
                        >
                            <span className="mr-1">&#8592;</span> Kembali
                        </button>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Tambah Pengguna</h1>
                    <p className="text-lg opacity-90">
                        Daftarkan pengguna baru dan atur hak akses sesuai dengan peran dan tanggung jawab
                    </p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto mb-8">
                <div className="p-6 bg-white rounded-xl shadow mb-8">
                    <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <div>
                            <h3 className="font-semibold text-black-800 mb-2">Informasi Pendaftaran</h3>
                            <p className="text-l text-black-600 leading-relaxed">
                                Formulir ini digunakan untuk mendaftarkan pengguna baru dalam sistem.
                                Pastikan semua kolom yang ditandai dengan <span className="text-red-500">*</span> diisi dengan benar.
                                Untuk format nomor telepon, gunakan format internasional seperti +62xxxxxxxxxxx.
                                Hak akses akan menentukan tingkat otoritas pengguna dalam mengakses fitur sistem.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow p-8">
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-black-700 text-sm font-bold mb-2" htmlFor="registration-number">
                                    Nomor Registrasi/NIP <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="registration-number"
                                    type="text"
                                    placeholder="Masukkan Nomor Registrasi/NIP"
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-black-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
                                    value={formData.registrationNumber}
                                    onChange={handleChange('registrationNumber')}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-black-700 text-sm font-bold mb-2" htmlFor="name">
                                    Nama <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Masukkan Nama"
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-black-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
                                    value={formData.name}
                                    onChange={handleChange('name')}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-black-700 text-sm font-bold mb-2" htmlFor="email">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Masukkan Email"
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-black-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
                                    value={formData.email}
                                    onChange={handleChange('email')}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-black-700 text-sm font-bold mb-2" htmlFor="phone-number">
                                    Nomor Telepon <span className="text-red-500">*</span>
                                </label>
                                <PhoneInput
                                    country={'id'}
                                    value={formData.phoneNumber.replace(/^\+/, '')}
                                    onChange={(value) => handleChange('phoneNumber')(value)}
                                    inputProps={{
                                        id: 'phone-number',
                                        name: 'phoneNumber',
                                        required: true,
                                        className: "shadow appearance-none border rounded w-full py-3 pl-14 pr-4 text-black-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
                                    }}
                                    containerClass="w-full"
                                    dropdownClass="bg-white shadow-lg"
                                    countryCodeEditable={false}
                                    disableDropdown={false}
                                    enableSearch={true}
                                    preferredCountries={['id']}
                                    searchPlaceholder="Cari negara..."
                                />
                                <p className="text-xs text-black-500 mt-1">Format nomor telepon internasional akan otomatis disesuaikan dengan negara yang dipilih</p>
                            </div>

                            <div>
                                <label className="block text-black-700 text-sm font-bold mb-2" htmlFor="password">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Masukkan Password"
                                        className="shadow appearance-none border rounded w-full py-3 px-4 text-black-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
                                        value={formData.password}
                                        onChange={handleChange('password')}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={togglePasswordVisibility}
                                    >
                                        {showPassword ? (
                                            <svg className="h-5 w-5 text-black-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                            </svg>
                                        ) : (
                                            <svg className="h-5 w-5 text-black-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-black-700 text-sm font-bold mb-2" htmlFor="confirm-password">
                                    Konfirmasi Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirm-password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Masukkan Konfirmasi Password"
                                        className="shadow appearance-none border rounded w-full py-3 px-4 text-black-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
                                        value={formData.cPassword}
                                        onChange={handleChange('cPassword')}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={togglePasswordVisibility}
                                    >
                                        {showPassword ? (
                                            <svg className="h-5 w-5 text-black-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                            </svg>
                                        ) : (
                                            <svg className="h-5 w-5 text-black-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-black-700 text-sm font-bold mb-2" htmlFor="role">
                                    Hak Akses <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="role"
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-black-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
                                    value={roleType}
                                    onChange={handleChange('r_role_id')}
                                    required
                                >
                                    <option value="">Pilih Hak Akses</option>
                                    {roles.map((role) => (
                                        user && role.level > user.roleLevel && (
                                            <option key={role.level} value={role.id}>
                                                {role.name}
                                            </option>
                                        )
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 pt-6">
                            <button
                                type="button"
                                onClick={handleFormSubmit}
                                className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-md font-medium flex-1 transition-colors flex justify-center items-center"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Sedang Menambahkan...</span>
                                    </>
                                ) : (
                                    'Tambah Pengguna'
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push('/pengguna')}
                                className="bg-gray-200 hover:bg-gray-300 text-black-800 py-3 px-6 rounded-md font-medium flex-1 transition-colors"
                            >
                                Batal
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {showDialog && (
                <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg w-full max-w-md mx-4 md:mx-auto shadow-xl">
                        <div className="flex justify-between items-center px-6 py-4 border-b">
                            <h4 className="text-lg font-semibold text-black-800">
                                {dialogSuccess ? 'Tambah Pengguna Berhasil' : 'Tambah Pengguna Gagal'}
                            </h4>
                            <button
                                className="text-black-500 hover:text-black-700"
                                onClick={closeDialog}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>

                        <div className="px-6 py-4 border-b">
                            {dialogSuccess ? (
                                <div className="flex items-center justify-center text-green-500 mb-4">
                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center text-red-500 mb-4">
                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                            )}
                            <p className="text-center text-black-700">
                                {dialogSuccess
                                    ? 'Pengguna berhasil ditambahkan ke dalam sistem.'
                                    : errorMessage || 'Terjadi kesalahan saat menambahkan pengguna.'}
                            </p>
                        </div>

                        <div className="px-6 py-4 flex justify-center space-x-4">
                            {dialogSuccess ? (
                                <>
                                    <button
                                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors"
                                        onClick={resetForm}
                                    >
                                        Tambah Pengguna Lagi
                                    </button>
                                    <button
                                        className="bg-gray-200 hover:bg-gray-300 text-black-800 py-2 px-4 rounded transition-colors"
                                        onClick={() => router.push('/pengguna')}
                                    >
                                        Kembali ke Daftar Pengguna
                                    </button>
                                </>
                            ) : (
                                <button
                                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors"
                                    onClick={closeDialog}
                                >
                                    Tutup
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tambah;