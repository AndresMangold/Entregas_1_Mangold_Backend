const { Carts, Products } = require('../models');

class CartManager {

    constructor() { }

    async prepare() {
        if (Carts.db.readyState !== 1) {
            throw new Error('must connect to mongodb!')
        }
    }

    async getCarts() {
        try {
            const carts = await Carts.find();
            return carts;

        } catch {
            throw new Error('Error al importar los carritos');
        }
    }
    async addCart() {
        try {
            await Carts.create({
                products: []
            })
        } catch {
            throw new Error('Error al agregar un nuevo carrito.')
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await Carts.findOne({ _id: cartId });
            return cart
        } catch {
            throw new Error('Hubo un error al obtener el ID del carrito.')
        }
    }

    async addProductToCart(productId, cartId) {
        try {
            const product = await Products.findOne({ _id: productId });
            if (!product) {
                throw new Error('El ID de producto no existe');
            }

            const cart = await Carts.findOne({ _id: cartId });
            if (!cart) {
                throw new Error('El ID de carrito no existe');
            }

            const existingProductIndex = cart.products.findIndex(p => p.id === productId);
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity += 1;
            } else {
                cart.products.push({ id: productId, quantity: 1 });
            }

            await Carts.updateOne({ _id: cartId }, cart);

            console.log('Producto agregado al carrito correctamente');
            return cart;
        } catch (error) {
            console.error('Error en addProductToCart:', error);
            throw new Error('Hubo un error al agregar un producto al carrito.');
        }
    }

};

module.exports = CartManager;