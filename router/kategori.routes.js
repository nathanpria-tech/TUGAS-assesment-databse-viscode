const express = require('express')
const router = express.Router();
const categoryController = require('../controllers/kategori.controller')

router.get('/get-all', categoryController.getAllCategories)
router.get('/get-by-id/:id', categoryController.getCategoryById)
router.get('/get-by-name', categoryController.getCategoryByName)
router.post('/create-category', categoryController.createCategory)
router.put('/edit-category/:id', categoryController.editCategory)
router.delete('/delete-category/:id', categoryController.deleteCategory)
router.get('/filter', categoryController.getCategoryFilter)
router.get('/filter-by-id/:id', categoryController.getCategoryById)
router.get('/sorting', categoryController.getCategorySorting)
router.get('/category-with-movies', categoryController.getCategoryWithMovies)
router.get('/category-movie-director', categoryController.getCategoryMovieDirector)
router.get('/category-movie-rating', categoryController.getCategoryMovieRating)


module.exports = router