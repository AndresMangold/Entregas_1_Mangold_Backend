const { Router } = require('express');
const router = Router();
const { userisLoggedIn } = require('../middlewares/auth.middleware');
const User = require('../dao/models/user.model');

router.get('/', userisLoggedIn, async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).populate('cartId');
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }
        const cart = user.cartId;
        if (!cart) {
            return res.status(404).json({ error: 'El usuario no tiene un carrito asociado.' });
        }
        console.log('este es el cart', cart);
        res.status(200).render('cart', {
            // cart: cart,
            cart: JSON.parse(JSON.stringify(cart)),
            titlePage: 'Carrito',
            style: ['styles.css'],
            isLoggedIn: req.session.user !== undefined || req.user !== undefined,
        });
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});


router.get('/:cid', userisLoggedIn, async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cartManager = req.app.get('cartManager');
        await cartManager.getCartById(cartId).populate('products.product');
        
        const cartData = {
            id: cart.id,
            product: cart.products.map(p => ({
                product: {
                    title: p.product.title,
                    productId: p.product.id,
                    code: p.product.code,
                },
                quantity: p.quantity
            }))
        };
        res.status(200).render('cart', {
            cart: cartData,
            titlePage: 'Carrito',
            style: ['styles.css'],
            isLoggedIn: req.session.user !== undefined || req.user !== undefined,
        });
    } catch (err) {
        res.status(500).json({ Error: err.message });
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

        console.log(`Adding product ${productId} to cart ${cartId}`); 

        const cartManager = req.app.get('cartManager');
        const updatedCart = await cartManager.addProductToCart(productId, cartId);

        res.status(200).render('cart', {
            cart: updatedCart, 
            titlePage: 'Carrito',
            style: ['styles.css'],
            isLoggedIn: req.session.user !== undefined || req.user !== undefined,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ Error: error.message });
    }
});


router.delete('/:cid/product/:pid', userisLoggedIn, async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        await cartManager.deleteProductFromCart(productId, cartId);
        res.status(200).json({ message: `Producto ${productId} eliminado del carrito ${cartId} de manera correcta.` });
    } catch (err) {
        console.error('Error en la ruta DELETE:', err);
        res.status(500).json({ Error: err.message, stack: err.stack });
    }
});




router.put('/:cid/product/:pid', userisLoggedIn, async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const { quantity } = req.body;
        const cartManager = req.app.get('cartManager');
        await cartManager.updateProductQuantityFromCart(productId, cartId, quantity);
        res.status(200).json({ message: `Se actualizó el producto ${productId} en una cantidad de ${quantity} del carrito ${cartId}.` });
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});



router.delete('/:cid', userisLoggedIn, async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cartManager = req.app.get('cartManager');
        await cartManager.clearCart(cartId);
        res.status(200).json({ message: `Carrito ${cartId} vaciado de manera correcta.` });
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



router.delete('/destroyCart/:cid', userisLoggedIn, async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cartManager = req.app.get('cartManager');
        await cartManager.deleteCart(cartId);
        res.status(200).json({ message: `Carrito ${cartId} eliminado de manera correcta.` });
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});

module.exports = router;
