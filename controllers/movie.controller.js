// const { query, get } = require("../router/movie.routes")
const {SuccessResponse} = require("../untils/custom.responden")
const {pool} =require ('../untils/db')

const getAllFilms = async (req, res) => {
    try {
         const[data] = await pool.query('SELECT * FROM film')

        res.status(200).json(
            new SuccessResponse("Success get all movies", data)
        )
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

// GET MOVIE BY ID
const getMovieByid = async (req,res) => {
    try {
        const {id} = req.params
        const [data] = await pool.query
            ('SELECT * FROM FILM WHERE id_film = ?',[id])
         res.status(200).json(new SuccessResponse("Success get product by id", data))
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

// GET MOVIE BY TITLE OR YEAR
const getMovieByTitleOrYear = async (req,res) => {
    try {
        const {judul,tahun_rilis } = req.query
        const [data] = await pool.query
        ('select * from film WHERE judul = ? OR tahun_rilis = ?',[judul,tahun_rilis])
        res.status(200).json(new SuccessResponse("Success get movie by title or year", data))
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

// create movie
    const createMovie = async (req, res) => {
    try {
        const {
            judul,
            description,
            tahun_rilis,
            durasi,
            id_kategori,
            id_sutradara
        } = req.body

        if (
            !judul ||
            !description ||
            !tahun_rilis ||
            !durasi ||
            !id_kategori ||
            !id_sutradara
        ) {
            throw new Error("Semua data wajib diisi")
        }

        const [result] = await pool.query(
            `INSERT INTO film
            (judul, description, tahun_rilis, durasi, id_kategori, id_sutradara)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                judul,
                description,
                tahun_rilis,
                durasi,
                id_kategori,
                id_sutradara
            ]
        )

        res.status(201).json(
            new SuccessResponse(
                "Success create movie",
                {
                    id_film: result.insertId,
                    judul,
                    description,
                    tahun_rilis,
                    durasi,
                    id_kategori,
                    id_sutradara
                }
            )
        )

    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}
// ini kolom yang mau diubah
const MOVIE_COLUMNS = [
    'judul',
    'description',
    'tahun_rilis',
    'durasi',
    'id_kategori',
    'id_sutradara'
]
// UPDATE MOVIE
 const editMovie = async (req, res) => {
    try {
        const { id } = req.params
        const columns = MOVIE_COLUMNS.filter(
            (column) => req.body[column] !== undefined
        )

        if (columns.length === 0) {
            throw new Error(
                `Minimal satu kolom harus diisi: ${MOVIE_COLUMNS.join(', ')}`
            )
        }

        const setClause = columns
            .map((column) => `${column} = ?`)
            .join(', ')

        const values = columns.map(
            (column) => req.body[column]
        )

        const [result] = await pool.query(
            `UPDATE film SET ${setClause} WHERE id_film = ?`,
            [...values, id]
        )

        if (result.affectedRows === 0) {
            throw new Error(`Movie dengan id ${id} tidak ditemukan`)
        }

        const updatedData = { id_film: id }

        columns.forEach((column, index) => {
            updatedData[column] = values[index]
        })

        res.status(200).json(
            new SuccessResponse(
                "Success update movie",
                updatedData
            )
        )

    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

// DELETED MOVIE
const deleteMovie = async (req, res) => {
    try {
        const { id } = req.params

        const [result] = await pool.query(
            'DELETE FROM film WHERE id_film = ?',
            [id]
        )

        if (result.affectedRows === 0) {
            throw new Error(`Movie dengan id ${id} tidak ditemukan`)
        }

        res.status(200).json(
            new SuccessResponse(
                "Success delete movie",
                { id_film: id }
            )
        )

    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

const getAllMovies = async (req, res) => {
    try {

        const { genre, year, sort } = req.query

        let page = parseInt(req.query.page) || 1
        let limit = parseInt(req.query.limit) || 10
        const offset = (page - 1) * limit
        let sqlParams = []
        let query = `
            SELECT
                film.id_film,
                film.judul,
                film.description,
                film.tahun_rilis,
                film.durasi,
                kategori.nama,
                sutradara.nama
                FROM film
            JOIN kategori
                ON film.id_kategori = kategori.id_kategori
            JOIN sutradara
                ON film.id_sutradara = sutradara.id_sutradara
            WHERE 1=1
        `

        // FILTER GENRE
        if (genre) {
            query += ` AND kategori.nama= ?`
            sqlParams.push(genre)
        }

        // FILTER TAHUN
        if (year) {
            query += ` AND film.tahun_rilis = ?`
            sqlParams.push(year)
        }

        // SORTING
        if (sort === "asc") {
            query += ` ORDER BY film.tahun_rilis ASC`
        } else if (sort === "desc") {
            query += ` ORDER BY film.tahun_rilis DESC`
        } else {
            query += ` ORDER BY film.id_film DESC`
        }

        // PAGINATION
        query += ` LIMIT ? OFFSET ?`
        sqlParams.push(limit, offset)
         const [data] = await pool.query(query, sqlParams)
        res.status(200).json(
        new SuccessResponse("Success get all movies", data)
        )
        } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
}



// joinn  movie = genre
const getMoviesWithGenres = async (req, res) => {
    try {

        const [data] = await pool.query(`
            SELECT
                film.judul,
                kategori.nama AS genre
            FROM film
            JOIN kategori
            ON film.id_kategori = kategori.id_kategori
        `)

        res.status(200).json(
            new SuccessResponse("Success get movies with genres", data)
        )

    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
}

// join movie  movie + rating
const getMoviesWithRatings = async (req, res) => {
    try {

        const [data] = await pool.query(`
            SELECT
                film.judul,
                AVG(rating.rating) AS average_rating
            FROM film
            JOIN rating
            ON film.id_film = rating.id_film
            GROUP BY film.id_film
            ORDER BY average_rating DESC
        `)

        res.status(200).json(
            new SuccessResponse("Success get movies with ratings", data)
        )

    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
}



module.exports = {
    getAllMovies,
    getMovieByid,
    getMovieByTitleOrYear,
    createMovie,
    editMovie,
    deleteMovie,
    getMoviesWithGenres,
    getMoviesWithRatings
}