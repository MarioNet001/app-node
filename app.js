const express = require('express')
const movies = require('./movies.json')
const crypto = require('node:crypto')
const cors = require('cors')
const {validateMovie, validatePartialMovie } = require('./Schemas/movie')
const { log } = require('node:console')
const app = express()

app.use(cors())
app.disable('x-powered-by')
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) 

app.get('/',(req, res) =>{
    res.send('Hola API')
})

app.get('/movies', (req, res) =>{
    res.header('Access-Control-Allow-Origin', '*')
    const {genre} = req.query
    if (genre) {
        const filter = movies.filter(
            (movie) => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
        )
        console.log(genre);
        return res.json(filter)
    }
    res.json(movies)
})

app.post('/movies', (req, res) => {
const result = validateMovie(req.body) //valida el body de la peticion  
if(!result.success){  // si no es exitoso
    return res.status(400).json({errors: result.error})
    }
    const newMovie = { // si es exitoso
        id : crypto.randomUUID(),  // genera uuid v4 
        ...result.data
    }

    movies.push(newMovie)
    res.status(201).json(newMovie)  // responde con el nuevo objeto creado
})

app.patch('/movies/:id', (req, res) => {
    const {id} = req.params
    const movieIndex = movies.findIndex((movie)=> movie.id === id)
    if(movieIndex === -1){return res.status(404).json({message : 'Movie Not Found'})}
    const result = validatePartialMovie(req.body)
    if(!result.success){return res.status(400).json({errors: result.error})}
    const movieUpdate = {
        ...movies[movieIndex],
        ...result.data
    }
    movies[movieIndex] = movieUpdate
    res.status(200).json(movies[movieIndex])
    
})

app.delete('/movies/:id', (req, res) =>{
  const {id} = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)
  if(movieIndex === -1){return res.status(404).json({message : 'Movie Not Found'})}
  movies.splice(movieIndex,1)
  res.status(204).json({messages: 'Movie Deleted'})
})

app.get('/movies/:id', (req, res) => {
    const {id} = req.params 
    const movie = movies.find((movie)=> movie.id === id)
    if(movie){return res.json(movie)}
    res.status(404).json({message : 'no Found'})
})
const PORT = process.env.PORT ?? 1234

app.listen(PORT, ()=> {
    console.log(`server listening on port  http://localhost:${PORT}`)
    
})