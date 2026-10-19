import { useState, useMemo, useEffect } from 'react'
import type { Task, TaskStatus } from '../types/Task'
import TaskCard from './TaskCard'


// define the order in which task priorities should be displayed. 1 shows first etc.
const priorityOrder = {
	high: 1,
	medium: 2,
	low: 3
}

//properties: must be stringn and task array, image string etc
interface KanbanColumnProps {
	title: string
	tasks: Task[]
	imageSrc: string
	status: TaskStatus
	onStatusChange: (taskId: string, newStatus: TaskStatus) => void
	onDeleteTask: (taskId: string) => void
	onEditTask: (task: Task) => void
}

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
				{/* title + length of this column's task array */}
				<h2>{title} ({tasks.length})</h2>
				<button
					className="column-toggle"
					type="button"
					onClick={() => setIsOpen(!isOpen)}
					aria-expanded={isOpen}
					aria-label={`Toggle ${title} tasks`}
				>
					<span aria-hidden="true">{isOpen ? '▲' : '▼'}</span>
				</button>
			</div>
			{/* if is Open is true - create content. if false - dont. And... */}
			{isOpen && (
				<div className="task-list">
					{tasks.length === 0 && <p>No tasks yet.</p>}
					{/* use the sorted array to make task cards */}
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
