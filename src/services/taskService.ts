import type { Task } from '../types/Task'

// The backend endpoint used for task requests
//tillfällig adress nu tills publicering 
const TASKS_API_URL = 'http://localhost:5001/api/tasks'


// Fetch all tasks from the backend
export async function getTasks(): Promise<Task[]> {
	const response = await fetch(TASKS_API_URL)
	if (!response.ok) {
		throw new Error(`Could not load tasks: ${response.status}`)
	}
	const tasks: Task[] = await response.json()
	return tasks
}