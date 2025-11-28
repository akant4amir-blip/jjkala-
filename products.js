// داده‌های اولیه محصولات
window.products = JSON.parse(localStorage.getItem('jjkala_products')) || [
    {
        id: 1,
        name: "گوشی موبایل سامسونگ",
        price: 12500000,
        description: "گوشی هوشمند سامسونگ با حافظه 128GB",
        category: "الکترونیک",
        image: null
    },
    {
        id: 2,
        name: "لپ تاپ ایسوس",
        price: 28500000,
        description: "لپ تاپ گیمینگ ایسوس با پردازنده Core i7",
        category: "الکترونیک",
        image: null
    },
    {
        id: 3,
        name: "هدفون بلوتوثی",
        price: 1850000,
        description: "هدفون بی‌سیم با قابلیت نویز کنسلینگ",
        category: "الکترونیک",
        image: null
    },
    {
        id: 4,
        name: "کتاب برنامه نویسی",
        price: 150000,
        description: "کتاب آموزش برنامه نویسی وب",
        category: "کتاب",
        image: null
    }
];

// تابع برای ذخیره محصولات
function saveProductsToStorage() {
    localStorage.setItem('jjkala_products', JSON.stringify(window.products));
}

// تابع برای لود محصولات
function loadProductsFromStorage() {
    const saved = localStorage.getItem('jjkala_products');
    if (saved) {
        window.products = JSON.parse(saved);
    }
}

// تابع برای گرفتن محصول بر اساس ID
function getProductById(productId) {
    return window.products.find(product => product.id === productId);
}

// تابع برای اضافه کردن محصول جدید
function addNewProduct(productData) {
    const newId = Math.max(...window.products.map(p => p.id), 0) + 1;
    const newProduct = {
        id: newId,
        ...productData
    };
    window.products.push(newProduct);
    saveProductsToStorage();
    return newProduct;
}

// تابع برای حذف محصول
function deleteProductById(productId) {
    window.products = window.products.filter(product => product.id !== productId);
    saveProductsToStorage();
}

// تابع برای آپدیت محصول
function updateProduct(productId, updatedData) {
    const productIndex = window.products.findIndex(product => product.id === productId);
    if (productIndex !== -1) {
        window.products[productIndex] = { ...window.products[productIndex], ...updatedData };
        saveProductsToStorage();
        return window.products[productIndex];
    }
    return null;
}

// لود محصولات هنگام بارگذاری
document.addEventListener('DOMContentLoaded', function() {
    loadProductsFromStorage();
});