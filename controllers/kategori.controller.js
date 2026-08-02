const { SuccessResponse } = require('../untils/custom.responden')
const { pool } = require('../untils/db')

const getAllCategories = async (req, res) => {
    try {
        const [data] = await pool.query('SELECT * FROM kategori')
        res.status(200).json(new SuccessResponse("Success get all categories", data))
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params
        const [data] = await pool.query('SELECT * FROM kategori WHERE id_kategori = ?', [id])
        res.status(200).json(new SuccessResponse("Success get category by id", data))
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

const getCategoryByName = async (req, res) => {
    try {
        const { nama} = req.query

        const [data] = await pool.query(
            'SELECT * FROM kategori WHERE nama = ?',
            [nama]
        )

        res.status(200).json(new SuccessResponse("Success get category by name", data))
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

const createCategory = async (req, res) => {
    try {
        const { nama } = req.body

        if (!nama) {
            throw new Error("Nama kategori harus diisi")
        }

        const [result] = await pool.query(
            'INSERT INTO kategori (nama) VALUES (?)',
            [nama]
        )

        res.status(201).json(
            new SuccessResponse(
                "Success create category",
                {
                    id_kategori: result.insertId,
                    nama
                }
            )
        )
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

// Daftar kolom yang boleh diubah
const CATEGORY_COLUMNS = ['nama']

const editCategory = async (req, res) => {
    try {
        const { id } = req.params

        const columns = CATEGORY_COLUMNS.filter((column) => req.body[column] !== undefined)

        if (columns.length === 0) {
            throw new Error(`Minimal satu kolom harus diisi: ${CATEGORY_COLUMNS.join(', ')}`)
        }

        const setClause = columns.map((column) => `${column} = ?`).join(', ')
        const values = columns.map((column) => req.body[column])

        const [result] = await pool.query(
            `UPDATE kategori SET ${setClause} WHERE id_kategori = ?`,
            [...values, id]
        )

        if (result.affectedRows === 0) {
            throw new Error(`Kategori dengan id ${id} tidak ditemukan`)
        }

        const updatedData = { id_kategori: id }

        columns.forEach((column, index) => {
            updatedData[column] = values[index]
        })

        res.status(200).json(
            new SuccessResponse("Success update category", updatedData)
        )
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params

        const [result] = await pool.query(
            'DELETE FROM kategori WHERE id_kategori = ?',
            [id]
        )

        if (result.affectedRows === 0) {
            throw new Error(`Kategori dengan id ${id} tidak ditemukan`)
        }

        res.status(200).json(
            new SuccessResponse("Success delete category", { id_kategori: id })
        )
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

const getCategoryFilter = async (req, res) => {
    try {
        const { nama } = req.query

        const [data] = await pool.query(
            'SELECT * FROM kategori WHERE nama = ?',
            [nama]
        )

        res.status(200).json(
            new SuccessResponse("Success filter category", data)
        )
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

const getCategoryFilterById = async (req, res) => {
    try {
        const { id } = req.query

        const [data] = await pool.query(
            'SELECT * FROM kategori WHERE id_kategori = ?',
            [id]
        )

        res.status(200).json(
            new SuccessResponse("Success filter category by id", data)
        )
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}
// SORTING
const getCategorySorting = async (req, res) => {
    try {

        const { sort } = req.query

        let query = 'SELECT * FROM kategori'

        if (sort == 'asc') {
            query += ' ORDER BY nama ASC'
        } else if (sort == 'desc') {
            query += ' ORDER BY nama DESC'
        }

        const [data] = await pool.query(query)

        res.status(200).json(
            new SuccessResponse("Success sorting category", data)
        )

    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

// join kategori ke film
const getCategoryWithMovies = async (req, res) => {
    try {

        const [data] = await pool.query(`
            SELECT
                nama,
                film.judul
            FROM kategori
            JOIN film
            ON kategori.id_kategori = film.id_kategori
        `)

        res.status(200).json(
            new SuccessResponse("Success get category with movies", data)
        )

    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

const getCategoryMovieDirector = async (req, res) => {
    try {

        const [data] = await pool.query(`
            SELECT
                kategori.nama,
                film.judul,
                sutradara.nama AS sutradara
            FROM kategori
            JOIN film
            ON kategori.id_kategori = film.id_kategori
            JOIN sutradara
            ON film.id_sutradara = sutradara.id_sutradara
        `)

        res.status(200).json(
            new SuccessResponse("Success get category movie director", data)
        )

    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

const getCategoryMovieRating = async (req, res) => {
    try {

        const [data] = await pool.query(`
            SELECT
                kategori.nama,
                film.judul,
                rating.rating
            FROM kategori
            JOIN film
            ON kategori.id_kategori = film.id_kategori
            JOIN rating
            ON film.id_film = rating.id_film
        `)

        res.status(200).json(
            new SuccessResponse("Success get category movie rating", data)
        )

    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}


module.exports = {
    getAllCategories,
    getCategoryById,
    getCategoryByName,
    createCategory,
    editCategory,
    deleteCategory,
    getCategoryFilter,
    getCategoryById,
    getCategorySorting,
    getCategoryWithMovies,
    getCategoryMovieDirector,
    getCategoryMovieRating
}
    
