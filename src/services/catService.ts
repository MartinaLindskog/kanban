import type { CatImage } from '../types/CatImage'
import { getAuthHeaders } from './apiClient'

// Store the backend endpoint used for the daily cat request
const DAILY_CAT_API_URL = 'http://localhost:5001/api/daily-cat'

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