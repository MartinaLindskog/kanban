import { expect, test } from '@jest/globals'
import { toApiTask, toDatabaseTask } from '../mappers/taskMapper.js'

test('converts a database task to frontend format', () => {
	const databaseTask = {
		id: '123',
		title: 'Mapper test',
		comment: null,
		assignee: null,
		due_date: '2026-10-22',
		priority: 'high',
		status: 'todo'
	}
	const result = toApiTask(databaseTask)
	expect(result).toEqual({
		id: '123',
		title: 'Mapper test',
		comment: '',
		assignee: '',
		dueDate: '2026-10-22',
		priority: 'high',
		status: 'todo'
	})
})

test('converts a frontend task to database format', () => {
	const frontendTask = {
		id: '123',
		title: 'Mapper test',
		comment: '',
		assignee: '',
		dueDate: '',
		priority: 'medium',
		status: 'in-progress'
	}
	const result = toDatabaseTask(frontendTask)
	expect(result).toEqual({
		title: 'Mapper test',
		comment: null,
		assignee: null,
		due_date: null,
		priority: 'medium',
		status: 'in-progress'
	})
})