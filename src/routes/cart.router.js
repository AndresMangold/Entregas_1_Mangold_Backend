const { Router } = require('express'); 
const router = Router(); 

router.get('/', async (req, res) => {
    try {
        const cartManager = req.app.get('cartManager');
        const carts = await cartManager.getCarts(); 
        res.status(200).json(carts); 
    } catch {
        res.status(500).json({ error: 'No se pudo conectar con los carritos' }); 
    }
});

router.post('/', async (req, res) => {
    try {
        const cartManager = req.app.get('cartManager');
        const cart = await cartManager.addCart(); 
        res.status(200).json({ message: 'Carrito creado con éxito', cart }); 
    } catch {
        res.status(500).json({ error: 'No se pudo crear el carrito' }); 
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid; 
        const cartManager = req.app.get('cartManager');
        const cart = await cartManager.getCartById(cartId); 
        res.status(200).json(cart); 
    } catch {
        res.status(500).json({ error: 'Hubo un problema al conectar con el servidor' }); 
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid; 
        const productId = req.params.pid; 
        const cartManager = req.app.get('cartManager');
        const updatedCart = await cartManager.addProductToCart(productId, cartId); 
        res.status(200).json(updatedCart); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ Error: error.message }); 
    }
});

module.exports = router; 