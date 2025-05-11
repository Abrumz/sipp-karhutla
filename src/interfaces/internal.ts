import {
	LaporanData,
	NonPatroliUserData,
	PatrolData,
	PatrolListData,
	PenugasanData,
	UserData,
	SuratTugasLaporanData
} from './data'

export interface ValidatorResult {
	pass: boolean
	message: string
}

export interface ServiceResponse<T = any> {
	success: boolean
	message: string | string[]
	data?: T
}

export interface AuthValidatorResult extends ValidatorResult {
	emailError: boolean
	passwordError: boolean
}

interface PatrolCounter {
	mandiri: number
	rutin: number
	terpadu: number
	padam: number
}

export interface PatroliServiceResponse {
	patroliSpots: PatrolData[]
	counter: PatrolCounter
	patroliTerpadu: PatrolListData[]
	patroliMandiri: PatrolListData[]
	patroliRutin: PatrolListData[]
	pemadaman: PatrolListData[]
}

export interface LoginInput {
	email: string
	password: string
}

export interface ResetInput {
	password: string
	retype_password: string
}

export interface SendInput {
	email: string
}

export interface AddPoskoInput {
	name: string
	daops: string
	kecamatan: string
}
export interface UpdatePoskoInput extends AddPoskoInput {
	id: string
}

interface BaseUserInput {
	name: string
	email: string
	registrationNumber: string
	phoneNumber: string
	password?: string
	cPassword?: string
	r_role_id: string
}

interface GcUserInput {
	name: string
	email: string
	password?: string
	cPassword?: string
	provinsi: string
	kabupaten: string
	patroli: string
	daops: string
	startDate: string
	anggota: string
}

export interface updateGcUserInput {
	id: string
	name: string
	email: string
	password?: string
	cPassword?: string
	provinsi: string
	kabupaten: string
	patroli: string
	daops: string
	startDate: string
	anggota: string
}

export type AddUserInput = BaseUserInput

export type AddUserGcInput = GcUserInput

export interface UpdateUserInput extends BaseUserInput {
	id: string
	oldEmail: string
	oldRegistrationNumber: string
}

export type DeleteUserInput = UserData

export type DeletePenugasanInput = PenugasanData

export type DeleteLaporanInput = SuratTugasLaporanData

export interface AddPatroliNonLoginUserInput {
	name: string
	role: number
}

export interface UpdatePatroliNonLoginUserInput
	extends AddPatroliNonLoginUserInput {
	id: number
}

export type DeletePatroliNonLoginUserInput = UpdatePatroliNonLoginUserInput

export interface CreateNonPatroliUser {
	id: string
	name: string
	email: string
	role: string
	organization: string
}

export interface SendEmailForgot {
	email: string
}

export interface resetPassword {
	signature: string
	password: string
	retype_password: string
}

export type DeleteNonPatroliUser = NonPatroliUserData
