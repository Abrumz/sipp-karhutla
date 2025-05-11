import { API } from '@/api'
import {
	AddPoskoInput,
	APIResponse,
	PoskoData,
	PoskoResponse,
	ServiceResponse,
	UpdatePoskoInput
} from '@/interfaces'
import {
	createPoskoValidator,
	deletePoskoValidator,
	updatePoskoValidator
} from '@/validators'

export const getAllPosko = async (): Promise<PoskoData[]> => {
	const r: APIResponse<PoskoResponse[]> = await API.get('/posko/list')
	if (r.status === 200) {
		return r.data.map((posko) => {
			return {
				id: posko.id,
				name: posko.nama,
				daops: posko.daops.nama,
				daopsId: posko.m_daops_id,
				kecamatan: posko.kecamatan.nama,
				kecamatanId: posko.r_wilayah_id_kec
			}
		})
	}
	return []
}

export const getDetailPosko = async (id: string): Promise<PoskoData | null> => {
	const response: APIResponse<PoskoResponse> = await API.get(
		`/posko/single/${id}`
	)

	if (response.status === 200) {
		return {
			id: response.data.id,
			name: response.data.nama,
			daops: response.data.daops.nama,
			daopsId: response.data.m_daops_id,
			kecamatan: response.data.kecamatan.nama,
			kecamatanId: response.data.r_wilayah_id_kec
		}
	}
	return null
}

export const addPosko = async (
	posko: AddPoskoInput
): Promise<ServiceResponse> => {
	const validate = createPoskoValidator(posko)
	if (!validate.pass) return { success: false, message: validate.message }

	const formData = new FormData()
	formData.append('nama', posko.name)
	formData.append('m_daops_id', posko.daops)
	formData.append('r_wilayah_id_kec', posko.kecamatan)

	const r: APIResponse<null> = await API.post('/posko/add', formData)
	if (r.status === 200) return { success: true, message: r.message }
	return { success: false, message: r.message }
}

export const updatePosko = async (
	newData: UpdatePoskoInput,
	oldName: string
): Promise<ServiceResponse> => {
	const validate = updatePoskoValidator(newData)
	if (!validate.pass) return { success: false, message: validate.message }

	const formData = new FormData()
	formData.append('id', newData.id)
	if (newData.name !== oldName) formData.append('nama', newData.name)
	formData.append('m_daops_id', newData.daops)
	formData.append('r_wilayah_id_kec', newData.kecamatan)

	const r: APIResponse<null> = await API.post('/posko/save', formData)
	if (r.status === 200) return { success: true, message: r.message }
	return { success: false, message: r.message }
}

export const deletePosko = async (
	posko: PoskoData
): Promise<ServiceResponse> => {
	const validate = deletePoskoValidator(posko)
	if (!validate.pass) return { success: false, message: validate.message }

	const r: APIResponse<null> = await API.delete(`/posko/remove/${posko.id}`)
	if (r.status === 200) return { success: true, message: r.message }
	return { success: false, message: r.message }
}
