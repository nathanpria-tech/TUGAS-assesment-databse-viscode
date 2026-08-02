require('dotenv').config({quiet:true})
const express = require('express')
const app = express()
const PORT = 3000




// buat imporr
const {getpool} = require ('./untils/db')
const movieRouter = require('./router/movie.routes')
const kategoriRouter = require('./router/kategori.routes')
const ratingRouter = require('./router/rating.routes')
app.use(express.json())
app.get('/',(req,res) => {
res.status(200).json({ status: "Healthcheck route: Safe" })
})
// router
app.use('/movie',movieRouter)
app.use('/kategori',kategoriRouter)
app.use('/rating',ratingRouter)

getpool()
.then(() => {
    app.listen(PORT, () => {
        console.log(`yahoo API Running at PORT: ${PORT}!`)
    })
})
.catch((err) => {
    console.log(err)
}) 
