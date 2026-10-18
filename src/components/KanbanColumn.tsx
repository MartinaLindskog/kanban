//COLUMNS for tasks in to-do, in-progress or done 
//the 3 columns are similar, so better to have 1 function that can be reused
//child to KanbanBoard


//react hook
import { useState, useMemo } from 'react'
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
	//starting value is closed aka false
	const [isOpen, setIsOpen] = useState(false)
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
