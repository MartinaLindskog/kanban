// Import the Supabase client used to verify login tokens
import supabase from '../supabaseClient.js'

// Stop requests that do not contain a login token
export async function requireAuth(request, response, next) {
	const authorizationHeader = request.headers.authorization
	if (!authorizationHeader?.startsWith('Bearer ')) {
		return response.status(401).json({
			message: 'You must be logged in.'
		})
	}
	const accessToken = authorizationHeader.slice(7)
    const { data, error } = await supabase.auth.getUser(accessToken)
    if (error || !data.user) {
        return response.status(401).json({
            message: 'Your login session is not valid.'
        })
    }
    request.user = data.user
    next()
}
// Stop signed-in users who do not have the admin role
export async function requireAdmin(request, response, next) {
	const { data, error } = await supabase
		.from('profiles')
		.select('role')
		.eq('id', request.user.id)
		.single()
	if (error) {
		console.error(error)
		return response.status(500).json({
			message: 'Could not verify the user role.'
		})
	}
	if (data.role !== 'admin') {
		return response.status(403).json({
			message: 'Only an admin can perform this action.'
		})
	}
	next()
}