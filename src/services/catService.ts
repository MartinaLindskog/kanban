import type { CatImage } from '../types/CatImage'

// Store the backend endpoint used for the daily cat request
const DAILY_CAT_API_URL = 'http://localhost:5001/api/daily-cat'

// Fetch today's cat image from the backend
export async function getDailyCat(): Promise<CatImage> {
	const response = await fetch(DAILY_CAT_API_URL)

	if (!response.ok) {
		throw new Error(`Could not load the daily cat: ${response.status}`)
	}

	const catImage: CatImage = await response.json()

	return catImage
}