import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import supabase from './supabaseClient.js'
import { requireAuth, requireAdmin } from './middleware/authMiddleware.js'
import { validateTaskInput } from './validation/taskValidation.js'
import { toApiTask, toDatabaseTask } from './mappers/taskMapper.js'

// Create the Express application
const app = express()

// Allow the React frontend to communicate with this API
app.use(cors())

// Parse JSON sent from the React frontend
app.use(express.json())

// Use port 5001 for local backend development
const PORT = 5001 

// Store the external endpoint used to request one cat image
const CAT_API_URL = 'https://api.thecatapi.com/v1/images/search?limit=1&has_breeds=1&include_breeds=1'

// Return today's number in the year, including leap years
function getDayOfYear(date = new Date()) {
	const startOfYear = Date.UTC(date.getUTCFullYear(), 0, 0)
	const currentDate = Date.UTC(
		date.getUTCFullYear(),
		date.getUTCMonth(),
		date.getUTCDate()
	)
	const millisecondsPerDay = 1000 * 60 * 60 * 24
	return Math.floor((currentDate - startOfYear) / millisecondsPerDay)
}

// Send the shared board settings to the frontend
app.get('/api/board-settings', requireAuth, async (request, response) => {
	const { data, error } = await supabase
		.from('board_settings')
		.select('max_in_progress_tasks')
		.eq('id', 'main')
		.single()
	if (error) {
		console.error(error)
		return response.status(500).json({
			message: 'Could not load board settings.'
		})
	}
	response.status(200).json({
		maxInProgressTasks: data.max_in_progress_tasks
	})
})

// Update the shared in-progress limit
app.put('/api/board-settings', requireAuth, requireAdmin, async (request, response) => {
	const newLimit = Number(request.body.maxInProgressTasks)
	// Reject values that are not positive whole numbers
	if (!Number.isInteger(newLimit) || newLimit < 1) {
		return response.status(400).json({
			message: 'The task limit must be a whole number of 1 or higher.'
		})
	}
	const { data, error } = await supabase
		.from('board_settings')
		.update({
			max_in_progress_tasks: newLimit
		})
		.eq('id', 'main')
		.select('max_in_progress_tasks')
		.single()
	if (error) {
		console.error(error)
		return response.status(500).json({
			message: 'Could not update board settings.'
		})
	}
	response.status(200).json({
		maxInProgressTasks: data.max_in_progress_tasks
	})
})

// Send all tasks when the frontend requests GET /api/tasks
app.get('/api/tasks', requireAuth, async (request, response) => {
	const { data, error } = await supabase
		.from('tasks')
		.select('*')
		.order('created_at', { ascending: true })
	if (error) {
		console.error(error)
		return response.status(500).json({
			message: 'Could not load tasks.'
		})
	}
	// Convert database column names to the format used by React
	const formattedTasks = data.map(toApiTask)
	response.status(200).json(formattedTasks)
})

// Create a new task when the frontend sends POST /api/tasks
app.post('/api/tasks', requireAuth, async (request, response) => {
	const validationError = validateTaskInput(request.body)
	if (validationError) {
		return response.status(400).json({ message: validationError })
	}
	// Convert the submitted task to database column names
	const taskToInsert = toDatabaseTask(request.body)
	const { data, error } = await supabase
		.from('tasks')
		.insert(taskToInsert)
		.select()
		.single()
	if (error) {
		console.error(error)
		return response.status(500).json({
			message: 'Could not create task.'
		})
	}
	// Convert the saved row back to React's format
	const savedTask = toApiTask(data)
	response.status(201).json(savedTask)
})

// Delete the task with the matching id
app.delete('/api/tasks/:id', requireAuth, requireAdmin, async (request, response) => {
	const { data, error } = await supabase
		.from('tasks')
		.delete()
		.eq('id', request.params.id)
		.select('id')
		.maybeSingle()
	if (error) {
		console.error(error)
		return response.status(500).json({
			message: 'Could not delete task.'
		})
	}
	if (!data) {
		return response.status(404).json({
			message: 'Task not found.'
		})
	}
	response.status(204).send()
})

// Update the task with the matching id
app.put('/api/tasks/:id', requireAuth, async (request, response) => {
	const validationError = validateTaskInput(request.body)
	if (validationError) {
		return response.status(400).json({ message: validationError })
	}
	// Convert the submitted changes to database column names	
	const taskToUpdate = toDatabaseTask(request.body)
	const { data, error } = await supabase
		.from('tasks')
		.update(taskToUpdate)
		.eq('id', request.params.id)
		.select()
		.maybeSingle()
	if (error) {
		console.error(error)
		return response.status(500).json({
			message: 'Could not update task.'
		})
	}
	if (!data) {
		return response.status(404).json({
			message: 'Task not found.'
		})
	}
	// Convert the updated row back to React's format	
	const updatedTask = toApiTask(data)
	response.status(200).json(updatedTask)
})

// Send one cat image when the frontend requests GET /api/daily-cat
app.get('/api/daily-cat', requireAuth, async (request, response) => {
	// Convert the day number to the API's zero-based page number
	const page = getDayOfYear() - 1
	// Use a fixed order so the selected image stays the same
	const dailyCatUrl = `${CAT_API_URL}&page=${page}&order=ASC`
	const catApiResponse = await fetch(dailyCatUrl, {
		headers: {
			'x-api-key': process.env.CAT_API_KEY
		}
	})
	// Stop if The Cat API returns an error
	if (!catApiResponse.ok) {
		return response.status(502).json({
			message: 'Could not load cat of the day.'
		})
	}
	const catImages = await catApiResponse.json()
	// Stop if The Cat API does not return an image
	if (catImages.length === 0) {
		return response.status(404).json({
			message: 'No cat image is available for today.'
		})
	}
	response.status(200).json(catImages[0])
})
// Start the server and listen for incoming requests
app.listen(PORT, (error) => {
	if (error) {
		console.error(error)
		return
	}
	console.log(`Server running on http://localhost:${PORT}`)
})
