import { BalaiData, ValidatorResult } from '@/interfaces'

export const createBalaiValidator = (inputData: BalaiData): ValidatorResult => {
	let errorMsg = ''
	if (!inputData.code) errorMsg = 'Tolong masukkan kode balai'
	else if (!inputData.name) errorMsg = 'Tolong masukkan nama balai'
	else if (!inputData.region) errorMsg = 'Tolong pilih wilayah balai'

	if (errorMsg) {
		return { pass: false, message: errorMsg }
	}
	return { pass: true, message: '' }
}

export const updateBalaiValidator = (inputData: BalaiData): ValidatorResult => {
	let errorMsg = ''
	if (!inputData.id) errorMsg = 'ID balai tidak disertakan'
	else if (!inputData.code) errorMsg = 'Tolong masukkan kode balai'
	else if (!inputData.name) errorMsg = 'Tolong masukkan nama balai'
	else if (!inputData.region) errorMsg = 'Tolong pilih wilayah'

	if (errorMsg) {
		return { pass: false, message: errorMsg }
	}
	return { pass: true, message: '' }
}

export const deleteBalaiValidator = (inputData: BalaiData): ValidatorResult => {
	if (!inputData.id)
		return { pass: false, message: 'ID Balai tidak disertakan' }
	return { pass: true, message: '' }
}
