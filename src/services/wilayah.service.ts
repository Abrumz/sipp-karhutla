import { API } from '@/api'
import { APIResponse, RegionData, RegionResponse } from '@/interfaces'

export interface WilayahPagedResponse {
  data: {
    data: any[];
    page: number;
    total: number;
  }
}

export interface WilayahListResult {
  data: any[];
  page: number;
  totalCount: number;
}

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
 
export const getWilayahList = async (
  tableState: { pageSize: number; page: number; search?: string },
  setTableState: (fn: (prev: any) => any) => void,
  URLapiV2: string
): Promise<void> => {
  setTableState((prev: any) => ({ ...prev, loading: true }));

  try {
	let url = `${URLapiV2}/wilayah/list3?`;
	url += `per_page=${tableState.pageSize}`;
	url += `&page=${tableState.page + 1}`;
	url += `&nama=${tableState.search || ''}`;

	const response = await fetch(url);
	const result = await response.json();

	if (result && result.data) {
	  setTableState((prev: any) => ({
		...prev,
		data: result.data.data || [],
		totalCount: parseInt(result.data.total) || 0,
		loading: false
	  }));
	} else {
	  setTableState((prev: any) => ({
		...prev,
		data: [],
		totalCount: 0,
		loading: false
	  }));
	}
  } catch (error) {
	console.error("Error fetching data:", error);
	setTableState((prev: any) => ({
	  ...prev,
	  data: [],
	  totalCount: 0,
	  loading: false
	}));
  }
};