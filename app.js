const express = require('express');
const formData = require('express-form-data');

require('dotenv').config();
const cors = require('cors');


const routes = require('./routes');
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
//
// Додайте middleware для обробки форм-дати
app.use(formData.parse());

// Додайте middleware для обробки файли
app.use(formData.format());
app.use(formData.stream());
app.use(formData.union());
app.use(routes);
//

module.exports = app;
