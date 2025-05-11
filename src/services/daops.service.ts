import { API } from '@/api'
import {
	APIResponse,
	DaopsData,
	DaopsResponse,
	ServiceResponse,
	KorwilDistinctData,
	KorwilDistinctResponse
} from '@/interfaces'
import {
	createDaopsValidator,
	deleteDaopsValidator,
	updateDaopsValidator
} from '@/validators'

export const getAllDaops = async (): Promise<DaopsData[]> => {
	const r: APIResponse<DaopsResponse[]> = await API.get('/daops/list')
	if (r.status === 200) {
		const data: DaopsData[] = r.data.map((daops) => {
			return {
				id: daops.id,
				code: daops.kode,
				name: daops.nama,
				balaiId: daops.r_balai_id
			}
		})
		return data
	}
	return []
}

export const getAllKorwilDistinct = async (): Promise<KorwilDistinctData[]> => {
	const r: APIResponse<KorwilDistinctResponse[]> = await API.get(
		'/korwil/distinct'
	)
	if (r.status === 200) {
		const data: KorwilDistinctData[] = r.data.map((daops) => {
			return {
				kode: daops.kode,
				nama: daops.nama
			}
		})
		return data
	}
	return []
}

export const addDaops = async (daops: DaopsData): Promise<ServiceResponse> => {
	const validate = createDaopsValidator(daops)
	if (!validate.pass) return { success: false, message: validate.message }

	const formData = new FormData()
	formData.append('kode', daops.code)
	formData.append('nama', daops.name)
	formData.append('r_balai_id', daops.balaiId)

	const r: APIResponse<null> = await API.post('/daops/add', formData)
	if (r.status === 200) return { success: true, message: r.message }
	return { success: false, message: r.message }
}

export const updateDaops = async (
	newData: DaopsData,
	oldData: DaopsData
): Promise<ServiceResponse> => {
	const validate = updateDaopsValidator(newData)
	if (!validate.pass) return { success: false, message: validate.message }

	const formData = new FormData()
	formData.append('id', newData.id)
	formData.append('nama', newData.name)
	formData.append('r_balai_id', newData.balaiId)
	if (oldData.code !== newData.code) formData.append('kode', newData.code)

	const r: APIResponse<null> = await API.post('/daops/save', formData)
	if (r.status === 200) return { success: true, message: r.message }
	return { success: false, message: r.message }
}

export const deleteDaops = async (
	daops: DaopsData
): Promise<ServiceResponse> => {
	const validate = deleteDaopsValidator(daops)
	if (!validate.pass) return { success: false, message: validate.message }

	const r: APIResponse<null> = await API.delete(`/daops/remove/${daops.id}`)
	if (r.status === 200) return { success: true, message: r.message }
	return { success: false, message: r.message }
}
