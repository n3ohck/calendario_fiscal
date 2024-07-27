// routes/events.js
const express = require('express');
const router = express.Router();
const connection = require('../config/mysql');

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

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
        queryParams.push(escapeHtml(params.tax_regime_id));
    }
    if (params.year !== undefined) {
        conditions.push('year = ?');
        queryParams.push(escapeHtml(params.year));
    }
    if (params.month !== undefined) {
        conditions.push('month = ?');
        queryParams.push(escapeHtml(params.month));
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
            if( results.length ){
                results = results.map(event => {
                    event.dates = getDates(event.id);
                    return event;
                });
            }
            resolve(results);
        });
    });
};

router.get('/', async (req, res) => {
    try {
        const events = await getEvents(req.query);
        res.json(events);
    } catch (error) {
        res.status(500).send('Error fetching events');
    }
});

module.exports = router;
