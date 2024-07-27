// index.js
require('dotenv').config();
const express = require('express');
const connection = require('./config/mysql');
const eventsRouter = require('./routes/events');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware para parsear cuerpos JSON

// Usa el grupo de rutas para /api/events
app.use('/api/sat/events', eventsRouter);

app.get('/api', (req, res) => {
    res.send({ message: 'Hello from the server!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
