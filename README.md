# PreEntrega_2_Mangold_Backend

# PREENTREGA nº 2 del curso de Programación Backend.

Este proyecto simula un servidor con persistencia de archivos alojado MONGODB y donde es posible visualizar productos y añadirlos a un carrito de compras.

Se podrá consultar productos disponibles utilizando filtros, paginación y ordenamientos.


# Para correr este proyecto:

- git clone https://github.com/AndresMangold/PreEntrega_1_Mangold_Backend.git
- npm i
- nodemon ./src/app.js
- [localhost://](http://localhost:8080/api/home)

# Frameworks y librerías utilizadas en este proyecto:

- Node JS
- Node Express
- Express Handlebars
- Handlebars
- Socket.io
- Mongoose
- Mongoose Paginate

# Métodos de Postman para correr la API:

Para ver todos los productos:
Get - [http://localhost:8080/api/products]

Para ver con page, limit y sort:
Get - [http://localhost:8080/api/products?page=1&limit=5&sort=asc]

Para ver un producto por su ID:
Get - [http://localhost:8080/api/products/6619c6e2dee5427af161b40d]

Para crear un nuevo carrito:
Post - [http://localhost:8080/api/cart]

Para ver todos los carritos:
Get - [http://localhost:8080/api/cart]

Para añadir un nuevo producto:
Post - [http://localhost:8080/api/products] + Body ["title", "description", "price", "code", "stock", "category"]

Para actualizar un producto: 
Put - [http://localhost:8080/api/products/6619c6e2dee5427af161b40d] + Body ["title", "description", "price", "code", "thumbnail", "category"]

Para borrar un producto:
Delete - [http://localhost:8080/api/products/6619c6e2dee5427af161b40d]

Para ver un carrito por su ID:
Get - [http://localhost:8080/api/cart/661eeec55d8db44e2eb4053f]

Para añadir un producto al carrito:
Post - [http://localhost:8080/api/cart/661eeec55d8db44e2eb4053f/product/6619c6e2dee5427af161b40d]

Para borrar un producto desde el carrito:
Delete - [http://localhost:8080/api/cart/661eeec55d8db44e2eb4053f/product/6619c6e2dee5427af161b40d]

Para modificar la cantidad de un producto en el carrito:
Put - [http://localhost:8080/api/cart/661eeec55d8db44e2eb4053f/product/6619c6e2dee5427af161b40d] + Body [ {"quantity": 3} ]

Para borrar limpiar el carrito: 
Delete -  [http://localhost:8080/api/cart/661eeec55d8db44e2eb4053f]

