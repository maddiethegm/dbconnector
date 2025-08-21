// /services/dbconnector/connectionManager.js

require('dotenv').config();
const sql = require('mssql');
const oracledb = require('oracledb');
const mysql = require('mysql2/promise');
const { Client } = require('pg');

/**
 * Gets a connection based on the configured database type.
 *
 * @returns {Promise<Object>} A promise that resolves with the database connection.
 */
async function getConnection() {
    const dbType = process.env.DB_TYPE;
    const config = getDBConfig(dbType);

    switch (dbType) {
        case 'MSSQL':
            return await sql.connect(config);
        case 'ORACLE':
            return await oracledb.getConnection(config);
        case 'MARIADB':
            return await mysql.createConnection(config);
        case 'POSTGRES':
            const client = new Client(config);
            await client.connect();
            return client;
        default:
            throw new Error('Unsupported database type');
    }
}

/**
 * Fetches the configuration for a specified database type from environment variables.
 *
 * @param {string} dbType - Type of database (e.g., 'MSSQL', 'ORACLE').
 * @returns {Object} The database configuration object.
 */
function getDBConfig(dbType) {
    switch (dbType) {
        case 'MSSQL':
            return {
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                server: process.env.DB_SERVER,
                database: process.env.DB_DATABASE,
                options: {
                    encrypt: true, // for secure connection
                    trustServerCertificate: process.env.DB_TRUST_CERT
                }
            };
        case 'ORACLE':
            return {
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                connectString: process.env.ORACLE_CONNECTION_STRING
            };
        case 'MARIADB':
            return {
                host: process.env.DB_SERVER,
                port: parseInt(process.env.DB_PORT, 10) || 3006,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE,
                namedPlaceholders: true
            };
        case 'POSTGRES':
            return {
                host: process.env.DB_SERVER,
                port: parseInt(process.env.DB_PORT, 10) || 5432,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE
            };
        default:
            throw new Error('Unsupported database type');
    }
}

module.exports = { getConnection };
