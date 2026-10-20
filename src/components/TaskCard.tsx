import type { Task, TaskStatus } from '../types/Task'
import { useAuth } from '../context/AuthContext'

interface TaskCardProps {
	task: Task
	onStatusChange: (taskId: string, newStatus: TaskStatus) => void   
	onDeleteTask: (taskId: string) => void
	onEditTask: (task: Task) => void
}

export default function TaskCard({ task, onStatusChange, onDeleteTask, onEditTask }: TaskCardProps) {
	const { role } = useAuth()
	// Ask for confirmation before deleting the task
	function handleDeleteClick() {
		const shouldDelete = window.confirm(
			`Are you sure you want to delete "${task.title}"?`
		)
		if (shouldDelete) {
			onDeleteTask(task.id)
		}
	}
	return (
		//classes: task-card, and based on status and prio
		<article className={`task-card task-card--${task.status} task-card--priority-${task.priority}`}>
			{role === 'admin' && (
				<button
					className="task-delete-button"
					type="button"
					onClick={handleDeleteClick}
					aria-label={`Delete ${task.title}`}
				>
					×
				</button>
			)}
			<h3>{task.title}</h3>

			{task.comment && <p>{task.comment}</p>}

			{task.assignee && (
				<p><strong>Assigned to:</strong> {task.assignee}</p>
			)}
			{task.dueDate && <p><strong>Due date:</strong> {task.dueDate}</p>}
			<p><strong>Priority:</strong> {task.priority}</p>
			<div className="task-card-actions">
				<button
					className="task-edit-button"
					type="button"
					onClick={() => onEditTask(task)}
				>
					Edit
				</button>	
				{task.status === 'todo' && (
					<button
						type="button"
						onClick={() => onStatusChange(task.id, 'in-progress')}
					>
						Move to In progress
					</button>
				)}

				{task.status === 'in-progress' && (
					<button
						type="button"
						onClick={() => onStatusChange(task.id, 'done')}
					>
						Move to Done
					</button>
				)}
				{task.status === 'done' && (
					<button
						type="button"
						onClick={() => onStatusChange(task.id, 'in-progress')}
					>
						Move back to In progress
					</button>
				)}
			</div> 
		</article>
	)
}
