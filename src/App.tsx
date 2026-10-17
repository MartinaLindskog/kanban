import Header from './components/Header'
import KanbanBoard from './components/KanbanBoard'
import type { Task, TaskStatus, NewTask } from './types/Task'
import './App.css'
import { useEffect, useState, useRef } from 'react'
import TaskForm from './components/TaskForm'
import MobileFooter from './components/MobileFooter'
import { isDueTomorrowOrEarlier } from './utils/dateUtils'
import { getTasks, createTask } from './services/taskService'



function App() {
	//Store all tasks in state so React updates the page when the list changes
	const [tasks, setTasks] = useState<Task[]>([])
	// Track whether tasks are currently being loaded
	const [isLoadingTasks, setIsLoadingTasks] = useState(true)
	// Store a user-friendly message if loading tasks fails
	const [taskLoadError, setTaskLoadError] = useState<string | null>(null)
	const [maxInProgressTasks, setMaxInProgressTasks] = useState(20)
	// Keep track of if the task form modal is open. is closed from the start
	const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)
	// Store the task that is currently being edited
	// null when no task is chosen to change
	const [taskToEdit, setTaskToEdit] = useState<Task | null>(null)
	// Store a reference to the task modal's HTML element
	const taskModalRef = useRef<HTMLDivElement>(null)
	// Load tasks from the backend when the app opens
	useEffect(() => {
		async function loadTasks() {
			try {
				const loadedTasks = await getTasks()
				setTasks(loadedTasks)
			} catch (error) {
				console.error(error)
				setTaskLoadError('Could not load tasks. Please try again.')
			} finally {
				setIsLoadingTasks(false)
			}
		}
		loadTasks()
	}, [])
	// Close the task form modal when user press escape on keyboard
	useEffect(() => {
		if (!isTaskFormOpen) return
		function handleKeyDown(event: KeyboardEvent) {
			//when user uses tab they should only be able to tab through the modal, not behind it
			if (event.key === 'Tab') {
				const focusableElements =
					taskModalRef.current?.querySelectorAll<HTMLElement>(
						'button, input, textarea, select'
					)

				if (!focusableElements || focusableElements.length === 0) return

				const firstFocusableElement = focusableElements[0]
				const lastFocusableElement =
					focusableElements[focusableElements.length - 1]

				if (
					event.shiftKey &&
					document.activeElement === firstFocusableElement
				) {
					event.preventDefault()
					lastFocusableElement.focus()
				} else if (
					!event.shiftKey &&
					document.activeElement === lastFocusableElement
				) {
					event.preventDefault()
					firstFocusableElement.focus()
				}
			}
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
	// Show the same warning whenever the In-progress limit is reached
	function showInProgressLimitAlert() {
		window.alert(
			`Maximum limit reached. You can have up to ${maxInProgressTasks} tasks in progress to keep the workflow focused and manageable.`
		)
	}
	function handleSetInProgressLimit() {
		const enteredLimit = window.prompt(
			'Set a maximum limit on in-progress tasks:',
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
	async function handleCreateTask(newTask: NewTask) {
		const inProgressTaskCount = tasks.filter(
			(task) => task.status === 'in-progress'
		).length
		// prevent user from adding more than set number of tasks to in-progress
		if (
			newTask.status === 'in-progress' &&
			inProgressTaskCount >= maxInProgressTasks
		) {
			showInProgressLimitAlert()
			return
		}
		try {
			const createdTask = await createTask(newTask)
			//spread 
			setTasks((currentTasks) => [...currentTasks, createdTask])
			//Close the task form modal after adding the new task
			setIsTaskFormOpen(false)
		} catch (error) {
			console.error(error)
			window.alert('Could not create task. Please try again.')
		}
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
			showInProgressLimitAlert()
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
			showInProgressLimitAlert()
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
						ref={taskModalRef}
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
			{/* role status and alert is for screen readers to notify user*/}
			{isLoadingTasks && <p role="status">Loading tasks...</p>}
			{taskLoadError && <p role="alert">{taskLoadError}</p>}			
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
