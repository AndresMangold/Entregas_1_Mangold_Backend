const express = require('express');
const http = require('http');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo'); 
const session = require('express-session');
const cookieParser = require('cookie-parser');
const ProductManager = require('./dao/dbManagers/productManager')
const passport = require('passport');


const { dbName, mongoUrl } = require('./dbConfig')
const sessionMiddleware = require('./session/mongoStorage')

const createProductRouter = require('./routes/createProduct.router');
const productsRouter = require('./routes/products.router')
const cartRouter = require('./routes/cart.router')

const app = express();
const middleware = require('./middlewares/auth.middleware');
const CartManager = require('./dao/dbManagers/CartManager');
const sessionRouter = require('./routes/session.router'); 

app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')

app.use(sessionMiddleware)

app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 
app.use(express.static(`${__dirname}/../public`))
app.use(express.static('public'));

const inicializeStrategy = require('./config/passport.config');
const inicializeStrategyWGitH = require('./config/passport-github.config');
inicializeStrategy();
inicializeStrategyWGitH();

app.use(cookieParser());
app.use(session({
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://andresmangold:andresPass@cluster0.hrz9nqj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
        ttl: 15,
    }),
    secret: "adminCod3r123",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', sessionRouter);

app.use('/api/createProduct', createProductRouter);
app.use('/api/products', productsRouter); 
app.use('/api/cart', cartRouter);
app.use('/', require('./routes/views.router'))

app.set('productManager', new ProductManager());
app.set('cartManager', new CartManager());


const server = http.createServer(app);
const PORT = process.env.PORT || 8080;

const main = async () => {
    try {
        await mongoose.connect(mongoUrl, {
            dbName: dbName
        });

        server.listen(PORT, () => {
            console.log('Servidor cargado!');
            console.log(`http://localhost:${PORT}/api/products`);
        });

    } catch (error) {
        console.error('Error al conectar con la base de datos:', error);
    }
};

main();
