// script.js

let products = [];
let cart = [];

// Função para cadastrar um novo produto
document.getElementById('productForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const barcode = document.getElementById('productBarcode').value;
    const lot = document.getElementById('productLot').value;

    const product = { name, price, barcode, lot };
    products.push(product);

    alert('Produto cadastrado com sucesso!');
    this.reset();
});

// Função para iniciar o scanner
function startScanner() {
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector('#video'),
            constraints: {
                facingMode: "environment"
            }
        },
        decoder: {
            readers: [
                "code_128_reader",
                "ean_reader",
                "ean_8_reader",
                "upc_reader",
                "upc_e_reader"
            ]
        }
    }, function (err) {
        if (err) {
            console.error(err);
            return;
        }
        Quagga.start();
    });

    Quagga.onDetected(function (data) {
        const barcode = data.codeResult.code;
        console.log('Código de Barras Detectado:', barcode);

        // Captura e exibe a imagem
        captureImage();
        
        const product = products.find(prod => prod.barcode === barcode);
        if (product) {
            cart.push(product);
            updateCart();
        } else {
            alert('Produto não encontrado!');
        }
    });
}

// Função para parar o scanner
function stopScanner() {
    Quagga.stop();
}

// Função para capturar e exibir a imagem da câmera
function captureImage() {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const video = document.getElementById('video');

    // Ajustar o tamanho do canvas para o vídeo
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Desenhar o quadro atual do vídeo no canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
}

// Função para atualizar a lista do carrinho
function updateCart() {
    const cartList = document.getElementById('cartList');
    cartList.innerHTML = '';

    let total = 0;
    cart.forEach(product => {
        const li = document.createElement('li');
        li.textContent = `${product.name} - R$${product.price.toFixed(2)}`;
        cartList.appendChild(li);
        total += product.price;
    });

    document.getElementById('totalPrice').textContent = total.toFixed(2);
}

// Função para mostrar o lote do produto
function showProductLot() {
    const barcode = document.getElementById('searchBarcode').value;
    const product = products.find(prod => prod.barcode === barcode);

    if (product) {
        document.getElementById('productName').textContent = `Nome: ${product.name}`;
        document.getElementById('productPrice').textContent = `Preço: R$${product.price.toFixed(2)}`;
        document.getElementById('productLot').textContent = `Lote: ${product.lot}`;
    } else {
        document.getElementById('productName').textContent = 'Nome: ';
        document.getElementById('productPrice').textContent = 'Preço: ';
        document.getElementById('productLot').textContent = 'Lote: Produto não encontrado!';
    }
}
