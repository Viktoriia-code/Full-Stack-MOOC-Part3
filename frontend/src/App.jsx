import { useState, useEffect } from 'react'
import phonebookService from "./services/phonebook"
import './index.css'
import Persons from "./components/Persons"
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='message'>
      {message}
    </div>
  )
}

const ErrorNotification = ({ errorMessage }) => {
  if (errorMessage === null) {
    return null
  }

  return (
    <div className='error'>
      {errorMessage}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])

  useEffect(() => {
    phonebookService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  /*const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])*/
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    const filterValue = event.target.value
    setNewFilter(filterValue)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <ErrorNotification errorMessage={errorMessage} />
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm 
        persons={persons} 
        newName={newName} 
        newNumber={newNumber} 
        handleNameChange={handleNameChange} 
        handleNumberChange={handleNumberChange}
        setPersons={setPersons}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
        setMessage={setMessage}
        setErrorMessage={setErrorMessage} />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={newFilter} setPersons={setPersons} />
    </div>
  )
}

export default App