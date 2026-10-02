interface MobileFooterProps {
	onAddTask: () => void
	onSetLimit: () => void
}

function MobileFooter({ onAddTask, onSetLimit }: MobileFooterProps) {
	return (
		<footer className="mobile-footer">
			<button
	className="settings-button"
	type="button"
	onClick={onSetLimit}
>
	Settings
</button>
			<button
				className="footer-add-task-button"
				type="button"
				onClick={onAddTask}
			>
				Add task
			</button>
		</footer>
	)
}

export default MobileFooter