const { Pool } = require("pg")
    /*
    const cs = "postgres://postgres:bips@localhost:5432/bips_bd";
    const client = new pg.Client(cs);
    client.connect();
    */

// Coloca aquí tus credenciales

const pool = new Pool({
    user: "postgres",
    host: "127.0.0.1",
    database: "bips_bd",
    password: "bipsbd",
    port: 5432,
});
module.exports = pool;