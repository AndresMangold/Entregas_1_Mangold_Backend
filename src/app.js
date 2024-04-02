const express = require('express');
const http = require('http');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io');
const mongoose = require('mongoose');

const productsRouter = require('./routes/products.router');
const cartRouter = require('./routes/cart.router');
const createProductRouter = require('./routes/createProduct.router');
const chatRouter = require('./routes/chat.router');

const ProductManager = require('./dao/dbManagers/ProductManager');
const CartManager = require('./dao/dbManagers/CartManager');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use(express.static(`${__dirname}/../public`));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/createProduct', createProductRouter);
app.use('/api/chat', chatRouter);

const PORT = process.env.PORT || 8080;

const main = async () => {
    try {
        await mongoose.connect('mongodb+srv://andresmangold:andresPass@cluster0.hrz9nqj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
            dbName: 'ecommerce'
        });

        const productManager = new ProductManager();
        await productManager.prepare();
        app.set('productManager', productManager);

        const cartManager = new CartManager();
        await cartManager.prepare();
        app.set('cartManager', cartManager);

        io.on('connection', (clientSocket) => {
            console.log('Nuevo cliente conectado via WebSocket');

            clientSocket.on('message', (data) => {
                io.emit('message', data);
            });
        });

        server.listen(PORT, () => {
            console.log(`Servidor cargado en el puerto ${PORT}!`);
        });
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error);
    }
};

main();
