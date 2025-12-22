// cart.js - ניהול העגלה, הצגת מוצרים וקופונים

// פונקציה להוספת מוצר לסל
function addToCart(productId) {
  const product = productsDatabase.find(p => p.id === productId);
  if (!product) {
    console.error("Product not found");
    return;
  }
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));

  Swal.fire({
    title: 'המוצר נוסף לסל!',
    text: `הוספת את ${product.name} בהצלחה`,
    icon: 'success',
    confirmButtonText: 'המשך בקנייה',
    confirmButtonColor: '#000'
  });
}

// פונקציה להצגת מוצרים בקטלוג
function renderProducts(brandFilter) {
  const container = document.querySelector(".brand-products");
  if (!container) return; 

  container.innerHTML = "";
  const filteredProducts = productsDatabase.filter(p => p.brand === brandFilter);

  filteredProducts.forEach(product => {
    const productHTML = `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p class="price">${product.price} ₪</p>
        <button onclick="addToCart(${product.id})" class="add-to-cart-btn">
          הוספה לסל
        </button>
      </div>
    `;
    container.innerHTML += productHTML;
  });
}

// --- ניהול דף העגלה והקופונים ---
document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  
  // אם יש כפתור לניקוי עגלה
  const clearBtn = document.getElementById("clear-cart");
  if(clearBtn) {
      clearBtn.addEventListener("click", () => {
        localStorage.setItem("cart", JSON.stringify([]));
        localStorage.removeItem("activeCoupon"); // איפוס קופון
        renderCart();
      });
  }
});

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function setCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function formatPrice(num) {
  return "₪" + num.toFixed(2);
}

// פונקציה ראשית לרינדור העגלה
function renderCart() {
  const cartItemsEl = document.getElementById("cart-items");
  // אלמנטים של סיכום
  const subtotalEl = document.getElementById("cart-subtotal-val");
  const discountRow = document.getElementById("discount-row");
  const discountValEl = document.getElementById("cart-discount-val");
  const totalFinalEl = document.getElementById("cart-total-final");
  const couponMsg = document.getElementById("coupon-message");

  if (!cartItemsEl) return; // אנחנו לא בדף עגלה

  const cart = getCart();

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `
      <div class="cart-empty">
        הסל שלך ריק כרגע.<br>
        אפשר לחזור לדף המוצרים ולהוסיף מוצרי טיפוח לפנים.
      </div>
    `;
    if(subtotalEl) subtotalEl.textContent = "₪0";
    if(totalFinalEl) totalFinalEl.textContent = "₪0";
    if(discountRow) discountRow.style.display = "none";
    return;
  }

  // 1. חישוב סכום ביניים
  let subtotal = 0;
  const html = cart.map((item, index) => {
      const priceNum = Number(item.price) || 0;
      subtotal += priceNum;
      return `
        <div class="cart-item">
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">${formatPrice(priceNum)}</div>
          </div>
          <button class="cart-item-remove" onclick="removeCartItem(${index})">
            הסר
          </button>
        </div>
      `;
    }).join("");

  cartItemsEl.innerHTML = html;

  // 2. בדיקת קופון
  let discount = 0;
  const activeCoupon = JSON.parse(localStorage.getItem("activeCoupon"));

  if (activeCoupon) {
      // לדוגמה: אם סוג הקופון הוא אחוזים
      if (activeCoupon.type === 'percent') {
          discount = subtotal * (activeCoupon.value / 100);
      }
      
      // עדכון התצוגה של שורת ההנחה
      if(discountRow) discountRow.style.display = "flex";
      if(discountValEl) discountValEl.textContent = "-" + formatPrice(discount);
      
      // הודעה שקופון פעיל (רק אם לא כתובה כבר הודעה אחרת)
      if(couponMsg && couponMsg.innerText === "") {
          couponMsg.textContent = `קופון ${activeCoupon.code} פעיל!`;
          couponMsg.className = "coupon-message success";
      }
  } else {
      if(discountRow) discountRow.style.display = "none";
  }

  // 3. עדכון סכומים
  const finalTotal = subtotal - discount;
  
  if(subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if(totalFinalEl) totalFinalEl.textContent = formatPrice(finalTotal);
}

// מחיקת פריט מהסל
window.removeCartItem = function(index) {
  const cart = getCart();
  cart.splice(index, 1);
  setCart(cart);
  renderCart();
};

// --- לוגיקת קופון ---
window.applyCoupon = function() {
    const codeInput = document.getElementById("coupon-code");
    const msgEl = document.getElementById("coupon-message");
    const code = codeInput.value.trim().toUpperCase();

    if (!code) {
        msgEl.textContent = "אנא הזן קוד קופון";
        msgEl.className = "coupon-message error";
        return;
    }

    // רשימת קופונים מוגדרת מראש
    const validCoupons = {
        "SALE10": { type: 'percent', value: 10 }, // 10% הנחה
        "PEDANT20": { type: 'percent', value: 20 },
        "WELCOME50": { type: 'fixed', value: 50 } // לא מומש כרגע בקוד, אבל אופציה
    };

    if (validCoupons[code]) {
        const couponData = validCoupons[code];
        couponData.code = code; // שומרים את השם
        
        localStorage.setItem("activeCoupon", JSON.stringify(couponData));
        
        msgEl.textContent = "הקופון הופעל בהצלחה!";
        msgEl.className = "coupon-message success";
        renderCart(); // רענון כדי לחשב מחיר מחדש
    } else {
        msgEl.textContent = "קוד קופון לא תקין";
        msgEl.className = "coupon-message error";
        localStorage.removeItem("activeCoupon");
        renderCart();
    }
};