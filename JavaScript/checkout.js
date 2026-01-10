// checkout.js - מעודכן עם תמונות ואנגלית

document.addEventListener("DOMContentLoaded", () => {
    // 1. שליפת הסל מה-localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const summaryList = document.getElementById("summary-list");
    const totalPriceElement = document.getElementById("total-price");

    let total = 0;

    // ניקוי הרשימה לפני הבנייה
    if (summaryList) summaryList.innerHTML = "";

    // 2. מעבר על המוצרים ובניית HTML לכל אחד
    cart.forEach(item => {
        const price = Number(item.price);
        const qty = item.quantity ? item.quantity : 1;
        const itemTotal = price * qty;
        total += itemTotal;

        // יצירת האלמנטים
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("summary-item");

        // בדיקה אם יש תמונה, אחרת נשתמש בתמונה ברירת מחדל או אייקון
        // הערה: וודאי שהנתיב לתמונות נכון (באותה תיקייה)
        const imgSrc = item.image ? item.image : 'logo.png'; 

        itemDiv.innerHTML = `
            <img src="${imgSrc}" alt="${item.name}">
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-qty">Qty: ${qty}</div>
            </div>
            <div class="item-price">${itemTotal} NIS</div>
        `;

        summaryList.appendChild(itemDiv);
    });

    // עדכון הסכום הכולל
    if (totalPriceElement) {
        totalPriceElement.textContent = total + " NIS";
    }

    // 3. טיפול בטופס (סימולציה)
    const checkoutForm = document.getElementById("checkout-form");
    if (checkoutForm) {
        checkoutForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const fullname = document.getElementById("fullname").value;
            const submitBtn = checkoutForm.querySelector("button");
            
            // אפקט כפתור נטען
            const originalText = submitBtn.textContent;
            submitBtn.textContent = "Processing...";
            submitBtn.disabled = true;

            setTimeout(() => {
                alert(`Thank you, ${fullname}!\nYour order has been placed successfully.`);
                
                // ריקון הסל
                localStorage.removeItem("cart");
                
                // חזרה לדף הבית
                window.location.href = "index.html";
            }, 1500);
        });
    }
});