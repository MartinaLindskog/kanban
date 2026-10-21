import Header from './components/Header'
import KanbanBoard from './components/KanbanBoard'
import type { Task, TaskStatus, NewTask } from './types/Task'
import './App.css'
import { useEffect, useState } from 'react'
import TaskModal from './components/TaskModal'
import MobileFooter from './components/MobileFooter'
import { getTasks, createTask, deleteTask, updateTask } from './services/taskService'
import { shouldTaskUseHighPriority, countTasksByStatus, applyUrgentPriorities } from './utils/taskUtils'
import LoginForm from './components/LoginForm'
import { useAuth } from './context/AuthContext'
import { getMaxInProgressTasks, updateMaxInProgressTasks } from './services/boardSettingsService'
import LoadingIndicator from './components/LoadingIndicator'

// Manage authentication, tasks, board settings and the main app layout
function App() {
	const { session, isLoading: isLoadingSession } = useAuth()
	const [tasks, setTasks] = useState<Task[]>([])
	const [isLoadingTasks, setIsLoadingTasks] = useState(true)
	const [taskLoadError, setTaskLoadError] = useState<string | null>(null)
	const [maxInProgressTasks, setMaxInProgressTasks] = useState(20)
	const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)
	const [taskToEdit, setTaskToEdit] = useState<Task | null>(null)
	// Load tasks after sign-in and clear them after sign-out	
	useEffect(() => {
		if (!session) {
			setTasks([])
			setIsLoadingTasks(false)
			return
		}
		setIsLoadingTasks(true)
		setTaskLoadError(null)
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
	}, [session])
	// Load the saved in-progress limit after sign-in
	useEffect(() => {
		if (!session) return
		async function loadBoardSettings() {
			try {
				const savedLimit = await getMaxInProgressTasks()
				setMaxInProgressTasks(savedLimit)
			} catch (error) {
				console.error(error)
			}
		}
		void loadBoardSettings()
	}, [session])
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
			// Recheck once per minute
			60_000
		)
		return () => {
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
	// Prompt an admin to validate and save a new in-progress limit
	async function handleSetInProgressLimit() {
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
		try {
			const savedLimit = await updateMaxInProgressTasks(newLimit)
			setMaxInProgressTasks(savedLimit)
		} catch (error) {
			console.error(error)
			window.alert('Could not save the task limit. Please try again.')
		}
	}
	// Create a task and add the saved result to the board
	async function handleCreateTask(newTask: NewTask) {
		const inProgressTaskCount = countTasksByStatus(tasks, 'in-progress')
		// Enforce the in-progress limit before creating the task
		if (
			newTask.status === 'in-progress' &&
			inProgressTaskCount >= maxInProgressTasks
		) {
			showInProgressLimitAlert()
			return
		}
		try {
			const createdTask = await createTask(newTask) 
			setTasks((currentTasks) => [...currentTasks, createdTask])
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
	// Validate and save changes to an existing task
	async function handleUpdateTask(updatedTask: Task) {
		const originalTask = tasks.find(
			(task) => task.id === updatedTask.id
		)
		const isMovingIntoInProgress =
			updatedTask.status === 'in-progress' &&
			originalTask?.status !== 'in-progress'
		const inProgressTaskCount = countTasksByStatus(tasks, 'in-progress')	
		// Enforce the limit only when a task enters In progress
		if (
			isMovingIntoInProgress &&
			inProgressTaskCount >= maxInProgressTasks
		) {
			showInProgressLimitAlert()
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
		const taskToUpdate = tasks.find((task) => task.id === taskId)
		if (!taskToUpdate) {
			return
		}
		const inProgressTaskCount = countTasksByStatus(tasks, 'in-progress')
		// Enforce the in-progress limit before changing the status
		if (newStatus === 'in-progress' && inProgressTaskCount >= maxInProgressTasks) {
			showInProgressLimitAlert()
			return
		}
		// Reapply the automatic priority rule after a status change
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
				currentTasks.filter((task) => task.id !== taskId)
			)
		} catch (error) {
			console.error(error)
			window.alert('Could not delete task. Please try again.')
		}
	}
	if (isLoadingSession) {
		return (
			<LoadingIndicator
				message="Checking login..."
				overlay
				/>
		)
	}	
	if (!session) {
		return (
			<>
				<Header
					onAddTask={handleOpenAddTask}
					onSetLimit={handleSetInProgressLimit}
				/>
				<LoginForm />
			</>
		)
	}
	return (
		<>
			<Header 
				onAddTask={handleOpenAddTask} 
				onSetLimit={handleSetInProgressLimit}
			/>
			{isTaskFormOpen && (
				<TaskModal
					taskToEdit={taskToEdit}
					onCreateTask={handleCreateTask}
					onUpdateTask={handleUpdateTask}
					onClose={handleCloseTaskForm}
				/>
			)}
			{isLoadingTasks && (
				<LoadingIndicator
					message="Loading tasks..."
					overlay
				/>
			)}
			{taskLoadError && <p role="alert">{taskLoadError}</p>}			
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
