// routes/events.js
const express = require('express');
const router = express.Router();
const connection = require('../config/mysql');

const getEvents = () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM events', (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
};

router.get('/', async (req, res) => {
    try {
        const events = await getEvents();
        res.json(events);
    } catch (error) {
        res.status(500).send('Error fetching events');
    }
});

module.exports = router;
