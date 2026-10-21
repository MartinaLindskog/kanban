// Limit task status to the supported workflow columns
export type TaskStatus = 'todo' | 'in-progress' | 'done'

// Limit task priority to the supported levels
export type TaskPriority = 'low' | 'medium' | 'high'

// Describe the task data used throughout the app
export interface Task {
	id: string
	title: string
	comment?: string
	assignee?: string
	dueDate?: string
	priority: TaskPriority
	status: TaskStatus
}

export type NewTask = Omit<Task, 'id'>
