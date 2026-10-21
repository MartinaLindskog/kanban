import { getCurrentSession } from './authService'

// Create the authorization header for protected backend requests
export async function getAuthHeaders() {
	const session = await getCurrentSession()
	if (!session) {
		throw new Error('No active login session.')
	}
	return {
		Authorization: `Bearer ${session.access_token}`
	}
}

// Store the backend base URL in one place
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5001'