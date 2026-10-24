/**
 * livrEXPRESS - Bamako, Mali
 * Interactive JavaScript Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Sticky Navbar on Scroll ---
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- 2. Mobile Drawer Navigation ---
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerClose = document.getElementById('drawerClose');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    mobileDrawer.classList.add('open');
    drawerBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    drawerBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // --- 3. Active Nav Link Highlighter ---
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.pageYOffset + 140;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // --- 4. Interactive Rate Calculator for Bamako ---
  const pickupSelect = document.getElementById('pickupCommune');
  const deliverySelect = document.getElementById('deliveryCommune');
  const packageSelect = document.getElementById('packageCategory');
  const priceDisplay = document.getElementById('calcPriceDisplay');
  const timeDisplay = document.getElementById('calcTimeDisplay');
  const btnBookFromCalc = document.getElementById('btnBookFromCalc');

  // Classification of Bamako neighborhoods
  const riveGauche = ['ACI 2000', 'Hamdallaye', 'Bamako Coura', 'Hippodrome', 'Quinzambougou', 'Korofina', 'Sotuba', 'Sebénikoro'];
  const riveDroite = ['Badalabougou', 'Faladié', 'Yirimadio', 'Torokorobougou', 'Baco Djicoroni'];
  const peripherie = ['Kati', 'Koulikoro'];

  function calculateRate() {
    if (!pickupSelect || !deliverySelect || !packageSelect) return;

    const from = pickupSelect.value;
    const to = deliverySelect.value;
    const pkg = packageSelect.value;

    let baseRate = 1500;
    let estimatedTime = '~35-45 minutes';

    const isPeriphery = peripherie.includes(from) || peripherie.includes(to);
    const isFromLeft = riveGauche.includes(from);
    const isToLeft = riveGauche.includes(to);
    const isFromRight = riveDroite.includes(from);
    const isToRight = riveDroite.includes(to);

    if (isPeriphery) {
      baseRate = 3000;
      estimatedTime = '~55-75 minutes';
    } else if ((isFromLeft && isToRight) || (isFromRight && isToLeft)) {
      // Crossing river (Pont des Martyrs / Pont Roi Fahd / 3ème Pont)
      baseRate = 2000;
      estimatedTime = '~40-50 minutes';
    } else if (from === to) {
      baseRate = 1000;
      estimatedTime = '~20-30 minutes';
    } else {
      // Same bank of Niger river
      baseRate = 1500;
      estimatedTime = '~30-40 minutes';
    }

    // Weight / Category adjust
    if (pkg === 'lourd') {
      baseRate += 1000;
    } else if (pkg === 'plis' && baseRate > 1500) {
      baseRate -= 200;
    }

    priceDisplay.textContent = `${baseRate.toLocaleString('fr-FR')} FCFA`;
    timeDisplay.textContent = `• Délai : ${estimatedTime}`;

    return { rate: baseRate, time: estimatedTime, from, to };
  }

  if (pickupSelect) pickupSelect.addEventListener('change', calculateRate);
  if (deliverySelect) deliverySelect.addEventListener('change', calculateRate);
  if (packageSelect) packageSelect.addEventListener('change', calculateRate);

  // --- 5. Interactive Order Modal ---
  const orderModal = document.getElementById('orderModal');
  const modalClose = document.getElementById('modalClose');
  const openModalButtons = document.querySelectorAll('.open-modal-btn');
  const orderFormulaSelect = document.getElementById('orderFormula');
  const modalPriceDisplay = document.getElementById('modalPriceDisplay');
  const orderForm = document.getElementById('orderForm');
  const pickupInput = document.getElementById('pickupAddress');
  const deliveryInput = document.getElementById('deliveryAddress');

  function openOrderModal(preset = 'standard') {
    if (orderModal) {
      orderModal.classList.add('open');
      document.body.style.overflow = 'hidden';

      // Set formula preset if provided
      if (orderFormulaSelect) {
        if (preset === 'pro') {
          orderFormulaSelect.value = 'pro';
        } else if (preset === 'vip') {
          orderFormulaSelect.value = 'vip';
        } else {
          orderFormulaSelect.value = 'flash';
        }
        updateModalPrice();
      }
    }
  }

  function closeOrderModal() {
    if (orderModal) {
      orderModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  function updateModalPrice() {
    if (!orderFormulaSelect || !modalPriceDisplay) return;
    const formula = orderFormulaSelect.value;
    if (formula === 'pro') {
      modalPriceDisplay.textContent = '1 000 FCFA';
    } else if (formula === 'vip') {
      modalPriceDisplay.textContent = '3 000 FCFA';
    } else {
      modalPriceDisplay.textContent = '1 500 FCFA';
    }
  }

  if (orderFormulaSelect) {
    orderFormulaSelect.addEventListener('change', updateModalPrice);
  }

  openModalButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const preset = btn.getAttribute('data-preset') || 'standard';
      openOrderModal(preset);
    });
  });

  if (btnBookFromCalc) {
    btnBookFromCalc.addEventListener('click', () => {
      const calcResult = calculateRate();
      openOrderModal('flash');
      if (pickupInput && calcResult) {
        pickupInput.value = `${calcResult.from}, Bamako`;
      }
      if (deliveryInput && calcResult) {
        deliveryInput.value = `${calcResult.to}, Bamako`;
      }
      if (modalPriceDisplay && calcResult) {
        modalPriceDisplay.textContent = `${calcResult.rate.toLocaleString('fr-FR')} FCFA`;
      }
    });
  }

  if (modalClose) modalClose.addEventListener('click', closeOrderModal);

  if (orderModal) {
    orderModal.addEventListener('click', (e) => {
      if (e.target === orderModal) closeOrderModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeOrderModal();
      closeDrawer();
    }
  });

  // --- 6. Form Submission & WhatsApp Order Generator ---
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');

  function showToast(message) {
    if (!toast) return;
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('clientName').value.trim();
      const phone = document.getElementById('clientPhone').value.trim();
      const pickup = document.getElementById('pickupAddress').value.trim();
      const delivery = document.getElementById('deliveryAddress').value.trim();
      const formulaText = orderFormulaSelect.options[orderFormulaSelect.selectedIndex].text;
      const paymentMode = document.getElementById('paymentMode').options[document.getElementById('paymentMode').selectedIndex].text;
      const notes = document.getElementById('packageNotes').value.trim() || 'Aucune note spécifique';
      const total = modalPriceDisplay.textContent;

      // Construct WhatsApp message text
      const message = `⚡ *NOUVELLE COMMANDE livrEXPRESS (Bamako)* ⚡%0A%0A` +
        `👤 *Client :* ${encodeURIComponent(name)}%0A` +
        `📞 *Téléphone :* ${encodeURIComponent(phone)}%0A` +
        `📍 *Départ (Collecte) :* ${encodeURIComponent(pickup)}%0A` +
        `🎯 *Arrivée (Livraison) :* ${encodeURIComponent(delivery)}%0A` +
        `📦 *Formule :* ${encodeURIComponent(formulaText)}%0A` +
        `💳 *Paiement :* ${encodeURIComponent(paymentMode)}%0A` +
        `💰 *Estimation Total :* ${encodeURIComponent(total)}%0A` +
        `📝 *Notes :* ${encodeURIComponent(notes)}%0A%0A` +
        `Merci de me confirmer la prise en charge immédiate du coursier !`;

      const whatsappUrl = `https://wa.me/22370001234?text=${message}`;

      showToast('⚡ Prise en charge validée ! Redirection vers WhatsApp...');
      closeOrderModal();
      orderForm.reset();

      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 900);
    });
  }

  // --- 7. Smooth reveal animations on scroll ---
  const revealElements = document.querySelectorAll('.step-card, .pricing-card, .testimonial-card, .rate-calculator-card');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.08}s`;
      observer.observe(el);
    });
  }
});
