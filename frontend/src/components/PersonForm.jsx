import phonebookService from "../services/phonebook"

const PersonInput = ({ text, value, handleChange }) => {
  return (
    <div>{text}<input value={value} onChange={handleChange} /></div>
  )
}

const PersonForm = ({ persons,newName,newNumber,handleNameChange,handleNumberChange,setPersons,setNewName,setNewNumber,setMessage,setErrorMessage}) => {
  const addPerson = (event) => {
    event.preventDefault()
    if (checkPerson(newName)) {
      /*alert(`${newName} is already added to phonebook`)*/
      /* Case when there is the name in the list */
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const personObject = {
          name: newName,
          number: newNumber
        }
        phonebookService
          .update(checkPerson(newName), personObject)
          .then(response => {
            setPersons(persons.map(n => n.id !== checkPerson(newName) ? n : response.data))
            setNewName('')
            setNewNumber('')
            setMessage(`${newName}'s number changed to ${newNumber}`)
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
          .catch(error => {
            setErrorMessage(error.response.data.error)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
        }
      } else {
        const personObject = {
          name: newName,
          number: newNumber
        }
        phonebookService
        .create(personObject)
        .then(response => {
          setPersons(persons.concat(response.data))
          setNewName('')
          setNewNumber('')
          setMessage(`Added ${newName}`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch(error => {
          // this is the way to access the error message
          setErrorMessage(error.response.data.error)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  }

  const checkPerson = (name) => {
    if (persons.find(x => x.name === name)) {
      return (persons.find(x => x.name === name)).id
    } else {
      return false
    }
  }

  return(
    <form onSubmit={addPerson}>
      <PersonInput text='name: ' value={newName} handleChange={handleNameChange} />
      <PersonInput text='number: ' value={newNumber} handleChange={handleNumberChange} />
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

export default PersonForm