import {
	AddPatroliNonLoginUserInput,
	AddUserInput,
	CreateNonPatroliUser,
	DeleteNonPatroliUser,
	DeletePatroliNonLoginUserInput,
	DeleteUserInput,
	NonPatroliUserData,
	ResetInput,
	UpdatePatroliNonLoginUserInput,
	UpdateUserInput,
	ValidatorResult
} from '@/interfaces'
import { digitLength, isEmail, isPhoneNumber } from '@/utils'

export const createUserValidator = (
	inputData: AddUserInput
): ValidatorResult => {
	let errorMsg = ''
	if (inputData.name.length < 1) errorMsg = 'Tolong masukan nama pengguna'
	else if (!isEmail(inputData.email))
		errorMsg = 'Tolong masukan email pengguna yang valid'
	else if (inputData.registrationNumber.length < 1)
		errorMsg = 'Tolong masukan nomor registrasi/NIP'
	else if (!isPhoneNumber(inputData.phoneNumber))
		errorMsg = 'Silahkan memasukan nomor Handphone yang valid'
	else if (!inputData.password) {
		errorMsg = 'Tolong masukkan kata sandi'
	} else if (!inputData.cPassword) {
		errorMsg = 'Tolong masukkan konfirmasi kata sandi'
	} else if (inputData.password && inputData.cPassword) {
		if (inputData.password.length < 8)
			errorMsg = 'Password minimal 8 karakter'
		else if (
			inputData.password !== inputData.cPassword &&
			inputData.password.length > 7
		) {
			errorMsg = 'Konfirmasi password tidak sama'
		}
	}

	if (errorMsg) return { pass: false, message: errorMsg }
	return { pass: true, message: '' }
}

export const updateUserValidator = (
	inputData: UpdateUserInput
): ValidatorResult => {
	let errorMsg = ''
	if (inputData.name.length < 1) errorMsg = 'Tolong masukan nama pengguna'
	else if (!isEmail(inputData.email))
		errorMsg = 'Tolong masukan email pengguna yang valid'
	else if (inputData.registrationNumber.length < 1)
		errorMsg = 'Tolong masukan nomor registrasi/NIP'
	else if (!isPhoneNumber(inputData.phoneNumber))
		errorMsg = 'Silahkan memasukan nomor Handphone yang valid'
	else if (inputData.password) {
		if (inputData.password.length < 8)
			errorMsg = 'Password minimal 8 karakter'
		else if (inputData.cPassword) {
			if (inputData.password !== inputData.cPassword) {
				errorMsg = 'Konfirmasi password tidak sama'
			}
		}
	}

	if (errorMsg) return { pass: false, message: errorMsg }
	return { pass: true, message: '' }
}

export const deleteUserValidator = (
	inputData: DeleteUserInput
): ValidatorResult => {
	if (digitLength(inputData.id) < 1)
		return { pass: false, message: 'ID Pengguna tidak ada' }
	return { pass: true, message: '' }
}

export const createPatroliNonLoginValidator = (
	inputData: AddPatroliNonLoginUserInput
): ValidatorResult => {
	let errorMsg = ''
	if (!inputData.name) errorMsg = 'Tolong masukan nama pengguna'
	else if (!inputData.role) errorMsg = 'Tolong pilih hak akses pengguna'

	if (errorMsg) return { pass: false, message: errorMsg }
	return { pass: true, message: '' }
}

export const updatePatroliNonLoginValidator = (
	inputData: UpdatePatroliNonLoginUserInput
): ValidatorResult => {
	let errorMsg = ''
	if (!inputData.id) errorMsg = 'Tidak ada ID pengguna'
	else if (inputData.name.length < 1)
		errorMsg = 'Tolong masukan nama pengguna'
	else if (!inputData.role) errorMsg = 'Tolong pilih hak akses pengguna'

	if (errorMsg) return { pass: false, message: errorMsg }
	return { pass: true, message: '' }
}

export const deletePatroliNonLoginValidator = (
	inputData: DeletePatroliNonLoginUserInput
): ValidatorResult => {
	if (digitLength(inputData.id) < 1)
		return { pass: false, message: 'ID hak akses tidak ada' }
	return { pass: true, message: '' }
}

export const createNonPatroliValidator = (
	inputData: CreateNonPatroliUser
): ValidatorResult => {
	let errorMsg = ''
	if (inputData.id.length < 1) errorMsg = 'ID pengguna tidak ada'
	else if (inputData.role.length < 1)
		errorMsg = 'Tolong pilih hak akses pengguna'
	// if (inputData.organization.length < 1)
	//   errorMsg="Tolong pilih Daops/Balai")

	if (errorMsg) return { pass: false, message: errorMsg }
	return { pass: true, message: '' }
}

export const updateNonPatroliValidator = (
	inputData: NonPatroliUserData
): ValidatorResult => {
	let errorMsg = ''
	if (digitLength(inputData.id) < 1) errorMsg = 'ID Pengguna tidak ada'
	else if (digitLength(inputData.role) < 1)
		errorMsg = 'Tolong pilih hak akses pengguna'

	if (errorMsg) return { pass: false, message: errorMsg }
	return { pass: true, message: '' }
}

export const deleteNonPatroliValidator = (
	inputData: DeleteNonPatroliUser
): ValidatorResult => {
	if (digitLength(inputData.accessId) < 1)
		return { pass: false, message: 'ID Akses Pengguna tidak ada' }
	return { pass: true, message: '' }
}

export const ResetValidator = (inputData: ResetInput): ValidatorResult => {
	let errorMsg = ''
	if (inputData.password && inputData.retype_password) {
		if (inputData.password.length < 8)
			errorMsg = 'Password minimal 8 karakter'
		else if (
			inputData.password !== inputData.retype_password &&
			inputData.password.length > 7
		) {
			errorMsg = 'Konfirmasi password tidak sama'
		}
	}

	if (errorMsg) return { pass: false, message: errorMsg }
	return { pass: true, message: '' }
}
