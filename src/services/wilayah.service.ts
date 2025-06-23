import { API } from '@/api'
import { APIResponse, RegionData, RegionResponse } from '@/interfaces'
 
export const REGION_TYPES = [
  "Kelurahan/Desa",
  "Kecamatan",
  "Kabupaten",
  "Provinsi"
]

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
				type: wilayah.tipe,
				tipe: wilayah.tipe
			}
		})
	}
	return []
}

export const getAllWilayah2 = async (
  page: number = 1,
  per_page: number = 100000,
  nama?: string
): Promise<RegionData[]> => { 
  const params: Record<string, string | number> = {
    page,
    per_page,
  };
  if (nama) {
    params.nama = nama;
  }
 
  const queryString = new URLSearchParams(params as any).toString();
 
  const r: APIResponse<any> = await API.get(`/wilayah/list2?${queryString}`);

  if (r.status === 200 && r.data && r.data.data && Array.isArray(r.data.data)) {
	return r.data.data.map((wilayah: { id: any; kode: any; nama: any; tipe: any; }) => ({
	  id: wilayah.id,
	  code: wilayah.kode,
	  name: wilayah.nama,
	  type: wilayah.tipe,
	  tipe: wilayah.tipe,
	}));
  }
  return [];
};

export const getAllKecamatan = async (p0: { page: number; limit: number; search: string; }): Promise<RegionData[]> => {
	const r: APIResponse<RegionResponse[]> = await API.get('/wilayah/list')
	if (r.status === 200) {
		const kecamatan: RegionData[] = []
		r.data.forEach((wilayah) => {
			if (wilayah.tipe === 'Kecamatan') {
				kecamatan.push({
					id: wilayah.id,
					code: wilayah.kode,
					name: wilayah.nama,
					type: wilayah.tipe,
					tipe: ''
				})
			}
		})
		return kecamatan
	}
	return []
}

export const getAllKelurahan2 = async (
  page: number = 1,
  per_page: number = 100000,
  nama?: string
): Promise<RegionData[]> => {
  const params: Record<string, string | number> = {
    page,
    per_page,
  };
  
  if (nama) {
    params.nama = nama;
  }

  const queryString = new URLSearchParams(params as any).toString();
  
  try {
    const r: APIResponse<any> = await API.get(`/wilayah/list2?${queryString}`);

    if (r.status === 200 && r.data?.data && Array.isArray(r.data.data)) { 
      return r.data.data
        .filter((wilayah: any) => wilayah.tipe === "Kelurahan/Desa")
        .map((wilayah: any) => ({
          id: wilayah.id,
          code: wilayah.kode,
		  kode: wilayah.kode,
          name: wilayah.nama,
		  nama: wilayah.nama,
          type: wilayah.tipe,
          tipe: wilayah.tipe
        }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching kelurahan:", error);
    return [];
  }
};


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
					type: wilayah.tipe,
					tipe: ''
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

export const addWilayah = async (data: { nama: string; kode: string; tipe: string }): Promise<boolean> => {
  try {
    const r: APIResponse<any> = await API.post('/wilayah/add', data);
    return r.status === 200;
  } catch (error) {
    console.error("Error adding wilayah:", error);
    return false;
  }
};
 
export const updateWilayah = async (data: { id: string; nama: string }): Promise<boolean> => {
  try {
    const r: APIResponse<any> = await API.post('/wilayah/save', data);
    return r.status === 200;
  } catch (error) {
    console.error("Error updating wilayah:", error);
    return false;
  }
};
 
export const deleteWilayah = async (id: string): Promise<boolean> => {
  try {
    const r: APIResponse<any> = await API.delete(`/wilayah/remove/${id}`);
    return r.status === 200;
  } catch (error) {
    console.error("Error deleting wilayah:", error);
    return false;
  }
};