document.addEventListener("DOMContentLoaded", () => {
  const cartItemsEl = document.getElementById("cart-items");
  const subtotalEl = document.getElementById("cart-subtotal");
  const clearBtn = document.getElementById("clear-cart");
  const checkoutBtn = document.getElementById("checkout-btn");

  function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
  }

  function setCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function formatPrice(num) {
    return "₪" + num.toFixed(2);
  }

  function renderCart() {
    const cart = getCart();

    if (cart.length === 0) {
      cartItemsEl.innerHTML = `
        <div class="cart-empty">
          הסל שלך ריק כרגע.<br>
          אפשר לחזור לדף המוצרים ולהוסיף מוצרי טיפוח לפנים.
        </div>
      `;
      subtotalEl.textContent = "₪0";
      return;
    }

    let subtotal = 0;

    const html = cart
      .map((item, index) => {
        const priceNum = Number(item.price) || 0;
        subtotal += priceNum;

        return `
          <div class="cart-item">
            <div class="cart-item-info">
              <div class="cart-item-name">${item.name}</div>
              <div class="cart-item-price">${formatPrice(priceNum)}</div>
            </div>
            <button class="cart-item-remove" onclick="removeCartItem(${index})">
              Remove
            </button>
          </div>
        `;
      })
      .join("");

    cartItemsEl.innerHTML = html;
    subtotalEl.textContent = formatPrice(subtotal);
  }

  // פונקציה גלובלית למחיקה (כדי שה־onclick ב-HTML יעבוד)
  window.removeCartItem = function(index) {
    const cart = getCart();
    cart.splice(index, 1);
    setCart(cart);
    renderCart();
  };

  clearBtn.addEventListener("click", () => {
    setCart([]);
    renderCart();
  });

  checkoutBtn.addEventListener("click", () => {
    alert("This is a demo checkout 🙂\nבפרויקט הזה אין תשלום אמיתי, רק סימולציה.");
  });

  renderCart();
});
