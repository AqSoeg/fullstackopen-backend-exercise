const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.json())

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

function generateId() {
  const maxId =
    persons.length > 0 ? Math.max(...persons.map((person) => person.id)) : 0
  return maxId + 1
}

app.get('/', (req, res) => {
  res.send('Phonebook')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  const date = new Date()
  res.send(`<div>Phonebook has info for ${persons.length} people</div>
    ${date}`)
})

app.get('/api/persons/:id', (req, res) => {
  const personId = Number(req.params.id)
  const person = persons.find((person) => person.id === personId)
  if (!person) {
    res.status(204).end()
  } else {
    res.json(person)
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const personId = Number(req.params.id)
  persons = persons.filter((person) => person.id !== personId)

  res.status(204).end()
})

// Configure middleware Morgan to log person infomation
morgan.token('personInfo', (req, res) => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :response-time ms :personInfo'))

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name) {
    return res.status(400).json({
      error: 'Name missing',
    })
  } else if (!body.number) {
    return res.status(400).json({
      error: 'Number missing',
    })
  } else if (
    () => {
      persons.map((person) => {
        person.name === body.name ? true : false
      })
    }
  ) {
    return res.status(400).json({
      error: `${body.name} already in the phonebook`,
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person)

  res.json(persons)
})

const PORT = 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
