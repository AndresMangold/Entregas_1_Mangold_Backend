const { Router } = require('express'); 
const router = Router(); 
const ProductManager = require('../dao/dbManagers/productManager');
const { userisLoggedIn } = require('../middlewares/auth.middleware')

router.get('/', userisLoggedIn, async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 12;
        const sort = req.query.sort;
        const category = req.query.category;
        const availability = req.query.availability;

        const pManager = new ProductManager();
        const products = await pManager.getProducts(page, limit, sort, category, availability);

        const welcomeMessage = req.query.welcome ? decodeURIComponent(req.query.welcome) : '';

        res.render('products', {
            products,
            titlePage: 'Productos',
            style: ['styles.css'],
            isLoggedIn: req.session.user !== undefined || req.user !== undefined,
            welcomeMessage: welcomeMessage
        });

    } catch (error) {
        console.error('Error al cargar los productos:', error);
        res.status(500).json({ Error: 'Error interno del servidor' });
    }
});


router.post('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const cartId = '661eeec55d8db44e2eb4053f'
        const cartManager = req.app.get('cartManager');
        await cartManager.addProductToCart(productId, cartId)
        res.status(301).redirect('/api/products');
    } catch (err) {
        res.status(500).json({ Error: err.message })
    }
});

router.get('/:pid', userisLoggedIn, async (req, res) => {
    try {

        const productId = req.params.pid; 
        const productManager = req.app.get('productManager');
        const product = await productManager.getProductById(productId); 

        const productData = {
            title: product.title,
            thumbnail: product.thumbnail,
            description: product.description,
            price: product.price,
            stock: product.stock,
            code: product.code,
            id: product.id
        };

        res.status(200).render('product', {
            product: [productData],
            titlePage: `Productos | ${product.title}`,
            style: ['styles.css'],
            isLoggedIn: req.session.user !== undefined || req.user !== undefined,
        });


    } catch (err) {
        res.status(500).json({ Error: err.message }); 
    }
});


router.put('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid; 
        const productManager = req.app.get('productManager');
        await productManager.updateProduct(productId, req.body); 
        res.status(200).json({ message: 'Producto actualizado' }); 
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar el producto' }); 
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, description, price, thumbnail, code, stock, category } = req.body; 
        const productManager = req.app.get('productManager');
        await productManager.addProduct(title, description, price, thumbnail, code, stock, category); 
        res.status(301).redirect('/api/products'); 
    } catch (error) {
        res.status(500).json({ Error: error.message }); 
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid; 
        const productManager = req.app.get('productManager');
        await productManager.deleteProduct(productId); 
        res.status(301).redirect('/api/products'); 
    } catch (err) {
        res.status(500).json({ Error: err.message }); 
    }
});

module.exports = router; 