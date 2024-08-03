// index.js
require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const eventsRouter = require('./routes/events');
const taxRegimensRouter = require('./routes/taxRegimens');
const taxPayersRouter = require('./routes/taxPayers');
const testEmailRouter = require('./routes/tests');
const authenticateJWT = require('./routes/jwt');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json()); // Middleware para parsear cuerpos JSON

// Usa el grupo de rutas para /api/events
app.use('/api/sat/events', eventsRouter);
app.use('/api/sat/tax_regimens', taxRegimensRouter);
app.use('/api/suscribe', taxPayersRouter);
app.use('/api/unsuscribe', taxPayersRouter);
app.use('/api/test', testEmailRouter);

app.get('/api', (req, res) => {
    res.send({ message: 'Hello from the server!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
