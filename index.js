require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

// 3.7-3.8 Show the data sent in HTTP POST requests
morgan.token('post-data', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return ' '
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'))

let persons = [{}]

Person.find({}).then(result => {
  persons = result
})
/*let persons = [
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
]*/

// 3.1 displaying persons on http://localhost:3001/api/persons
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// 3.2 displaying number of persons and date on http://localhost:3001/info
app.get('/info', (request, response) => {
  const currentTime = new Date()
  response.send(`<p>Phonebook has info for ${persons.length} persons</p>
  <p>${currentTime}</p>`)
})

// 3.3 displaying the information for a single phonebook entry
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
        console.log('found the person')
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      next(error)
      /*console.log(error)*/
      response.status(500).end()
    })
})

// 3.4 delete a person
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// 3.5 add a new person
/*const generateId = () => {
  const new_id = Math.floor(Math.random() * 10000)
  return new_id
}*/

app.put('/api/persons/:id', (request, response, next) => {
  /*const body = request.body*/
  const { name, number } = request.body

  /*const person = {
    name: body.name,
    number: body.number,
  }*/

  Person.findByIdAndUpdate(request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(
      error => {
        next(error)
        /*console.log(error.response.data.error)*/
      }
    )
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  const person = new Person({
    name: body.name,
    number: body.number,
    /*id: generateId(),*/
  })
  // 3.6 error handling for creating new entries
  if (!body.name) {
    return response.status(400).json({
      error: 'name is missing'
    })
  }

  else if (!body.number) {
    return response.status(400).json({
      error: 'number is missing'
    })
  }
  else if (person.validateSync()) {
    return response.status(400).json({
      error: person.validateSync().errors['number'].message
    })
  }
  else if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  } else {
    person.save()
      .then(() => {
        console.log(`added ${person.name} number ${person.number} to phonebook`)
        response.json(person)
      })
      .catch(error => {
        next(error)
        return response.status(400).json({ error: error.message })
      })
  }
})

// 3.16 new error handler middleware
const errorHandler = (error, request, response, next) => {
  /*console.error(error.response.data.error)*/
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})