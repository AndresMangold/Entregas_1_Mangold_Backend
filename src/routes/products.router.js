const { Router } = require('express');
const ProductManager = require('../productManager');

const router = Router();

const productManager = new ProductManager(`${__dirname}/../assets/products.json`);

productManager.init().catch(error => {
    console.error('Error al inicializar ProductManager:', error);
});

router.get('/', async function(req, res) {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const products = await productManager.getProducts(limit);
        res.json(products);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/:pid', function(req, res) {
    try {
        const productId = parseInt(req.params.pid);
        const product = productManager.getProductById(productId);
        if (product) {
            res.json(product);
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.post('/', async function(req, res) {
    try {
        const newProduct = req.body;
        const productId = await productManager.addProduct(newProduct);
        res.status(201).json({ id: productId, ...newProduct });
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.put('/:pid', async function(req, res) {
    try {
        const productId = parseInt(req.params.pid);
        const updatedProduct = req.body;
        const success = await productManager.updateProduct(productId, updatedProduct);
        if (success) {
            res.json({ message: 'Producto actualizado correctamente' });
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.delete('/:pid', async function(req, res) {
    try {
        const productId = parseInt(req.params.pid);
        const success = await productManager.deleteProduct(productId);
        if (success) {
            res.json({ message: 'Producto eliminado correctamente' });
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).send('Error interno del servidor');
    }
});

module.exports = router;
