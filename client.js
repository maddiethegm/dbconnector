// client.js

const axios = require('axios');
const generateUUID = require('uuid').v4;
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

// Example usage:
(async () => {
    // CREATE: Ensure all required fields are present
    const ID1 = generateUUID();
    const ID2 = generateUUID();
    const ID3 = generateUUID();
    const ID4 = generateUUID();

    await testQuery('Test', 'CREATE', { 
        Name: 'Test Item',
        Text: 'A sample item created with ID: ' + ID1,
        ID: ID1, // Assuming an ID is needed for identification or to prevent conflicts
        // Add other necessary fields here based on your schema
    });
    await testQuery('Test', 'CREATE', { 
        Name: 'Test Item',
        Text: 'A sample item created with ID: ' + ID2,
        ID: ID2, // Assuming an ID is needed for identification or to prevent conflicts
        // Add other necessary fields here based on your schema
    });
    await testQuery('Test', 'CREATE', { 
        Name: 'Test Item',
        Text: 'A sample item created wth ID: ' + ID3,
        ID: ID3, // Assuming an ID is needed for identification or to prevent conflicts
        // Add other necessary fields here based on your schema
    });
    await testQuery('Test', 'CREATE', { 
        Name: 'Test Item',
        Text: 'A sample item created with ID: ' + ID4,
        ID: ID4, // Assuming an ID is needed for identification or to prevent conflicts
        // Add other necessary fields here based on your schema
    });

    // UPDATE: Ensure both the ID and at least one field to update are present. ID must be the LAST field.
    await testQuery('Test', 'UPDATE', {
        Name: 'Tested item name',  
        Text: 'Updated item text successfully for item: ' + ID2,
        ID: ID2
    });

    // READ: Ensure the ID is present
    await testQuery('Test', 'READ', {
        ID : ID1
    } );

    // READ: See all rows in a table
    await testQuery('Test', 'READ', {
        Name: 'Tested item name',
    });

    // READ: See all rows in a table
    await testQuery('Test', 'READ', {
        partialMatch: true,
        Name: 'Test',
    });


    // DELETE: Ensure the ID is present
    await testQuery('Test', 'DELETE', { 
        ID: ID3
    });
/*
    // COMPARE: Ensure both compareTable and idField are present
    const compareParams = {
        compareTable: 'Test2',
        idField: 'ID',
        ID: '1'
    };
    await testQuery('Test', 'COMPARE', compareParams);*/
})();
