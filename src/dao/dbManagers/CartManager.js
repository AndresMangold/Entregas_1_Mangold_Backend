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
            const cart = await Carts.findOne({ _id: cartId }).populate('products.product');
            return cart
        } catch (err) {
            console.error(err)
            throw new Error('Hubo un error al obtener el ID del carrito.')
        }
    }

    async addProductToCart(productId, cartId) {
        try {

            const product = await Products.findById(productId);
            if (!product) {
                throw new Error('El producto no existe');
            }

            const cart = await Carts.findById(cartId);
            if (!cart) {
                throw new Error('El carrito no existe');
            }

            const existingProductIndex = cart.products.findIndex(p => p.product.equals(productId));
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity += 1;
            } else {
                cart.products.push({ product: productId, quantity: 1 });
            }

            await cart.save();

            console.log('Producto agregado al carrito correctamente');
            return cart;
        } catch (error) {
            console.error('Error en addProductToCart:', error);
            throw new Error('Hubo un error al agregar un producto al carrito.');
        }
    }

    async deleteProductFromCart(productId, cartId) {
        try {

            const cart = await Carts.findById(cartId);
            if (!cart) {
                throw new Error('El carrito no existe.');
            }

            const product = await Products.findById(productId);
            if (!product) {
                throw new Error('El producto no existe.');
            }

            await cart.updateOne({ $pull: { products: { product: productId } } });

            console.log(`Se eliminó el producto ${productId} del carrito ${cartId}`);
        } catch (error) {
            console.error('Error al eliminar el producto del carrito:', error);
            throw new Error('Error al eliminar el producto del carrito');
        }
    }

    async updateCart(cartId, products) {
        try {
            const cart = await Carts.findById(cartId);
            if (!cart) {
                throw new Error('El carrito no existe.');
            }

            for (const { product: productId, quantity } of products) {
                const product = await Products.findById(productId);
                if (!product) {
                    throw new Error(`El producto con ID ${productId} no existe.`);
                }

                const existingProductIndex = cart.products.findIndex(p => p.product.equals(productId));
                if (existingProductIndex !== -1) {
                    cart.products[existingProductIndex].quantity += quantity;
                } else {
                    cart.products.push({ product: productId, quantity });
                }
            }

            await cart.save();

            console.log(`Se actualizó el carrito ${cartId}`);
        } catch (error) {
            console.error('Error al actualizar el carrito:', error);
            throw new Error('Error al actualizar el carrito');
        }
    }

    async updateProductQuantityFromCart(productId, cartId, quantity) {
        try {
            const cart = await Carts.findById(cartId);
            if (!cart) {
                throw new Error('El carrito no existe.');
            }

            const product = await Products.findById(productId);
            if (!product) {
                throw new Error('El producto no existe.');
            }

            const existingProductIndex = cart.products.findIndex(p => p.product.equals(productId));
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity = quantity;

                await cart.save();

                console.log(`Cantidad del producto ${productId} actualizada en el carrito ${cartId}`);
            } else {
                throw new Error('No se pudo encontrar el producto en el carrito');
            }
        } catch (error) {
            console.error('Hubo un error al actualizar la cantidad del producto:', error);
            throw new Error('Hubo un error al actualizar la cantidad del producto');
        }
    }

    async clearCart(cartId) {
        try {

            const existingCart = await this.getCartById(cartId);
            if (!existingCart) {
                throw new Error('El carrito no existe');
            }

            await Carts.updateOne({ _id: cartId }, { $set: { products: [] } });

        } catch {
            throw new Error('Hubo un error al vaciar el carrito')
        }
    }

};

module.exports = CartManager;