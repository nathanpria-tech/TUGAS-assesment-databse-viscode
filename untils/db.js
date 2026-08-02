const mysql = require('mysql2/promise')
const database = require('mime-db')
const pool = mysql.createPool({
    host:process.env.DB_HOST,
    port:process.env.DB_PORT_MYSQL,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_DATABASED
})

async function getpool() {
    const connection = await pool.getConnection()
    connection.release()
    console.log("yeyy connected to MYSQL")
    return pool
}


module.exports ={
    pool,
    getpool
}