import { API, apiV2 } from '@/api'
import {
	AddPatroliNonLoginUserInput,
	AddUserInput,
	AddUserGcInput,
	APIResponse,
	CreateNonPatroliUser,
	DeleteNonPatroliUser,
	DeletePatroliNonLoginUserInput,
	DeleteUserInput,
	NonLoginUserResponse,
	NonPatroliUserData,
	NonPatroliUserResponse,
	KorwilData,
	KorwilResponse,
	RoleData,
	RoleResponse,
	ServiceResponse,
	UpdatePatroliNonLoginUserInput,
	UpdateUserInput,
	UserData,
	UserDetailResponse,
	updateGcUserInput,
	SendEmailForgot,
	resetPassword
} from '@/interfaces'
import {
	createNonPatroliValidator,
	createPatroliNonLoginValidator,
	createUserValidator,
	deleteNonPatroliValidator,
	deletePatroliNonLoginValidator,
	deleteUserValidator,
	updateNonPatroliValidator,
	updatePatroliNonLoginValidator,
	updateUserValidator,
	ResetValidator
} from '@/validators'

export const getAllUsers = async (): Promise<UserData[]> => {
	const r: APIResponse<UserDetailResponse[]> = await API.get('/user/list')
	if (r.status === 200) {
		return r.data.map((user) => {
			return {
				id: parseInt(user.id),
				registrationNumber: user.no_registrasi,
				name: user.nama,
				email: user.email,
				phoneNumber: user.no_telepon,
				accessId: 0,
				nip: '',
				organization: '',
				role: 0,
				photo: '',
				roleLevel: 0,
				roleName: ''
			}
		})
	}
	return []
}

export const getUserDetail = async (
	userId: string
): Promise<ServiceResponse<UserData | null>> => {
	const r: APIResponse<UserDetailResponse> = await API.get(
		`/user/single/${userId}`
	)
	console.log(r)
	if (r.status === 200) {
		const user: UserData = {
			id: parseInt(r.data.id),
			registrationNumber: r.data.no_registrasi,
			name: r.data.nama,
			email: r.data.email,
			phoneNumber: r.data.no_telepon,
			accessId: 0,
			role: r.data.roles.length > 0 ? parseInt(r.data.roles[0].id) : 0,
			organization: r.data.instansi,
			photo: r.data.foto,
			roleLevel:
				r.data.roles.length > 0 ? parseInt(r.data.roles[0].level) : 0,
			roleName: r.data.roles.length > 0 ? r.data.roles[0].nama : ''
		}
		return { success: true, message: r.message, data: user }
	}
	return { success: false, message: r.message, data: null }
}

export const addUser = async (data: AddUserInput): Promise<ServiceResponse> => {
	const validate = createUserValidator(data)
	if (!validate.pass) return { success: false, message: validate.message }

	const formData = new FormData()
	formData.append('no_registrasi', data.registrationNumber)
	formData.append('nama', data.name)
	formData.append('email', data.email)
	formData.append('password', data.password as string)
	formData.append('no_telepon', data.phoneNumber)
	formData.append('r_role_id', data.r_role_id)
	formData.append('instansi', '-')
	formData.append('aktif', 't')

	const r: APIResponse<null> = await API.post('/user/add', formData)
	if (r.status === 200) return { success: true, message: r.message }
	return { success: false, message: r.message }
}

export const addUserGroundCheck = async (
	data: AddUserGcInput
): Promise<ServiceResponse> => {
	// const validate = createUserValidator(data)
	// if (!validate.pass) return { success: false, message: validate.message }

	const formData = new FormData()
	formData.append('nama', data.name)
	formData.append('email', data.email)
	formData.append('password', data.password as string)
	formData.append('provinsi', data.provinsi)
	formData.append('kabupaten', data.kabupaten)
	formData.append('patroli', data.patroli)
	formData.append('daops', data.daops)
	formData.append('tanggal', data.startDate)
	formData.append('anggota', data.anggota)

	const r: APIResponse<null> = await apiV2.post(
		'/groundcheck/addUser',
		formData
	)
	if (r.status === 200) return { success: true, message: r.message }
	return { success: false, message: r.message }
}

export const updateUserGroundCheck = async (
	data: updateGcUserInput
): Promise<ServiceResponse> => {
	// const validate = updateUserValidator(data)
	// if (!validate.pass) return { success: false, message: validate.message }

	const formData = new FormData()
	formData.append('id', data.id)
	formData.append('nama', data.name)
	formData.append('email', data.email)
	formData.append('password', data.password as string)
	formData.append('provinsi', data.provinsi)
	formData.append('kabupaten', data.kabupaten)
	formData.append('patroli', data.patroli)
	formData.append('daops', data.daops)
	formData.append('tanggal', data.startDate)
	formData.append('anggota', data.anggota)

	const r: APIResponse<null> = await apiV2.post(
		'/groundcheck/editUser',
		formData
	)
	if (r.status === 200)
		return {
			success: true,
			message: 'Ubah data pengguna Ground Check berhasil'
		}
	return { success: false, message: r.message }
}

export const updateUser = async (
	data: UpdateUserInput
): Promise<ServiceResponse> => {
	const validate = updateUserValidator(data)
	if (!validate.pass) return { success: false, message: validate.message }

	const formData = new FormData()
	formData.append('id', data.id)
	formData.append('nama', data.name)
	formData.append('no_telepon', data.phoneNumber)
	if (data.password) formData.append('password', data.password)
	if (data.oldEmail !== data.email) formData.append('email', data.email)
	if (data.oldRegistrationNumber !== data.registrationNumber)
		formData.append('no_registrasi', data.registrationNumber)

	const r: APIResponse<null> = await API.post('/user/save', formData)
	if (r.status === 200)
		return { success: true, message: 'Ubah data pengguna berhasil' }
	return { success: false, message: r.message }
}

export const deleteUser = async (
	data: DeleteUserInput
): Promise<ServiceResponse | undefined> => {
	try {
		const validate = deleteUserValidator(data)
		if (!validate.pass) return { success: false, message: validate.message }

		const r: APIResponse<null> = await API.delete(`/user/remove/${data.id}`)
		if (r.status === 200) return { success: true, message: r.message }
		return { success: false, message: r.message }
	} catch (error) {
		// return { success: false, message: error }
	}
}

export const getPatroliNonLoginUsers = async (): Promise<UserData[]> => {
	const r: APIResponse<NonLoginUserResponse[]> = await API.get(
		'/non_login/list'
	)
	if (r.status === 200) {
		const users: UserData[] = r.data.map((user) => {
			return {
				id: parseInt(user.id),
				accessId: 0,
				email: '',
				nip: '',
				organization: '',
				phoneNumber: '',
				registrationNumber: '',
				name: user.nama,
				role: parseInt(user.r_role_id),
				photo: '',
				roleLevel: parseInt(user.r_role.level),
				roleName: user.r_role.nama
			}
		})
		return users
	}
	return []
}

export const addPatroliNonLoginUser = async (
	data: AddPatroliNonLoginUserInput
): Promise<ServiceResponse> => {
	const validate = createPatroliNonLoginValidator(data)
	if (!validate.pass) return { success: false, message: validate.message }

	const formData = new FormData()
	formData.append('nama', data.name)
	formData.append('r_role_id', data.role.toString())

	const r: APIResponse<null> = await API.post('/non_login/add', formData)
	if (r.status === 200) return { success: true, message: r.message }
	return { success: false, message: r.message }
}

export const updatePatroliNonLoginUser = async (
	data: UpdatePatroliNonLoginUserInput
): Promise<ServiceResponse> => {
	const validate = updatePatroliNonLoginValidator(data)
	if (!validate.pass) return { success: false, message: validate.message }

	const formData = new FormData()
	formData.append('id', data.id.toString())
	formData.append('nama', data.name)
	formData.append('r_role_id', data.role.toString())

	const r: APIResponse<null> = await API.post('/non_login/save', formData)
	if (r.status === 200) return { success: true, message: r.message }
	return { success: false, message: r.message }
}

export const deletePatroliNonLoginUser = async (
	data: DeletePatroliNonLoginUserInput
): Promise<ServiceResponse> => {
	const validate = deletePatroliNonLoginValidator(data)
	if (!validate.pass) return { success: false, message: validate.message }

	const r: APIResponse<null> = await API.delete(
		`/non_login/remove/${data.id}`
	)
	if (r.status === 200) return { success: true, message: r.message }
	return { success: false, message: r.message }
}

export const getNonPatroliRoles = async (): Promise<RoleData[]> => {
	const r: APIResponse<RoleResponse[]> = await API.get('/role/list')
	if (r.status === 200) {
		const data: RoleData[] = []
		r.data.forEach((role) => {
			if (parseInt(role.level, 10) <= 7) {
				data.push({
					id: parseInt(role.id, 10),
					name: role.nama,
					level: parseInt(role.level, 10),
					active: role.aktif
				})
			}
		})
		return data
	}
	return []
}

export const getPatroliNonLoginRoles = async (): Promise<RoleData[]> => {
	const r: APIResponse<RoleResponse[]> = await API.get('/role/list')
	if (r.status === 200) {
		const data: RoleData[] = []
		r.data.forEach((role) => {
			if (parseInt(role.level, 10) === 7) {
				data.push({
					id: parseInt(role.id, 10),
					name: role.nama,
					level: parseInt(role.level, 10),
					active: role.aktif
				})
			}
		})
		return data
	}
	return []
}

export const getNonPatroliUsers = async (): Promise<{
	daopsUsers: NonPatroliUserData[]
	balaiUsers: NonPatroliUserData[]
	korwilUsers: NonPatroliUserData[]
}> => {
	const r: APIResponse<NonPatroliUserResponse[]> = await API.get(
		'/non_patroli/list'
	)
	const daopsUsers: NonPatroliUserData[] = []
	const balaiUsers: NonPatroliUserData[] = []
	const korwilUsers: NonPatroliUserData[] = []
	if (r.status === 200) {
		r.data.forEach((userAccess) => {
			const user: NonPatroliUserData = {
				id: parseInt(userAccess.m_user.id, 10),
				accessId: parseInt(userAccess.id, 10),
				registrationNumber: userAccess.m_user.no_registrasi,
				role: parseInt(userAccess.r_role_id, 10),
				organization: userAccess.m_user.instansi,
				name: userAccess.m_user.nama,
				email: userAccess.m_user.email
			}
			if (parseInt(userAccess.r_role.level, 10) <= 3) {
				balaiUsers.push(user)
			} else if (
				parseInt(userAccess.r_role.level, 10) == 4 ||
				parseInt(userAccess.r_role.level, 10) == 5
			) {
				korwilUsers.push(user)
			} else {
				daopsUsers.push(user)
			}
		})
		return { daopsUsers, balaiUsers, korwilUsers }
	}
	return { daopsUsers, balaiUsers, korwilUsers }
}

export const getKorwilUsers = async (): Promise<{
	korwilUsers: KorwilData[]
}> => {
	const r: APIResponse<KorwilResponse[]> = await API.get('/korwil/list')
	const korwilUsers: KorwilData[] = []
	if (r.status === 200) {
		r.data.forEach((users) => {
			const user: KorwilData = {
				id: users.id,
				nama: users.nama,
				kode: users.kode,
				m_daops_id: users.m_daops_id
			}

			korwilUsers.push(user)
		})
		return { korwilUsers }
	}
	return { korwilUsers }
}

export const addNonPatroliUser = async (
	data: CreateNonPatroliUser
): Promise<ServiceResponse> => {
	const validate = createNonPatroliValidator(data)
	if (!validate.pass) return { success: false, message: validate.message }

	// TODO: Add organization detail
	const formData = new FormData()
	formData.append('m_user_id', data.id)
	formData.append('r_role_id', data.role)

	const r: APIResponse<null> = await API.post('/non_patroli/add', formData)
	if (r.status === 200) return { success: true, message: r.message }
	return { success: false, message: r.message }
}

export const sendEmail = async (
	data: SendEmailForgot
): Promise<ServiceResponse> => {
	const formData = new FormData()
	formData.append('email', data.email.toString())

	const r: APIResponse<null> = await API.post('/auth/forgot', formData)
	console.log(r)
	if (r.status === 200)
		return {
			success: true,
			message: 'Email perubahan password Berhasil dikirim.'
		}
	return { success: false, message: r.message }
}

export const resetUser = async (
	data: resetPassword
): Promise<ServiceResponse> => {
	const validate = ResetValidator(data)
	if (!validate.pass) return { success: false, message: validate.message }

	const formData = new FormData()
	formData.append('signature', data.signature.toString())
	formData.append('password', data.password.toString())
	formData.append('retype_password', data.retype_password.toString())
	console.log(formData)
	const r: APIResponse<null> = await API.post('/auth/reset', formData)
	// console.log(r)
	if (r.status === 200)
		return {
			success: true,
			message: 'Password Berhasil diganti. Silahkan Login'
		}
	if (r.status === 417)
		return {
			success: false,
			message: 'Token tidak sesuai, silahkan request lagi'
		}
	return { success: false, message: r.message }
}

export const updateNonPatroliUser = async (
	data: NonPatroliUserData
): Promise<ServiceResponse> => {
	const validate = updateNonPatroliValidator(data)
	if (!validate.pass) return { success: false, message: validate.message }

	const formData = new FormData()
	formData.append('id', data.id.toString())
	formData.append('instansi', data.organization.toString())
	formData.append('r_role_id', data.role.toString())

	const r: APIResponse<null> = await API.post('/user/save', formData)
	// TODO: update daops/balai organization in user access
	if (r.status === 200) return { success: true, message: r.message }
	return { success: false, message: r.message }
}

export const deleteNonPatroliUser = async (
	data: DeleteNonPatroliUser
): Promise<ServiceResponse> => {
	const validate = deleteNonPatroliValidator(data)
	if (!validate.pass) return { success: false, message: validate.message }
	const r: APIResponse<null> = await API.delete(
		`/non_patroli/remove/${data.accessId}`
	)
	if (r.status === 200) return { success: true, message: r.message }
	return { success: false, message: r.message }
}
