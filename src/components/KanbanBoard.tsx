import KanbanColumn from './KanbanColumn'
import type { Task, TaskStatus } from '../types/Task'
import todoImage from '../assets/To-do.png'
import inProgressImage from '../assets/in-progress.png'
import doneImage from '../assets/done.png'

interface KanbanBoardProps {
	tasks: Task[]
	onStatusChange: (taskId: string, newStatus: TaskStatus) => void
	onDeleteTask: (taskId: string) => void
	onEditTask: (task: Task) => void
}

// Group tasks by status and display the three Kanban columns
function KanbanBoard(props: KanbanBoardProps) { 
	const todoTasks = props.tasks.filter((task) => task.status === 'todo')
	const inProgressTasks = props.tasks.filter(
		(task) => task.status === 'in-progress',
	)
	const doneTasks = props.tasks.filter((task) => task.status === 'done')
	return (
		<main className="kanban-board" aria-label="Kanban board">
			<KanbanColumn
				title="To do"
				status="todo"
				tasks={todoTasks}
				imageSrc={todoImage}
				onStatusChange={props.onStatusChange}
				onDeleteTask={props.onDeleteTask}
				onEditTask={props.onEditTask}
			/>
			<KanbanColumn
				title="In progress"
				status="in-progress"
				tasks={inProgressTasks}
				imageSrc={inProgressImage}
				onStatusChange={props.onStatusChange}
				onDeleteTask={props.onDeleteTask}
				onEditTask={props.onEditTask}
			/>
			<KanbanColumn
				title="Done"
				status="done"
				tasks={doneTasks}
				imageSrc={doneImage}
				onStatusChange={props.onStatusChange}
				onDeleteTask={props.onDeleteTask}
				onEditTask={props.onEditTask}
			/>
		</main>
	)
}

export default KanbanBoard
