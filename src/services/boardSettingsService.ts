// Store the backend endpoint used for board settings
const BOARD_SETTINGS_API_URL =
	'http://localhost:5001/api/board-settings'

// Describe the JSON returned by the backend
interface BoardSettingsResponse {
	maxInProgressTasks: number
}

// Fetch the maximum number of in-progress tasks
export async function getMaxInProgressTasks(): Promise<number> {
	const response = await fetch(BOARD_SETTINGS_API_URL)
	if (!response.ok) {
		throw new Error(
			`Could not load board settings: ${response.status}`
		)
	}
	const settings: BoardSettingsResponse = await response.json()
	return settings.maxInProgressTasks
}

// Save a new maximum number of in-progress tasks
export async function updateMaxInProgressTasks(
	newLimit: number
): Promise<number> {
	const response = await fetch(BOARD_SETTINGS_API_URL, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			maxInProgressTasks: newLimit
		})
	})
	if (!response.ok) {
		throw new Error(
			`Could not update board settings: ${response.status}`
		)
	}
	const settings: BoardSettingsResponse = await response.json()
	return settings.maxInProgressTasks
}