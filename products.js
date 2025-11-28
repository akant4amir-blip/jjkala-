// مدیریت داده‌های محصولات جی جی کالا
class ProductManager {
    constructor() {
        this.products = [];
        this.init();
    }

    init() {
        this.loadFromStorage();
        if (this.products.length === 0) {
            this.initializeSampleProducts();
        }
    }

    initializeSampleProducts() {
        this.products = [
            {
                id: 1,
                name: "گوشی موبایل سامسونگ گلکسی A32",
                price: 12500000,
                description: "گوشی هوشمند سامسونگ با حافظه داخلی 128GB و رم 6GB",
                category: "الکترونیک",
                image: null,
                stock: 15,
                featured: true
            },
            {
                id: 2,
                name: "لپ تاپ ایسوس TUF گیمینگ",
                price: 38500000,
                description: "لپ تاپ گیمینگ ایسوس با پردازنده Core i7 نسل 11 و کارت گرافیک RTX 3050",
                category: "الکترونیک",
                image: null,
                stock: 8,
                featured: true
            },
            {
                id: 3,
                name: "هدفون بلوتوثی سونی WH-1000XM4",
                price: 12500000,
                description: "هدفون بی‌سیم با قابلیت نویز کنسلینگ فعال و باتری 30 ساعته",
                category: "الکترونیک",
                image: null,
                stock: 20,
                featured: false
            },
            {
                id: 4,
                name: "کتاب آموزش برنامه نویسی وب",
                price: 280000,
                description: "کتاب جامع آموزش HTML5, CSS3, JavaScript و React",
                category: "کتاب",
                image: null,
                stock: 25,
                featured: true
            },
            {
                id: 5,
                name: "ماوس گیمینگ رزر DeathAdder",
                price: 1850000,
                description: "ماوس گیمینگ با سنسور نوری 20000DPI و 7 دکمه programmable",
                category: "الکترونیک",
                image: null,
                stock: 12,
                featured: false
            },
            {
                id: 6,
                name: "کیبورد مکانیکی کورسیر K95",
                price: 8500000,
                description: "کیبورد مکانیکی RGB با سوییچ Cherry MX و 6 macro keys",
                category: "الکترونیک",
                image: null,
                stock: 6,
                featured: true
            }
        ];
        this.saveToStorage();
    }

    loadFromStorage() {
        try {
            const saved = localStorage.getItem('jjkala_products');
            if (saved) {
                this.products = JSON.parse(saved);
            }
        } catch (error) {
            console.error('خطا در بارگذاری محصولات:', error);
            this.products = [];
        }
    }

    saveToStorage() {
        try {
            localStorage.setItem('jjkala_products', JSON.stringify(this.products));
            this.syncWithStore();
        } catch (error) {
            console.error('خطا در ذخیره محصولات:', error);
        }
    }

    syncWithStore() {
        // همگام‌سازی با صفحه فروشگاه اگر باز است
        if (window.opener && !window.opener.closed && typeof window.opener.syncProducts === 'function') {
            window.opener.syncProducts();
        }
        
        // بروزرسانی اگر در همان صفحه هستیم
        if (typeof syncProducts === 'function') {
            syncProducts();
        }
    }

    getAllProducts() {
        return this.products;
    }

    getProductById(id) {
        return this.products.find(product => product.id === id);
    }

    getFeaturedProducts() {
        return this.products.filter(product => product.featured);
    }

    getProductsByCategory(category) {
        return this.products.filter(product => product.category === category);
    }

    searchProducts(query) {
        const searchTerm = query.toLowerCase();
        return this.products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
    }

    addProduct(productData) {
        const newId = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
        const newProduct = {
            id: newId,
            name: productData.name || 'محصول بدون نام',
            price: parseInt(productData.price) || 0,
            description: productData.description || '',
            category: productData.category || 'عمومی',
            image: productData.image || null,
            stock: parseInt(productData.stock) || 0,
            featured: Boolean(productData.featured),
            createdAt: new Date().toISOString()
        };
        
        this.products.push(newProduct);
        this.saveToStorage();
        return newProduct;
    }

    updateProduct(id, updatedData) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updatedData };
            this.saveToStorage();
            return this.products[index];
        }
        return null;
    }

    deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            const deletedProduct = this.products.splice(index, 1)[0];
            this.saveToStorage();
            return deletedProduct;
        }
        return null;
    }

    decreaseStock(id, quantity = 1) {
        const product = this.getProductById(id);
        if (product && product.stock >= quantity) {
            product.stock -= quantity;
            this.saveToStorage();
            return true;
        }
        return false;
    }

    increaseStock(id, quantity = 1) {
        const product = this.getProductById(id);
        if (product) {
            product.stock += quantity;
            this.saveToStorage();
            return true;
        }
        return false;
    }

    getCategories() {
        const categories = [...new Set(this.products.map(product => product.category))];
        return categories;
    }

    getStats() {
        const totalProducts = this.products.length;
        const totalValue = this.products.reduce((sum, product) => sum + (product.price * product.stock), 0);
        const lowStock = this.products.filter(product => product.stock < 5).length;
        const outOfStock = this.products.filter(product => product.stock === 0).length;
        
        return {
            totalProducts,
            totalValue,
            lowStock,
            outOfStock,
            categories: this.getCategories().length
        };
    }
}

// ایجاد نمونه جهانی
window.productManager = new ProductManager();
window.products = window.productManager.getAllProducts();

// تابع همگام‌سازی برای استفاده در صفحات
function syncProducts() {
    if (window.productManager) {
        window.products = window.productManager.getAllProducts();
        
        if (typeof displayProducts === 'function') {
            displayProducts();
        }
        
        if (typeof loadProducts === 'function') {
            loadProducts();
        }
        
        if (typeof updateStats === 'function') {
            updateStats();
        }
    }
}

// بارگذاری اولیه
document.addEventListener('DOMContentLoaded', function() {
    if (window.productManager) {
        window.products = window.productManager.getAllProducts();
    }
});
