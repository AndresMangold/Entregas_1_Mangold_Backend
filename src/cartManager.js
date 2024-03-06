const fs = require('fs');
const ProductManager = require('./productManager.js');

class CartManager {
    constructor(path) {
        this.carts = [];
        this.path = path;
        this.lastCartId = 1;
        this.productManager = new ProductManager(`${__dirname}/../assets/products.json`); 
        this.readFile();
    }

    async readFile() {
        try {
            const fileData = await fs.promises.readFile(this.path, 'utf-8');
            this.carts = JSON.parse(fileData);
            this.updateLastCartId();
        } catch (error) {
            await this.saveFile();
        }
    }

    updateLastCartId() {
        const lastCart = this.carts[this.carts.length - 1];
        if (lastCart) {
            this.lastCartId = lastCart.id + 1;
        }
    }

    async saveFile() {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2), 'utf-8');
        } catch (error) {
            console.error('Error al guardar el archivo:', error);
            throw error;
        }
    }

    getNewId() {
        return this.lastCartId++;
    }

    async getCarts() {
        try {
            const fileContents = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(fileContents);
        } catch (err) {
            return [];
        }
    }

    async createCart() {
        try {
            const cartId = await this.addCart();
            console.log('Nuevo carrito creado con ID:', cartId);
            return cartId;
        } catch (error) {
            throw new Error('Error al crear el carrito: ' + error.message);
        }
    }

    async addCart() {
        try {
            const cart = { id: this.getNewId(), products: [] };
            this.carts.push(cart);
            await this.saveFile();
            console.log('Nuevo carrito creado');
            return cart.id;
        } catch (error) {
            throw new Error('Hubo un error al generar el carrito');
        }
    }

    async getCartById(cartId) {
        const existingCart = await this.getCarts();
        const filterCartById = existingCart.find(c => c.id === cartId);
        if (filterCartById) {
            return filterCartById;
        } else {
            throw new Error('Not Found: No existe el ID de carrito');
        }
    }

    async addProductToCart(cartId, productId, quantity) {
        try {
            const product = await this.productManager.getProductById(productId); 
            const cart = await this.getCartById(cartId);
    
            if (!product) {
                throw new Error('Producto no encontrado');
            }
    
            const existingProduct = cart.products.find(p => p.id === productId);
    
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                const productToAdd = { id: product.id, quantity };
                cart.products.push(productToAdd);
            }
    
            const updatedCarts = await this.getCarts();
            const indexToUpdate = updatedCarts.findIndex(c => c.id === cartId);
            if (indexToUpdate !== -1) {
                updatedCarts[indexToUpdate] = cart;
                this.carts = updatedCarts;
                await this.saveFile();
                console.log('Producto agregado al carrito correctamente');
                return cart;
            } else {
                throw new Error('No se encontró el carrito para actualizar');
            }
        } catch (error) {
            console.error('Error en addProductToCart:', error);
            throw new Error('Error al cargar el producto al archivo');
        }
    }    
}

module.exports = CartManager;
