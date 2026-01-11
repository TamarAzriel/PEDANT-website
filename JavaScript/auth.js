// auth.js - ניהול הרשמה ו-התחברות

let usersDatabase = JSON.parse(localStorage.getItem('usersDatabase')) || [];

// פונקציית עזר להצגת הודעה יוקרתית בתוך הכרטיסייה
function showSuccessState(title, message, nextStep) {
  const cardContent = document.querySelector('.auth-grid');
  if (!cardContent) {
    // אם אנחנו לא בדף התחברות, פשוט נריץ את הצעד הבא
    if (nextStep) nextStep();
    return;
  }

  cardContent.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
  cardContent.style.opacity = '0';
  cardContent.style.transform = 'translateY(-20px)';

  setTimeout(() => {
    const card = document.querySelector('.luxury-auth-card');
    card.innerHTML = `
      <div class="success-state" style="text-align: center; padding: 4rem 0; animation: fade-up 1.2s ease forwards;">
        <div class="success-line" style="width: 40px; height: 1px; background: #000; margin: 0 auto 3rem; opacity: 0.2;"></div>
        <span class="luxury-subheading" style="display: block; margin-bottom: 1.5rem; letter-spacing: 0.5em;">${title}</span>
        <h2 class="luxury-display" style="font-size: 2.5rem; margin-bottom: 2rem;">${message}</h2>
        <p class="luxury-body" style="opacity: 0.4;">Redirecting...</p>
      </div>
    `;
    
    setTimeout(nextStep, 2000);
  }, 800);
}

document.addEventListener('DOMContentLoaded', function() {
  updateNavBar();
  
  const loginForm = document.getElementById('login-form');
  if (loginForm) loginForm.addEventListener('submit', handleLogin);
  
  const signupForm = document.getElementById('signup-form');
  if (signupForm) signupForm.addEventListener('submit', handleSignup);
});

// עדכון ה-Navbar בזמן אמת
function updateNavBar() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  
  const loginLink = document.getElementById('nav-login');
  const signupLink = document.getElementById('nav-signup');
  const profileLink = document.getElementById('nav-profile');
  const logoutLink = document.getElementById('nav-logout');
  
  if (user) {
    if (loginLink) loginLink.style.display = 'none';
    if (signupLink) signupLink.style.display = 'none';
    if (profileLink) {
      profileLink.style.display = 'block';
      profileLink.textContent = user.name.toUpperCase();
    }
    if (logoutLink) logoutLink.style.display = 'block';
  } else {
    if (loginLink) loginLink.style.display = 'block';
    if (signupLink) signupLink.style.display = 'block';
    if (profileLink) profileLink.style.display = 'none';
    if (logoutLink) logoutLink.style.display = 'none';
  }
}

function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();
  
  const user = usersDatabase.find(u => u.email === email && u.password === password);
  
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify({ name: user.name, email: user.email }));
    showSuccessState('ACCESS GRANTED', `Welcome back, ${user.name}`, () => {
      window.location.href = 'index.html';
    });
  } else {
    alert('Invalid credentials. Please try again.');
  }
}

function handleSignup(event) {
  event.preventDefault();
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value.trim();
  
  if (!name || !email || !password) return;

  if (usersDatabase.find(u => u.email === email)) {
    alert('Account already exists with this email.');
    return;
  }
  
  const newUser = { name, email, password, createdAt: new Date().toISOString() };
  usersDatabase.push(newUser);
  localStorage.setItem('usersDatabase', JSON.stringify(usersDatabase));
  localStorage.setItem('currentUser', JSON.stringify({ name, email }));
  
  showSuccessState('JOURNEY BEGUN', `Welcome to PÉDANT, ${name}`, () => {
    window.location.href = 'index.html';
  });
}

// פונקציית התנתקות
function logout(event) {
  if (event) event.preventDefault();
  localStorage.removeItem('currentUser');
  window.location.href = 'index.html';
}
