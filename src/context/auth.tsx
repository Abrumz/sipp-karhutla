import { API } from '@/api'
import {
	APIResponse,
	LoginResponse,
	ServiceResponse,
	UserData
} from '@/interfaces'
import {
	getTokenCookie,
	getUserCookie,
	removeTokenCookie,
	removeUserCookie,
	setTokenCookie,
	setUserCookie
} from '@/services'
import { useRouter } from 'next/router'
import {
	ComponentType,
	createContext,
	FC,
	JSX,
	useContext,
	useEffect,
	useState,
	ReactNode
} from 'react'

// Konstanta dipindahkan dari _app.tsx
const PUBLIC_ROUTES = [
	'/',
	'/login',
	'/forgot-password',
	'/reset',
	'/unauthorized',
	'/mobile-only', // Tambahkan rute baru untuk pengguna mobile
	'/about',
	'/faq',
	'/404',
	'/_error'
];

const PROTECTED_ROUTES: Record<string, number[]> = {
	'/pengguna': [0, 1, 2],
	'/pengguna/hak-akses': [0, 1, 2],
	'/penugasan': [0, 1, 2, 3, 4, 5, 6, 7],
	'/penugasan/berkas': [6],
	'/wilayah/posko': [0, 1, 2],
	'/wilayah/daops': [0, 1, 2, 6, 7],
	'/wilayah/korwil': [0, 1, 4, 5],
	'/wilayah/balai': [0, 1, 2, 3],
	'/wilayah': [0, 1, 2, 3, 4, 5, 6, 7],
	'/hotspot': [0, 1, 2, 3, 4, 5, 6, 7],
	'/patroli': [0, 1, 2, 3, 4, 5, 6, 7],
	'/pelaporan': [0, 1, 2, 3, 4, 5, 6, 7],
	'/pelaporan/laporan-ringkasan': [0, 1, 2, 3, 4, 5, 6, 7],
	'/pelaporan/rentang-tanggal': [0, 1, 2, 3, 4, 5, 6, 7],
	'/pelaporan/surat-tugas': [0, 1, 2, 3, 4, 5, 6, 7],
	'/profile': [0, 1, 2, 3, 4, 5, 6, 7]
};

// Konstanta untuk role yang hanya bisa akses mobile
const MOBILE_ONLY_ROLES = [8, 9, 10];

const DefaultUser: UserData = {
	id: 0,
	name: '',
	accessId: 0,
	role: 0,
	email: '',
	registrationNumber: '',
	phoneNumber: '',
	organization: '',
	photo: '',
	roleLevel: 100,
	roleName: ''
}

type AuthContextType = {
	isAuthenticated: boolean
	loading: boolean
	user: UserData
	login: (username: string, password: string) => Promise<ServiceResponse>
	logout: () => void
	isAuthorized: boolean | null
	checkAccess: (path: string) => void
}

const AuthContext = createContext<AuthContextType>({
	isAuthenticated: false,
	loading: true,
	user: DefaultUser,
	isAuthorized: null,
	checkAccess: () => { },
	login: async (username: string, password: string) => {
		try {
			if (!username && !password) {
				throw new Error('Login failed')
			}
			return { success: true, message: '' }
		} catch (error) {
			return { success: false, message: (error as Error).message || 'An error occurred' }
		}
	},
	logout: () => { }
})

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<UserData>(DefaultUser)
	const [loading, setLoading] = useState(true)
	const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
	const router = useRouter()

	useEffect(() => {
		async function loadUserFromCookies() {
			const token = getTokenCookie()
			if (token) {
				const user = getUserCookie()
				if (user) setUser(JSON.parse(user))
			}
			setLoading(false)
		}
		loadUserFromCookies()
	}, [])

	// Fungsi untuk memeriksa akses ke halaman tertentu
	const checkAccess = (pathname: string) => {
		if (loading) return;

		if (
			PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/')) ||
			pathname === '/_error' ||
			pathname === '/404'
		) {
			setIsAuthorized(true);
			return;
		}

		if (!user.id) {
			router.replace('/login');
			return;
		}

		// Cek apakah user memiliki role yang hanya bisa akses via mobile
		if (MOBILE_ONLY_ROLES.includes(user.roleLevel) && pathname !== '/mobile-only') {
			router.replace('/mobile-only');
			return;
		}

		let hasAccess = true;

		for (const [route, allowedRoles] of Object.entries(PROTECTED_ROUTES)) {
			if (pathname.startsWith(route)) {
				if (!allowedRoles.includes(user.roleLevel)) {
					hasAccess = false;
					break;
				}
			}
		}

		if (!hasAccess) {
			router.replace('/unauthorized');
			return;
		}

		setIsAuthorized(true);
	}

	// Memanggil checkAccess setiap kali rute berubah
	useEffect(() => {
		checkAccess(router.pathname);
	}, [router.pathname, loading, user]);

	const login = async (
		username: string,
		password: string
	): Promise<ServiceResponse> => {
		try {
			const {
				status,
				data,
				message
			}: APIResponse<LoginResponse> = await API.post('/auth/login', {
				username,
				password
			})

			const user: UserData = {
				id: parseInt(data.user.id_user, 10),
				accessId: 0,
				role: 0,
				name: data.user.nama,
				email: data.user.email,
				registrationNumber: data.detail.no_registrasi,
				phoneNumber: data.detail.no_telepon,
				organization: data.detail.instansi,
				photo: data.detail.foto,
				roleLevel:
					data.detail.roles.length > 0
						? parseInt(data.detail.roles[0].level, 10)
						: 100,
				roleName:
					data.detail.roles.length > 0
						? data.detail.roles[0].nama
						: ''
			}

			const token: string = data.token || ''
			if (token) {
				setTokenCookie(token)
				setUserCookie(user)
				setUser(user)

				// Cek apakah user punya role mobile only
				if (MOBILE_ONLY_ROLES.includes(user.roleLevel)) {
					window.location.pathname = '/mobile-only';
				} else {
					window.location.pathname = '/patroli';
				}
			}
			return { success: true, message: 'Login success' }
		} catch (error) {
			return { success: false, message: (error as Error).message || 'An error occurred' }
		}
	}

	const logout = () => {
		removeTokenCookie()
		removeUserCookie()
		setUser(DefaultUser)
		window.location.pathname = '/login'
	}

	// Tampilkan loading jika status otorisasi masih diproses
	if (isAuthorized === null && !PUBLIC_ROUTES.some(route => router.pathname === route || router.pathname.startsWith(route + '/'))) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="relative">
					<div className="h-12 w-12 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin"></div>
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="h-6 w-6 rounded-full bg-white"></div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated: !!user.id,
				user,
				login,
				loading,
				logout,
				isAuthorized,
				checkAccess
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export default function useAuth(): AuthContextType {
	const context = useContext(AuthContext)
	return context
}

// Fungsi HOC untuk melindungi rute
export const ProtectRoute = (
	Page: ComponentType,
	isAuthRoute = false,
	limitedAccessRight = false
): (() => JSX.Element) => {
	return () => {
		const router = useRouter()
		const { isAuthenticated, loading, user, checkAccess } = useAuth()

		useEffect(() => {
			// Panggil checkAccess untuk memeriksa dan menangani akses ke halaman
			checkAccess(router.pathname);

			// Logika khusus untuk halaman otentikasi
			if (
				isAuthRoute &&
				isAuthenticated &&
				router.pathname !== '/forgot-password' &&
				router.pathname !== '/reset'
			)
				router.push('/patroli')
		}, [loading, isAuthenticated, user, router.pathname])

		return <Page />
	}
}

// Komponen AuthWrapper untuk digunakan di _app.tsx
export const AuthWrapper: FC<{ children: ReactNode }> = ({ children }) => {
	const { isAuthorized } = useAuth();

	return <>{children}</>;
};