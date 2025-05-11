import {
	AuthValidatorResult,
	LoginInput,
	ResetInput,
	SendInput
} from '@/interfaces'

export const loginValidator = (inputData: LoginInput): AuthValidatorResult => {
	let emailError = false
	let passwordError = false
	let errorMsg = ''
	if (inputData.email.length < 1 && inputData.password.length < 1) {
		emailError = true
		passwordError = true
		errorMsg = 'Tolong masukkan email dan password anda'
	} else if (inputData.password.length < 1) {
		passwordError = true
		errorMsg = 'Tolong masukkan password anda'
	} else if (inputData.email.length < 1) {
		emailError = true
		errorMsg = 'Tolong masukkan email anda'
	}

	if (errorMsg) {
		return { pass: false, message: errorMsg, emailError, passwordError }
	}
	return { pass: true, message: '', emailError, passwordError }
}

export const resetValidator = (inputData: ResetInput): AuthValidatorResult => {
	const emailError = false
	let passwordError = false
	let errorMsg = ''
	if (inputData.password.length < 1) {
		passwordError = true
		errorMsg = 'Tolong masukkan password anda'
	}

	if (errorMsg) {
		return { pass: false, message: errorMsg, emailError, passwordError }
	}
	return { pass: true, message: '', emailError, passwordError }
}

export const sendEmailValidator = (
	inputData: SendInput
): AuthValidatorResult => {
	let emailError = false
	const passwordError = false
	let errorMsg = ''
	if (inputData.email.length < 1) {
		emailError = true
		errorMsg = 'Tolong masukkan email anda'
	}

	if (errorMsg) {
		return { pass: false, message: errorMsg, emailError, passwordError }
	}
	return { pass: true, message: '', emailError, passwordError }
}
