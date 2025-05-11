export interface APIResponse<T> {
	status: number
	message: string
	data: T
}

export interface APIResponseUpload<T> {
	status: number
	message: string
	data: T
	code: string
}

interface UserBaseResponse {
	no_registrasi: string
	nama: string
	email: string
	no_telepon: string
}

export interface UserResponse extends UserBaseResponse {
	id_user: string
	initial: number
	expired: number
}

export interface RoleResponse {
	id: string
	nama: string
	level: string
	aktif: string
}

export interface UserDetailResponse extends UserBaseResponse {
	id: string
	instansi: string
	foto: string | null
	aktif: string
	roles: RoleResponse[]
}

export interface NonPatroliUserResponse {
	id: string
	m_user_id: string
	r_role_id: string
	m_user: UserDetailResponse
	r_role: RoleResponse
}

export interface KorwilResponse {
	id: string
	nama: string
	kode: string
	m_daops_id: string
}

export interface LaporanDataResponse {
	success: boolean
	message: string | string[]
	no_sk: string
	data?: any
}

export interface NonLoginUserResponse {
	id: string
	nama: string
	r_role_id: string
	r_role: RoleResponse
}

export interface LoginResponse {
	token: string
	user: UserResponse
	detail: UserDetailResponse
}

export interface RegionResponse {
	id: string
	nama: string
	kode: string
	tipe: string
}

export interface ProvinsiResponse {
	kode_wilayah: string
	nama_wilayah: string
}

export interface KabupatenResponse {
	kode_wilayah: string
	nama_wilayah: string
}

export interface SkNumberResponse {
	successData: boolean
	message: string | string[]
}

export interface BalaiResponse {
	id: string
	kode: string
	nama: string
	r_wilayah_id: string
	r_wilayah: RegionResponse
}

export interface DaopsResponse {
	id: string
	kode: string
	nama: string
	r_balai_id: string
	r_balai: BalaiResponse
}

export interface KorwilDistinctResponse {
	kode: string
	nama: string
}

export interface DaopsListResponse {
	nama_daops: string
}
export interface HotspotItemDetail {
	tanggal: string
	latitude: string
	longitude: string
	confidence: string
	kawasan: string
	desa: string
	kecamatan: string
	'kota/kabupaten': string
	provinsi: string
}

export interface HotspotItem {
	lat: string
	lon: string
	conf: string
	sat: string
	tanggal: string
	detail: HotspotItemDetail
}

export interface UserGroundcheckResponse {
	id: string
	nama: string
	email: string
	provinsi: string
	kabupaten: string
	patroli: string
	daops: string
	tanggal: string
	anggota: string
}

interface DaerahPatroli {
	id_daerah_patroli: string
	nama_daerah_patroli: string
	id_daops: string
	id_wilayah: string
	nama_daops: string
	id_balai: string | null
	ketua_daops: string | null
	nip_ketua: string
	nama_ketua: string
	kode_wilayah: string
	tipe_wilayah: string
	nama_wilayah: string
}

export interface PatroliResponse {
	id_laporan_header: string
	id_daerah_patroli: DaerahPatroli
	id_aktivitas_harian: string[]
	id_regu_tim_patroli: [
		{
			id_regu_tim_patroli: string
			no_sk: string
			periode_awal: string
			periode_akhir: string
			id_daerah_patroli: string
			id_pengguna: string
			id_roles: string
			no_registrasi: string
			instansi: string
			nama: string
		}
	]
	id_inventori_patroli: string[]
	kategori_patroli: string
	satelit_hotspot: string[]
	tanggal_patroli: string
	regu_patroli: {
		daerah: DaerahPatroli
		ketua: {
			no_registrasi: string
			nama: string
			email: string
			id_pengguna: string
			id_regu_tim_patroli: string
			id_daerah_patroli: string
		}
		anggota: [
			{
				id_regu_tim_patroli: string
				nama: string
			}
		]
	}
	my_daops: boolean
	laporanDarat: [
		{
			id_laporan_darat: string
			id_laporan_header: string
			latitude: string
			longitude: string
			desa_kelurahan: string
			cuaca_pagi: string
			cuaca_siang: string
			cuaca_sore: string
			curah_hujan: string
			suhu: string
			kelembaban: string
			kecepatan_angin: string
			kondisi_lapangan: string
			potensi_karhutla: string
			FFMC_KKAS: string
			FWI_ICK: string
			DC_KK: string
			aktivitas_masyarakat: string
			aksebilitas: string
			kecamatan: string | null
			kabupaten: string | null
			provinsi: string | null
		}
	]
}

export interface SuratTugasResponse {
	id: string
	nomor: string
	jenis_surat: string
	tanggal_awal: string
	tanggal_akhir: string
}

export interface SuratTugasTeamMemberResponse {
	id: string
	tanggal_awal: string
	tanggal_akhir: string
	nama: string
	no_registrasi: string
	instansi: string
	posko: string
	daops: string
}

export interface SuratTugasLaporanDataResponse {
	id_laporan_header: string
	tanggal_patroli: string
	nama_daerah_patroli: string
	nama_daops: string
	nama_ketua: string
}

export interface PoskoResponse {
	id: string
	nama: string
	m_daops_id: string
	r_wilayah_id_kec: string
	r_wilayah_id_kel: string
	r_wilayah_id_desa: string | null
	daops: DaopsResponse
	kecamatan: RegionResponse
	kelurahan: RegionResponse
	desa: RegionResponse | null
}
