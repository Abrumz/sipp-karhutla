import { UserData } from '@/interfaces'
import Cookies from 'js-cookie'
// import { parseJwt } from "../utils/formatter";

// Token Name for JWT Token
const KEY_TOKEN = '_z2lj4lY7Wn_hIz_'

// Token Name for temporary report file download
// const KEY_TOKEN_V1 = 'kHIn83Lok_as3'

// Token Name for user data
const KEY_USER = 'ijN8Lds_1nd'

export const getTokenCookie = (): string => {
	return Cookies.get(KEY_TOKEN) || ''
}

export const setTokenCookie = (token = ''): void => {
	Cookies.set(KEY_TOKEN, token, { expires: 1 })
}

export const removeTokenCookie = (): void => {
	Cookies.remove(KEY_TOKEN)
}

// static getTokenV1() {
// 	return Cookies.get(KEY_TOKEN_V1)
// }

// static setTokenV1(token = '') {
// 	Cookies.set(KEY_TOKEN_V1, token, { expires: 1 })
// }

// static removeTokenV1() {
// 	Cookies.remove(KEY_TOKEN_V1)
// }

// static checkToken() {
// 	const token = Cookies.get(KEY_TOKEN);
// 	return !!token;
// }

// static getUserFromToken() {
// 	const token = Cookies.get(KEY_TOKEN);
// 	return parseJwt(token);
// }

export const getUserCookie = (): string => {
	return Cookies.get(KEY_USER) || ''
}

export const setUserCookie = (user: UserData): void => {
	Cookies.set(KEY_USER, JSON.stringify(user))
}

export const removeUserCookie = (): void => {
	Cookies.remove(KEY_USER)
}
