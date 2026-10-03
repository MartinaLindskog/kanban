//HEADER
//(reminder to myself tsx because im using "html-look-alike" code)


interface HeaderProps {
	onAddTask: () => void
	onSetLimit: () => void
}


//(reminder to myself: Capital H --> react)
function Header({ onAddTask, onSetLimit }: HeaderProps) {
	return (
		<header className="app-header">
			<h1 className="app-title">Catnip Kanban</h1>
			<div className="header-actions">
				<button
	className="settings-button"
	type="button"
	onClick={onSetLimit}
>
	Edit task limit
</button>
				<button className="add-task-button" type="button" onClick={onAddTask}>
					Add task
				</button>
			</div>
		</header>
	)
}

export default Header
