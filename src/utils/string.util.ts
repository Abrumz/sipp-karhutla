/**
 * Split string and trim the output
 * @param {string} string input string
 * @param {string} sep separator
 * @returns {string} array of splitted and trimmed string
 */
export const splitAndTrim = (string: string, sep: string): string[] => {
	const splittedString = string.split(sep)
	for (let i = 0; i < splittedString.length; i += 1) {
		splittedString[i] = splittedString[i].trim()
	}
	return splittedString
}

/**
 * Check string is numeric or not
 * @param {string} value input string
 * @returns {boolean} true if string is numeric and vice versa
 */
export const isNumeric = (value: string): boolean => /^\d+$/.test(value)

/**
 * Check string is a valid email or not
 * @param {string} value input string
 * @returns {boolean} true if string is a valid email and vice versa
 */
export const isEmail = (value: string): boolean =>
	/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)

/**
 * Check string is a valid phone number or not
 * Phone number format : +62xxxxxxxxxx (minimal 10 digits after +62)
 * @param {string} value input string
 * @returns {boolean} true if string in a valid phone number and vice versa
 */
export const isPhoneNumber = (value: string): boolean =>
    /^(^\+62)\d{10,15}$/.test(value)
