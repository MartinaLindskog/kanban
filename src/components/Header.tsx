import CatOfTheDay from './CatOfTheDay'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '../context/AuthContext'
import LogoutButton from './LogoutButton'

interface HeaderProps {
	onAddTask: () => void
	onSetLimit: () => void
}


// Display the title and actions available to signed-in users
function Header({ onAddTask, onSetLimit }: HeaderProps) {
	const { session, role } = useAuth()
	return (
		<header className="app-header">
			<h1 className="app-title">Catnip Kanban</h1>
			{session && (
				<div className="header-actions">
					<ThemeToggle />
					{role === 'admin' && (
						<button
							type="button"
							onClick={onSetLimit}
						>
							Edit task limit
						</button>
					)}	
					<button className="add-task-button" type="button" onClick={onAddTask}>
						Add task
					</button>
					<CatOfTheDay />
					<LogoutButton />
				</div>
			)}
		</header>
	)
}

export default Header
