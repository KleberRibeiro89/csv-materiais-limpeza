// Gerenciamento do carrinho usando localStorage
class CartManager {
    constructor() {
        this.cartKey = 'csv_cart';
        this.init();
    }

    init() {
        if (!this.getCart()) {
            this.saveCart([]);
        }
        this.updateCartIcon();
    }

    getCart() {
        const cart = localStorage.getItem(this.cartKey);
        return cart ? JSON.parse(cart) : [];
    }

    saveCart(cart) {
        localStorage.setItem(this.cartKey, JSON.stringify(cart));
        this.updateCartIcon();
    }

    addToCart(product) {
        const cart = this.getCart();
        const existingItem = cart.find(item => item.name === product.name);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }

        this.saveCart(cart);
        this.showNotification('Produto adicionado ao carrinho!');
    }

    removeFromCart(productName) {
        const cart = this.getCart();
        const filteredCart = cart.filter(item => item.name !== productName);
        this.saveCart(filteredCart);
    }

    updateQuantity(productName, quantity) {
        const cart = this.getCart();
        const item = cart.find(item => item.name === productName);
        
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productName);
            } else {
                item.quantity = quantity;
                this.saveCart(cart);
            }
        }
    }

    clearCart() {
        this.saveCart([]);
    }

    getCartCount() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + item.quantity, 0);
    }

    updateCartIcon() {
        const cartCount = document.getElementById('cartCount');
        const count = this.getCartCount();

        if (cartCount) {
            if (count > 0) {
                cartCount.textContent = count;
                cartCount.style.display = 'flex';
            } else {
                cartCount.style.display = 'none';
            }
        }
    }

    showNotification(message) {
        // Criar notificação temporária
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 2000);
    }

    generateWhatsAppMessage() {
        const cart = this.getCart();
        if (cart.length === 0) {
            return '';
        }

        let message = '🛒 *Pedido - CSV Materiais de Limpeza*\n\n';
        message += 'Olá! Gostaria de fazer o seguinte pedido:\n\n';

        cart.forEach((item, index) => {
            message += `${index + 1}. *${item.name}*\n`;
            message += `   Quantidade: ${item.quantity}\n`;
            message += '\n';
        });

        message += `Total de itens: ${this.getCartCount()}\n\n`;
        message += 'Por favor, confirme a disponibilidade e o valor total.';

        return encodeURIComponent(message);
    }
}

// Instanciar o gerenciador de carrinho
const cartManager = new CartManager();

