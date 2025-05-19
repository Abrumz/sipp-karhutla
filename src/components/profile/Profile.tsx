import { ChangeEvent, MouseEvent, useEffect, useState } from 'react'
import Loader from '@/components/loader/Loader'
import useAuth from '@/context/auth'
import { UserData } from '@/interfaces'
import { getUserCookie, setUserCookie, updateUser } from '@/services'
import { User, Mail, Phone, Building, Key, Eye, EyeOff, Save, AlertTriangle, CheckCircle, Badge } from 'lucide-react'
import SiteLayout from '@/components/layout/siteLayout/SiteLayout'

function Profile() {
    const { isAuthenticated, user } = useAuth()

    const [loading, setLoading] = useState(false)
    const [values, setValues] = useState({
        id: '',
        registrationNumber: '',
        oldRegistrationNumber: '',
        name: '',
        email: '',
        oldEmail: '',
        phoneNumber: '',
        photo: '',
        organization: '',
        password: '',
        cPassword: '',
        r_role_id: '',
        errorMessage: '',
        showPassword: false,
        showAlert: false,
        alertMessage: '',
        alertSuccess: true
    })

    const handleChange = (prop: string) => (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        setValues({ ...values, [prop]: event.target.value })
    }

    const handleFormSubmit = async () => {
        setLoading(true)
        const result = await updateUser(values)
        if (result.success) {
            setValues({
                ...values,
                showAlert: true,
                alertMessage: result.message as string,
                alertSuccess: result.success
            })
            const updatedUser: UserData = {
                id: parseInt(values.id, 10),
                name: values.name,
                email: values.email,
                registrationNumber: values.registrationNumber,
                phoneNumber: values.phoneNumber,
                organization: values.organization,
                photo: values.photo,
                accessId: user.accessId,
                role: user.role,
                roleLevel: user.roleLevel,
                roleName: user.roleName
            }
            setUserCookie(updatedUser)
        } else {
            setValues({
                ...values,
                showAlert: true,
                alertMessage: result.message as string,
                alertSuccess: result.success
            })
        }
        setLoading(false)
    }

    const handleClickShowPassword = () =>
        setValues({ ...values, showPassword: !values.showPassword })

    const handleMouseDownPassword = (event: MouseEvent) =>
        event.preventDefault()

    useEffect(() => {
        if (isAuthenticated) {
            const user = JSON.parse(getUserCookie())
            setValues({
                ...values,
                id: user.id,
                registrationNumber: user.registrationNumber,
                oldRegistrationNumber: user.registrationNumber,
                name: user.name,
                email: user.email,
                oldEmail: user.email,
                phoneNumber: user.phoneNumber,
                photo: user.photo,
                organization: user.instantion
            })
        }
    }, [isAuthenticated])

    return !isAuthenticated ? (
        <Loader />
    ) : (
        <div className="bg-gray-50 min-h-screen pb-8">
            {/* Header with subtle animation */}
            <div className="relative py-8 px-4 mb-8 overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-b-lg shadow-lg">
                {/* Background patterns */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -mt-20 -mr-20"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full -mb-20 -ml-20"></div>

                <div className="relative flex flex-col items-center justify-center text-center z-10">
                    <div className="flex items-center mb-2">
                        <User className="text-white w-8 h-8 mr-3" />
                        <h1 className="text-3xl font-bold">
                            Profil Pengguna
                        </h1>
                    </div>
                    <p className="text-blue-100 text-lg max-w-2xl">
                        Kelola informasi akun dan kata sandi Anda
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4">
                {/* Profile Image Section */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-blue-100 flex items-center justify-center">
                            {values.photo ? (
                                <img
                                    src={values.photo}
                                    alt="Foto Profile"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <User className="h-16 w-16 text-blue-600" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Alert */}
                {values.showAlert && (
                    <div className="max-w-2xl mx-auto mb-6">
                        <div
                            className={`p-4 rounded-xl shadow-md flex items-start justify-between ${values.alertSuccess
                                ? 'bg-green-50 border-l-4 border-green-500 text-green-800'
                                : 'bg-red-50 border-l-4 border-red-500 text-red-800'
                                }`}
                        >
                            <div className="flex items-center">
                                {values.alertSuccess ? (
                                    <CheckCircle className="h-5 w-5 mr-3 text-green-500" />
                                ) : (
                                    <AlertTriangle className="h-5 w-5 mr-3 text-red-500" />
                                )}
                                <span>{values.alertMessage}</span>
                            </div>
                            <button
                                onClick={() => {
                                    setValues({
                                        ...values,
                                        alertMessage: '',
                                        showAlert: false
                                    })
                                }}
                                className="text-l hover:bg-gray-200 hover:bg-opacity-50 h-6 w-6 flex items-center justify-center rounded-full"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                )}

                {/* Main Content Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* User Info Card */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                            <div className="flex items-center">
                                <User className="h-5 w-5 mr-2" />
                                <h2 className="text-xl font-bold">Data Pengguna</h2>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Access Rights Field */}
                            <div className="flex items-start">
                                <div className="bg-blue-600 rounded-full p-2 mr-4 text-white flex-shrink-0">
                                    <Badge className="h-5 w-5" />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-medium text-gray-800 mb-2">Hak Akses</h3>
                                    <input
                                        id="role"
                                        className="w-full py-2 px-3 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        type="text"
                                        value={user.roleName}
                                        disabled
                                    />
                                </div>
                            </div>

                            {/* Registration Number Field */}
                            <div className="flex items-start">
                                <div className="bg-blue-600 rounded-full p-2 mr-4 text-white flex-shrink-0">
                                    <Badge className="h-5 w-5" />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-medium text-gray-800 mb-2">Nomor Registrasi/NIP</h3>
                                    <input
                                        id="registration-number"
                                        className="w-full py-2 px-3 bg-white text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        type="text"
                                        onChange={handleChange('registrationNumber')}
                                        value={values.registrationNumber}
                                    />
                                </div>
                            </div>

                            {/* Name Field */}
                            <div className="flex items-start">
                                <div className="bg-blue-600 rounded-full p-2 mr-4 text-white flex-shrink-0">
                                    <User className="h-5 w-5" />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-medium text-gray-800 mb-2">Nama</h3>
                                    <input
                                        id="name"
                                        className="w-full py-2 px-3 bg-white text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        type="text"
                                        required
                                        onChange={handleChange('name')}
                                        value={values.name}
                                    />
                                </div>
                            </div>

                            {/* Email Field */}
                            <div className="flex items-start">
                                <div className="bg-blue-600 rounded-full p-2 mr-4 text-white flex-shrink-0">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-medium text-gray-800 mb-2">Email</h3>
                                    <input
                                        id="email"
                                        className="w-full py-2 px-3 bg-white text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        type="email"
                                        onChange={handleChange('email')}
                                        value={values.email}
                                    />
                                </div>
                            </div>

                            {/* Phone Number Field */}
                            <div className="flex items-start">
                                <div className="bg-blue-600 rounded-full p-2 mr-4 text-white flex-shrink-0">
                                    <Phone className="h-5 w-5" />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-medium text-gray-800 mb-2">Nomor Telepon</h3>
                                    <input
                                        id="phone-number"
                                        className="w-full py-2 px-3 bg-white text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        type="tel"
                                        required
                                        onChange={handleChange('phoneNumber')}
                                        value={values.phoneNumber}
                                    />
                                    <p className="text-gray-500 text-l mt-1">Format nomor telepon: +62xxxxxxxxxxx</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Password Card */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                            <div className="flex items-center">
                                <Key className="h-5 w-5 mr-2" />
                                <h2 className="text-xl font-bold">Kata Sandi</h2>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Password Field */}
                            <div>
                                <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                                    <Key className="h-4 w-4 mr-2 text-blue-600" />
                                    Kata Sandi Baru
                                </h3>
                                <div className="relative">
                                    <input
                                        id="password"
                                        className="w-full py-2 px-3 bg-white text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                                        type={values.showPassword ? 'text' : 'password'}
                                        onChange={handleChange('password')}
                                        value={values.password}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                    >
                                        {values.showPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-500" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-500" />
                                        )}
                                    </button>
                                </div>
                                <p className="text-gray-500 text-l mt-1">Silakan isi untuk mengubah kata sandi</p>
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                                    <Key className="h-4 w-4 mr-2 text-blue-600" />
                                    Konfirmasi Kata Sandi
                                </h3>
                                <div className="relative">
                                    <input
                                        id="confirmation-password"
                                        className="w-full py-2 px-3 bg-white text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                                        type={values.showPassword ? 'text' : 'password'}
                                        onChange={handleChange('cPassword')}
                                        value={values.cPassword}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                    >
                                        {values.showPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-500" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-500" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Button Card */}
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex flex-col sm:flex-row items-center justify-between">
                            <div className="flex items-center mb-4 sm:mb-0">
                                <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                                    <User className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Data Profil</h3>
                                    <p className="text-gray-600">Simpan perubahan yang Anda buat</p>
                                </div>
                            </div>
                            {loading ? (
                                <div className="flex justify-center items-center h-10 w-32">
                                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600"></div>
                                </div>
                            ) : (
                                <button
                                    className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
                                    onClick={handleFormSubmit}
                                >
                                    <Save className="h-5 w-5 mr-2" />
                                    Simpan
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile