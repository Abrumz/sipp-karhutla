import { ValidatorResult, DeletePenugasanInput } from '@/interfaces'

import { digitLength } from '@/utils'
export const uploadPenugasanValidator = (
	file: File,
	type: string,
	sk_number: string,
	province: string,
	kabupaten: string
): ValidatorResult => {
	let errorMsg = ''
	if (!file) errorMsg = 'Tolong pilih berkas penugasan yang ingin diunggah'
	else if (!type) errorMsg = 'Tolong pilih kategori penugasan'
	else if (!sk_number) errorMsg = 'Tolong dimasukkan nomor SK'
	else if (!province) errorMsg = 'Tolong pilih Provinsi'
	else if (!kabupaten) errorMsg = 'Tolong pilih Kabupaten'

	if (errorMsg) return { pass: false, message: errorMsg }
	return { pass: true, message: '' }
}

export const deletePenugasanValidator = (
	inputData: DeletePenugasanInput
): ValidatorResult => {
	return { pass: true, message: '' }
}
