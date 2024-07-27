// routes/taxPayers.js
const express = require('express');
const router = express.Router();
const connection = require('../config/mysql');
const sendmail = require('../utils/sendmail');

const checkEmailExists = async (email) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT id FROM tax_payers WHERE email = ?';
        connection.query(query, [email], (error, results) => {
            if (error) return reject(error);
            resolve(results.length > 0);
        });
    });
};

const checkTaxRegimeExists = async (taxRegimeId) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT id FROM tax_regimens WHERE id = ?';
        connection.query(query, [taxRegimeId], (error, results) => {
            if (error) return reject(error);
            resolve(results.length > 0);
        });
    });
};

const setSuscribe = async (params) => {
    if (params.email === undefined || params.taxRegimeId === undefined) {
        throw new Error('Email and taxRegimeId are required');
    }
    try {
        // Verificar si el régimen fiscal existe
        const taxRegimeExists = await checkTaxRegimeExists(params.taxRegimeId);
        if (!taxRegimeExists) {
            throw new Error('The tax regime does not exist');
        }

        // Verificar si el correo electrónico ya está registrado
        const emailExists = await checkEmailExists(params.email);
        if (emailExists) {
            throw new Error('The email is already registered');
        }

        // Si es válido, proceder con la inserción
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO tax_payers (email, tax_regime_id) VALUES (?, ?)';
            const values = [params.email, params.taxRegimeId];
            connection.query(query, values, (error, results) => {
                if (error) return reject(error);
                sendEmail(params.email, 'Registro SAT', { email: params.email });
                resolve(results);
            });
        });
    } catch (error) {
        throw error;
    }
};

const unSuscribe = (params) => {
    return new Promise((resolve, reject) => {
        if (params.id === undefined) {
            reject('Id is required');
        }

        const query = 'UPDATE tax_payers SET status = "suspendido" WHERE id = ?';
        const values = [params.id];
        connection.query(query, values, (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};

router.post('/', async (req, res) => {
    try {
        const taxPayers = await setSuscribe(req.body);
        res.json(taxPayers);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.put('/', async (req, res) => {
    try {
        const taxPayers = await unSuscribe(req.body);
        res.json(taxPayers);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;