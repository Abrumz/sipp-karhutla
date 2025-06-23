import React, { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useAuth from '@/context/auth';
import { getUserDetail, updateUser } from '@/services';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface UbahProps {
    userId: string;
}

const Ubah: React.FC<UbahProps> = ({ userId }) => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState<'success' | 'info' | 'warning' | 'error'>('warning');
    const [alertMessage, setAlertMessage] = useState('');

    const [formData, setFormData] = useState({
        id: '',
        registrationNumber: '',
        oldRegistrationNumber: '',
        name: '',
        email: '',
        oldEmail: '',
        phoneNumber: '',
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
        }
    };

    const validateForm = () => {
        if (!formData.registrationNumber.trim()) {
            showAlertMessage('warning', 'Nomor Registrasi/NIP tidak boleh kosong');
            return false;
        }
        if (!formData.name.trim()) {
            showAlertMessage('warning', 'Nama tidak boleh kosong');
            return false;
        }
        if (!formData.email.trim()) {
            showAlertMessage('warning', 'Email tidak boleh kosong');
            return false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            showAlertMessage('warning', 'Format email tidak valid');
            return false;
        }
        if (!formData.phoneNumber.trim()) {
            showAlertMessage('warning', 'Nomor Telepon tidak boleh kosong');
            return false;
        }
        return true;
    };

    const showAlertMessage = (type: 'success' | 'info' | 'warning' | 'error', message: string) => {
        setAlertType(type);
        setAlertMessage(message);
        setShowAlert(true);

        setTimeout(() => {
            setShowAlert(false);
        }, 5000);
    };

    const handleFormSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const result = await updateUser(formData);
            if (result.success) {
                router.push('/pengguna?alert=Ubah data pengguna berhasil');
            } else {
                showAlertMessage('error', result.message as string);
            }
        } catch (error) {
            console.error("Error updating user:", error);
            showAlertMessage('error', "Terjadi kesalahan saat memperbarui data pengguna");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const getUserData = async () => {
            if (userId) {
                try {
                    const result = await getUserDetail(userId);
                    if (result.success) {
                        const { data: user } = result;
                        if (user) {
                            setFormData({
                                id: user.id.toString(),
                                registrationNumber: user.registrationNumber,
                                oldRegistrationNumber: user.registrationNumber,
                                name: user.name,
                                email: user.email,
                                oldEmail: user.email,
                                phoneNumber: user.phoneNumber,
                                r_role_id: user.role.toString()
                            });
                        }
                    } else {
                        setNotFound(true);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setNotFound(true);
                }
            }
        };

        if (isAuthenticated) getUserData();
    }, [isAuthenticated, userId]);

    if (!isAuthenticated) {
        return null;
    }

    if (notFound) {
        return (
            <div className="bg-gray-50 min-h-full p-6 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow p-8 text-center">
                    <div className="text-red-500 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-black-800 mb-2">Pengguna Tidak Ditemukan</h2>
                    <p className="text-black-600 mb-6">Maaf, data pengguna yang Anda cari tidak dapat ditemukan.</p>
                    <button
                        onClick={() => router.push('/pengguna')}
                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md transition-colors"
                    >
                        Kembali ke Daftar Pengguna
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-full p-6">
            {showAlert && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-md flex justify-between items-center shadow-lg ${alertType === 'success' ? 'bg-green-50 text-green-800 border-l-4 border-green-500' :
                    alertType === 'error' ? 'bg-red-50 text-red-800 border-l-4 border-red-500' :
                        alertType === 'warning' ? 'bg-yellow-50 text-yellow-800 border-l-4 border-yellow-500' :
                            'bg-blue-50 text-blue-800 border-l-4 border-blue-500'
                    }`}>
                    <p>{alertMessage}</p>
                    <button
                        onClick={() => setShowAlert(false)}
                        className="ml-4 text-black-500 hover:text-black-700"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            )}

            <div className="header-primary text-white p-8 rounded-xl mb-8 shadow-md">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-3xl font-bold mb-2">Ubah Data Pengguna</h1>
                    <p className="text-lg opacity-90">
                        Perbarui informasi data pengguna dalam sistem
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
                            <h3 className="font-semibold text-black-800 mb-2">Informasi Pengubahan Data</h3>
                            <p className="text-l text-black-600 leading-relaxed">
                                Formulir ini digunakan untuk mengubah data pengguna yang sudah terdaftar dalam sistem.
                                Pastikan semua kolom yang ditandai dengan <span className="text-red-500">*</span> diisi dengan benar.
                                Untuk format nomor telepon, gunakan format internasional seperti +62xxxxxxxxxxx.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow p-8">
                    <form className="space-y-6">
                        <div className="space-y-6">
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
                                        <span>Menyimpan...</span>
                                    </>
                                ) : (
                                    'Simpan Perubahan'
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
        </div>
    );
};

export default Ubah;