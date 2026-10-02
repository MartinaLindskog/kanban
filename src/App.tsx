import Header from './components/Header'
import KanbanBoard from './components/KanbanBoard'
import type { Task, TaskStatus } from './types/Task'
import './App.css'
import { useEffect, useState } from 'react'
import TaskForm from './components/TaskForm'
import MobileFooter from './components/MobileFooter'
import { isDueTomorrowOrEarlier } from './utils/dateUtils'


function App() {
	//Store all tasks in state so React updates the page when the list changes
	const [tasks, setTasks] = useState<Task[]>([])
	const [maxInProgressTasks, setMaxInProgressTasks] = useState(20)
	// Keep track of if the task form modal is open. is closed from the start
	const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)
	// Store the task that is currently being edited
	// null when no task is chosen to change
	const [taskToEdit, setTaskToEdit] = useState<Task | null>(null)
	// Close the task form modal when user press escape on keyboard
	useEffect(() => {
		if (!isTaskFormOpen) return
		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				setTaskToEdit(null)
				setIsTaskFormOpen(false)
			}
		}
		window.addEventListener('keydown', handleKeyDown)
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
			}, [isTaskFormOpen])
	// Automatically update existing tasks when their due date becomes urgent
useEffect(() => {
	function updateDueTaskPriorities() {
		setTasks((currentTasks) => {
			let hasChanges = false
			const updatedTasks = currentTasks.map((task) => {
				if (
					//we dont need this feature on tasks that are already done
					task.status !== 'done' &&
					task.priority !== 'high' &&
					isDueTomorrowOrEarlier(task.dueDate)
				) {
					hasChanges = true
					const updatedTask: Task = {
						...task,
						priority: 'high'
					}
					return updatedTask
				}
				return task
			})
			return hasChanges ? updatedTasks : currentTasks
		})
	}
	updateDueTaskPriorities()
	const intervalId = window.setInterval(
		updateDueTaskPriorities,
		//one minute - check is done once a minute
		60_000
	)
	return () => {
		// stop the interval when webbpage is closed etc
		window.clearInterval(intervalId)
	}
}, [])

	// Open an empty task form for creating a new task
	function handleOpenAddTask() {
		setTaskToEdit(null)
		setIsTaskFormOpen(true)
	}
	function handleSetInProgressLimit() {
	const enteredLimit = window.prompt(
		'Set the maximum number of tasks allowed in progress:',
		String(maxInProgressTasks)
	)

	if (enteredLimit === null) return

	const newLimit = Number(enteredLimit)

	if (!Number.isInteger(newLimit) || newLimit < 1) {
		window.alert('Enter a whole number of 1 or higher.')
		return
	}

	setMaxInProgressTasks(newLimit)
}
	//Add the new task from TaskForm to the existing task list
	function handleCreateTask(newTask: Task) {
		const inProgressTaskCount = tasks.filter(
	(task) => task.status === 'in-progress'
).length
// prevent user from adding more than set number of tasks to in-progress
if (
	newTask.status === 'in-progress' &&
	inProgressTaskCount >= maxInProgressTasks
) {
	window.alert(
		`Maximum limit reached. You can have up to ${maxInProgressTasks} tasks in progress to keep the workflow focused and manageable.`
	)
	return
}
		//spread 
		setTasks((currentTasks) => [...currentTasks, newTask])
		//Close the task form modal after adding the new task
		setIsTaskFormOpen(false)
	}
	// Select a task and open the form in edit mode
	function handleOpenEditTask(task: Task) {
		setTaskToEdit(task)
		setIsTaskFormOpen(true)
	}
	// Replace the edited task with its updated version
	function handleUpdateTask(updatedTask: Task) {
		const originalTask = tasks.find(
	(task) => task.id === updatedTask.id
)

const isMovingIntoInProgress =
	updatedTask.status === 'in-progress' &&
	//only if it wasnt already in-progress before
	originalTask?.status !== 'in-progress'

const inProgressTaskCount = tasks.filter(
	(task) => task.status === 'in-progress'
).length

if (
	isMovingIntoInProgress &&
	inProgressTaskCount >= maxInProgressTasks
) {
	window.alert(
		`Maximum limit reached. You can have up to ${maxInProgressTasks} tasks in progress to keep the workflow focused and manageable.`
	)
	//task does not update
	return false
}
		setTasks((currentTasks) =>
			currentTasks.map((task) => {
				if (task.id === updatedTask.id) {
					return updatedTask
				}

				return task
			})
		)

		setTaskToEdit(null)
		setIsTaskFormOpen(false)
		//task will update 
		return true
	}
	// Change the status of the task with the matching id
	function handleTaskStatusChange(taskId: string, newStatus: TaskStatus) {
	//counts how many tasks in status in progress
		const inProgressTaskCount = tasks.filter(
	(task) => task.status === 'in-progress'
).length
//if there are X number of tasks - stops user from putting another in status in progress
if (newStatus === 'in-progress' && inProgressTaskCount >= maxInProgressTasks) {
	window.alert(`Maximum limit reached. You can have up to ${maxInProgressTasks} tasks in progress to keep the workflow focused and manageable.`)
	return
}
		setTasks((currentTasks) =>
			currentTasks.map((task) => {
				if (task.id === taskId) {
	const shouldUseHighPriority =
		newStatus === 'in-progress' &&
		isDueTomorrowOrEarlier(task.dueDate)
	return {
		...task,
		status: newStatus,
		priority: shouldUseHighPriority ? 'high' : task.priority
	}
}

				return task
			})
		)
	}
	// Remove the task with the matching id from the task list
	function handleDeleteTask(taskId: string) {
		setTasks((currentTasks) =>
			//!== taskId keeps all tasks that do not have the chosen id
			//tasks with the chosen id is now not included in the array -> immutable update
			currentTasks.filter((task) => task.id !== taskId)
		)
	}
	return (
		// <> and </> makes a fragment. react wants a fragment to put the komponents in, this makes it without an extra html-element
		<>
			<Header 
				onAddTask={handleOpenAddTask} 
				onSetLimit={handleSetInProgressLimit}
			/>
			{/* if false dont show new task form modal */}
			{isTaskFormOpen && (
				<div className="modal-backdrop">
					<div
						className="task-modal"
						role="dialog"
						aria-modal="true"
						aria-label={taskToEdit ? 'Edit task' : 'Add task'}
					>
						<button
							className="modal-close-button"
							type="button"
							onClick={() => {
								setTaskToEdit(null)
								setIsTaskFormOpen(false)
							}}
							aria-label="Close task form"
						>
							×
						</button>
						<TaskForm
							onCreateTask={handleCreateTask}
							onUpdateTask={handleUpdateTask}
							taskToEdit={taskToEdit}
						/>
					</div>
				</div>
			)}
			{/* Send array to board */}
			<KanbanBoard 
				tasks={tasks}
				onStatusChange={handleTaskStatusChange}
				onDeleteTask={handleDeleteTask}
				onEditTask={handleOpenEditTask}
			/>
			<MobileFooter 
				onAddTask={handleOpenAddTask} 
				onSetLimit={handleSetInProgressLimit}
			/>
		</>
	)
}

export default App
