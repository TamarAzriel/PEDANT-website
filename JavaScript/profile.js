// profile.js - ניהול פרופיל המשתמש

// בדיקה האם המשתמש מחובר כשהדף נטען
document.addEventListener('DOMContentLoaded', function() {
  loadProfile();
});

// טעינת מידע הפרופיל
function loadProfile() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  
  if (!user) {
    // אם אין משתמש מחובר, הפנה לעמוד הכניסה
    window.location.href = 'login.html';
    return;
  }
  
  // הצגת מידע הפרופיל
  document.getElementById('profile-name').textContent = user.name || 'N/A';
  document.getElementById('profile-email').textContent = user.email || 'N/A';
  
  // הצגת התאריך שהחשבון נוצר
  const createdDate = new Date(user.createdAt || new Date());
  const formattedDate = createdDate.toLocaleDateString('he-IL');
  document.getElementById('profile-date').textContent = formattedDate;

  // טעינת הזמנות קודמות
  loadOrders(user.email);
}

// טעינת הזמנות קודמות
function loadOrders(email) {
  const ordersContainer = document.getElementById('orders-list');
  if (!ordersContainer) return;

  const allOrders = JSON.parse(localStorage.getItem('allOrders')) || {};
  const userOrders = allOrders[email] || [];

  if (userOrders.length === 0) {
    ordersContainer.innerHTML = `
      <div class="profile-card-luxury" style="text-align: center; padding: 4rem; opacity: 0.4;">
        <p style="font-size: 0.9rem; letter-spacing: 0.1em;">No previous orders found.</p>
      </div>
    `;
    return;
  }

  ordersContainer.innerHTML = userOrders.map(order => `
    <div class="profile-card-luxury" style="margin-bottom: 2rem; padding: 2.5rem;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; border-bottom: 1px solid #eee; padding-bottom: 1.5rem;">
        <div>
          <span style="font-size: 8px; letter-spacing: 0.2em; opacity: 0.4; text-transform: uppercase;">Order Number</span>
          <h3 style="font-size: 1.1rem; font-weight: 300; margin-top: 0.5rem;">#${order.id}</h3>
        </div>
        <div style="text-align: right;">
          <span style="font-size: 8px; letter-spacing: 0.2em; opacity: 0.4; text-transform: uppercase;">Date</span>
          <p style="font-size: 0.9rem; margin-top: 0.5rem; opacity: 0.6;">${order.date}</p>
        </div>
      </div>
      
      <div style="margin-bottom: 2rem;">
        <span style="font-size: 8px; letter-spacing: 0.2em; opacity: 0.4; text-transform: uppercase; display: block; margin-bottom: 1rem;">Selections</span>
        ${order.items.map(item => `
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span style="font-size: 0.85rem; opacity: 0.7;">${item.name}</span>
            <span style="font-size: 0.85rem; opacity: 0.5;">NIS ${item.price.toFixed(2)}</span>
          </div>
        `).join('')}
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 1.5rem; border-top: 1px solid #eee;">
        <span style="font-size: 9px; letter-spacing: 0.2em; font-weight: 600; text-transform: uppercase;">Total Amount</span>
        <span style="font-size: 1.2rem; font-weight: 300;">NIS ${order.total.toFixed(2)}</span>
      </div>
    </div>
  `).join('');
}

// עריכת פרופיל
function editProfile() {
  alert('עדכון פרופיל עדיין בתפוצה בקרוב!');
  // כאן אפשר להוסיף פרטים על עריכה של הפרופיל
}

// התנתקות
function logout(event) {
  if (event) {
    event.preventDefault();
  }
  
  localStorage.removeItem('currentUser');
  alert('הותקנת בהצלחה!');
  window.location.href = 'index.html';
}
