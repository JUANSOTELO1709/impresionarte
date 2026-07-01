// ── Configura tu número de WhatsApp (con código de país, sin + ni espacios)
const WHATSAPP_NUMBER = '573026622715';
const API = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? window.location.origin
  : 'https://api.impresionartes.com';

document.addEventListener('alpine:init', () => {
    Alpine.data('catalogApp', () => ({

        // ── Data ─────────────────────────────────────────────────
        categories: [],
        products: [],
        loading: true,
        selectedCategory: null,
        searchQuery: '',

        // ── Modal producto ────────────────────────────────────────
        productModal: false,
        product: null,
        currentPhoto: 0,
        selectedColor: null,
        selectedSize: null,
        quantity: 1,
        displayPrice: 0,

        // ── Modal pedido ──────────────────────────────────────────
        orderModal: false,
        orderForm: { name: '', phone: '', email: '', notes: '' },
        orderLoading: false,
        orderError: '',

        // ── Confirmación ──────────────────────────────────────────
        successModal: false,
        orderId: null,

        // ── Computed ─────────────────────────────────────────────
        get filteredProducts() {
            const q = this.searchQuery.toLowerCase().trim();
            return this.products.filter(p => {
                const matchCat = !this.selectedCategory || p.category_id === this.selectedCategory;
                const matchSearch = !q || p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q);
                return matchCat && matchSearch;
            });
        },
        get featuredProducts() {
            return this.products.filter(p => p.is_featured);
        },

        // ── Init ─────────────────────────────────────────────────
        async init() {
            await this.loadData();
        },

        async loadData() {
            this.loading = true;
            try {
                const [cats, prods] = await Promise.all([
                    fetch(`${API}/categories/`).then(r => r.json()),
                    fetch(`${API}/products/?available=true`).then(r => r.json()),
                ]);
                this.categories = cats;
                this.products = prods;
            } finally {
                this.loading = false;
            }
        },

        // ── Modal producto ────────────────────────────────────────
        openProduct(p) {
            this.product = p;
            this.currentPhoto = 0;
            this.selectedColor = p.colors?.[0] || null;
            this.selectedSize = p.sizes?.[0] || null;
            this.quantity = 1;
            this.updatePrice();
            this.productModal = true;
            document.body.style.overflow = 'hidden';
        },

        closeProduct() {
            this.productModal = false;
            document.body.style.overflow = '';
        },

        selectColor(c) { this.selectedColor = c; },

        selectSize(s) {
            this.selectedSize = s;
            this.updatePrice();
        },

        updatePrice() {
            if (!this.product) return;
            let price = this.product.base_price;
            if (this.selectedSize) price += (this.selectedSize.price_modifier || 0);
            this.displayPrice = price * this.quantity;
        },

        changeQty(delta) {
            this.quantity = Math.max(1, this.quantity + delta);
            this.updatePrice();
        },

        photoUrl(p, thumb = false) {
            if (!p) return '';
            if (thumb && p.filename) return `${API}/uploads/productos/thumb_${p.filename.replace('.webp','')}.webp`;
            return p.url || `${API}/uploads/productos/${p.filename}`;
        },

        // ── Pedido directo ────────────────────────────────────────
        openOrder() {
            this.orderForm = { name: '', phone: '', email: '', notes: '' };
            this.orderError = '';
            this.orderModal = true;
        },

        async submitOrder() {
            if (!this.orderForm.name.trim() || !this.orderForm.phone.trim()) {
                this.orderError = 'Nombre y teléfono son obligatorios';
                return;
            }
            this.orderLoading = true;
            this.orderError = '';
            try {
                const payload = {
                    product_id: this.product.id,
                    color_id: this.selectedColor?.id || null,
                    size_id: this.selectedSize?.id || null,
                    quantity: this.quantity,
                    notes: this.orderForm.notes || null,
                    channel: 'web',
                    customer_name: this.orderForm.name,
                    customer_phone: this.orderForm.phone,
                    customer_email: this.orderForm.email || null,
                };
                const res = await fetch(`${API}/orders/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                if (!res.ok) {
                    const e = await res.json().catch(() => ({}));
                    throw new Error(e.detail || 'Error al enviar el pedido');
                }
                const order = await res.json();
                this.orderId = order.id;
                this.orderModal = false;
                this.productModal = false;
                document.body.style.overflow = '';
                this.successModal = true;
            } catch (e) {
                this.orderError = e.message;
            } finally {
                this.orderLoading = false;
            }
        },

        // ── WhatsApp ──────────────────────────────────────────────
        openWhatsApp() {
            const color = this.selectedColor ? `\n🎨 Color: ${this.selectedColor.name}` : '';
            const size = this.selectedSize ? `\n📐 Medida: ${this.selectedSize.label}` : '';
            const price = this.formatPrice(this.displayPrice);
            const msg = `Hola, me interesa pedir:\n\n📦 *${this.product.name}*${color}${size}\n🔢 Cantidad: ${this.quantity}\n💰 Total aprox: ${price}\n\n¿Está disponible?`;
            window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
        },

        // ── Helpers ───────────────────────────────────────────────
        formatPrice(p) {
            return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(p || 0);
        },

        categoryName(id) {
            return this.categories.find(c => c.id === id)?.name || '';
        },
    }));
});
