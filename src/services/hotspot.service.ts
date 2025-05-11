import { HotspotAPI } from '@/api'
import { APIResponse, HotspotItem } from '@/interfaces'

export const getHotspot = async (url: string): Promise<HotspotItem[]> => {
	try {
		const res: APIResponse<HotspotItem[]> = await HotspotAPI.get(url)
		// console.log(res.data)
		return res.data ? res.data : []
	} catch (error) {
		console.error(error)
		return []
	}
}
