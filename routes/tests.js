// routes/events.js
const express = require('express');
const router = express.Router();
const sendmail = require('../utils/sendmail');

// Función para construir la consulta SQL con condiciones dinámicas
const test = (params) => {
    return sendmail.sendEmail(params.email,'Test', { name: params.name });
};

router.post('/', async (req, res) => {
    try {
        const testResponse = test(req.body);
        res.status(200).send('Email sent');
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
