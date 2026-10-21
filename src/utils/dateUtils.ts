// Check whether a due date is tomorrow, today or overdue
export function isDueTomorrowOrEarlier(dueDate?: string): boolean {
	if (!dueDate) return false
	const today = new Date()
	today.setHours(0, 0, 0, 0)
	const tomorrow = new Date(today)
	tomorrow.setDate(tomorrow.getDate() + 1)
	const selectedDueDate = new Date(`${dueDate}T00:00:00`)
	return selectedDueDate.getTime() <= tomorrow.getTime()
}
