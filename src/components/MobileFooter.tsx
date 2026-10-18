import CatOfTheDay from './CatOfTheDay'
import ThemeToggle from './ThemeToggle'

interface MobileFooterProps {
	onAddTask: () => void
	onSetLimit: () => void
}

function MobileFooter({ onAddTask, onSetLimit }: MobileFooterProps) {
	return (
		<footer className="mobile-footer">
			<ThemeToggle iconOnly />
			<button
				className="settings-button"
				type="button"
				aria-label="Edit maximum tasks"
				title="Edit maximum tasks"
				onClick={onSetLimit}
			>
				⚙️
			</button>
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
		</footer>
	)
}

export default MobileFooter
