import CatOfTheDay from './CatOfTheDay'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '../context/AuthContext'
import LogoutButton from './LogoutButton'

interface MobileFooterProps {
	onAddTask: () => void
	onSetLimit: () => void
}

function MobileFooter({ onAddTask, onSetLimit }: MobileFooterProps) {
	const { role } = useAuth()
	return (
		<footer className="mobile-footer">
			<ThemeToggle iconOnly />
			{role === 'admin' && (
				<button
					type="button"
					aria-label="Edit maximum tasks"
					title="Edit maximum tasks"
					onClick={onSetLimit}
				>
					⚙️
				</button>
			)}	
			<button
				className="footer-add-task-button"
				type="button"
				aria-label="Add task"
				title="Add task"
				onClick={onAddTask}
			>
				+
			</button>
			<CatOfTheDay iconOnly />
			<LogoutButton iconOnly />
		</footer>
	)
}

export default MobileFooter
