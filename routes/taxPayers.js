// routes/taxPayers.js
const express = require('express');
const router = express.Router();
const connection = require('../config/mysql');

const checkEmailExists = (email) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT id FROM tax_payers WHERE email = ?';
        connection.query(query, [email], (error, results) => {
            if (error) return reject(error);
            resolve(results.length > 0);
        });
    });
};

const checkTaxRegimeExists = (taxRegimeId) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT id FROM tax_regimens WHERE id = ?';
        connection.query(query, [taxRegimeId], (error, results) => {
            if (error) return reject(error);
            resolve(results.length > 0);
        });
    });
};

const setSuscribe = async (params) => {
    return new Promise(async (resolve, reject) => {
        if (params.email === undefined || params.taxRegimeId === undefined) {
            return reject('Email and taxRegimeId are required');
        }
        try {
            // Verificar si el régimen fiscal existe
            const taxRegimeExists = await checkTaxRegimeExists(params.taxRegimeId);
            if (!taxRegimeExists) {
                return reject('The tax regime does not exist');
            }

            // Verificar si el correo electrónico ya está registrado
            const emailExists = await checkEmailExists(params.email);
            if (emailExists) {
                return reject('The email is already registered');
            }

            //Si es valido, proceder con la inserción
            const query = 'INSERT INTO tax_payers (email, tax_regime_id) VALUES (?, ?)';
            const values = [params.email, params.taxRegimeId];
            connection.query(query, values, (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        } catch (error) {
            reject(error);
        }
    });
};

const unSuscribe = (params) => {
    return new Promise((resolve, reject) => {
        if( params.id === undefined ){
            reject('Id are required');
        }

        const query = 'UPDATE tax_payers SET status = "suspendido" WHERE id = ?';
        const id = params.id;
        const values = [id];
        connection.query(query, values, (error, results) => {
            if (error) throw error;
            resolve(results);
        });
    });
};

router.post('/', async (req, res) => {
    try {
        const taxPayers = await setSuscribe(req.body);
        res.json(taxPayers);
    } catch (error) {
        res.status(500).send('Error fetching events');
    }
});

router.put('/', async (req, res) => {
    try {
        const taxPayers = await unSuscribe(req.body);
        res.json(taxPayers);
    } catch (error) {
        res.status(500).send('Error fetching events');
    }
});

module.exports = router;
