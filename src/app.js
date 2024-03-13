const express = require('express');
const http = require('http');
const productsRouter = require('./routes/products.router.js');
const cartsRouter = require('./routes/cart.router.js');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io');
const homeRouter = require('./routes/home.router');
const realTimeProductsRouter = require('./routes/realTimeProducts.router')

const app = express();
const server = http.createServer(app); 

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use(express.static(`${__dirname}/../public`));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.use('/api/home', homeRouter)
app.use('/api/realTimeProducts', realTimeProductsRouter)

const PORT = process.env.PORT || 8080;

const wsServer = new Server(server); 
app.set('ws', wsServer)

wsServer.on('connection', (socket) => {
    console.log('Nuevo cliente conectado via WebSocket');
})

server.listen(PORT, () => {
    console.log(`Servidor cargado en el puerto ${PORT}!`);
});
