// cart.js - ניהול העגלה, הוספה לסל ואישור כרטיסיית בוטיק יוקרתית

const injectCartStyles = () => {
  if (document.getElementById('cart-success-styles')) return;
  const style = document.createElement('style');
  style.id = 'cart-success-styles';
  style.innerHTML = `
    .cart-success-overlay {
      position: fixed; inset: 0; z-index: 10000;
      background: rgba(0,0,0,0.05);
      backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px);
      display: flex; align-items: center; justify-content: center;
      opacity: 0; visibility: hidden; transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .cart-success-overlay.active { opacity: 1; visibility: visible; }
    
    .cart-success-card { 
      background: #f2f2f2; /* אפור סטודיו יוקרתי */
      padding: 4.5rem 3rem; border-radius: 40px; 
      width: 90%; max-width: 550px; text-align: center;
      box-shadow: 0 50px 100px rgba(0,0,0,0.1);
      transform: translateY(40px); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
    }
    .cart-success-overlay.active .cart-success-card { transform: translateY(0); }
    
    .success-line { width: 40px; height: 1px; background: #000; margin: 0 auto 2.5rem; opacity: 0.15; }
    
    .continue-btn {
      background: #000; color: #fff; border: none; margin-top: 3rem; width: 100%;
      padding: 1.25rem; font-size: 0.75rem; letter-spacing: 0.3em;
      cursor: pointer; transition: all 0.4s ease; border-radius: 4px;
      text-transform: uppercase;
    }
    .continue-btn:hover { background: #333; letter-spacing: 0.35em; }
  `;
  document.head.appendChild(style);
};

function showCartSuccess(productName) {
  injectCartStyles();
  let overlay = document.querySelector('.cart-success-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'cart-success-overlay';
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `
    <div class="cart-success-card">
      <div class="success-line"></div>
      <span style="display:block; font-size:9px; letter-spacing:0.5em; opacity:0.4; margin-bottom:1.5rem; text-transform:uppercase;">Selection Added</span>
      <h2 style="font-family: 'Inter', sans-serif; font-size:2.2rem; font-weight:100; margin-bottom:1.5rem; text-transform:uppercase; letter-spacing:0.05em;">${productName}</h2>
      <p style="font-size:0.85rem; opacity:0.5; font-weight:300; line-height:1.6;">This masterpiece has been successfully added to your shopping bag.</p>
      <button class="continue-btn" onclick="closeCartSuccess()">Continue Shopping</button>
    </div>
  `;

  setTimeout(() => overlay.classList.add('active'), 10);
}

window.closeCartSuccess = function() {
  const overlay = document.querySelector('.cart-success-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    setTimeout(() => overlay.remove(), 600);
  }
};

window.addToCart = function(productId) {
  const pId = parseInt(productId);
  const product = productsDatabase.find(p => p.id === pId);
  if (!product) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  showCartSuccess(product.name);
};

function renderCart() {
  const container = document.getElementById("cart-items");
  if (!container) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const subtotalVal = document.getElementById("cart-subtotal-val");
  const totalVal = document.getElementById("cart-total-final");
  const discountRow = document.getElementById("discount-row");
  const discountVal = document.getElementById("cart-discount-val");

  if (cart.length === 0) {
    container.innerHTML = `<div style="padding:100px 0; text-align:center; opacity:0.3;">Your bag is empty.</div>`;
    if (subtotalVal) subtotalVal.textContent = "NIS 0.00";
    if (totalVal) totalVal.textContent = "NIS 0.00";
    if (discountRow) discountRow.style.display = "none";
    return;
  }

  let subtotal = 0;
  container.innerHTML = cart.map((item, index) => {
    subtotal += item.price;
    return `
      <div class="cart-item" style="display:flex; gap:2.5rem; padding:3rem 0; border-bottom:1px solid rgba(0,0,0,0.05);">
        <div style="width:100px; aspect-ratio:1/1; background:#f9f9f9; border-radius:12px; display:flex; align-items:center; justify-content:center;">
          <img src="${item.image}" style="max-width:80%; max-height:80%; object-fit:contain; mix-blend-mode:multiply;">
        </div>
        <div style="flex:1; display:flex; flex-direction:column; justify-content:center;">
          <span style="font-size:7px; letter-spacing:0.4em; opacity:0.3; text-transform:uppercase; margin-bottom:0.5rem;">${item.brand}</span>
          <h3 style="font-size:1rem; font-weight:300; letter-spacing:0.05em; text-transform:uppercase; margin-bottom:0.5rem;">${item.name}</h3>
          <div style="font-size:0.85rem; opacity:0.6;">NIS ${item.price.toFixed(2)}</div>
        </div>
        <div style="display:flex; align-items:center;">
          <button onclick="removeCartItem(${index})" style="background:none; border:none; font-size:8px; opacity:0.3; letter-spacing:0.2em; cursor:pointer; text-transform:uppercase;">Remove</button>
        </div>
      </div>
    `;
  }).join("");

  const discountAmount = parseFloat(sessionStorage.getItem("cartDiscount")) || 0;
  if (subtotalVal) subtotalVal.textContent = "NIS " + subtotal.toFixed(2);
  if (discountAmount > 0 && discountRow) {
    discountRow.style.display = "flex";
    discountVal.textContent = "-NIS " + discountAmount.toFixed(2);
  }
  if (totalVal) totalVal.textContent = "NIS " + (subtotal - discountAmount).toFixed(2);
}

window.removeCartItem = function(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
};

window.applyCoupon = function() {
  const input = document.getElementById("coupon-code");
  const message = document.getElementById("coupon-message");
  if(!input) return;
  const code = input.value.trim().toUpperCase();
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  
  if (cart.length === 0) {
    if(message) message.textContent = "BAG IS EMPTY";
    return;
  }

  let subtotal = cart.reduce((acc, item) => acc + item.price, 0);
  if (code === "PEDANT20") {
    const discount = subtotal * 0.2;
    sessionStorage.setItem("cartDiscount", discount);
    if(message) message.textContent = "20% DISCOUNT APPLIED";
    renderCart();
  } else {
    if(message) message.textContent = "INVALID CODE";
  }
};

document.addEventListener("DOMContentLoaded", renderCart);
