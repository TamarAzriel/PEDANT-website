// auth.js - ניהול הרשמה ו-התחברות

// מסד נתונים דמוי-משתמשים (בפועל זה היה צריך להיות בשרת)
let usersDatabase = JSON.parse(localStorage.getItem('usersDatabase')) || [];

// הוספת משתמש לדוגמה לבדיקה (רק אם אין משתמשים)
if (usersDatabase.length === 0) {
  usersDatabase = [
    {
      name: "Test User",
      email: "test@example.com",
      password: "123456",
      createdAt: new Date().toISOString()
    }
  ];
  localStorage.setItem('usersDatabase', JSON.stringify(usersDatabase));
  console.log('Test user created:', usersDatabase);
}

// בדיקה בטעינת הדף
document.addEventListener('DOMContentLoaded', function() {
  updateNavBar();
  
  // עיבוד טופס ה-login
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  // עיבוד טופס ה-signup
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
  }
});

// עדכון ה-navigation bar בהתאם למצב ההתחברות
function updateNavBar() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  
  const profileItem = document.getElementById('nav-profile-item');
  const loginItem = document.getElementById('nav-login');
  const signupItem = document.getElementById('nav-signup');
  const logoutItem = document.getElementById('nav-logout');
  
  if (user) {
    // המשתמש מחובר
    if (profileItem) profileItem.style.display = 'block';
    if (loginItem) loginItem.style.display = 'none';
    if (signupItem) signupItem.style.display = 'none';
    if (logoutItem) logoutItem.style.display = 'block';
  } else {
    // המשתמש לא מחובר
    if (profileItem) profileItem.style.display = 'none';
    if (loginItem) loginItem.style.display = 'block';
    if (signupItem) signupItem.style.display = 'block';
    if (logoutItem) logoutItem.style.display = 'none';
  }
}

// עיבוד התחברות
function handleLogin(event) {
  event.preventDefault();
  
  console.log('Form submitted');
  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  
  console.log('Email:', email, 'Password:', password);
  console.log('Users in database:', usersDatabase);
  
  if (!email || !password) {
    alert('אנא מלא את כל השדות!');
    return;
  }
  
  // חיפוש משתמש במסד הנתונים
  const user = usersDatabase.find(u => u.email === email && u.password === password);
  
  console.log('Found user:', user);
  
  if (user) {
    // התחברות מוצלחת
    const userToStore = {
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };
    localStorage.setItem('currentUser', JSON.stringify(userToStore));
    alert('ברוכים הבאים ' + user.name + '!');
    window.location.href = 'profile.html';
  } else {
    alert('שגיאה: דוא"ל או סיסמה לא נכונים!\n\nאם אתה משתמש חדש, אנא התחבר תחילה דרך Sign Up');
  }
}

// עיבוד רישום
function handleSignup(event) {
  event.preventDefault();
  
  const nameInput = document.getElementById('signup-name');
  const emailInput = document.getElementById('signup-email');
  const passwordInput = document.getElementById('signup-password');
  
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  
  console.log('Signup attempt:', { name, email, password });
  
  if (!name || !email || !password) {
    alert('אנא מלא את כל השדות!');
    return;
  }
  
  if (password.length < 6) {
    alert('הסיסמה חייבת להיות לפחות 6 תווים!');
    return;
  }
  
  // בדיקה אם המשתמש כבר קיים
  const existingUser = usersDatabase.find(u => u.email === email);
  
  if (existingUser) {
    alert('שגיאה: דוא"ל זה כבר רשום!');
    return;
  }
  
  // יצירת משתמש חדש
  const newUser = {
    name: name,
    email: email,
    password: password,
    createdAt: new Date().toISOString()
  };
  
  // הוספת למסד הנתונים
  usersDatabase.push(newUser);
  localStorage.setItem('usersDatabase', JSON.stringify(usersDatabase));
  
  console.log('User registered successfully:', newUser);
  
  // התחברות אוטומטית
  const userToStore = {
    name: newUser.name,
    email: newUser.email,
    createdAt: newUser.createdAt
  };
  localStorage.setItem('currentUser', JSON.stringify(userToStore));
  
  alert('חשבון נוצר בהצלחה! ברוכים הבאים ' + name + '!');
  window.location.href = 'profile.html';
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
