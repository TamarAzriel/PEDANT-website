// cart.js - ניהול העגלה והצגת מוצרים

// פונקציה להוספת מוצר לסל
function addToCart(productId) {
  // חיפוש המוצר בדאטה בייס
  const product = productsDatabase.find(p => p.id === productId);
  
  if (!product) {
    console.error("Product not found");
    return;
  }

  // שליפת הסל הנוכחי מהזיכרון
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // הוספת המוצר לסל
  cart.push(product);

  // שמירה חזרה לזיכרון
  localStorage.setItem("cart", JSON.stringify(cart));

 // Elegant English Popup
  Swal.fire({
    title: 'Added to Cart',
    text: `You have added ${product.name} to your cart.`,
    icon: null, // ללא אייקון - למראה נקי ומינימליסטי
    confirmButtonText: 'CONTINUE SHOPPING',
    buttonsStyling: false, // מאפשר לנו להשתמש בעיצוב שלנו
    customClass: {
      popup: 'elegant-modal',
      title: 'elegant-title',
      htmlContainer: 'elegant-content',
      confirmButton: 'elegant-btn'
    }
  });
  // כאן אפשר להוסיף עדכון של אייקון העגלה אם תרצי בעתי

// פונקציה להצגת מוצרים בדף הקטלוג
function renderProducts(brandFilter) {
  const container = document.querySelector(".brand-products");
  if (!container) return; // אם אנחנו לא בדף מוצרים, לא עושים כלום

  // ניקוי התוכן הקיים
  container.innerHTML = "";

  // סינון המוצרים לפי המותג
  const filteredProducts = productsDatabase.filter(p => p.brand === brandFilter);

  // יצירת HTML עבור כל מוצר
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

// ניהול דף העגלה (Cart Page)
document.addEventListener("DOMContentLoaded", () => {
  const cartItemsEl = document.getElementById("cart-items");
  const subtotalEl = document.getElementById("cart-subtotal");
  const clearBtn = document.getElementById("clear-cart");
  const checkoutBtn = document.getElementById("checkout-btn");

  // אם אנחנו לא בדף העגלה, הפונקציה renderCart לא צריכה לרוץ
  if (!cartItemsEl) return;

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
      // אם האלמנט קיים, נעדכן אותו
      if(subtotalEl) subtotalEl.textContent = "₪0";
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
    
    // בודקים אם יש אלמנט לסיכום מחיר (ייתכן שלא קיים בכל הדפים)
    if(subtotalEl) {
        subtotalEl.textContent = formatPrice(subtotal);
    } else {
        // אם אין אלמנט סיכום (כמו בעיצוב הנוכחי שלך), נוסיף שורה ידנית
        const totalDiv = document.createElement('div');
        totalDiv.style.marginTop = "20px";
        totalDiv.style.fontWeight = "bold";
        totalDiv.textContent = "סה\"כ לתשלום: " + formatPrice(subtotal);
        cartItemsEl.appendChild(totalDiv);
    }
  }

  // מחיקת פריט מהסל
  window.removeCartItem = function(index) {
    const cart = getCart();
    cart.splice(index, 1);
    setCart(cart);
    renderCart();
  };

  if(clearBtn) {
      clearBtn.addEventListener("click", () => {
        setCart([]);
        renderCart();
      });
  }

  if(checkoutBtn) {
      checkoutBtn.addEventListener("click", () => {
        alert("This is a demo checkout 🙂\nבפרויקט הזה אין תשלום אמיתי, רק סימולציה.");
      });
  }

  renderCart();
});