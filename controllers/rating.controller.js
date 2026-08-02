const {SuccessResponse} = require("../untils/custom.responden")
const {pool} =require ('../untils/db')

const getAllRatings = async (req, res) => {
    try {
        const [data] = await pool.query('SELECT * FROM rating')
        res.status(200).json(new SuccessResponse("Success get all ratings", data))
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

const getRatingById = async (req, res) => {
    try {
        const { id } = req.params

        const [data] = await pool.query(
            'SELECT * FROM rating WHERE id_rating = ?',
            [id]
        )

        res.status(200).json(new SuccessResponse("Success get rating by id", data))
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

const getRatingByValue = async (req, res) => {
    try {
        const { rating } = req.query

        const [data] = await pool.query(
            'SELECT * FROM rating WHERE rating = ?',
            [rating]
        )

        res.status(200).json(new SuccessResponse("Success get rating", data))
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

const createRating = async (req, res) => {
    try {
        const { id_film, rating } = req.body

        if (!id_film || !rating) {
            throw new Error("id_film dan rating harus diisi")
        }

        const [result] = await pool.query(
            'INSERT INTO rating (id_film, rating) VALUES (?, ?)',
            [id_film, rating]
        )

        res.status(201).json(
            new SuccessResponse("Success create rating", {
                id_rating: result.insertId,
                id_film,
                rating
            })
        )

    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

const RATING_COLUMNS = ['id_film', 'rating']

const editRating = async (req, res) => {
    try {
        const { id } = req.params

        const columns = RATING_COLUMNS.filter(
            (column) => req.body[column] !== undefined
        )

        if (columns.length === 0) {
            throw new Error(`Minimal satu kolom harus diisi: ${RATING_COLUMNS.join(', ')}`)
        }

        const setClause = columns.map(
            (column) => `${column} = ?`
        ).join(', ')

        const values = columns.map(
            (column) => req.body[column]
        )

        const [result] = await pool.query(
            `UPDATE rating SET ${setClause} WHERE id_rating = ?`,
            [...values, id]
        )

        if (result.affectedRows === 0) {
            throw new Error(`Rating dengan id ${id} tidak ditemukan`)
        }

        const updatedData = { id_rating: id }

        columns.forEach((column, index) => {
            updatedData[column] = values[index]
        })

        res.status(200).json(
            new SuccessResponse("Success update rating", updatedData)
        )

    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

const deleteRating = async (req, res) => {
    try {
        const { id } = req.params

        const [result] = await pool.query(
            'DELETE FROM rating WHERE id_rating = ?',
            [id]
        )

        if (result.affectedRows === 0) {
            throw new Error(`Rating dengan id ${id} tidak ditemukan`)
        }

        res.status(200).json(
            new SuccessResponse("Success delete rating", {
                id_rating: id
            })
        )

    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

// filtering
const getRatingFilter = async (req, res) => {
    try {
        const { rating } = req.query

        const [data] = await pool.query(
            'SELECT * FROM rating WHERE rating = ?',
            [rating]
        )

        res.status(200).json(new SuccessResponse("Success filter rating", data))
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

const getRatingByMovie = async (req, res) => {
    try {
        const { id_film } = req.query

        const [data] = await pool.query(
            'SELECT * FROM rating WHERE id_film = ?',
            [id_film]
        )

        res.status(200).json(new SuccessResponse("Success filter rating by movie", data))
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

// sorting
const getRatingSorting = async (req, res) => {
    try {

        const { sort } = req.query

        let query = 'SELECT * FROM rating'

        if (sort == 'asc') {
            query += ' ORDER BY rating ASC'
        } else if (sort == 'desc') {
            query += ' ORDER BY rating DESC'
        }

        const [data] = await pool.query(query)

        res.status(200).json(new SuccessResponse("Success sorting rating", data))

    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}


const getRatingWithMovies = async (req, res) => {
    try {

        const [data] = await pool.query(`
            SELECT
                rating.rating,
                film.judul
            FROM rating
            JOIN film
            ON rating.id_film = film.id_film
        `)

        res.status(200).json(new SuccessResponse("Success get rating with movies", data))

    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

const getRatingMovieCategory = async (req, res) => {
    try {

        const [data] = await pool.query(`
            SELECT
                film.judul,
                kategori.nama,
                rating.rating
            FROM rating
            JOIN film
            ON rating.id_film = film.id_film
            JOIN kategori
            ON film.id_kategori = kategori.id_kategori
        `)

        res.status(200).json(new SuccessResponse("Success get rating movie category", data))

    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

const getRatingMovieDirector = async (req, res) => {
    try {

        const [data] = await pool.query(`
            SELECT
                film.judul,
                sutradara.nama,
                rating.rating
            FROM rating
            JOIN film
            ON rating.id_film = film.id_film
            JOIN sutradara
            ON film.id_sutradara = sutradara.id_sutradara
        `)

        res.status(200).json(new SuccessResponse("Success get rating movie director", data))

    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

module.exports = {
    getAllRatings,
    getRatingById,
    getRatingByValue,
    createRating,
    editRating,
    deleteRating,
    getRatingFilter,
    getRatingByMovie,
    getRatingSorting,
    getRatingWithMovies,
    getRatingMovieCategory,
    getRatingMovieDirector
}