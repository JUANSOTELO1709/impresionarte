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
            const all = this.products.filter(p => p.is_featured).sort((a, b) => a.id - b.id);
            const i = all.findIndex(p => p.category_id === 7);
            if (i > 1) { const [x] = all.splice(i, 1); all.splice(1, 0, x); }
            return all;
        },
        get bannerSlides() {
            const featured = this.products.filter(p => p.is_featured);
            const catOrder = this.categories.map(c => c.id);
            const seen = new Set();
            const slides = [];
            for (const catId of catOrder) {
                const p = featured.find(p => p.category_id === catId);
                if (p) { seen.add(p.id); slides.push(p); }
            }
            for (const p of featured) {
                if (!seen.has(p.id)) slides.push(p);
            }
            return slides.slice(0, 6);
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
                const sinFoto = prods.filter(p => !p.photos?.length && !p.primary_photo_url);
                if (sinFoto.length) console.warn('[Impresionarte] Productos sin foto:', sinFoto.map(p => `#${p.id} ${p.name}`));
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
        catIcon(name) {
            if (!name) return '🖨️';
            const n = name.toLowerCase();
            if (n.includes('letra')) return '🔤';
            if (n.includes('matera') || n.includes('plant')) return '🌱';
            if (n.includes('llavero')) return '🗝️';
            if (n.includes('tarjeta') || n.includes('empresa') || n.includes('negocio') || n.includes('letrero')) return '💼';
            if (n.includes('prototipo') || n.includes('técnico')) return '⚙️';
            if (n.includes('boda') || n.includes('matrimonio')) return '💍';
            if (n.includes('figura') || n.includes('juguete')) return '🎮';
            if (n.includes('navidad') || n.includes('natal')) return '🎄';
            return '🖨️';
        },
        catIconSVG(name) {
            const s = (path) => `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6">${path}</svg>`;
            if (!name) return s('<path d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.75 19.817m.72-5.988a42.41 42.41 0 0110.56 0m0 0L17.25 19.817M12 2.25l.75 4.5m0 0l-3 1.5m3-1.5l3 1.5"/>');
            const n = name.toLowerCase();
            if (n.includes('letra')) return s('<path d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.13.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"/>');
            if (n.includes('matera') || n.includes('plant')) return s('<path d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.354a15.055 15.055 0 01-4.5 0M3 9.75a9 9 0 1118 0v.75"/>');
            if (n.includes('llavero')) return s('<path d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"/>');
            if (n.includes('negocio') || n.includes('letrero') || n.includes('empresa')) return s('<path d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016 2.993 2.993 0 002.25-1.016 3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.375.375 0 00.375-.375v-1.5a.375.375 0 00-.375-.375h-3.75a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375z"/>');
            if (n.includes('prototipo') || n.includes('técnico')) return s('<path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>');
            if (n.includes('boda') || n.includes('matrimonio')) return s('<path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>');
            if (n.includes('navidad') || n.includes('natal')) return s('<path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/>');
            return s('<path d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.75 19.817m.72-5.988a42.41 42.41 0 0110.56 0m0 0L17.25 19.817M12 2.25l.75 4.5m0 0l-3 1.5m3-1.5l3 1.5"/>');
        },

        formatPrice(p) {
            return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(p || 0);
        },

        categoryName(id) {
            return this.categories.find(c => c.id === id)?.name || '';
        },
    }));
});
