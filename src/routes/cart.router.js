const { Router } = require('express');
const CartManager = require('../cartManager');
const ProductManager = require('../productManager');

const router = Router();
const cartManager = new CartManager(`${__dirname}/../../assets/cart.json`);
const productManager = new ProductManager(`${__dirname}/../../assets/products.json`);

router.post('/', async (req, res) => {
    try {
        const cartId = await cartManager.createCart();
        res.status(201).json({ id: cartId });
    } catch (error) {
        console.error('Error al crear el carrito:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const cart = await cartManager.getCartById(cartId);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);
        const quantity = parseInt(req.body.quantity); 
        const product = await productManager.getProductById(productId); 
        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }
        const success = await cartManager.addProductToCart(cartId, productId, quantity);
        if (success) {
            res.json({ message: 'Producto agregado al carrito correctamente' });
        } else {
            res.status(404).send('Producto o carrito no encontrado');
        }
    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
        res.status(500).send('Error interno del servidor');
    }
});

module.exports = router;
