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
