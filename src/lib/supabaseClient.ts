import { createClient } from '@supabase/supabase-js'

// Read the public Supabase settings provided by Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// Stop the app if required Supabase settings are missing
if (!supabaseUrl || !supabasePublishableKey) {
	throw new Error('Missing Supabase frontend environment variables.')
}

// Create the shared client used for authentication
const supabase = createClient(supabaseUrl, supabasePublishableKey)

export default supabase