import Header from './components/Header'
import KanbanBoard from './components/KanbanBoard'
import type { Task, TaskStatus, NewTask } from './types/Task'
import './App.css'
import { useEffect, useState } from 'react'
import TaskModal from './components/TaskModal'
import MobileFooter from './components/MobileFooter'
import { getTasks, createTask, deleteTask, updateTask } from './services/taskService'
import { shouldTaskUseHighPriority, countTasksByStatus, applyUrgentPriorities } from './utils/taskUtils'


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
	// Load tasks from the backend when the app opens
	useEffect(() => {
		async function loadTasks() {
			try {
				const loadedTasks = await getTasks()
				setTasks(applyUrgentPriorities(loadedTasks))
			} catch (error) {
				console.error(error)
				setTaskLoadError('Could not load tasks. Please try again.')
			} finally {
				setIsLoadingTasks(false)
			}
		}
		loadTasks()
	}, [])
	// Automatically update existing tasks when their due date becomes urgent
	useEffect(() => {
		function updateDueTaskPriorities() {
			setTasks((currentTasks) => 
				applyUrgentPriorities(currentTasks)
			)
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
	// Close the task form and stop editing the selected task
	function handleCloseTaskForm() {
		setTaskToEdit(null)
		setIsTaskFormOpen(false)
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
		const inProgressTaskCount = countTasksByStatus(tasks, 'in-progress')
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
	async function handleUpdateTask(updatedTask: Task) {
		const originalTask = tasks.find(
			(task) => task.id === updatedTask.id
		)
		const isMovingIntoInProgress =
			updatedTask.status === 'in-progress' &&
			//only if it wasnt already in-progress before
			originalTask?.status !== 'in-progress'
		const inProgressTaskCount = countTasksByStatus(tasks, 'in-progress')	
		if (
			isMovingIntoInProgress &&
			inProgressTaskCount >= maxInProgressTasks
		) {
			showInProgressLimitAlert()
			//task does not update
			return false
		}
		try {
			const savedTask = await updateTask(updatedTask)
			setTasks((currentTasks) =>
				currentTasks.map((task) => {
					if (task.id === updatedTask.id) {
						return savedTask
					}
					return task
				})
			)
			setTaskToEdit(null)
			setIsTaskFormOpen(false)
			return true
		} catch (error) {
			console.error(error)
			window.alert('Could not update task. Please try again.')
			return false
		}
	}
	// Change the status of the task with the matching id
	async function handleTaskStatusChange(taskId: string, newStatus: TaskStatus) {
		// Find the task that will be updated
		const taskToUpdate = tasks.find((task) => task.id === taskId)
		if (!taskToUpdate) {
			return
		}
		const inProgressTaskCount = countTasksByStatus(tasks, 'in-progress')
		//if there are X number of tasks - stops user from putting another in status in progress
		if (newStatus === 'in-progress' && inProgressTaskCount >= maxInProgressTasks) {
			showInProgressLimitAlert()
			return
		}
		const shouldUseHighPriority = shouldTaskUseHighPriority(
			newStatus,
			taskToUpdate.dueDate
		)
		const taskWithNewStatus: Task = {
			...taskToUpdate,
			status: newStatus,
			priority: shouldUseHighPriority ? 'high' : taskToUpdate.priority
		}
		try {
			const savedTask = await updateTask(taskWithNewStatus)
			setTasks((currentTasks) =>
				currentTasks.map((task) => {
					if (task.id === taskId) {
						return savedTask
					}
					return task
				})
			)
		} catch (error) {
			console.error(error)
			window.alert('Could not change task status. Please try again.')
		}	
	}
	// Remove the task with the matching id from the task list
	async function handleDeleteTask(taskId: string) {
		try {
			await deleteTask(taskId)
			setTasks((currentTasks) =>
				//!== taskId keeps all tasks that do not have the chosen id
				//tasks with the chosen id is now not included in the array -> immutable update
				currentTasks.filter((task) => task.id !== taskId)
			)
		} catch (error) {
			console.error(error)
			window.alert('Could not delete task. Please try again.')
		}
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
				<TaskModal
					taskToEdit={taskToEdit}
					onCreateTask={handleCreateTask}
					onUpdateTask={handleUpdateTask}
					onClose={handleCloseTaskForm}
				/>
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
