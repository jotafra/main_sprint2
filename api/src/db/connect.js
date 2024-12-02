const mysql = require('mysql2');//Importa o mysql

const pool = mysql.createPool({
    connectionLimit:10,
    host:'10.89.240.74',
    user:'alunods',
    password:'senai@604',
    database:'vio_reservas'
});

module.exports = pool;//Para usar o mysql