import {
	AddPoskoInput,
	PoskoData,
	UpdatePoskoInput,
	ValidatorResult
} from '@/interfaces'
import { digitLength } from '@/utils'

export const createPoskoValidator = (
	inputData: AddPoskoInput
): ValidatorResult => {
	let errorMsg = ''
	if (!inputData.name) errorMsg = 'Tolong masukkan nama posko'
	else if (digitLength(parseInt(inputData.daops)) < 1)
		errorMsg = 'Tolong pilih daops'
	else if (digitLength(parseInt(inputData.kecamatan)) < 1)
		errorMsg = 'Tolong pilih kecamatan'

	if (errorMsg) return { pass: false, message: errorMsg }
	return { pass: true, message: '' }
}

export const updatePoskoValidator = (
	inputData: UpdatePoskoInput
): ValidatorResult => {
	let errorMsg = ''
	if (!inputData.id) errorMsg = 'ID posko tidak disertakan'
	else if (!inputData.name) errorMsg = 'Tolong masukkan nama posko'
	else if (!inputData.daops) errorMsg = 'Tolong pilih daops'
	else if (!inputData.kecamatan) errorMsg = 'Tolong pilih kecamatan'

	if (errorMsg) return { pass: false, message: errorMsg }
	return { pass: true, message: '' }
}

export const deletePoskoValidator = (inputData: PoskoData): ValidatorResult => {
	if (!inputData.id)
		return { pass: false, message: 'ID posko tidak disertakan' }
	return { pass: true, message: '' }
}
