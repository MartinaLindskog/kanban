import { useState, useMemo, useEffect } from 'react'
import type { Task, TaskStatus } from '../types/Task'
import TaskCard from './TaskCard'


// Define the display order for task priorities
const priorityOrder = {
	high: 1,
	medium: 2,
	low: 3
}

interface KanbanColumnProps {
	title: string
	tasks: Task[]
	imageSrc: string
	status: TaskStatus
	onStatusChange: (taskId: string, newStatus: TaskStatus) => void
	onDeleteTask: (taskId: string) => void
	onEditTask: (task: Task) => void
}

// Display and remember the open state of one Kanban column
function KanbanColumn({ title, tasks, imageSrc, onStatusChange, onDeleteTask, status, onEditTask }: KanbanColumnProps) {
	// Restore whether this column was previously open
	const [isOpen, setIsOpen] = useState(() => {
		const savedIsOpen = localStorage.getItem(`kanban-column-${status}-open`)
		return savedIsOpen === 'true'
	})
	// Save this column's open state in the browser
	useEffect(() => {
		localStorage.setItem(
			`kanban-column-${status}-open`,
			String(isOpen)
		)
	}, [isOpen, status])
	// Copy and re-sort the tasks only when this column's tasks change
	const sortedTasks = useMemo(
		() =>
			[...tasks].sort(
				(a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
			),
		[tasks]
	)
	return (
		<section className={`kanban-column kanban-column--${status}`}>
			<img className="column-image" src={imageSrc} alt="" />
			<div className="column-heading">
				<h2>{title} ({tasks.length})</h2>
				<button
					type="button"
					className="column-toggle-button"
					onClick={() => setIsOpen(!isOpen)}
					aria-expanded={isOpen}
					aria-label={`Toggle ${title} tasks`}
				>
					<span aria-hidden="true">{isOpen ? '▲' : '▼'}</span>
				</button>
			</div>
			{isOpen && (
				<div className="task-list">
					{tasks.length === 0 && <p>No tasks yet.</p>}
					{sortedTasks.map((task) => (
						<TaskCard 
							key={task.id} 
							task={task} 
							onStatusChange={onStatusChange}
							onDeleteTask={onDeleteTask}
							onEditTask={onEditTask}
						/>
					))}
				</div>
			)}
		</section>
	)
}

export default KanbanColumn
