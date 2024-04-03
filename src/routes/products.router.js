const { Router } = require('express'); 
const router = Router(); 

router.get('/', async (req, res) => {
    try {
        const productManager = req.app.get('productManager'); 
        const products = await productManager.getProducts();
        const limitFilter = req.query.limit; 

        const productsData = products.map(product => ({
            title: product.title,
            thumbnail: product.thumbnail,
            description: product.description,
            price: product.price,
            stock: product.stock,
            code: product.code,
            id: product.id
        }));

        if (limitFilter) { 
            if (limitFilter <= 0 || isNaN(parseInt(limitFilter))) { 
                res.status(400).json({ error: 'Debe ingresar un número válido superior a 0.' }); 
                return;
            } else {
                const limit = parseInt(limitFilter); 
                const limitedProducts = products.slice(0, limit); 

                res.render('home', {
                    products: limitedProducts,
                    titlePage: 'Productos',
                    h1: 'Tienda',
                    style: ['styles.css'],
                });
            }
        } else {
            res.render('home', {
                products: productsData,
                titlePage: 'Productos',
                style: ['styles.css'],
            });

        }
    } catch {
        res.status(500).json({ Error: 'Error al cargar los productos' }); 
    };
});

router.get('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid; 
        const productManager = req.app.get('productManager');
        const product = await productManager.getProductById(productId); 
        res.status(200).json(product); 
    } catch (err) {
        res.status(500).json({ Error: err.message }); 
    }
});



router.post('/', async (req, res) => {
    try {
        const { title, description, price, thumbnail, code, status, stock } = req.body; 
        const productManager = req.app.get('productManager');
        await productManager.addProduct(title, description, price, thumbnail, code, status, stock); 
        res.status(301).redirect('/api/products'); 
    } catch (error) {
        res.status(500).json({ Error: error.message }); 
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



router.delete('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid; 
        const productManager = req.app.get('productManager');
        await productManager.deleteProduct(productId); 
        res.status(200).json({ message: 'Producto eliminado' }); 
    } catch (err) {
        res.status(500).json({ Error: err.message }); 
    }
});

module.exports = router; 
