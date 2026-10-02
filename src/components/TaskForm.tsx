//TASK. lets user create a task

import type { FormEvent } from 'react'
import type { Task, TaskPriority, TaskStatus } from '../types/Task'
import { isDueTomorrowOrEarlier } from '../utils/dateUtils'

interface TaskFormProps {
	//void: does not return a value
	onCreateTask: (task: Task) => void
	taskToEdit: Task | null
	onUpdateTask: (task: Task) => boolean
}

export default function TaskForm({ onCreateTask, taskToEdit, onUpdateTask }: TaskFormProps) {
	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		const formData = new FormData(event.currentTarget)
		const title = formData.get('title') as string
		//will be an empty string if user dont write anything
		const comment = formData.get('comment') as string
		const assignee = formData.get('assignee') as string
		//will be an empty string if user doesnt choose a date
		const dueDate = formData.get('dueDate') as string
		//will be one of the values as decided in Task.ts
		const priority = formData.get('priority') as TaskPriority
		const status = formData.get('status') as TaskStatus
		// Use the date helper to decide if the priority should be High
const isDoneTask = status === 'done'
const shouldUseHighPriority =
	!isDoneTask && isDueTomorrowOrEarlier(dueDate)
const finalPriority: TaskPriority = shouldUseHighPriority
	//if true - high	
	? 'high'
	//if false - priority is what user set
	: priority
if (shouldUseHighPriority) {
	window.alert(
		'Deadline approaching — priority automatically set to High.'
	)
}
		// Update the selected task in edit mode, otherwise create a new task
		if (taskToEdit) {
			const updatedTask: Task = {
				...taskToEdit,
				title: title,
				comment: comment,
				assignee: assignee,
				dueDate: dueDate,
				//when due date is tomorrow or earlier
				priority: finalPriority,
				status: status,
			}

			const wasTaskUpdated = onUpdateTask(updatedTask)

if (!wasTaskUpdated) {
	const statusSelect =
		event.currentTarget.elements.namedItem('status')
// Confirm that the field is a select element so its value can be changed safely
	if (statusSelect instanceof HTMLSelectElement) {
		statusSelect.value = taskToEdit.status
	}
}
		} else {
			const newTask: Task = {
				id: crypto.randomUUID(),
				title: title,
				comment: comment,
				assignee: assignee,
				dueDate: dueDate,
				priority: finalPriority,
				status: status
			}

			onCreateTask(newTask)
		}
	}
	return (
		<section className="task-form-container">
			{/* if edit task then show edit task, otherwise show add task */}
			<h2>{taskToEdit ? 'Edit task' : 'Add task'}</h2>
			<form className="task-form" onSubmit={handleSubmit}>
				<label htmlFor="task-title">Title</label>
				<input
					// reminder for myself: id here is the html-id, not the id as in task.id
					id="task-title"
					name="title"
					type="text"
					//task to edit? if yes then use task's title, otherwise empty
					defaultValue={taskToEdit ? taskToEdit.title : ''}
					//easier for user to start typing here immediately 
					autoFocus 
					required
				/>
				<label htmlFor="task-comment">Comment</label>
				<textarea
					id="task-comment"
					name="comment"
					rows={3}
					defaultValue={taskToEdit ? taskToEdit.comment : ''}
					//not required
				/>
				<label htmlFor="task-assignee">Assigned to</label>
				<input
					id="task-assignee"
					name="assignee"
					type="text"
					defaultValue={taskToEdit ? taskToEdit.assignee : ''}
					//not required 
				/>
				<label htmlFor="task-due-date">Due date</label>
				<input
					id="task-due-date"
					name="dueDate"
					type="date"
					defaultValue={taskToEdit ? taskToEdit.dueDate : ''}
					//not required
				/>
				<label htmlFor="task-status">Status</label>
<select
	id="task-status"
	name="status"
	//if user is editing the task - show current status. otherwise its add task - show to-do
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
					{/* disabled: you cant choose this as an option */}
					<option value="" disabled>
						Select priority
					</option>
					<option value="high">High</option>
					<option value="medium">Medium</option>
					<option value="low">Low</option>
				</select>
				<button type="submit">
					{/* if the task is being edited the button says Save, otherwise Add task */}
					{taskToEdit ? 'Save' : 'Add task'}
				</button>
			</form>
		</section>
	)
}
