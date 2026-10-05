// Check if a due date is tomorrow, today or already passed
export function isDueTomorrowOrEarlier(dueDate?: string): boolean {
	//if user didnt choose a date
	if (!dueDate) return false
	//todays date
	const today = new Date()
	today.setHours(0, 0, 0, 0)
	//date of tomorrow
	const tomorrow = new Date(today)
	tomorrow.setDate(tomorrow.getDate() + 1)
	const selectedDueDate = new Date(`${dueDate}T00:00:00`)
	//compare today and tomorrow and return false if its not urgent, and true if tomorrow or sooner(also a date that already passed)
	return selectedDueDate.getTime() <= tomorrow.getTime()
}
