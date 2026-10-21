import type { CatImage } from '../types/CatImage'
import { API_BASE_URL, getAuthHeaders } from './apiClient'

const DAILY_CAT_API_URL = `${API_BASE_URL}/api/daily-cat`

// Fetch today's cat image from the backend
export async function getDailyCat(): Promise<CatImage> {
	const response = await fetch(DAILY_CAT_API_URL, {
		headers: await getAuthHeaders()
	})
	if (!response.ok) {
		const errorData: { message?: string } = await response.json()
		throw new Error(errorData.message ?? 'Could not load cat of the day.')
	}
	const catImage: CatImage = await response.json()
	return catImage
}