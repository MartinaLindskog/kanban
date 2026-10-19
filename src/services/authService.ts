import supabase from '../lib/supabaseClient'

export type UserRole = 'admin' | 'user'

// Sign in a user with email and password
export async function signInUser(email: string, password: string) {
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password
	})
	if (error) {
		throw new Error(error.message)
	}
	return data.session
}

// Get the active login session when the page loads
export async function getCurrentSession() {
	const { data, error } = await supabase.auth.getSession()
	if (error) {
		throw new Error(error.message)
	}
	return data.session
}

// Sign out the current user
export async function signOutUser() {
	const { error } = await supabase.auth.signOut()
	if (error) {
		throw new Error(error.message)
	}
}

// Get the signed-in user's role from their profile
export async function getUserRole(userId: string) {
	const { data, error } = await supabase
		.from('profiles')
		.select('role')
		.eq('id', userId)
		.single()
	if (error) {
		throw new Error(error.message)
	}
	return data.role as UserRole
}