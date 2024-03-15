const socket = io();

socket.on('newProduct', (newProduct) => {
    const container = document.getElementById('productFeed');

    const divContainer = document.createElement('div');
    divContainer.classList.add('product');
    divContainer.setAttribute('data-product-id', newProduct.id);

    const title = document.createElement('h4');
    title.innerText = newProduct.title;

    const thumbnail = document.createElement('img');
    thumbnail.setAttribute('src', newProduct.thumbnail);
    thumbnail.setAttribute('alt', newProduct.title);

    const divInfo = document.createElement('div');
    divInfo.classList.add('product__info');

    const description = document.createElement('p');
    description.innerText = newProduct.description;

    const price = document.createElement('p');
    price.innerText = `Precio: ${newProduct.price}`;

    const stock = document.createElement('p');
    stock.innerText = `Stock: ${newProduct.stock}`;

    const code = document.createElement('p');
    code.innerText = `Código: ${newProduct.code}`;

    divInfo.append(description, price, stock, code);
    divContainer.append(title, thumbnail, divInfo);
    container.append(divContainer);
});

socket.on('updateFeed', (products) => {
    const container = document.getElementById('productFeed');

    const currentProducts = container.querySelectorAll('.product');

    currentProducts.forEach((productElement) => {
        const productId = productElement.dataset.productId;

        const productExists = products.some(product => product.id.toString() === productId);

        if (!productExists) {
            productElement.remove();
        }
    });

    products.forEach(product => {
        const existingProduct = container.querySelector(`.product[data-product-id="${product.id}"]`);

        if (!existingProduct) {
            const divContainer = document.createElement('div');
            divContainer.classList.add('product');
            divContainer.setAttribute('data-product-id', product.id);

            const title = document.createElement('h4');
            title.innerText = product.title;

            const thumbnail = document.createElement('img');
            thumbnail.setAttribute('src', product.thumbnail);
            thumbnail.setAttribute('alt', product.title);

            const divInfo = document.createElement('div');
            divInfo.classList.add('product__info');

            const description = document.createElement('p');
            description.innerText = product.description;

            const price = document.createElement('p');
            price.innerText = `Precio: ${product.price}`;

            const stock = document.createElement('p');
            stock.innerText = `Stock: ${product.stock}`;

            const code = document.createElement('p');
            code.innerText = `Código: ${product.code}`;

            divInfo.append(description, price, stock, code);
            divContainer.append(title, thumbnail, divInfo);
            container.append(divContainer);
        }
    });
});
