const express = require('express');
const productsRouter = require('./routes/products.router.js');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/products', productsRouter);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Servidor cargado en el puerto 8080!`);
});

module.exports = app;
