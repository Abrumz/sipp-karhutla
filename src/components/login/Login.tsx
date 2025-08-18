import { ChangeEvent, MouseEvent, useState, useEffect, FormEvent, useRef } from 'react'
import { useRouter } from 'next/router'
import useAuth from '@/context/auth'
import { loginValidator } from '@/validators'
import Swal from 'sweetalert2'
import Link from 'next/link'
import favicon from '@/assets/img/sipp-favicon.png'
import Image from 'next/image'

interface LoginValues {
    email: string;
    password: string;
    alertMessage: string;
    emailError: boolean;
    passwordError: boolean;
    showAlert: boolean;
    showPassword: boolean;
    captchaToken: string | null;
    captchaError: boolean;
}

interface LoginFormProps {
    redirectTo?: string;
    customClass?: string;
}

const LoginForm = ({ redirectTo, customClass }: LoginFormProps) => {
    const router = useRouter()
    const { login } = useAuth()
    const [loading, setLoading] = useState(false)
    const [cardAnimation, setCardAnimation] = useState<string>('opacity-0 translate-y-4')
    const [visualCaptcha, setVisualCaptcha] = useState({ question: '', answer: '' })
    const [userAnswer, setUserAnswer] = useState('')
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const [values, setValues] = useState<LoginValues>({
        email: '',
        password: '',
        alertMessage: '',
        emailError: false,
        passwordError: false,
        showAlert: false,
        showPassword: false,
        captchaToken: null,
        captchaError: false
    })

    useEffect(() => {
        const timer = setTimeout(() => {
            setCardAnimation('opacity-100 translate-y-0 transition-all duration-500 ease-out')
        }, 100)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        generateVisualCaptcha()
    }, [])

    const generateVisualCaptcha = () => {
        const chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
        const captchaLength = 5;
        let captchaText = '';

        for (let i = 0; i < captchaLength; i++) {
            captchaText += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        setVisualCaptcha({
            question: captchaText,
            answer: captchaText
        })
        setUserAnswer('')

        setTimeout(() => {
            drawCaptcha(captchaText)
        }, 100)
    }

    const drawCaptcha = (text: string) => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        canvas.width = 200
        canvas.height = 60

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
        gradient.addColorStop(0, '#f8f9fa')
        gradient.addColorStop(1, '#e9ecef')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        for (let i = 0; i < 50; i++) {
            ctx.fillStyle = `rgba(${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 100}, 0.3)`
            ctx.beginPath()
            ctx.arc(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                Math.random() * 2 + 1,
                0,
                2 * Math.PI
            )
            ctx.fill()
        }

        for (let i = 0; i < 5; i++) {
            ctx.strokeStyle = `rgba(${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 100}, 0.3)`
            ctx.lineWidth = Math.random() * 2 + 1
            ctx.beginPath()
            ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height)
            ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height)
            ctx.stroke()
        }

        const colors = ['#8B4513', '#4B0082', '#2F4F4F', '#800000', '#2E8B57']
        for (let i = 0; i < text.length; i++) {
            const char = text[i]
            const x = 25 + i * 28 + (Math.random() * 10 - 5)
            const y = 35 + (Math.random() * 8 - 4)
            const rotation = (Math.random() * 0.5 - 0.25)

            ctx.save()
            ctx.translate(x, y)
            ctx.rotate(rotation)

            ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)]
            ctx.font = 'bold 24px serif'
            ctx.textAlign = 'center'
            ctx.fillText(char, 0, 0)

            ctx.shadowColor = 'rgba(0,0,0,0.3)'
            ctx.shadowOffsetX = 1
            ctx.shadowOffsetY = 1
            ctx.shadowBlur = 1

            ctx.restore()
        }

        for (let i = 0; i < 20; i++) {
            ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.1)`
            ctx.fillRect(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                Math.random() * 4 + 1,
                Math.random() * 4 + 1
            )
        }
    }

    const handleClickShowPassword = () =>
        setValues({ ...values, showPassword: !values.showPassword })

    const handleMouseDownPassword = (event: MouseEvent) =>
        event.preventDefault()

    const handleChange = (prop: string) => (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        if (prop === 'email' && values.emailError) {
            setValues({
                ...values,
                [prop]: event.target.value,
                emailError: false
            })
        } else if (prop === 'password' && values.passwordError) {
            setValues({
                ...values,
                [prop]: event.target.value,
                passwordError: false
            })
        } else {
            setValues({ ...values, [prop]: event.target.value })
        }
    }

    const onVisualCaptchaChange = (e: ChangeEvent<HTMLInputElement>) => {
        const userInput = e.target.value.toUpperCase();
        setUserAnswer(userInput);
        setValues({
            ...values,
            captchaToken: userInput === visualCaptcha.answer ? 'valid' : null,
            captchaError: userInput !== visualCaptcha.answer && userInput !== ''
        })
    }

    const showSuccessAlert = (userData: any) => {
        const userName = userData?.name || userData?.full_name || getUserNameFromEmail(values.email);
        const hour = new Date().getHours();
        let greeting = "";
        if (hour < 12) {
            greeting = "Selamat pagi";
        } else if (hour < 15) {
            greeting = "Selamat siang";
        } else if (hour < 18) {
            greeting = "Selamat sore";
        } else {
            greeting = "Selamat malam";
        }
        Swal.fire({
            icon: 'success',
            title: `${greeting}, ${userName}!`,
            text: 'Senang melihat Anda kembali di SIPP Karhutla',
            timer: 3000,
            showConfirmButton: false,
            timerProgressBar: true,
            customClass: {
                popup: 'animate__animated animate__fadeInUp',
                title: 'text-xl font-bold text-black-800',
                htmlContainer: 'text-black-600'
            },
            background: 'rgba(255, 255, 255, 0.95)',
            backdrop: 'rgba(0, 0, 123, 0.1)'
        });
    }

    const getUserNameFromEmail = (email: string): string => {
        if (!email) return "Pengguna";
        const namePart = email.split('@')[0];
        if (namePart.includes('.') || namePart.includes('_')) {
            return namePart
                .split(/[._]/)
                .map(part => part.charAt(0).toUpperCase() + part.slice(1))
                .join(' ');
        }
        return namePart.charAt(0).toUpperCase() + namePart.slice(1);
    }

    const showErrorAlert = (message: string) => {
        Swal.fire({
            icon: 'error',
            title: 'Login Gagal',
            text: 'Email atau Password salah. Silakan coba lagi.',
            timer: 1500,
            showConfirmButton: false,
            timerProgressBar: true,
            customClass: {
                popup: 'animate__animated animate__fadeInUp'
            }
        });
    }

    const handleSubmit = async (e?: FormEvent) => {
        if (e) {
            e.preventDefault()
        }
        const validate = loginValidator(values)
        if (!values.captchaToken || userAnswer !== visualCaptcha.answer) {
            setValues({
                ...values,
                captchaError: true,
                alertMessage: 'Mohon masukkan kode verifikasi dengan benar',
                showAlert: false
            })
            showErrorAlert('Mohon masukkan kode verifikasi dengan benar');
            return;
        }
        if (validate.pass) {
            setLoading(true)
            try {
                const result = await login(
                    values.email.trim(),
                    values.password.trim()
                )
                if (!result.success) {
                    setValues({
                        ...values,
                        alertMessage: result.message as string,
                        showAlert: false,
                        captchaToken: null,
                        captchaError: true
                    })
                    generateVisualCaptcha()
                    showErrorAlert(result.message as string);
                } else {
                    showSuccessAlert(result.data);
                    setTimeout(() => {
                        if (redirectTo) {
                            router.push(redirectTo);
                        }
                    }, 1500);
                }
            } catch (error) {
                const errorMessage = "Terjadi kesalahan saat menghubungi server. Silakan coba lagi.";
                setValues({
                    ...values,
                    alertMessage: errorMessage,
                    showAlert: false,
                    captchaToken: null,
                    captchaError: true
                })
                generateVisualCaptcha()
                showErrorAlert(errorMessage);
            } finally {
                setLoading(false)
            }
        } else {
            setValues({
                ...values,
                emailError: validate.emailError,
                passwordError: validate.passwordError,
                alertMessage: validate.message,
                showAlert: false
            })
            showErrorAlert(validate.message);
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit()
        }
    }

    return (
        <div className={`bg-white backdrop-blur-lg bg-opacity-95 rounded-2xl shadow-2xl ${cardAnimation} ${customClass} overflow-hidden w-full`}>
            <Link href="/" className="absolute top-4 left-4 z-20 flex items-center px-3 py-1.5 bg-white/80 backdrop-blur-l rounded-full shadow-l text-black-700 hover:text-blue-600 hover:bg-white/90 transition-all duration-300 transform hover:scale-105">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                <span className="text-l font-medium">Beranda</span>
            </Link>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600 rounded-full opacity-20 blur-2xl"></div>
            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-indigo-600 rounded-full opacity-20 blur-2xl"></div>
            <form className="relative px-6 sm:px-8 py-8 sm:py-10 z-10" onSubmit={handleSubmit}>
                <div className="text-center mb-6 sm:mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full  mb-3 sm:mb-4 shadow-lg relative">
                        <div className="relative h-8 w-8 sm:h-10 sm:w-10">
                            <Image
                                src={favicon}
                                alt="SIPP Karhutla"
                                fill
                                style={{ objectFit: 'contain' }}
                                sizes="(max-width: 640px) 32px, 40px"
                            />
                        </div>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-black-800 mb-1">Login ke SIPP Karhutla</h2>
                </div>
                <div className="space-y-5 sm:space-y-6">
                    <div className="space-y-1 sm:space-y-2">
                        <label htmlFor="email" className="block text-black-700 text-l font-semibold mb-1">
                            Email
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="h-5 w-5 text-black-400 group-focus-within:text-blue-500 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                            </div>
                            <input
                                id="email"
                                type="email"
                                className={`pl-10 w-full py-2.5 sm:py-3 px-4 bg-gray-50 text-black-700 border ${values.emailError ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                onChange={handleChange('email')}
                                value={values.email}
                                onKeyPress={handleKeyPress}
                                autoComplete="username"
                                placeholder="email@example.com"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                {values.email && !values.emailError && (
                                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                                {values.emailError && (
                                    <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )}
                            </div>
                        </div>
                        {values.emailError && (
                            <p className="text-red-500 text-l mt-1 flex items-center">
                                <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Format email tidak valid
                            </p>
                        )}
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                        <label htmlFor="password" className="block text-black-700 text-l font-semibold mb-1">
                            Password
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="h-5 w-5 text-black-400 group-focus-within:text-blue-500 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <input
                                id="password"
                                type={values.showPassword ? 'text' : 'password'}
                                className={`pl-10 w-full py-2.5 sm:py-3 px-4 bg-gray-50 text-black-700 border ${values.passwordError ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                onChange={handleChange('password')}
                                value={values.password}
                                onKeyPress={handleKeyPress}
                                autoComplete="current-password"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-black-400 hover:text-black-700 transition-colors duration-200"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                aria-label={values.showPassword ? "Hide password" : "Show password"}
                                tabIndex={-1}
                            >
                                {values.showPassword ? (
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {values.passwordError && (
                            <p className="text-red-500 text-l mt-1 flex items-center">
                                <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Password tidak boleh kosong
                            </p>
                        )}
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                        <label className="block text-black-700 text-l font-semibold mb-1">
                            Kode Verifikasi
                        </label>
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="border-2 border-gray-300 rounded-lg p-2 bg-white">
                                <canvas
                                    ref={canvasRef}
                                    className="block"
                                    style={{ width: '200px', height: '60px' }}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    generateVisualCaptcha()
                                    setValues({ ...values, captchaToken: null, captchaError: false })
                                }}
                                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                aria-label="Refresh kode"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="h-5 w-5 text-black-400 group-focus-within:text-blue-500 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                className={`pl-10 w-full py-2.5 sm:py-3 px-4 bg-gray-50 text-black-700 border ${values.captchaError ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 uppercase tracking-wider`}
                                onChange={onVisualCaptchaChange}
                                value={userAnswer}
                                onKeyPress={handleKeyPress}
                                placeholder="Masukkan CAPTCHA"
                                autoComplete="off"
                                maxLength={5}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                {userAnswer && !values.captchaError && values.captchaToken && (
                                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                                {values.captchaError && (
                                    <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )}
                            </div>
                        </div>
                        {values.captchaError && (
                            <p className="text-red-500 text-l mt-1 flex items-center">
                                <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Kode verifikasi salah
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-6 sm:mt-8 space-y-4">
                    <div className="w-full">
                        {loading ? (
                            <button
                                type="button"
                                disabled
                                className="w-full flex items-center justify-center bg-blue-600 text-white py-2.5 sm:py-3 px-4 rounded-xl cursor-not-allowed"
                            >
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Memproses...
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-center py-2.5 sm:py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Login
                            </button>
                        )}
                    </div>
                    <div className="w-full text-center">
                        <button
                            type="button"
                            className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 text-l flex items-center justify-center mx-auto"
                            onClick={(event) => {
                                event.preventDefault()
                                router.push('/forgot-password')
                            }}
                        >
                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                            </svg>
                            Lupa kata sandi?
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default LoginForm
