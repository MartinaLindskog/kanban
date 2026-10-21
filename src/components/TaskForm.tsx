import { useState, type FormEvent } from 'react'
import type { Task, TaskPriority, TaskStatus, NewTask } from '../types/Task'
import { shouldTaskUseHighPriority } from '../utils/taskUtils'

interface TaskFormProps {
	onCreateTask: (task: NewTask) => Promise<void>
	taskToEdit: Task | null
	onUpdateTask: (task: Task) => Promise<boolean>
}

// Display the form used to create or edit a task
export default function TaskForm({ onCreateTask, taskToEdit, onUpdateTask }: TaskFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false)
	// Handle form submission by creating or updating a task
	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		if (isSubmitting) return
		setIsSubmitting(true)
		const form = event.currentTarget
		const formData = new FormData(form)
		const title = formData.get('title') as string
		const comment = formData.get('comment') as string
		const assignee = formData.get('assignee') as string
		const dueDate = formData.get('dueDate') as string
		const priority = formData.get('priority') as TaskPriority
		const status = formData.get('status') as TaskStatus
		// Use the shared task rule to determine the final priority
		const shouldUseHighPriority = shouldTaskUseHighPriority(status, dueDate)
		const finalPriority: TaskPriority = shouldUseHighPriority
			? 'high'
			: priority
		if (shouldUseHighPriority) {
			window.alert(
				'Deadline approaching — priority automatically set to High.'
			)
		}
		if (taskToEdit) {
			const updatedTask: Task = {
				...taskToEdit,
				title: title,
				comment: comment,
				assignee: assignee,
				dueDate: dueDate,
				priority: finalPriority,
				status: status,
			}
			const wasTaskUpdated = await onUpdateTask(updatedTask)
			if (!wasTaskUpdated) {
				const statusSelect = form.elements.namedItem('status')
				// Confirm that the field is a select element so its value can be changed safely
				if (statusSelect instanceof HTMLSelectElement) {
					statusSelect.value = taskToEdit.status
				}
			}
		} else {
			const newTask: NewTask = {
				title: title,
				comment: comment,
				assignee: assignee,
				dueDate: dueDate,
				priority: finalPriority,
				status: status
			}
			await onCreateTask(newTask)
		}
		setIsSubmitting(false)
	}
	return (
		<section>
			<h2>{taskToEdit ? 'Edit task' : 'Add task'}</h2>
			<form className="task-form" onSubmit={handleSubmit}>
				<label htmlFor="task-title">Title</label>
				<input
					id="task-title"
					name="title"
					type="text"
					defaultValue={taskToEdit ? taskToEdit.title : ''}
					autoFocus 
					required
				/>
				<label htmlFor="task-comment">Comment</label>
				<textarea
					id="task-comment"
					name="comment"
					rows={3}
					defaultValue={taskToEdit ? taskToEdit.comment : ''}
				/>
				<label htmlFor="task-assignee">Assigned to</label>
				<input
					id="task-assignee"
					name="assignee"
					type="text"
					defaultValue={taskToEdit ? taskToEdit.assignee : ''}
				/>
				<label htmlFor="task-due-date">Due date</label>
				<input
					id="task-due-date"
					name="dueDate"
					type="date"
					defaultValue={taskToEdit ? taskToEdit.dueDate : ''}
				/>
				<label htmlFor="task-status">Status</label>
				<select
					id="task-status"
					name="status"
					defaultValue={taskToEdit ? taskToEdit.status : 'todo'}
				>
					<option value="todo">To do</option>
					<option value="in-progress">In progress</option>
					<option value="done">Done</option>
				</select>
				<label htmlFor="task-priority">Priority</label>
				<select
					id="task-priority"
					name="priority"
					defaultValue={taskToEdit ? taskToEdit.priority : ''}
					required
				>
					<option value="" disabled>
						Select priority
					</option>
					<option value="high">High</option>
					<option value="medium">Medium</option>
					<option value="low">Low</option>
				</select>
				<button type="submit" disabled={isSubmitting}>
					{isSubmitting
						? 'Saving...'
						: (taskToEdit ? 'Save' : 'Add task')}
				</button>
			</form>
		</section>
	)
}
