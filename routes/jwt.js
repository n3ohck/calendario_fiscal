// routes/events.js
const express = require('express');
require('dotenv').config();

const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) return res.sendStatus(403);

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);

        req.user = user;
        next();
    });
};
module.exports = {authenticateJWT};
