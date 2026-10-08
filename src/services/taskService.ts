import type { Task, NewTask } from '../types/Task'

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


// Send a new task to the backend
export async function createTask(newTask: NewTask): Promise<Task> {
	const response = await fetch(TASKS_API_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(newTask)
	})
	if (!response.ok) {
		throw new Error(`Could not create task: ${response.status}`)
	}
	const createdTask: Task = await response.json()
	return createdTask
}