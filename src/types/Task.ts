// TASK. Describes the task. (TaskCard.tsx will show the task)

//status in a task can only be either of these 3
export type TaskStatus = 'todo' | 'in-progress' | 'done'

//priority in a task can only be either of these 3
export type TaskPriority = 'low' | 'medium' | 'high'

// task interface
export interface Task {
	// will be a randomized string rather than number in a sequence
	id: string
	title: string
	//comment volontary
	comment?: string
	//assignee (assigned to, who is doing the task) is volontary 
	assignee?: string
	// optional, deadline stored as YYYY-MM-DD
	dueDate?: string
	priority: TaskPriority
	status: TaskStatus
}

//new tasks have all Task properties except id, which the server creates
export type NewTask = Omit<Task, 'id'>
