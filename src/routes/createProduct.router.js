const { Router } = require('express'); 
const router = Router(); 

router.get('/', async (_, res) => {
    res.render('createProduct', {
        titlePage: 'Agregar Producto',
        style: ['styles.css'],
        script: ['createProduct.js']
    });
});

router.post('/', async (req, res) => {
    try {
        const { title, description, price, thumbnail, code, status, stock } = req.body;

        const productManager = req.app.get('productManager');
        await productManager.addProduct(title, description, price, thumbnail, code, status, stock);

        res.status(301).redirect('/api/products');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

module.exports = router;