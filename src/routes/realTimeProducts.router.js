const { Router } = require('express');
const router = Router();
const ProductManager = require('../productManager');

const manager = new ProductManager(`${__dirname}/../../assets/products.json`);

router.get('/', async (_, res) => {
    try {
        const products = await manager.getProducts();

        const productsData = products.map(product => ({
            title: product.title,
            thumbnail: product.thumbnail,
            description: product.description,
            price: product.price,
            stock: product.stock,
            code: product.code,
            id: product.id
        }));

        res.render('realTimeProducts', {
            products: productsData,
            titlePage: 'Productos',
            h1: 'Tienda',
            style: ['styles.css'],
            script: ['realTimeProducts.js'],
            useWS: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

router.post('/', async (req, res) => {
    try {

        const { title, description, price, thumbnail, code, status, stock } = req.body;

        const newProduct = { title, description, price, thumbnail, code, status, stock };

        await manager.addProduct(title, description, price, thumbnail, code, status, stock);

        if (newProduct.title && newProduct.description && newProduct.price && newProduct.code && newProduct.stock) {
            req.app.get('ws').emit('newProduct', newProduct);
        }

        res.status(301).redirect('/api/realTimeProducts');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

router.delete('/:pid', async (req, res) => {
    try {

        const productId = parseInt(req.params.pid);

        await manager.deleteProduct(productId);

        const products = await manager.getProducts();

        req.app.get('ws').emit('updateFeed', products);

        res.status(301).redirect('/realTimeProducts');
    } catch {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

module.exports = router;