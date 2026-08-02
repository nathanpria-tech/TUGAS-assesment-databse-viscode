const express = require('express')
const router = express.Router()

const ratingController = require('../controllers/rating.controller')


router.get('/get-all', ratingController.getAllRatings)
router.get('/get-by-id/:id', ratingController.getRatingById)
router.get('/get-by-rating', ratingController.getRatingByValue)
router.post('/create-rating', ratingController.createRating)
router.put('/edit-rating/:id', ratingController.editRating)
router.delete('/delete-rating/:id', ratingController.deleteRating)

// FILTER
router.get('/filter', ratingController.getRatingFilter)
router.get('/filter-by-movie', ratingController.getRatingByMovie)

// SORTING
router.get('/sorting', ratingController.getRatingSorting)

// JOIN
router.get('/rating-with-movies', ratingController.getRatingWithMovies)
router.get('/rating-movie-category', ratingController.getRatingMovieCategory)
router.get('/rating-movie-director', ratingController.getRatingMovieDirector)

module.exports = router