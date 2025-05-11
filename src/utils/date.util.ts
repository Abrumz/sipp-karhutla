/**
 * Calculates how many days the difference between date2 and date1
 * Simple Logic : date1 - date2 = output
 * @param {Date} date1 input date
 * @param {Date} date2 input date
 * @returns {string} num of day differences
 */
export const calcDayDifference = (date1: Date, date2: Date): number => {
	const oneDayTimeMillis = 1000 * 60 * 60 * 24
	const calcResult =
		Math.round(date1.getTime() - date2.getTime()) / oneDayTimeMillis
	return parseInt(calcResult.toFixed(0))
}

/**
 * Check date1 is greater than date2 or not
 * @param {Date} date1 input date
 * @param {Date} date2 input date
 * @returns {boolean} true if date1 >= date2 and vice versa
 */
export const isGreaterThan = (date1: string, date2: string): boolean =>
	Date.parse(date1) >= Date.parse(date2)

/**
 * Format date to YYYY-MM-DD
 * @param {Date} date input date
 * @returns {string} date in YYYY-MM-DD format
 */
export const formatYYYYMMDD = (date: Date): string =>
	date.toISOString().split('T')[0]
