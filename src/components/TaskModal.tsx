import { useEffect, useRef } from 'react'
import type { NewTask, Task } from '../types/Task'
import TaskForm from './TaskForm'

interface TaskModalProps {
	taskToEdit: Task | null
	onCreateTask: (task: NewTask) => Promise<void>
	onUpdateTask: (task: Task) => Promise<boolean>
	onClose: () => void
}

export default function TaskModal({
	taskToEdit,
	onCreateTask,
	onUpdateTask,
	onClose
}: TaskModalProps) {
	const taskModalRef = useRef<HTMLDivElement>(null)
	// Close the modal when the user presses Escape
	useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
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
				onClose()
			}
		}
		window.addEventListener('keydown', handleKeyDown)
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [onClose])
	return (
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
					onClick={onClose}
					aria-label="Close task form"
				>
					×
				</button>
				<TaskForm
					onCreateTask={onCreateTask}
					onUpdateTask={onUpdateTask}
					taskToEdit={taskToEdit}
				/>
			</div>
		</div>
	)
}
