const express = require('express')
const router = express.Router();
const movieController = require ('../controllers/movie.controller')

router.get('/get-all', movieController.getAllMovies)
router.get('/get-by-id/:id',movieController.getMovieByid)
router.get('/get-by-title-or-year',movieController.getMovieByTitleOrYear)
router.post('/create-movie',movieController.createMovie)
router.put('/edit-movie/:id',movieController.editMovie)
router.delete('/delete-movie/:id',movieController.deleteMovie)
router.get('/get-movies-with-genres',movieController.getMoviesWithGenres)
router.get('/get-movies-with-ratings',movieController.getMoviesWithRatings)
module.exports = router;    