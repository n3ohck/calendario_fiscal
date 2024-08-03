// routes/events.js
const express = require('express');
const router = express.Router();
const connection = require('../config/mysql');
const sendmail = require('../utils/sendmail');

// Función para construir la consulta SQL con condiciones dinámicas
function buildQuery(params) {
    let baseQuery = 'SELECT id,title,description,tax_regime_id,image,status_event,year,month FROM events';
    let conditions = [];
    let queryParams = [];
    conditions.push('status = "activo"');
    conditions.push('deleted_at IS NULL');

    // Añadir condiciones dinámicas según los parámetros presentes
    if (params.tax_regime_id !== undefined) {
        conditions.push('tax_regime_id = ?');
        queryParams.push(params.tax_regime_id);
    }
    if (params.year !== undefined) {
        conditions.push('year = ?');
        queryParams.push(params.year);
    }
    if (params.month !== undefined) {
        conditions.push('month = ?');
        queryParams.push(params.month);
    }

    // Construir la cláusula WHERE si hay condiciones
    if (conditions.length > 0) {
        baseQuery += ' WHERE ' + conditions.join(' AND ');
    }
    return { query: baseQuery, params: queryParams };
}

const getDates = (id) => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT id, event_id, start_date, end_date, type FROM events_dates WHERE event_id = ?', [id], (error, results) => {
            if (error) reject(error);
            resolve(results);
        });
    });
};

const getEvents = (params) => {
    return new Promise((resolve, reject) => {
        const { query, params: queryParams } = buildQuery(params);
        connection.query(query, queryParams, (error, results) => {
            if (error) reject(error);
            resolve(results);
        });
    });
};

const createEvent = (params) => {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO events SET ?', params, (error, results) => {
            if (error) reject(error);
            params.id = results.insertId;
            notificate(params);
            resolve(results);
        });
    });

}

const notificate = (event) =>{
    connection.query('SELECT * FROM tax_payers WHERE tax_regime_id = ? and status = ?', [event.tax_regime_id, 'activo'], (error, results) => {
        if (error) reject(error);
        results.forEach(taxPayer => {
            sendmail.sendEmailEvent(taxPayer.email, 'Nuevo evento', event);
            connection.query('INSERT INTO event_tax_payer_notifications SET ?', {event_id: event.id, tax_payer_id: taxPayer.id, tax_regime_id: taxPayer.tax_regime_id});
        });
    });
}

router.get('/', async (req, res) => {
    try {
        const events = await getEvents(req.query);
        res.json(events);
    } catch (error) {
        res.status(500).send('Error fetching events');
    }
});

router.post('/', async (req, res) => {
    try {
        const events = await createEvent(req.body);
        res.json(events);
    } catch (error) {
        res.status(500).send('Error fetching events');
    }
});

module.exports = router;
