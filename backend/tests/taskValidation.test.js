import { expect, test } from '@jest/globals'
import { validateTaskInput } from '../validation/taskValidation.js'

test('rejects a task without a title', () => {
	const task = {
		title: '',
		priority: 'medium',
		status: 'todo'
	}
	const result = validateTaskInput(task)
	expect(result).toBe('A task title is required.')
})

test('accepts valid task data', () => {
	const task = {
		title: 'Write unit tests',
		comment: 'Test the validation helper',
		assignee: 'Martina',
		dueDate: '2026-10-22',
		priority: 'medium',
		status: 'todo'
	}
	const result = validateTaskInput(task)
	expect(result).toBeNull()
})

test('rejects an impossible due date', () => {
	const task = {
		title: 'Invalid date test',
		dueDate: '2026-02-30',
		priority: 'medium',
		status: 'todo'
	}
	const result = validateTaskInput(task)
	expect(result).toBe(
		'Due date must be a valid date in YYYY-MM-DD format.'
	)
})

test('rejects missing task data', () => {
	const result = validateTaskInput()
	expect(result).toBe('A task title is required.')
})

test('rejects an invalid priority', () => {
	const task = {
		title: 'Invalid priority test',
		priority: 'urgent',
		status: 'todo'
	}
	const result = validateTaskInput(task)
	expect(result).toBe('Priority must be low, medium or high.')
})

test('rejects an invalid status', () => {
	const task = {
		title: 'Invalid status test',
		priority: 'medium',
		status: 'waiting'
	}
	const result = validateTaskInput(task)
	expect(result).toBe('Status must be todo, in-progress or done.')
})