// Import Express so this file can create an API server
import express from 'express'
// Import CORS so the React app can communicate with this server
import cors from 'cors'

/* CORS behövs alltså nu därför att våra två lokala program körs på olika portar. 
Vid publiceringen beror behovet av CORS på om frontend och backend ligger på samma eller olika domäner.

localhost betyder alltid den dator där adressen öppnas. 
Om den färdiga appen fortfarande försökte kontakta http://localhost:5000, 
skulle varje användares webbläsare leta efter en server på användarens egen dator. 
Det skulle alltså inte fungera.
När projektet publiceras behöver båda delarna få riktiga adresser.
När appen fungerar lokalt byter vi senare till publicerade adresser 
och anpassar servern efter vald hosting.
Vi bör inte skriva localhost utspritt på flera platser. 
API-adressen kan senare läggas i en inställning eller miljövariabel */


// Create the Express application
const app = express()

// Allow the React frontend to communicate with this API
app.use(cors())

// Parse JSON sent from the React frontend
app.use(express.json())

// Store the port number used by the backend server
const PORT = 5001 // min mac använder redan 5000 till nåt annat
/* Port 5001 ska behållas medan vi arbetar lokalt, 
men normalt inte användas på samma sätt efter publicering.
Det beror på hur backend publiceras */


// Store tasks temporarily in the server's memory
let tasks = [
	{
		id: '1',
		title: 'Connect React to Express',
		comment: 'Load this task from the backend',
		assignee: 'Martina',
		priority: 'medium',
		status: 'todo'
	}
]

// Send all tasks when the frontend requests GET /api/tasks
app.get('/api/tasks', (request, response) => {
	response.status(200).json(tasks)
})


// Create a new task when the frontend sends POST /api/tasks
app.post('/api/tasks', (request, response) => {
	const newTask = {
		...request.body,
        /* Servern skapar id eftersom den ska äga den permanenta datan. 
        nuvarande frontend skapar fortfarande också ett id, 
        men tar bort den delen senare när jag kopplar formuläret till API */
		id: crypto.randomUUID()
	}

	tasks.push(newTask)

	response.status(201).json(newTask)
})

// Start the server and listen for incoming requests
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`)
})