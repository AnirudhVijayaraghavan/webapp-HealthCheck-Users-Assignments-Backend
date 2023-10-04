console.log("Starting program.")
// const flag = require('./databasepg')
const nodemon = require('nodemon');
const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000; // Connects to localhost:3000

const csvParser = require('csv-parser');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const { Sequelize, DataTypes } = require('sequelize');
// const pool = new Pool({
//   host: "localhost",
//   user: "postgres",
//   port: 5432,
//   password: "900900",
//   database: "test"
// });

// The following query was used to create the ACCOUNT table.
// CREATE TABLE IF NOT EXISTS ACCOUNT (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),first_name VARCHAR(255) NOT NULL, last_name VARCHAR(255) NOT NULL,  password VARCHAR(255) NOT NULL,  email VARCHAR(255) NOT NULL UNIQUE,  account_created TIMESTAMP DEFAULT NOW(),  account_updated TIMESTAMP DEFAULT NOW());
// The following query was used to create the ASSIGNMENT table.
// CREATE TABLE IF NOT EXISTS ASSIGNMENT (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),name VARCHAR(255) NOT NULL,points NUMERIC(5, 2) NOT NULL CHECK (points >= 1 AND points <= 100),num_of_attempts INT NOT NULL CHECK (num_of_attempts >= 1 AND num_of_attempts <= 100),deadline TIMESTAMP WITH TIME ZONE NOT NULL,assignment_created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,assignment_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP);


const sequelize = new Sequelize({
  dialect: "postgres",
  host: "localhost",
  database: "test",
  username: "postgres",
  password: "900900"
});
const Account = sequelize.define('Account', {
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  createdAt: {
    field: 'account_created',
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    field: 'account_updated',
    allowNull: false,
    type: DataTypes.DATE
  }
}, {
  tableName: 'account', // Specify the correct table name here
});

// Middleware to parse JSON requests
app.use(express.json());

// Load user data from CSV file at startup and insert into the database
fs.createReadStream('opt/users.csv')
  .pipe(csvParser())
  .on('data', async (row) => {
    //Finding existing user : 
    const existingUser = await Account.findOne({ where: { email: row.email } });

    if (!existingUser) {
      // Hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(row.password, 10);

      // Insert user data into the database
      try {
        await Account.create({
          first_name: row.first_name,
          last_name: row.last_name,
          password: hashedPassword,
          email: row.email,
        });
      } catch (error) {
        console.error(error);
      }
    }
  })
  .on('end', () => {
    console.log('CSV file loaded.');
  });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
