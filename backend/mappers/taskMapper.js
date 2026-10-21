// Convert a database task to the format used by the frontend
export function toApiTask(task) {
	return {
		id: task.id,
		title: task.title,
		comment: task.comment ?? '',
		assignee: task.assignee ?? '',
		dueDate: task.due_date ?? '',
		priority: task.priority,
		status: task.status
	}
}

// Convert a frontend task to the format used by the database
export function toDatabaseTask(task) {
	return {
		title: task.title,
		comment: task.comment || null,
		assignee: task.assignee || null,
		due_date: task.dueDate || null,
		priority: task.priority,
		status: task.status
	}
}