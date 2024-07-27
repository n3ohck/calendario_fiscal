// index.js
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;

app.get('/hello', (req, res) => {
    res.send({ message: 'Hello from the server!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
