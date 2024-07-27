// routes/events.js
const express = require('express');
const router = express.Router();
const connection = require('../config/mysql');

const getTaxRegimens = () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT id,key_name,description FROM tax_regimens WHERE deleted_at IS NULL ORDER BY key_name ASC', (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
};

router.get('/', async (req, res) => {
    try {
        const taxRegimens = await getTaxRegimens();
        res.json(taxRegimens);
    } catch (error) {
        res.status(500).send('Error fetching tax regimens');
    }
});

module.exports = router;
