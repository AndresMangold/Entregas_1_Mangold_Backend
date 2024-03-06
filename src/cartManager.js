const { promises: fs } = require('fs');

class CartManager {
    constructor(filePath) {
        this.carts = [];
        this.filePath = filePath;
        this.init();
    }

    async init() {
        await this.loadCarts();
    }

    async loadCarts() {
        try {
            const data = await fs.readFile(this.filePath, 'utf8');
            this.carts = JSON.parse(data);
        } catch (err) {
            console.error('Error leyendo el archivo de carritos:', err);
        }
    }

    async saveCarts() {
        try {
            await fs.writeFile(this.filePath, JSON.stringify(this.carts, null, 2));
        } catch (err) {
            console.error('Error escribiendo el archivo de carritos:', err);
        }
    }

    async createCart() {
        const cartId = this.carts.length > 0 ? this.carts[this.carts.length - 1].id + 1 : 1;
        const newCart = { id: cartId, products: [] };
        this.carts.push(newCart);
        await this.saveCarts();
        return cartId;
    }

    async getCart(cartId) {
        const cart = this.carts.find(cart => cart.id === cartId);
        return cart || null;
    }

    async addProductToCart(cartId, productId, quantity) {
        const cart = this.carts.find(cart => cart.id === cartId);
        if (!cart) {
            return false; 
        }
        
        const existingProduct = cart.products.find(product => product.id === productId);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ id: productId, quantity });
        }
        await this.saveCarts();
        return true;
    }
}

module.exports = CartManager;
