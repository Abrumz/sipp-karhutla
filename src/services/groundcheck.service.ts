import { SimaduAPI, simaduApiUrl, apiV2, apiV2URL, API } from '@/api'
import {
	APIResponse,
	ServiceResponse,
	UserGroundcheckData,
	DaopsList,
	DaopsListResponse,
	UserGroundcheckResponse,
	UserGroundCheckData
} from '@/interfaces'
import { splitAndTrim } from '@/utils'
import { uploadPenugasanValidator, deletePenugasanValidator } from '@/validators'
import axios from 'axios'

export const getUserGroundcheck = async (): Promise<UserGroundcheckData[]> => {
	const r: APIResponse<UserGroundcheckResponse[]> = await apiV2.get(
		'/groundcheck/userList'
	)
	console.log(r)
	if (r.status === 200) {
		const dataUser = r.data.map((balai) => {
			const date_awal = new Date(balai.tanggal)
			const part_awal = balai.tanggal.split('-')
			const month_awal = date_awal.toLocaleString('default', {
				month: 'short'
			})
			const tanggal_awal =
				part_awal[2] + ' ' + month_awal + ' ' + part_awal[0]

			return {
				id: balai.id,
				nama: balai.nama,
				email: balai.email,
				provinsi: balai.provinsi,
				kabupaten: balai.kabupaten,
				patroli: balai.patroli,
				daops: balai.daops,
				tanggal: tanggal_awal,
				anggota: balai.anggota
			}
		})
		return dataUser
	}
	return []
}

export const deleteUserGroundcheck = async (
	data: UserGroundCheckData
): Promise<ServiceResponse> => {
	try {
		const r: APIResponse<{
			message: string
		}> = await apiV2.delete(`groundcheck/delUser/${data.id}`)
		console.log(r)
		if (r.status === 200) return { success: true, message: r.data.message }
		return { success: false, message: r.data.message }
	} catch (error) {
		return { success: false, message: 'An error occurred while deleting the user groundcheck.' }
	}
}

export const getDaops = async (): Promise<DaopsList[]> => {
	const r: APIResponse<DaopsListResponse[]> = await apiV2.get('/lists/daops/')
	if (r.status === 200) {
		return r.data.map((daops) => {
			return {
				nama_daops: daops.nama_daops
			}
		})
	}
	return []
}

export const getDataUserGc = async (
	userid: string
): Promise<{
	success: boolean
	message: string | string[]
	data?: any
}> => {
	const r: APIResponse<any> = await apiV2.get(
		`groundcheck/detailUser?id=${userid}`
	)
	console.log(r)
	if (r.status === 200) {
		return { success: true, message: r.message, data: r.data }
	}
	return { success: false, message: r.message }
}
