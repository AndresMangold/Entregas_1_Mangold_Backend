// const { MongoClient, ObjectId } = require('mongodb');

// class CartManager {
//     constructor() {
//         this.client = new MongoClient('mongodb://localhost:27017', { useUnifiedTopology: true });
//         this.db = null;
//     }

//     async connect() {
//         try {
//             await this.client.connect();
//             console.log('Connected to MongoDB');
//             this.db = this.client.db('ecommerce'); // Reemplaza 'nombre_de_tu_base_de_datos' con el nombre de tu base de datos
//         } catch (error) {
//             console.error('Error connecting to MongoDB:', error);
//             throw error;
//         }
//     }

//     async getCarts() {
//         try {
//             const cartsCollection = this.db.collection('carts'); // Reemplaza 'carts' con el nombre de tu colección de carritos
//             const carts = await cartsCollection.find({}).toArray();
//             return carts;
//         } catch (error) {
//             console.error('Error getting carts from MongoDB:', error);
//             throw error;
//         }
//     }

//     async addCart() {
//         try {
//             const cartsCollection = this.db.collection('carts');
//             const result = await cartsCollection.insertOne({ products: [] });
//             console.log('Nuevo carrito creado');
//             return result.insertedId;
//         } catch (error) {
//             console.error('Error adding cart to MongoDB:', error);
//             throw error;
//         }
//     }

//     async getCartById(cartId) {
//         try {
//             const cartsCollection = this.db.collection('carts');
//             const cart = await cartsCollection.findOne({ _id: new ObjectId(cartId) });
//             if (!cart) {
//                 throw new Error('Not Found: No existe el ID de carrito');
//             }
//             return cart;
//         } catch (error) {
//             console.error('Error getting cart by ID from MongoDB:', error);
//             throw error;
//         }
//     }

//     async addProductToCart(productId, cartId) {
//         try {
//             const productsCollection = this.db.collection('products'); // Reemplaza 'products' con el nombre de tu colección de productos
//             const product = await productsCollection.findOne({ _id: new ObjectId(productId) });
//             if (!product) {
//                 throw new Error('El ID de producto no existe');
//             }

//             const cartsCollection = this.db.collection('carts');
//             const cart = await cartsCollection.findOne({ _id: new ObjectId(cartId) });
//             if (!cart) {
//                 throw new Error('El ID de carrito no existe');
//             }

//             const existingProductIndex = cart.products.findIndex(p => p.id === productId);
//             if (existingProductIndex !== -1) {
//                 cart.products[existingProductIndex].quantity += 1;
//             } else {
//                 cart.products.push({ id: productId, quantity: 1 });
//             }

//             await cartsCollection.updateOne({ _id: new ObjectId(cartId) }, { $set: { products: cart.products } });

//             console.log('Producto agregado al carrito correctamente');
//             return cart;
//         } catch (error) {
//             console.error('Error adding product to cart in MongoDB:', error);
//             throw new Error('Hubo un error al agregar un producto al carrito.');
//         }
//     }

//     async close() {
//         await this.client.close();
//         console.log('Disconnected from MongoDB');
//     }
// }

// module.exports = CartManager;
