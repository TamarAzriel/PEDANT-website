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
            <div class="item-price">€${itemTotal}</div>
        `;

        summaryList.appendChild(itemDiv);
    });

    // עדכון הסכום הכולל
    if (totalPriceElement) {
        totalPriceElement.textContent = "€" + total;
    }

    // 3. טיפול בטופס (סימולציה של הצלחה יוקרתית)
    const checkoutForm = document.getElementById("checkout-form");
    if (checkoutForm) {
        checkoutForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const fullname = document.getElementById("fullname").value;
            const submitBtn = checkoutForm.querySelector("button");
            
            // אפקט כפתור נטען
            submitBtn.textContent = "VERIFYING...";
            submitBtn.disabled = true;

            setTimeout(() => {
                // יצירת מספר הזמנה רנדומלי יוקרתי
                const orderId = "PD" + Math.floor(100000 + Math.random() * 900000);
                
                // יצירת ה-Overlay של ההצלחה ב-JS (כדי למנוע שינויים ב-HTML)
                const overlay = document.createElement('div');
                overlay.className = 'success-overlay-v2';
                overlay.innerHTML = `
                    <div class="success-card-v2">
                        <span class="order-number-v2">ORDER #${orderId}</span>
                        <span class="luxury-subheading">SUCCESSFUL TRANSACTION</span>
                        <h2 class="luxury-display" style="font-size: 2.5rem; margin-top: 1.5rem; margin-bottom: 2rem;">
                            THANK YOU, ${fullname.split(' ')[0]}
                        </h2>
                        <p class="luxury-body" style="opacity: 0.5;">
                            A confirmation email with your order details has been sent to your inbox.<br>
                            Your journey with PÉDANT has officially begun.
                        </p>
                        <button class="success-btn-v2" onclick="window.location.href='index.html'">BACK TO ARCHIVE</button>
                    </div>
                `;
                document.body.appendChild(overlay);
                
                // הפעלת האנימציה
                setTimeout(() => overlay.classList.add('active'), 100);
                
                // ריקון הסל
                localStorage.removeItem("cart");
            }, 2000);
        });
    }
});