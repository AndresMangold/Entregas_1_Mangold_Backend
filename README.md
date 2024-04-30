
# Desafío Login del curso de Programación Backend.

Este proyecto simula un servidor con persistencia de archivos alojado MONGODB y donde es posible visualizar productos y añadirlos a un carrito de compras.

Se agregó para esta entrega semanal: un pantalla de login que protege el acceso a los endpoints de productos y de la visualización del carrito. Ambas visualizaciones: la de productos
y la del carrito sólo la pueden ver usuarios con el role: user. El rol de "admin" permite acceder además a la ruta de agregar producto, esta ruta está protegida para los users.
Se puede acceder también a un endpoint de perfil para ver la información de usuario y existe un logout para destruir la sesión.

Se podrá consultar productos disponibles utilizando filtros, paginación y ordenamientos.


# Para correr este proyecto:

- git clone https://github.com/AndresMangold/PreEntrega_1_Mangold_Backend.git
- npm i
- nodemon ./src/app.js
- [localhost:8080//](http://localhost:8080/api/products)

# Frameworks y librerías utilizadas en este proyecto:

- Node JS
- Node Express
- Express Handlebars
- Handlebars
- Socket.io
- Mongoose
- Mongoose Paginate
- Session-file-store
- Connect-mongo
- Cookie-parser

# Métodos de Postman para correr la API:

- Para ver todos los productos:
Get - [http://localhost:8080/api/products]

- Para ver con page, limit y sort:
Get - [http://localhost:8080/api/products?page=1&limit=5&sort=asc]

- Para ver un producto por su ID:
Get - [http://localhost:8080/api/products/6619c6e2dee5427af161b40d]

- Para crear un nuevo carrito:
Post - [http://localhost:8080/api/cart]

- Para ver todos los carritos:
Get - [http://localhost:8080/api/cart]

- Para añadir un nuevo producto:
Post - [http://localhost:8080/api/products] + Body ["title", "description", "price", "code", "stock", "category"]

- Para actualizar un producto: 
Put - [http://localhost:8080/api/products/6619c6e2dee5427af161b40d] + Body ["title", "description", "price", "code", "thumbnail", "category"]

- Para borrar un producto:
Delete - [http://localhost:8080/api/products/6619c6e2dee5427af161b40d]

- Para ver un carrito por su ID:
Get - [http://localhost:8080/api/cart/661eeec55d8db44e2eb4053f]

- Para añadir un producto al carrito:
Post - [http://localhost:8080/api/cart/661eeec55d8db44e2eb4053f/product/6619c6e2dee5427af161b40d]

- Para borrar un producto desde el carrito:
Delete - [http://localhost:8080/api/cart/661eeec55d8db44e2eb4053f/product/6619c6e2dee5427af161b40d]

- Para modificar la cantidad de un producto en el carrito:
Put - [http://localhost:8080/api/cart/661eeec55d8db44e2eb4053f/product/6619c6e2dee5427af161b40d] + Body [ {"quantity": 3} ]

- Para limpiar el carrito: 
Delete -  [http://localhost:8080/api/cart/661eeec55d8db44e2eb4053f]

