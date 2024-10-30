
const z = require('zod') //importa zod para la validacion de datos
const movieSchema = z.object({
    title: z.string({invalid_type_error: 'Movie title must be string'}).min(1).max(100),
    genre: z.array(z.string().min(1)).min(1).max(10),
    year: z.number().int().min(1888).max(2077),
    director: z.string().min(1).max(100),
    duration: z.number().int().min(1).max(500),
    rate: z.number().min(0).max(10).default(5),
    poster: z.string().url(),
})

function validateMovie(object) {
    return movieSchema.safeParse(object)
}

function validatePartialMovie(object){
    return movieSchema.partial().safeParse(object)
}

module.exports = {
    validateMovie,
    validatePartialMovie
}