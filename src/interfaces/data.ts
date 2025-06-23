import { ReactNode } from 'react'
import { PatroliResponse } from './api'

export interface UserData {
    nama: any
    no_registrasi: string
    no_telepon: string
	id: number
	accessId: number
	name: string
	email: string
	registrationNumber: string
	phoneNumber: string
	organization: string
	photo: string | null
	role: number
	roleLevel: number
	roleName: string
}

export interface PenugasanData {
	id: string
	number: string
}

export interface UserGcData {
	id: number
	number: number
}

export interface NonPatroliUserData {
	id: number
	accessId: number
	name: string
	email: string
	registrationNumber: string
	role: number
	organization: string
}

export interface KorwilData {
	id: string
	nama: string
	kode: string
	m_daops_id: string
}

export interface BalaiData {
	id: string
	code: string
	name: string
	region: string
}

export interface ProvinsiData {
	kode_wilayah: string
	nama_wilayah: string
}

export interface KabupatenData {
	kode_wilayah: string
	nama_wilayah: string
}

export interface SkNumberData<T = any> {
	success: boolean
	message: string | string[]
	data?: T
}

export interface DaopsData {
	id: string
	code: string
	name: string
	balaiId: string
}

export interface KorwilDistinctData {
	kode: string
	nama: string
}

export interface DaopsList {
	nama_daops: string
}

export interface RegionData {
    tipe: string
	id: string
	code: string
	name: string
	type: string
}

export interface PatrolData {
	 id: string;
	latitude: string
	longitude: string
	marker: string
	patroli: PatroliResponse | null
}

export interface PatrolResponse {
  [x: string]: string
  id_daerah_patroli: string
  kategori_patroli: string
  id_laporan_header: string
  id: string; 
}

export interface SpotData {
 latitude: string;
	longitude: string;
	marker: string;
	patroli: PatroliData; 
}

export interface PatroliData {
    lon: string
    longitude: string
    lat: string
    latitude: string
	id: any
	daops: ReactNode
	ketua: ReactNode
	kode: ReactNode
	daerah: ReactNode
	kategori: any 
	regu_patroli: {
		daerah: {
			nama_daops: string;
		};
		ketua: {
			nama: string;
			email: string;
		};
	};
	laporanDarat: Array<{
		latitude: string;
		longitude: string;
	}>; 
	id_laporan_header: string;
	kategori_patroli: string;
	id_daerah_patroli: {
		nama_daerah_patroli: string;
		tipe_wilayah: string;
		nama_wilayah: string;
	};
	status_padam?: string;
	my_daops?: boolean;
}

export interface PatrolListData {
	reportLink: string
	patrolRegion: string
	operationRegion: string
	patrolDate: string
	patroli: PatrolInfo | null;
}

export interface PatrolInfo {
  id: string;
  type: string; 
}

export interface SuratTugasData {
	id: string
	number: string
	type: string
	startDate: string
	finishDate: string
	reportLink: string
}

export interface UserGroundcheckData {
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

export interface EditPenugasanProps {
    member: SuratTugasTeamMemberData;
    skNumber: string;
    onClose: () => void;
    onSuccess: () => void;
}

export interface EmailOption {
    value: string;
    label: string;
}

export interface KelurahanOption {
    value: string;
    label: string;
    data: {
        id: string;
        nama: string;
        kode: string;
        tipe: string;
    };
}

export interface SuratTugasTeamMemberData { 
  id_daops: string;
  r_surat_tugas_id: any;
  no_registrasi: string;
  groupMembers: any;
  kode_wilayah: string;
  isActive: any;
  r_role_id: string;
  email: string;
  phoneNumber: string;
  id: string;
  name: string; 
  registrationNumber: string;
  organization: string;
  startDate: string; 
  endDate: string; 
  posko: string;
  daops: string;
  id_daerah_patroli: string;
}

export interface ModifySkFormData {
    id_regu_tim_patroli: string;
    tanggal_awal: string;
    tanggal_akhir: string;
    id_roles: string;
    email: string;
    id_daerah_patroli: string;
    kode_wilayah: string;
    new_posko: boolean;
    id_daops: string;
    new_user: boolean;
    enabled: boolean;
}

export interface SuratTugasLaporanData {
	id_laporan_header: string
	tanggal_patroli: string
	nama_daerah_patroli: string
	nama_daops: string
	nama_ketua: string
}

export interface UserGroundCheckData {
	id: string
}
export interface LaporanData {
	id: string
	id_daerah_patroli: string
	kategori_patroli: string
	tanggal_patroli: string
}

export interface PoskoData {
	id: string
	name: string
	daops: string
	daopsId: string
	kecamatan: string
	kecamatanId: string
}

export interface RoleData {
	id: number
	name: string
	level: number
	active: string
}
