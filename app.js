// app.js - simple frontend checks and UI actions
(function(){
  const minCibil = 350;
  document.getElementById('minCibil').innerText = minCibil;

  // Install prompt PWA
  let deferredPrompt;
  const installBtn = document.getElementById('installBtn');
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.hidden = false;
  });
  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    deferredPrompt = null;
    installBtn.hidden = true;
  });

  // submit handler
  const submitBtn = document.getElementById('submitBtn');
  const status = document.getElementById('status');

  function showStatus(msg, ok=true){
    status.innerText = msg;
    status.style.color = ok ? '#0f5132' : '#7a1b1b';
    status.style.background = ok ? 'rgba(16,185,129,0.06)' : 'rgba(255,0,0,0.04)';
    status.style.padding = '12px';
    status.style.borderRadius = '10px';
  }

  submitBtn.addEventListener('click', ()=>{
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const amount = Number(document.getElementById('amount').value);
    const tenure = Number(document.getElementById('tenure').value);
    const interest = Number(document.getElementById('interest').value);
    const cibil = Number(document.getElementById('cibil').value);

    const aadhaarFile = document.getElementById('aadhaar').files[0];
    const panFile = document.getElementById('pan').files[0];
    const selfieFile = document.getElementById('selfie').files[0];

    if (!name) { showStatus('Enter full name', false); return; }
    if (!phone || phone.length < 10) { showStatus('Enter valid phone', false); return; }
    if (!amount || amount < 1000) { showStatus('Enter loan amount (min 1000)', false); return; }
    if (!tenure || tenure <= 0) { showStatus('Enter tenure months', false); return; }
    if (Number.isNaN(cibil) || cibil < minCibil) { showStatus('CIBIL too low — minimum required: ' + minCibil, false); return; }

    // require uploads
    if (!aadhaarFile || !panFile || !selfieFile){ showStatus('Please upload Aadhaar, PAN and Selfie', false); return; }

    showStatus('Submitting application — please wait...');

    // Simple simulate upload + local save
    setTimeout(()=>{
      // store local copy
      const entry = { name, phone, amount, tenure, interest, cibil, time: Date.now() };
      const list = JSON.parse(localStorage.getItem('loan_apps')||'[]');
      list.unshift(entry);
      localStorage.setItem('loan_apps', JSON.stringify(list));

      showStatus('Application submitted successfully. Our team will review documents. (This is demo frontend only.)');
      // clear (optional)
      // document.getElementById('name').value = '';
    }, 1200);
  });
})();
