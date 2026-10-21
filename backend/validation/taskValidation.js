// Define the values accepted for task priority and status
const VALID_TASK_PRIORITIES = ['low', 'medium', 'high']
const VALID_TASK_STATUSES = ['todo', 'in-progress', 'done']

// Check that an optional due date is a real YYYY-MM-DD date
function isValidOptionalDate(dateValue) {
	if (
		dateValue === undefined ||
		dateValue === null ||
		dateValue === ''
	) {
		return true
	}
	if (
		typeof dateValue !== 'string' ||
		!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)
	) {
		return false
	}
	const parsedDate = new Date(`${dateValue}T00:00:00Z`)
	return (
		!Number.isNaN(parsedDate.getTime()) &&
		parsedDate.toISOString().slice(0, 10) === dateValue
	)
}

// Return an error message when submitted task data is invalid
export function validateTaskInput(task) {
	if (
		!task ||
		typeof task.title !== 'string' ||
		task.title.trim() === ''
	) {
		return 'A task title is required.'
	}
	if (!VALID_TASK_PRIORITIES.includes(task.priority)) {
		return 'Priority must be low, medium or high.'
	}
	if (!VALID_TASK_STATUSES.includes(task.status)) {
		return 'Status must be todo, in-progress or done.'
	}
	if (
		task.comment !== undefined &&
		task.comment !== null &&
		typeof task.comment !== 'string'
	) {
		return 'Comment must be text.'
	}
	if (
		task.assignee !== undefined &&
		task.assignee !== null &&
		typeof task.assignee !== 'string'
	) {
		return 'Assignee must be text.'
	}
	if (!isValidOptionalDate(task.dueDate)) {
		return 'Due date must be a valid date in YYYY-MM-DD format.'
	}
	return null
}