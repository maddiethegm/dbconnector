## JS DB Connector Service Guide
This set of modules is intended to serve as a general purpose toolkit for building Node.js applications with a database-type agnostic SQL backend. The audience at creation is myself, as I wanted a reusable module for communicating with my SQL backends in Node.js projects.

## Features
At the moment, CRUD operations against Microsoft SQL Server and MariaDB servers are supported. I plan to implement support for interoperability with Postgres, Oracle, and MongoDB as well to provide the most possible utility in this package. An example implementation is available in the included server.js:

```javascript
// server.js

require('dotenv').config();
const express = require('express');
const app = express();
const queryExecutor = require('./services/dbconnector/queryExecutor');
const cors = require('cors');

app.use(express.json());
app.use(cors());
/**
 * Example route to demonstrate CRUD operations.
 */
app.post('/api/query', async (req, res) => {
    try {
        const { table, operation, params } = req.body;
        const result = await queryExecutor.executeQuery(table, operation, params);
        res.status(200).json(result);
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3100;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
```

Additionally, the script `client.js` which runs simulated interactions with the server.js contains the following example for a request to the sample API route:

```javascript
async function testQuery(table, operation, params) {
    try {
        const response = await axios.post('http://localhost:3100/api/query', {
            table,
            operation,
            params
        });
        console.log(response.data);
    } catch (error) {
        console.error('Error executing query:', error.response ? error.response.data : error.message);
    }
}
...
    const ID = generateUUID();
    await testQuery('Test', 'CREATE', { 
        Name: 'Test Item',
        Text: 'A sample item created with ID: ' + ID,
        ID: ID
        // Add other necessary fields here based on your schema
    });
```

The following environment variables are used to control the operation of the DB connector:
```
DB_USER= # A user with permissions to manage the database
DB_PASSWORD= # Password for DB_USER
DB_SERVER= # Hostname or IP of the database server
DB_PORT= # Port if not using default for the database type
DB_DATABASE= # Database to be used. As written, only a single database is supported
DB_TYPE= # MSSQL and MARIADB are implemented. ORACLEDB and POSTGRES are planned.
DB_TRUST_CERT= # Trust the local system SSL certificate, useful for developing against MSSQL server. 
```

## Testing

To test the function of these modules, run "node server.js" in the project root, and post to http://localhost:3100/api/query. You can instead run client.js to automatically attempt each query type against the default server URL.