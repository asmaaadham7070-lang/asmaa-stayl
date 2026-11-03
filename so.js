 document.addEventListener("DOMContentLoaded", function () {
    updateCartBadge(); // تحديث العداد أول ما الصفحة تفتح

    // ربط كل أزرار "إضافة للسلة" بالحدث مرة واحدة فقط
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            // بنجيب الكارت اللي فيه المنتج
            const productCard = this.closest('.product-card');
            
            // استخراج اسم المنتج من أول h3
            const nameElement = productCard.querySelector('h3');
            const productName = nameElement ? nameElement.innerText.trim() : "منتج";

            // استخراج السعر وتحويله لرقم
            const priceElement = productCard.querySelector('p');
            let price = 0;
            if (priceElement) {
                const priceText = priceElement.innerText.replace(/[^\d]/g, '');
                price = parseInt(priceText) || 0;
            }

            // إضافة المنتج للسلة بالكمية الصحيحة
            addToCart(productName, price);
        });
    });
});

// دالة إضافة المنتج للسلة وتخزينه في LocalStorage
function addToCart(productName, productPrice) {
    let cart = JSON.parse(localStorage.getItem('myCart')) || [];
    
    // هل المنتج موجود قبل كده في السلة؟
    let existingItem = cart.find(item => item.name === productName);

    if (existingItem) {
        // لو موجود، زود الكمية 1
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        // لو مش موجود، ضيفه جديد ومعاه الكمية 1
        cart.push({ name: productName, price: productPrice, quantity: 1 });
    }

    localStorage.setItem('myCart', JSON.stringify(cart));
    updateCartBadge(); // تحديث العداد فوق
    alert("تم إضافة المنتج للسلة بنجاح! 🛍️");
}

// دالة تحديث رقم العداد اللي في الهيدر
function updateCartBadge() {
    let cart = JSON.parse(localStorage.getItem('myCart')) || [];
    // حساب إجمالي الكميات لكل المنتجات في السلة
    let totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    let badge = document.getElementById('cart-count');
    if (badge) {
        badge.innerText = totalItems;
    }
}