import { API } from '@/api'
import {
	APIResponse,
	BalaiData,
	BalaiResponse,
	KorwilData,
	KorwilResponse,
	ServiceResponse
} from '@/interfaces'
import {
	createBalaiValidator,
	deleteBalaiValidator,
	updateBalaiValidator
} from '@/validators'

export const getAllBalai = async (): Promise<BalaiData[]> => {
	const r: APIResponse<BalaiResponse[]> = await API.get('/balai/list')
	if (r.status === 200) {
		const data: BalaiData[] = r.data.map((balai) => {
			return {
				id: balai.id,
				code: balai.kode,
				name: balai.nama,
				region: balai.r_wilayah_id
			}
		})
		return data
	}
	return []
}

export const addBalai = async (balai: BalaiData): Promise<ServiceResponse> => {
	const validate = createBalaiValidator(balai)
	if (!validate.pass) return { success: false, message: validate.message }

	const formData = new FormData()
	formData.append('kode', balai.code)
	formData.append('nama', balai.name)
	formData.append('r_wilayah_id', balai.region)

	const r: APIResponse<null> = await API.post('/balai/add', formData)
	if (r.status === 200) return { success: true, message: r.message }
	return { success: false, message: r.message }
}

export const updateBalai = async (
	newData: BalaiData,
	oldData: BalaiData
): Promise<ServiceResponse> => {
	const validate = updateBalaiValidator(newData)
	if (!validate.pass) return { success: false, message: validate.message }

	const formData = new FormData()
	formData.append('id', newData.id)
	formData.append('nama', newData.name)
	formData.append('r_wilayah_id', newData.region)
	if (oldData.code !== newData.code) formData.append('kode', newData.code)

	const r: APIResponse<null> = await API.post('/balai/save', formData)
	if (r.status === 200) return { success: true, message: r.message }
	return { success: false, message: r.message }
}

export const deleteBalai = async (
	balai: BalaiData
): Promise<ServiceResponse> => {
	const validate = deleteBalaiValidator(balai)
	if (!validate.pass) return { success: false, message: validate.message }

	const r: APIResponse<null> = await API.delete(`/balai/remove/${balai.id}`)
	if (r.status === 200) return { success: true, message: r.message }
	return { success: false, message: r.message }
}

export const getAllKorwil = async (): Promise<KorwilData[]> => {
	const r: APIResponse<KorwilResponse[]> = await API.get('/korwil/list')
	if (r.status === 200) {
		const data: KorwilData[] = r.data.map((korwil) => {
			return {
				id: korwil.id,
				kode: korwil.kode,
				nama: korwil.nama,
				m_daops_id: korwil.m_daops_id
			}
		})
		return data
	}
	return []
}

export const addKorwil = async (
	korwil: KorwilData
): Promise<ServiceResponse> => {
	// const validate = createBalaiValidator(korwil)
	// if (!validate.pass) return { success: false, message: validate.message }

	const formData = new FormData()
	formData.append('kode', korwil.kode)
	formData.append('nama', korwil.nama)
	formData.append('m_daops_id', korwil.m_daops_id)

	const r: APIResponse<null> = await API.post('/korwil/add', formData)
	if (r.status === 200) return { success: true, message: r.message }
	return { success: false, message: r.message }
}

export const updateKorwil = async (
	newData: KorwilData,
	oldData: KorwilData
): Promise<ServiceResponse> => {
	// const validate = updateBalaiValidator(newData)
	// if (!validate.pass) return { success: false, message: validate.message }

	const formData = new FormData()
	formData.append('id', newData.id)
	formData.append('nama', newData.nama)
	formData.append('m_daops_id', newData.m_daops_id)
	if (oldData.kode !== newData.kode) formData.append('kode', newData.kode)

	const r: APIResponse<null> = await API.post('/korwil/save', formData)
	if (r.status === 200) return { success: true, message: r.message }
	return { success: false, message: r.message }
}

export const deleteKorwil = async (
	korwil: KorwilData
): Promise<ServiceResponse> => {
	// const validate = deleteBalaiValidator(balai)
	// if (!validate.pass) return { success: false, message: validate.message }

	const r: APIResponse<null> = await API.delete(`/korwil/remove/${korwil.id}`)
	if (r.status === 200) return { success: true, message: r.message }
	return { success: false, message: r.message }
}
