import { API } from '@/api'
import { APIResponse, RegionData, RegionResponse } from '@/interfaces'

export const getAllWilayah = async (): Promise<RegionData[]> => {
	const r: APIResponse<RegionResponse[]> = await API.get('/wilayah/list')
	if (r.status === 200) {
		return r.data.map((wilayah) => {
			return {
				id: wilayah.id,
				code: wilayah.kode,
				name: wilayah.nama,
				type: wilayah.tipe
			}
		})
	}
	return []
}

export const getAllKecamatan = async (): Promise<RegionData[]> => {
	const r: APIResponse<RegionResponse[]> = await API.get('/wilayah/list')
	if (r.status === 200) {
		const kecamatan: RegionData[] = []
		r.data.forEach((wilayah) => {
			if (wilayah.tipe === 'Kecamatan') {
				kecamatan.push({
					id: wilayah.id,
					code: wilayah.kode,
					name: wilayah.nama,
					type: wilayah.tipe
				})
			}
		})
		return kecamatan
	}
	return []
}

export const getAllPulau = async (): Promise<RegionData[]> => {
	const r: APIResponse<RegionResponse[]> = await API.get('/wilayah/list')
	if (r.status === 200) {
		const pulau: RegionData[] = []
		r.data.forEach((wilayah) => {
			if (wilayah.tipe === 'Pulau') {
				pulau.push({
					id: wilayah.id,
					code: wilayah.kode,
					name: wilayah.nama,
					type: wilayah.tipe
				})
			}
		})
		return pulau
	}
	return []
}
