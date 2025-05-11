import { DaopsData, ValidatorResult } from '@/interfaces'

export const createDaopsValidator = (inputData: DaopsData): ValidatorResult => {
	let errorMsg = ''
	if (!inputData.code) errorMsg = 'Tolong masukkan kode daops'
	else if (!inputData.name) errorMsg = 'Tolong masukkan nama daops'
	else if (!inputData.balaiId) errorMsg = 'Tolong pilih balai'

	if (errorMsg) return { pass: false, message: errorMsg }
	return { pass: true, message: '' }
}

export const updateDaopsValidator = (inputData: DaopsData): ValidatorResult => {
	let errorMsg = ''
	if (!inputData.id) errorMsg = 'ID daops tidak disertakan'
	else if (!inputData.code) errorMsg = 'Tolong masukkan kode daops'
	else if (!inputData.name) errorMsg = 'Tolong masukkan nama daops'
	else if (!inputData.balaiId) errorMsg = 'Tolong pilih balai'

	if (errorMsg) return { pass: false, message: errorMsg }
	return { pass: true, message: '' }
}

export const deleteDaopsValidator = (inputData: DaopsData): ValidatorResult => {
	if (!inputData.id)
		return { pass: false, message: 'ID Daops tidak disertakan' }
	return { pass: true, message: '' }
}
