const { Products } = require('../models');

class ProductManager {

    constructor() { }

    async prepare() {
        if (Products.db.readyState !== 1) {
            throw new Error('must connect to mongodb!')
        }
    }

    async getProducts() {
        try {
            const allProducts = await Products.find();
            return allProducts.map(p => p.toObject({ virtuals: true }));
        } catch {
            return [];
        }
    }

    async getProductById(id) {
        try {
            const product = await Products.findOne({ _id: id });

            if (product) {
                return product;
            } else {
                throw new Error('Not Found: El ID solicitado no existe.');
            }
        } catch (error) {
            console.error('Error al obtener el producto por ID:', error);
            throw new Error('Error al obtener el producto por ID');
        }
    }


    async addProduct(title, description, price, thumbnail, code, status, stock) {

        const invalidOptions = isNaN(+price) || +price <= 0 || isNaN(+stock) || +stock < 0;

        if (!title || !description || !code || invalidOptions) {
            throw new Error('Error al validar los datos');
        };

        const finalThumbnail = thumbnail ? thumbnail : 'Sin Imagen';

        if (typeof status === 'undefined' || status === true || status === 'true') {
            status = true;
        } else {
            status = false;
        }

        try {
            await Products.create({
                title,
                description,
                price,
                thumbnail: finalThumbnail,
                code,
                status,
                stock,
            });

            console.log('Producto agregado correctamente');
        } catch (error) {
            console.error('Error al agregar el producto desde DB:', error);
            throw new Error('Error al agregar el producto desde DB');
        }
    }

    async updateProduct(id, fieldsToUpdate) {
        try {
            const areFieldsPresent = Object.keys(fieldsToUpdate).length > 0;

            if (!areFieldsPresent) {
                throw new Error('No se proporcionaron campos para actualizar');
            }

            const updatedProduct = await Products.updateOne({ _id: id }, { $set: fieldsToUpdate });

            if (updatedProduct.nModified === 0) {
                throw new Error('No se encontró el producto para actualizar');
            }

            return updatedProduct;
        } catch (error) {
            console.error('Error al actualizar el producto desde DB:', error);
            throw new Error('Error al actualizar el producto desde DB');
        }
    }

    async deleteProduct(id) {
        await Products.deleteOne({ _id: id })
    }
}

module.exports = ProductManager;