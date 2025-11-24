// Simple PWA client-only app. Stores applications in localStorage as fallback.
// Replace contactEmail below with your real contact before publishing.
const contactEmail = "contact@example.com";
document.getElementById('contactEmail').innerText = contactEmail;

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js').catch(err => console.log('SW err', err));
}

// Signup flow (email-only)
const signupSection = document.getElementById('signupSection');
const applySection = document.getElementById('applySection');
const emailInput = document.getElementById('emailInput');
const signupBtn = document.getElementById('signupBtn');

signupBtn.onclick = () => {
  const email = emailInput.value.trim();
  if (!email || !email.includes('@')) { alert('Valid email required'); return; }
  localStorage.setItem('loanpay_user_email', email);
  signupSection.classList.add('hidden');
  applySection.classList.remove('hidden');
};

// Apply form
document.getElementById('applyBtn').onclick = () => {
  const app = {
    email: localStorage.getItem('loanpay_user_email') || '',
    name: document.getElementById('name').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    amount: Number(document.getElementById('amount').value),
    tenure: Number(document.getElementById('tenure').value),
    interest: Number(document.getElementById('interest').value),
    purpose: document.getElementById('purpose').value.trim(),
    date: new Date().toISOString()
  };
  if (!app.name || !app.amount || !app.tenure) { alert('Name, amount and tenure required'); return; }

  // Save locally
  let apps = JSON.parse(localStorage.getItem('loanpay_apps') || '[]');
  apps.push(app);
  localStorage.setItem('loanpay_apps', JSON.stringify(apps));

  // Show basic amortization example (simple interest)
  const monthlyInterestRate = (app.interest/100)/12;
  const monthlyPayment = ((app.amount * monthlyInterestRate) / (1 - Math.pow(1+monthlyInterestRate, -app.tenure))).toFixed(2);
  document.getElementById('status').innerHTML = `<strong>Submitted.</strong> Monthly ≈ ₹ ${monthlyPayment}`;
  // Clear form
  document.getElementById('name').value = '';
  document.getElementById('phone').value = '';
  document.getElementById('amount').value = '';
  document.getElementById('tenure').value = '';
  document.getElementById('interest').value = '';
  document.getElementById('purpose').value = '';
};

// If already signed up, show apply
if (localStorage.getItem('loanpay_user_email')) {
  signupSection.classList.add('hidden');
  applySection.classList.remove('hidden');
}
