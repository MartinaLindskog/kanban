import { useTheme } from '../context/ThemeContext'

interface ThemeToggleProps {
	iconOnly?: boolean
}

// Let the user switch between the dark and light themes
export default function ThemeToggle( { iconOnly = false }: ThemeToggleProps) {
	const { theme, toggleTheme } = useTheme()
    	// Choose text for desktop or a symbol for mobile
	    const buttonLabel = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
	    let buttonContent = theme === 'dark' ? 'Light mode' : 'Dark mode'

	if (iconOnly) {
		buttonContent = theme === 'dark' ? '☀️' : '🌙'
	}
	return (
		<button
			className="theme-toggle-button"
			type="button"
            aria-label={buttonLabel}
            title={buttonLabel}
			onClick={toggleTheme}
		>
			{buttonContent}
		</button>
	)
}