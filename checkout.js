
// שלב 1: שליפת הסל מה-localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const summaryList = document.getElementById("summary-list");
const totalPriceElement = document.getElementById("total-price");

let total = 0;

// עוברים על כל מוצר בסל
cart.forEach(item => {
const li = document.createElement("li");

// חשוב: לעדכן שמות שדות לפי מה שיש לך
// למשל item.productName במקום item.name אם זה השם אצלך
const name = item.name;
const price = Number(item.price); // דואגים שיהיה מספר
const qty = item.quantity ? item.quantity : 1;

li.textContent = `${name} × ${qty} - ${price * qty} ₪`;
summaryList.appendChild(li);

total += price * qty;
});

// מציגים את הסכום הכולל
totalPriceElement.textContent = total;


// שלב 2: טיפול בשליחה של טופס ה-Checkout
const checkoutForm = document.getElementById("checkout-form");

checkoutForm.addEventListener("submit", function (event) {
event.preventDefault(); // לא מרענן את העמוד

const fullname = document.getElementById("fullname").value;
const email = document.getElementById("email").value;
const address = document.getElementById("address").value;

// כאן אפשר לעשות ולידציות נוספות אם רוצים

// הודעת תשלום דמה
alert(
"This is a demo checkout 😊\n" +
"בפרויקט הזה אין תשלום אמיתי, רק סימולציה.\n\n" +
"תודה " + fullname + " על ההזמנה מ-PÉDANT!"
);

// מנקים את הסל אחרי "תשלום"
localStorage.removeItem("cart");

// חזרה לדף הבית / לדף תודה
window.location.href = "index.html";
});