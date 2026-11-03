document.addEventListener("DOMContentLoaded", function () {
    let cart = JSON.parse(localStorage.getItem('myCart')) || [];
    const cartContainer = document.getElementById('cart-container');
    const totalSpan = document.querySelector('.total');
    const completeBtn = document.getElementById('complete-btn');
    const addressBox = document.getElementById('address-box');
    const confirmOrderBtn = document.getElementById('confirm-order');

    function renderCart() {
        let total = 0;

        if (cart.length === 0) {
            cartContainer.innerHTML = "<p>السلة فارغة حالياً 🛍️</p>";
            totalSpan.innerText = "0";
            return;
        }

        cartContainer.innerHTML = "";

        cart.forEach((item, index) => {
            const quantity = item.quantity || 1;
            const itemTotal = item.price * quantity;
            total += itemTotal;

            cartContainer.innerHTML += `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:12px; border-bottom:1px solid #ddd; margin-bottom: 8px; background: #fff; border-radius: 6px;">
                    <div>
                        <strong style="font-size: 16px;">${item.name}</strong><br>
                        <small style="color: #666;">${item.price} EGP</small>
                    </div>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <button onclick="decreaseQty(${index})" style="background:#ddd; border:none; width:28px; height:28px; border-radius:4px; cursor:pointer; font-weight:bold;">-</button>
                        <span style="font-weight:bold; min-width:20px; text-align:center;">${quantity}</span>
                        <button onclick="increaseQty(${index})" style="background:#ddd; border:none; width:28px; height:28px; border-radius:4px; cursor:pointer; font-weight:bold;">+</button>
                    </div>
                    <div>
                        <strong>${itemTotal} EGP</strong>
                    </div>
                    <button onclick="removeItem(${index})" style="background:#ff4d4d; color:white; border:none; padding:6px 10px; border-radius:5px; cursor:pointer;">حذف</button>
                </div>
            `;
        });

        totalSpan.innerText = total;
    }

    // زيادة الكمية (+)
    window.increaseQty = function(index) {
        cart[index].quantity = (cart[index].quantity || 1) + 1;
        localStorage.setItem('myCart', JSON.stringify(cart));
        renderCart();
    };

    // إنقاص الكمية (-)
    window.decreaseQty = function(index) {
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
        } else {
            cart.splice(index, 1); // لو بقت صفر، احذف المنتج
        }
        localStorage.setItem('myCart', JSON.stringify(cart));
        renderCart();
    };

    // حذف منتج تماماً
    window.removeItem = function(index) {
        cart.splice(index, 1);
        localStorage.setItem('myCart', JSON.stringify(cart));
        renderCart();
    };

    renderCart();

    // إظهار صندوق العنوان
    if (completeBtn && addressBox) {
        completeBtn.addEventListener('click', function () {
            addressBox.style.display = 'block';
        });
    }

    // تأكيد الطلب وإرساله للواتساب
    if (confirmOrderBtn) {
        confirmOrderBtn.addEventListener('click', function () {
            const address = document.getElementById('address').value.trim();
            const phone = document.getElementById('phone').value.trim();

            if (address === "" || phone === "") {
                alert("من فضلك اكتب العنوان ورقم التليفون!");
                return;
            }

            if (cart.length === 0) {
                alert("السلة فارغة!");
                return;
            }

            let productsListText = "";
            let total = 0;
            cart.forEach((item, index) => {
                const qty = item.quantity || 1;
                const subTotal = item.price * qty;
                total += subTotal;
                productsListText += `${index + 1}. ${item.name} | الكمية: ${qty} | الإجمالي: ${subTotal} EGP\n`;
            });

            const storePhoneNumber = "201029103330"; // رقمك بالصيغة الدولية

            const message = `طلب جديد من المتجر 🛍️\n\n` +
                            `*المنتجات:*\n${productsListText}\n` +
                            `*الإجمالي الكلي:* ${total} EGP\n\n` +
                            `*العنوان:* ${address}\n` +
                            `*رقم التواصل:* ${phone}`;

            const whatsappUrl = `https://wa.me/${storePhoneNumber}?text=${encodeURIComponent(message)}`;

            window.open(whatsappUrl, '_blank');
            localStorage.removeItem('myCart');
            cart = [];
            renderCart();
            addressBox.style.display = 'none';
        });
    }
});