import { createContext, type ReactNode, useState, useContext, useEffect } from 'react'

// Limit the theme to the two supported values
export type Theme = 'dark' | 'light'
// Describe the values shared through the theme context
interface ThemeContextValue {
	theme: Theme
	toggleTheme: () => void
}
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)
// Describe the content wrapped by the provider
interface ThemeProviderProps {
	children: ReactNode
}

// Make theme values available to nested components
export function ThemeProvider({ children }: ThemeProviderProps) {
	const [theme, setTheme] = useState<Theme>(() => {
		const savedTheme = localStorage.getItem('theme')
		return savedTheme === 'light' ? 'light' : 'dark'
	})
	// Tell CSS which theme is currently active
	useEffect(() => {
		document.documentElement.dataset.theme = theme
		localStorage.setItem('theme', theme)
	}, [theme])
	// Switch between the dark and light themes
	function toggleTheme() {
		setTheme((currentTheme) =>
			currentTheme === 'dark' ? 'light' : 'dark'
		)
	}
	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	)
}

// Give components access to the current theme and toggle function
export function useTheme() {
	const context = useContext(ThemeContext)
	if (context === undefined) {
		throw new Error('useTheme must be used inside ThemeProvider')
	}
	return context
}
