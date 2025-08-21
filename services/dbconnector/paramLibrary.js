// /services/dbconnector/paramLibrary.js

const sql = require('mssql');
const oracledb = require('oracledb');

/**
 * Formats query parameters based on their keys and types, specific to each database type.
 *
 * @param {Object} params - An object containing the parameters to format.
 * @returns {Promise<Object>} A promise that resolves with formatted parameters.
 */
async function formatQueryParams(params) {
    const { DB_TYPE } = process.env;
    let formattedParams = {};

    console.log(`Formatting query parameters for ${DB_TYPE.toUpperCase()}...`); // Debugging log
    console.log('Raw params:', params); // Log the raw parameters received

    switch (DB_TYPE.toUpperCase()) {
        case 'MSSQL':
            formattedParams = formatMSSQLParams(params);
            break;
        case 'ORACLE':
            formattedParams = formatOracleParams(params);
            break;
        case 'MARIADB':
            formattedParams = formatMariaDBParams(params);
            break;
        case 'POSTGRES':
            formattedParams = formatPostgresParams(params);
            break;
        default:
            throw new Error('Unsupported database type');
    }

    console.log('Formatted params:', formattedParams); // Log the formatted parameters
    return formattedParams;
}

/**
 * Formats query parameters for MSSQL.
 *
 * @param {Object} params - An object containing the parameters to format.
 * @returns {Object} Formatted parameters.
 */
function formatMSSQLParams(params) {
    const formattedParams = {};
    for (const key in params) {
        if (key === 'ID') {
            console.log(`Formatting ID: ${params[key]}`); // Debugging log
            formattedParams[key] = { type: sql.UniqueIdentifier, value: params[key] };
        } else if (
            ['Name', 'Description', 'Building', 'Owner', 'Role', 'Location', 'Route', 'Email', 'DisplayName', 'Team'].includes(key)
        ) {
            formattedParams[key] = { type: sql.NVarChar(255), value: params[key] };
        } else if (key === 'Username' || key === 'AuthenticatedUsername') {
            formattedParams[key] = { type: sql.NVarChar(50), value: params[key].toLowerCase() }; // Normalize to lowercase
        } else if (key === 'UITheme' || key === 'UITHeme') {
            formattedParams[key] = { type: sql.NVarChar(50), value: params[key] };
        } else if (['Bio', 'PasswordHash', 'Image', 'AvatarURL'].includes(key)) {
            formattedParams[key] = { type: sql.Text, value: params[key] };
        } else if (key === 'SQL_USER') {
            formattedParams[key] = { type: sql.Bit, value: params[key] }; // Support for bit data type
        } else if (typeof params[key] === 'string') {
            formattedParams[key] = { type: sql.NVarChar(255), value: params[key] };
        } else if (typeof params[key] === 'number') {
            formattedParams[key] = { type: sql.Int, value: params[key] };
        }
    }
    return formattedParams;
}

// ... rest of the file ...


/**
 * Formats query parameters for Oracle.
 *
 * @param {Object} params - An object containing the parameters to format.
 * @returns {Object} Formatted parameters.
 */
function formatOracleParams(params) {
    const formattedParams = {};
    for (const key in params) {
        if (key === 'ID') {
            formattedParams[key] = { type: oracledb.STRING, value: params[key] }; // UUID can be handled as a string
        } else if (
            ['Name', 'Description', 'Building', 'Owner', 'Role', 'Location', 'Route', 'Email', 'DisplayName', 'Team'].includes(key)
        ) {
            formattedParams[key] = { type: oracledb.STRING, value: params[key] };
        } else if (key === 'Username' || key === 'AuthenticatedUsername') {
            formattedParams[key] = { type: oracledb.STRING, value: params[key].toLowerCase() }; // Normalize to lowercase
        } else if (key === 'UITheme' || key === 'UITHeme') {
            formattedParams[key] = { type: oracledb.STRING, value: params[key] };
        } else if (['Bio', 'PasswordHash', 'Image', 'AvatarURL'].includes(key)) {
            formattedParams[key] = { type: oracledb.CLOB, value: params[key] };
        } else if (key === 'SQL_USER') {
            formattedParams[key] = { type: oracledb.BOOLEAN, value: params[key] }; // Support for bit data type
        } else if (typeof params[key] === 'string') {
            formattedParams[key] = { type: oracledb.STRING, value: params[key] };
        } else if (typeof params[key] === 'number') {
            formattedParams[key] = { type: oracledb.NUMBER, value: params[key] };
        }
    }
    return formattedParams;
}

/**
 * Formats query parameters for MariaDB.
 *
 * @param {Object} params - An object containing the parameters to format.
 * @returns {Object} Formatted parameters.
 */
function formatMariaDBParams(params) {
    const formattedParams = {};
    for (const key in params) {
        if (key === 'ID') {
            formattedParams[key] = { type: 'char', value: params[key] }; // UUID can be handled as a string
        } else if (
            ['Name', 'Description', 'Building', 'Owner', 'Role', 'Location', 'Route', 'Email', 'DisplayName', 'Team'].includes(key)
        ) {
            formattedParams[key] = { type: 'string', value: params[key] };
        } else if (key === 'Username' || key === 'AuthenticatedUsername') {
            formattedParams[key] = { type: 'string', value: params[key].toLowerCase() }; // Normalize to lowercase
        } else if (key === 'UITheme' || key === 'UITHeme') {
            formattedParams[key] = { type: 'string', value: params[key] };
        } else if (['Bio', 'PasswordHash', 'Image', 'AvatarURL'].includes(key)) {
            formattedParams[key] = { type: 'text', value: params[key] };
        } else if (key === 'SQL_USER') {
            formattedParams[key] = { type: 'boolean', value: params[key] }; // Support for bit data type
        } else if (typeof params[key] === 'string') {
            formattedParams[key] = { type: 'string', value: params[key] };
        } else if (typeof params[key] === 'number') {
            formattedParams[key] = { type: 'int', value: params[key] };
        }
    }
    return formattedParams;
}

/**
 * Formats query parameters for PostgreSQL.
 *
 * @param {Object} params - An object containing the parameters to format.
 * @returns {Object} Formatted parameters.
 */
function formatPostgresParams(params) {
    const formattedParams = {};
    for (const key in params) {
        if (key === 'ID') {
            formattedParams[key] = { type: 'uuid', value: params[key] };
        } else if (
            ['Name', 'Description', 'Building', 'Owner', 'Role', 'Location', 'Route', 'Email', 'DisplayName', 'Team'].includes(key)
        ) {
            formattedParams[key] = { type: 'varchar', value: params[key] };
        } else if (key === 'Username' || key === 'AuthenticatedUsername') {
            formattedParams[key] = { type: 'varchar', value: params[key].toLowerCase() }; // Normalize to lowercase
        } else if (key === 'UITheme' || key === 'UITHeme') {
            formattedParams[key] = { type: 'varchar', value: params[key] };
        } else if (['Bio', 'PasswordHash', 'Image', 'AvatarURL'].includes(key)) {
            formattedParams[key] = { type: 'text', value: params[key] };
        } else if (key === 'SQL_USER') {
            formattedParams[key] = { type: 'boolean', value: params[key] }; // Support for bit data type
        } else if (typeof params[key] === 'string') {
            formattedParams[key] = { type: 'varchar', value: params[key] };
        } else if (typeof params[key] === 'number') {
            formattedParams[key] = { type: 'int', value: params[key] };
        }
    }
    return formattedParams;
}

module.exports = { formatQueryParams };
