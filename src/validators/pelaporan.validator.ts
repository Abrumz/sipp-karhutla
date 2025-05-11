import { ValidatorResult } from '@/interfaces'
import { calcDayDifference, isGreaterThan } from '@/utils'

export const downloadRentangTanggalValidator = (
	startDate: Date,
	endDate: Date
): ValidatorResult => {
	let errorMsg = ''
	// End Date must greater than Start Date
	if (!isGreaterThan(endDate.toISOString(), startDate.toISOString())) {
		errorMsg = 'Tanggal Selesai harus lebih besar dari Tanggal Mulai'
	}
	// Max 7 day range
	else if (calcDayDifference(endDate, startDate) > 7) {
		errorMsg =
			'Maksimal rentang tanggal adalah 7 hari, silakan pilih rentang tanggal lain'
	}

	if (errorMsg) return { pass: false, message: errorMsg }
	return { pass: true, message: '' }
}

export const downloadRentangTanggalRingkasanValidator = (
	startDate: Date,
	endDate: Date
): ValidatorResult => {
	let errorMsg = ''
	// End Date must greater than Start Date
	if (!isGreaterThan(endDate.toISOString(), startDate.toISOString())) {
		errorMsg = 'Tanggal Selesai harus lebih besar dari Tanggal Mulai'
	}

	if (errorMsg) return { pass: false, message: errorMsg }
	return { pass: true, message: '' }
}
