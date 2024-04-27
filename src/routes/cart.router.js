const { Router } = require('express'); 
const router = Router();
const { userisLoggedIn } = require('../middlewares/auth.middleware') 


router.get('/', userisLoggedIn, async (req, res) => {
    try {
        const cartManager = req.app.get('cartManager');
        const carts = await cartManager.getCarts(); 

        const cartsData = carts.map(c => ({
            id: c.id,
            quantity: c.products.length
        }));

        res.status(200).render('carts', {
            carts: cartsData,
            titlePage: 'Carritos',
            style: ['styles.css'],
            isLoggedIn: req.session.user !== undefined, 
        }); 
    } catch {
        res.status(500).json({ error: 'No se pudo conectar con los carritos' }); 
    }
});


router.get('/:cid', userisLoggedIn, async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cartManager = req.app.get('cartManager');
        const cart = await cartManager.getCartById(cartId);

        const cartData = {
            id: cart.id,
            products: cart.products.map(p => ({
                productId: p.product.id,
                title: p.product.title,
                code: p.product.code,
                quantity: p.quantity
            }))
        };

        const isLoggedIn = req.user ? true : false;

        res.status(200).render('cart', {
            cart: cartData,
            titlePage: 'Carrito',
            style: ['styles.css'],
            isLoggedIn: req.session.user !== undefined,
        });
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});


router.put('/:cid', userisLoggedIn, async (req, res) => {
    try {
        const cartId = req.params.cid; 
        const { products } = req.body;
        const cartManager = req.app.get('cartManager');
        await cartManager.updateCart(cartId, products);
        res.status(200).json({ message: 'Carrito actualizado correctamente.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.post('/', userisLoggedIn, async (req, res) => {
    try {
        const cartManager = req.app.get('cartManager');
        const cart = await cartManager.addCart(); 
        res.status(200).json({ message: 'Carrito creado con éxito', cart }); 
    } catch {
        res.status(500).json({ error: 'No se pudo crear el carrito' }); 
    }
});

router.post('/:cid/product/:pid', userisLoggedIn, async (req, res) => {
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

router.put('/:cid/product/:pid', userisLoggedIn, async (req, res) => {
    try {
        const cartId = req.params.cid; 
        const productId = req.params.pid; 
        const { quantity } = req.body;
        const cartManager = req.app.get('cartManager');
        await cartManager.updateProductQuantityFromCart(productId, cartId, quantity);
        res.status(301).redirect('/api/cart');
    } catch (err) {
        res.status(500).json({ Error: err.message })
    }
});


router.delete('/:cid/product/:pid', userisLoggedIn, async (req, res) => {
    try {
        const cartId = req.params.cid; 
        const productId = req.params.pid; 
        const cartManager = req.app.get('cartManager');
        await cartManager.deleteProductFromCart(productId, cartId);
        res.status(301).redirect('/api/cart')
    } catch (err) {
        res.status(500).json({ Error: err.message })
    }
});


router.delete('/:cid', userisLoggedIn, async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cartManager = req.app.get('cartManager');
        await cartManager.clearCart(cartId);
        res.status(301).redirect('/api/cart');
    } catch (err) {
        res.status(500).json({ Error: err.message })
    }
})

module.exports = router; 