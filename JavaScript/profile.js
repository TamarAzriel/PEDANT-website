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
