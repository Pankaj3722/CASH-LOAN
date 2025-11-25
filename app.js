// basic behaviour: EMI calc, validate CIBIL >= 350, save application locally (for admin view)
(function(){
  const q = s => document.querySelector(s);

  // EMI calc
  q('#heroCalc').addEventListener('click', ()=>{
    const A = Number(q('#heroAmount').value)||0;
    const n = Number(q('#heroTenure').value)||1;
    const r = (Number(q('#heroInterest').value)||0)/100/12;
    if (A<=0){ q('#heroResult').innerText='Enter a valid amount'; return; }
    const m = (A*r)/(1-Math.pow(1+r,-n)) || (A/n);
    q('#heroResult').innerHTML = `<strong>Estimated monthly:</strong> ₹ ${m.toFixed(2)} • Total ₹ ${(m*n).toFixed(2)}`;
  });

  // install prompt
  let deferredPrompt;
  const installBtn = q('#installBtn');
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

  // submit application
  q('#applyBtn').addEventListener('click', ()=>{
    const name = q('#name').value.trim();
    const phone = q('#phone').value.trim();
    const amount = Number(q('#amount').value)||0;
    const tenure = Number(q('#tenure').value)||0;
    const interest = Number(q('#interest').value)||0;
    const cibil = Number(q('#cibil').value)||0;

    if(!name || !phone || amount<=0){ q('#status').innerText='Please fill name, phone and valid amount.'; return; }
    if(cibil < 350){ q('#status').innerText='Sorry — minimum CIBIL required is 350. Application rejected.'; return; }

    // collect filenames (no server upload here)
    const aadhaar = q('#aadhaar').files.length ? q('#aadhaar').files[0].name : '';
    const pan = q('#pan').files.length ? q('#pan').files[0].name : '';
    const selfie = q('#selfie').files.length ? q('#selfie').files[0].name : '';

    const app = {
      id: Date.now(),
      name, phone, amount, tenure, interest, cibil,
      aadhaar, pan, selfie,
      created: new Date().toISOString(),
      status: 'pending'
    };

    // save locally
    let apps = JSON.parse(localStorage.getItem('loan_apps')||'[]');
    apps.push(app);
    localStorage.setItem('loan_apps', JSON.stringify(apps));

    q('#status').innerText = 'Application submitted — thanks. Admin will review (stored locally).';
    // clear a few fields
    q('#name').value=''; q('#phone').value=''; q('#amount').value=''; q('#cibil').value='350';
  });

  q('#clearLocal').addEventListener('click', ()=>{
    localStorage.removeItem('loan_apps'); q('#status').innerText='Local application data cleared.';
  });

})();
