import type { TaskStatus, Task } from '../types/Task'
import { isDueTomorrowOrEarlier } from './dateUtils'

// Check whether an unfinished task has an urgent deadline
export function shouldTaskUseHighPriority(
	status: TaskStatus,
	dueDate?: string
): boolean {
	return status !== 'done' && isDueTomorrowOrEarlier(dueDate)
}

// Count tasks with the selected status
export function countTasksByStatus(
	tasks: Task[],
	status: TaskStatus
): number {
	return tasks.filter((task) => task.status === status).length
}

// Set urgent unfinished tasks to high priority
export function applyUrgentPriorities(tasks: Task[]): Task[] {
	let hasChanges = false
	const updatedTasks = tasks.map((task): Task => {
		if (
			task.priority !== 'high' &&
			shouldTaskUseHighPriority(task.status, task.dueDate)
		) {
			hasChanges = true
			return {
				...task,
				priority: 'high'
			}
		}
		return task
	})
	return hasChanges ? updatedTasks : tasks
}
