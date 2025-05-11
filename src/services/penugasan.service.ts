import { SimaduAPI, simaduApiUrl, apiV2, apiV2URL, API } from '@/api'
import {
	APIResponse,
	ServiceResponse,
	SuratTugasData,
	SuratTugasResponse,
	SuratTugasTeamMemberData,
	SuratTugasTeamMemberResponse,
	DeletePenugasanInput,
	ProvinsiData,
	ProvinsiResponse,
	KabupatenData,
	KabupatenResponse,
	APIResponseUpload,
	SkNumberData,
	SkNumberResponse,
	PenugasanData
} from '@/interfaces'
import { splitAndTrim } from '@/utils'
import { uploadPenugasanValidator, deletePenugasanValidator } from '@/validators'
import axios from 'axios'

export const getAllPenugasan = async (): Promise<SuratTugasData[]> => {
	// const r: APIResponse<SuratTugasResponse[]> = await SimaduAPI.get('/listsk')
	const r: APIResponse<SuratTugasResponse[]> = await apiV2.get(
		'simadu/listsk'
	)
	if (r.status === 200) {
		return r.data.map((work) => {
			const date_awal = new Date(work.tanggal_awal)
			const part_awal = work.tanggal_awal.split('-')
			const part_akhir = work.tanggal_akhir.split('-')
			const date_akhir = new Date(work.tanggal_akhir)
			const month_awal = date_awal.toLocaleString('default', {
				month: 'short'
			})
			const month_akhir = date_akhir.toLocaleString('default', {
				month: 'short'
			})

			const tanggal_awal =
				part_awal[2] + ' ' + month_awal + ' ' + part_awal[0]
			const tanggal_akhir =
				part_akhir[2] + ' ' + month_akhir + ' ' + part_akhir[0]

			return {
				id: work.id,
				number: work.nomor,
				type: work.jenis_surat,
				startDate: tanggal_awal,
				finishDate: tanggal_akhir,
				reportLink: `${apiV2URL}/karhutla/downloadPeriode?nomor_sk=${work.nomor}`
			}
		})
	}
	return []
}

export const checkSkNumber = async (
	no_sk: string
): Promise<{
	success: boolean
	message: string | string[]
}> => {
	const r: APIResponse<SkNumberResponse> = await apiV2.get(
		'simadu/cekst/?no_st=' + no_sk
	)
	if (r.status === 200) {
		return { success: true, message: r.data.message }
	} else {
		return { success: false, message: r.data.message }
	}
}

export const getAllProvinsi = async (): Promise<ProvinsiData[]> => {
	const r: APIResponse<ProvinsiResponse[]> = await apiV2.get('/lists/wilayah')
	if (r.status === 200) {
		return r.data.map((provinsi) => {
			return {
				kode_wilayah: provinsi.kode_wilayah,
				nama_wilayah: provinsi.nama_wilayah
			}
		})
	}
	return []
}

export const getAllKabupaten = async (
	id_provinsi: string
): Promise<KabupatenData[]> => {
	const r: APIResponse<KabupatenResponse[]> = await apiV2.get(
		'/lists/wilayah/' + id_provinsi
	)
	if (r.status === 200) {
		return r.data.map((provinsi) => {
			return {
				kode_wilayah: provinsi.kode_wilayah,
				nama_wilayah: provinsi.nama_wilayah
			}
		})
	}
	return []
}

export const getAllKecamatanGc = async (
	id_kabupaten: string
): Promise<KabupatenData[]> => {
	const r: APIResponse<KabupatenResponse[]> = await apiV2.get(
		'/lists/wilayah/' + id_kabupaten
	)
	if (r.status === 200) {
		console.log(r)
		return r.data.map((kecamatan) => {
			return {
				kode_wilayah: kecamatan.kode_wilayah,
				nama_wilayah: kecamatan.nama_wilayah
			}
		})
	}
	return []
}

export const deletePenugasan = async (
	data: DeletePenugasanInput
): Promise<ServiceResponse> => {
	try {
		const validate = deletePenugasanValidator(data)
		if (!validate.pass) return { success: false, message: validate.message }

		// const r: APIResponse<null> = await SimaduAPI.get(`/deletesk?no_st=${data.number}`)
		const r: APIResponse<{
			id: string
			number: string
			message: string
		}> = await apiV2.get(`simadu/deletesk?no_st=${data.number}`)
		console.log(r)
		if (r.status === 200) return { success: true, message: r.data.message }
		return { success: false, message: r.data.message }
	} catch (error) {
		return { success: false, message: 'An error occurred while deleting the assignment.' }
	}
}

export const uploadPenugasan = async (
	file: File,
	type: string,
	sk_number: string,
	province: string,
	kabupaten: string
): Promise<ServiceResponse> => {
	const validate = uploadPenugasanValidator(
		file,
		type,
		sk_number,
		province,
		kabupaten
	)
	if (!validate.pass) {
		return {
			success: false,
			message: [validate.message]
		}
	}

	try {
		const formData = new FormData()
		formData.append('file', file)
		formData.append('jenis_patroli', type)
		formData.append('sk_number', sk_number)
		formData.append('provinsi', province)
		formData.append('kabupaten', kabupaten)

		// }> = await axios.post(`${simaduApiUrl}/uploadtim`, formData)
		const r: APIResponseUpload<{
			code: string
		}> = await apiV2.post(`/simadu/uploadtim`, formData)
		console.log(r)
		if (r.code == '200') {
			return {
				success: true,
				message: [r.message]
			}
		} else if (r.code == '400') {
			return {
				success: false,
				message: [r.message]
			}
		}
		// Tambahkan default return statement di sini
		return {
			success: false,
			message: ['Unexpected error occurred']
		}
	} catch (error) {
		// Perbaiki catch block untuk menangani error dengan benar
		if (error instanceof Error) {
			return {
				success: false,
				message: [error.message]
			}
		}
		return {
			success: false,
			message: ['Unknown error occurred']
		}
	}
}

export const getPenugasanDetail = async (
	noSK: string
): Promise<SuratTugasTeamMemberData[]> => {
	const r: APIResponse<SuratTugasTeamMemberResponse[]> = await apiV2.get(
		`/simadu/listregu?nomor_sk=${noSK}`
	)
	if (r.status === 200) {
		return r.data.map((teamMember) => {
			return {
				id: teamMember.id,
				name: teamMember.nama,
				registrationNumber: teamMember.no_registrasi,
				organization: teamMember.instansi,
				startDate: teamMember.tanggal_awal,
				endDate: teamMember.tanggal_akhir,
				posko: teamMember.posko,
				daops: teamMember.daops
			}
		})
	}
	return []
}