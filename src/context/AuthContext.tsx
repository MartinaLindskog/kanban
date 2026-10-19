import { createContext, type ReactNode, useContext, useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { getCurrentSession, signInUser, signOutUser, getUserRole, type UserRole } from '../services/authService'

// Describe the authentication values shared across the app
interface AuthContextValue {
	session: Session | null
	role: UserRole | null
	isLoading: boolean
	signIn: (email: string, password: string) => Promise<void>
	signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// Describe the content wrapped by the provider
interface AuthProviderProps {
	children: ReactNode
}

// Make authentication values available to nested components
export function AuthProvider({ children }: AuthProviderProps) {
	const [role, setRole] = useState<UserRole | null>(null)
	const [session, setSession] = useState<Session | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	// Restore the active session and role when the app starts
	useEffect(() => {
		async function loadSession() {
			try {
				const activeSession = await getCurrentSession()
				setSession(activeSession)
				if (activeSession) {
					const activeRole = await getUserRole(activeSession.user.id)
					setRole(activeRole)
				} else {
					setRole(null)
				}
			} catch (error) {
				console.error(error)
				setSession(null)
				setRole(null)				
			} finally {
				setIsLoading(false)
			}
		}
		void loadSession()
	}, [])
	// Sign in and store the user's role and session
	async function signIn(email: string, password: string) {
		const activeSession = await signInUser(email, password)
		const activeRole = await getUserRole(activeSession.user.id)
		setRole(activeRole)
		setSession(activeSession)
	}
	// Sign out and remove the session and role from React state
	async function signOut() {
		await signOutUser()
		setSession(null)
		setRole(null)		
	}
	return (
		<AuthContext.Provider value={{ session, role, isLoading, signIn, signOut }}>
			{children}
		</AuthContext.Provider>
	)
}

// Give components access to the authentication context
export function useAuth() {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error('useAuth must be used inside AuthProvider')
	}
	return context
}