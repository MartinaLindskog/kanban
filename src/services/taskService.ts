import type { Task, NewTask } from '../types/Task'
import { getAuthHeaders } from './apiClient'

// The backend endpoint used for task requests
//tillfällig adress nu tills publicering 
const TASKS_API_URL = 'http://localhost:5001/api/tasks'


// Fetch all tasks from the backend
export async function getTasks(): Promise<Task[]> {
	const response = await fetch(TASKS_API_URL, {
	headers: await getAuthHeaders()
	})
	if (!response.ok) {
		throw new Error(`Could not load tasks: ${response.status}`)
	}
	const tasks: Task[] = await response.json()
	return tasks
}


// Send a new task to the backend
export async function createTask(newTask: NewTask): Promise<Task> {
	const authHeaders = await getAuthHeaders()
	const response = await fetch(TASKS_API_URL, {
		method: 'POST',
		headers: {
			...authHeaders,
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

// Send an updated task to the backend
export async function updateTask(updatedTask: Task): Promise<Task> {
	const authHeaders = await getAuthHeaders()
	const response = await fetch(`${TASKS_API_URL}/${updatedTask.id}`, {
		method: 'PUT',
		headers: {
			...authHeaders,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(updatedTask)
	})

	if (!response.ok) {
		throw new Error(`Could not update task: ${response.status}`)
	}

	const savedTask: Task = await response.json()

	return savedTask
}

// Ask the backend to delete a task
export async function deleteTask(taskId: string): Promise<void> {
	const response = await fetch(`${TASKS_API_URL}/${taskId}`, {
		method: 'DELETE',
		headers: await getAuthHeaders()
	})
	if (!response.ok) {
		throw new Error(`Could not delete task: ${response.status}`)
	}
}