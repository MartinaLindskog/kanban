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

