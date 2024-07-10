import phonebookService from "../services/phonebook"

const Persons = ({ persons, filter, setPersons }) => {
  const filteredPersons = persons.filter((x) => x.name.toLowerCase().includes(filter.toLowerCase()));

  const deletePerson = (id,name) => {
    if (window.confirm(`Delete ${name} ?`)) {
      phonebookService
        .remove(id)
        setPersons(persons.filter(person => person.id !== id))
    }
  }

  return(
    <>
    {filteredPersons.map(person => 
      <p key={person.id}>
        {person.name} {person.number}
        <button onClick={() => deletePerson(person.id,person.name)}>delete</button>
      </p>
    )}
    </>
  )
}

export default Persons