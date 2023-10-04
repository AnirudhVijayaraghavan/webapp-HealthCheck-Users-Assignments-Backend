console.log("Starting program.")
// const flag = require('./databasepg')
const express = require('express');
const nodemon = require('nodemon');
const app = express();
const port = 3000; // Connects to localhost:3000

//
const { Pool } = require('pg');


async function checkDatabaseConnection() {
  // The object below has the postgres test DB credentials / configurations. Port : 5432, name : test, user : postgres.
  const dbConfig = {
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "900900",
    database: "test"
  };
  const pool = new Pool(dbConfig);


  try {
    // The line below connects to the main test postgres DB.
    const client = await pool.connect();
    // Releases the resource on successful connection.
    client.release();
    return true;
  } catch (error) {
    //console.error('Database connection error:', error);
    return false;
  } finally {
    pool.end();
  }

}
//aDaDaD@131313a
//C:\Users\aniru/.ssh/id_rsa
//SHA256:4r1PH9x3EYM9kI1gV16Y8/V1fxWvaQr6FxZiJ1AM+VA aniru@Anirudh

//ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDSEvxhX6As9BtcMwYq8uhMi06Limf+gI39ug16TXspvgl3Jeb8eZ9oENmsSWX5bam/3tNKBtuRdhEV1cp8Sm1rGvfaspr8L2h9vOvGDzF0oLbggC0e81EoOON3JGnQ2irMHdDqnVx8GK7pJloJQMtgcuy+teHvTtkjF0wkOuk+THNEsi4+RbaGkGV+nXSSROkaZWbNCY5JOufmk99eVN2q+yXwBnYKBLUWFHH0m2RgDn9jTUMq9TiCv26U/OU3ndKqrtYmcxFRkHLVzcA6pcbYhR91I8g4CdcpGXKDXhuLEVlpbcVsUWTC94suvuzn8rXfZz4jz+SMddcOQN8bNFPVLYahK6UqHpHGko2A8ajwYpcxoC89d5nyXbvfYJ9aH+P7bnCAQgmuE3tx2rAhocPUt5+S2pnZaFJBzZKWEjC8IpFJ7rEJUqEfWjfC+YIPocZGnLJtkLptr6JOl7kEK45i27YaQWEMov9dvee60mpyGHuqbrPEYO4y9oOkyZkpFmc= aniru@Anirudh
//echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDSEvxhX6As9BtcMwYq8uhMi06Limf+gI39ug16TXspvgl3Jeb8eZ9oENmsSWX5bam/3tNKBtuRdhEV1cp8Sm1rGvfaspr8L2h9vOvGDzF0oLbggC0e81EoOON3JGnQ2irMHdDqnVx8GK7pJloJQMtgcuy+teHvTtkjF0wkOuk+THNEsi4+RbaGkGV+nXSSROkaZWbNCY5JOufmk99eVN2q+yXwBnYKBLUWFHH0m2RgDn9jTUMq9TiCv26U/OU3ndKqrtYmcxFRkHLVzcA6pcbYhR91I8g4CdcpGXKDXhuLEVlpbcVsUWTC94suvuzn8rXfZz4jz+SMddcOQN8bNFPVLYahK6UqHpHGko2A8ajwYpcxoC89d5nyXbvfYJ9aH+P7bnCAQgmuE3tx2rAhocPUt5+S2pnZaFJBzZKWEjC8IpFJ7rEJUqEfWjfC+YIPocZGnLJtkLptr6JOl7kEK45i27YaQWEMov9dvee60mpyGHuqbrPEYO4y9oOkyZkpFmc= aniru@Anirudh" >> ~/.ssh/authorized_keys



// Adds the Cache-control on the Header.
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache');
  console.log(req.body)
  if (req.body != undefined) {
    
    res.status(400).send();
    console.log("400")
  } else {
    // If it's not a GET request or if there's no payload, continue processing
    next();
  }
  // next();
});

// Health check endpoint
app.get('/healthz', (req, res) => {
  // Simulate a database connection check (replace with your own logic)
  const isDBConnected = checkDatabaseConnection();
  let flag = isDBConnected.then((result) => {
    //console.log(result); // "Promise resolved"
    if (result) {
      res.status(200).send();
      console.log("200")
    } else {
      res.status(503).send();
      console.log("503");
    }
  })
});
// The following code handles all other HTTP requests. Sends 405.
app.all('/healthz', (req, res) => {
  res.status(405).send();
  console.log("405");
});


// Starts the server, on port 3000.
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Instructions for starting in terminal :
// npm init -y
// npm install express lodash pg nodemon
// npm start

// Instructions for cmd (postgres) :
// Run CMD as administrator
// pg_ctl -D "C:\Program Files\PostgreSQL\16\data" stop
// pg_ctl -D "C:\Program Files\PostgreSQL\16\data" start