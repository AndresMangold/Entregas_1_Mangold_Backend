const { MongoClient } = require('mongodb');

class ProductManager {
    constructor() {
        this.client = new MongoClient('mongodb://localhost:27017', { useUnifiedTopology: true });
        this.productsCollection = null;
    }

    async init() {
        await this.loadProducts();
    }

    async loadProducts() {
        try {
            const data = await fs.readFile(this.filePath, 'utf8');
            this.products = JSON.parse(data);
        } catch (err) {
            console.error('Error leyendo el archivo:', err);
        }
    }

    async saveProducts() {
        try {
            await fs.writeFile(this.filePath, JSON.stringify(this.products, null, 2));
        } catch (err) {
            console.error('Error escribiendo el archivo:', err);
        }
    }

    async addProduct(title, description, price, thumbnail, code, stock) {
        if (!title || !description || !price || !thumbnail || !code || typeof stock !== 'number') {
            return;
        }        

        if (this.products.some(product => product.code === code)) {
            console.error('El código ya existe');
            return;
        }

        const id = this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 1;

        const newProduct = {
            id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };
        this.products.push(newProduct);
        await this.saveProducts(); 
    }

    getProducts(limit) {
        if (limit) {
            return this.products.slice(0, limit);
        } else {
            return this.products;
        }
    }

    // async getProducts(limit = 10, sort = 'asc', query = '') {
    //     try {
    //         let filteredProducts = [...this.products];
    
    //         // Filtrar por query (podrías implementar la lógica de búsqueda aquí)
    //         if (query) {
    //             filteredProducts = filteredProducts.filter(product => product.category === query);
    //         }
    
    //         // Ordenar los productos
    //         if (sort === 'asc') {
    //             filteredProducts.sort((a, b) => a.price - b.price);
    //         } else if (sort === 'desc') {
    //             filteredProducts.sort((a, b) => b.price - a.price);
    //         }
    
    //         // Aplicar el límite
    //         const slicedProducts = filteredProducts.slice(0, limit);
    
    //         return slicedProducts;
    //     } catch (error) {
    //         console.error('Error al obtener los productos:', error);
    //         throw new Error('Error al obtener los productos');
    //     }
    // }
    
    

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (product) {
            return product;
        } else {
            console.error('Producto no encontrado');
            return null;
        }
    }

    updateProduct(id, updatedFields) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updatedFields };
            this.saveProducts();
            return true;
        }
        return false;
    }
    
    updateStock(productId, quantity) {
        const product = this.getProductById(productId);
        if (product) {
            if (product.stock >= quantity) {
                product.stock -= quantity;
                this.updateProduct(productId, { stock: product.stock });
                return true;
            } else {
                console.error('No hay suficiente stock disponible');
                return false;
            }
        } else {
            console.error('Producto no encontrado');
            return false;
        }
    }

    deleteProduct(id) {
        this.products = this.products.filter(product => product.id !== id);
        this.saveProducts();
    }
}

module.exports = ProductManager;
