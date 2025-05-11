/** Pusat Role IDs */
const pusatRoleLevel = [4, 5]
/** Balai Role IDs */
const balaiRoleLevel = [6, 7]
/** Daops Role Ids */
const daopsRoleLevel = [8, 9]

/**
 * Check role is part of pusat role or not
 * Pusat role = admin pusat and superadmin
 * @param {number} id ID of role
 * @returns {boolean} true if ID in one of pusat role level
 */
export const isPusatRole = (id: number): boolean =>
	!!pusatRoleLevel.includes(id)

/**
 * Check role is part of balai role or not
 * Balai role = admin balai and kepala balai
 * @param {number} id ID of role
 * @returns {boolean} true if ID in one of balai role level
 */
export const isBalaiRole = (id: number): boolean =>
	!!balaiRoleLevel.includes(id)

/**
 * Check role is part of daops role or not
 * Daops role = admin daops and kepala daops
 * @param {number} id ID of role
 * @returns {boolean} true if ID in one of daops role level
 */
export const isDaopsRole = (id: number): boolean =>
	!!daopsRoleLevel.includes(id)
