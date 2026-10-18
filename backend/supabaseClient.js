// Load the backend environment variables
import 'dotenv/config'

// Import the function used to create a Supabase connection
import { createClient } from '@supabase/supabase-js'

// Read the database address and secret key from .env
const supabaseUrl = process.env.SUPABASE_URL
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY

// Stop the server if required database settings are missing
if (!supabaseUrl || !supabaseSecretKey) {
	throw new Error('Missing Supabase environment variables.')
}

// Create a server-only client for database requests
const supabase = createClient(supabaseUrl, supabaseSecretKey, {
	auth: {
		persistSession: false,
		autoRefreshToken: false,
		detectSessionInUrl: false
	}
})

export default supabase