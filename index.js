const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

// 3.7-3.8 Show the data sent in HTTP POST requests
morgan.token('post-data', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  }
  return ' ';
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'));

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

// 3.1 displaying persons on http://localhost:3001/api/persons
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// 3.2 displaying number of persons and date on http://localhost:3001/info
app.get('/info', (request, response) => {
  const currentTime = new Date()
  response.send(`<p>Phonebook has info for ${persons.length} persons</p>
  <p>${currentTime}</p>`)
})

// 3.3 displaying the information for a single phonebook entry
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

// 3.4 delete a person
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

// 3.5 add a new person
const generateId = () => {
  const new_id = Math.floor(Math.random() * 10000)
  return new_id
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  // 3.6 error handling for creating new entries
  if (!body.name) {
    return response.status(400).json({ 
      error: 'name is missing' 
    })
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'number is missing' 
    })
  }

  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)
  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})