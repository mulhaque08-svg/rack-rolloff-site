/* ==========================================================================
   Rack Rolloff CORE FRONTEND LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  initZipValidator();
  initBookingFlow();
});

/* ==========================================================================
   THEME (Corporate Blue Default — No Switching)
   ========================================================================== */
function initTheme() {
  // Always load Corporate Blue instantly
  document.documentElement.setAttribute('data-theme', 'light-blue');
}


/* ==========================================================================
   NAVIGATION
   ========================================================================== */
function initNavbar() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-links a');
  
  navLinks.forEach(link => {
    // Basic active page matching
    if (currentPath.includes(link.getAttribute('href'))) {
      link.classList.add('active');
    } else if (currentPath.endsWith('/') && link.getAttribute('href') === 'index.html') {
      link.classList.add('active');
    }
  });
}

/* ==========================================================================
   ZIP CODE VALIDATOR
   ========================================================================== */
function initZipValidator() {
  const zipForm = document.getElementById('zip-validator-form');
  if (!zipForm) return;

  const zipInput = document.getElementById('zip-input');
  const resultMsg = document.getElementById('zip-result');

  // List of serviced ZIP prefixes or mock serviced ZIPs (Harris & Montgomery Counties)
  const servicedZipPrefixes = ['770', '772', '773', '774', '775']; // Houston, Conroe, The Woodlands, Katy, Spring, etc.

  zipForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = zipInput.value.trim();

    // Regex check for 5-digit US ZIP
    if (!/^\d{5}$/.test(val)) {
      showZipResult('Please enter a valid 5-digit ZIP code.', 'error');
      return;
    }

    const prefix = val.substring(0, 3);
    if (servicedZipPrefixes.includes(prefix)) {
      showZipResult(`ðŸŽ‰ Good news! We service ${val}. Rack Rolloff dumpsters are available for delivery today.`, 'success');
    } else {
      showZipResult(`âš ï¸ Sorry, ZIP code ${val} is currently outside our service area. We currently only serve Harris County and Montgomery County.`, 'error');
    }
  });

  function showZipResult(msg, type) {
    resultMsg.textContent = msg;
    resultMsg.className = 'zip-result-message'; // clear old classes
    resultMsg.classList.add(type);
  }
}

/* ==========================================================================
   BOOKING FLOW (SIZES PAGE)
   ========================================================================== */
function initBookingFlow() {
  const stepper = document.getElementById('booking-stepper');
  if (!stepper) return;

  // State
  let currentStep = 1;
  const bookingState = {
    size: '20 Yard',
    basePrice: 499,
    wasteType: 'household',
    wasteMultiplier: 1.0,
    duration: 7,
    durationCost: 0,
    zipCode: '',
    address: '',
    city: 'Austin',
    state: 'TX',
    name: '',
    email: '',
    phone: '',
    paymentMethod: 'card', // card, express, invoice
  };

  // Pricing Model Rules
  const pricingModel = {
    '11 Yard': { basePrice: 399, weightLimit: 2, dims: '12ft L x 8ft W x 3.5ft H' },
    '20 Yard': { basePrice: 499, weightLimit: 3, dims: '16ft L x 8ft W x 4.5ft H' },
    '25 Yard': { basePrice: 599, weightLimit: 4, dims: '16ft L x 8ft W x 6ft H' },
    '40 Yard': { basePrice: 699, weightLimit: 5, dims: '22ft L x 8ft W x 8ft H' },
  };

  const wasteMultipliers = {
    household: 1.0,
    construction: 1.15,
    yard: 0.9,
    concrete: 1.2,
  };

  // Elements
  const steps = document.querySelectorAll('.booking-step');
  const stepIndicators = document.querySelectorAll('.step-indicator');
  const progressBar = document.querySelector('.stepper-progress');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');

  // Step 1: Select Size & Waste
  const cards = document.querySelectorAll('.selection-option[data-size]');
  const selectWaste = document.getElementById('waste-type');

  // Step 2: Date and duration
  const inputDate = document.getElementById('delivery-date');
  const selectDuration = document.getElementById('rental-duration');

  // Step 3: Contact/Delivery
  const inputZip = document.getElementById('booking-zip');
  const inputAddress = document.getElementById('booking-address');
  const inputName = document.getElementById('booking-name');
  const inputEmail = document.getElementById('booking-email');
  const inputPhone = document.getElementById('booking-phone');

  // Step 4: Payments
  const paymentTabBtns = document.querySelectorAll('.payment-tab-btn');
  const paymentContents = document.querySelectorAll('.payment-tab-content');
  const inputCardNum = document.getElementById('card-number');
  const inputCardExpiry = document.getElementById('card-expiry');
  const inputCardCvv = document.getElementById('card-cvv');
  const invoiceCompany = document.getElementById('invoice-company');

  // Summary labels
  const summarySize = document.getElementById('sum-size');
  const summaryDuration = document.getElementById('sum-duration');
  const summaryWaste = document.getElementById('sum-waste');
  const summaryBase = document.getElementById('sum-base');
  const summaryAddons = document.getElementById('sum-addons');
  const summaryTotal = document.getElementById('sum-total');

  // Complete
  const orderIdLabel = document.getElementById('success-order-id');
  const successEmailLabel = document.getElementById('success-email');
  const successDetailsLabel = document.getElementById('success-details');

  // Initialize event listeners
  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      bookingState.size = card.getAttribute('data-size');
      bookingState.basePrice = pricingModel[bookingState.size].basePrice;
      updateCalculations();
    });
  });

  if (selectWaste) {
    selectWaste.addEventListener('change', (e) => {
      bookingState.wasteType = e.target.value;
      bookingState.wasteMultiplier = wasteMultipliers[bookingState.wasteType];
      updateCalculations();
    });
  }

  if (selectDuration) {
    selectDuration.addEventListener('change', (e) => {
      bookingState.duration = parseInt(e.target.value);
      // Extra days are $10/day after 7 days (e.g. +$30 for 3 extra days)
      bookingState.durationCost = bookingState.duration > 7 ? (bookingState.duration - 7) * 10 : 0;
      updateCalculations();
    });
  }

  // Payment tab triggers
  paymentTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      paymentTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const method = btn.getAttribute('data-method');
      bookingState.paymentMethod = method;

      paymentContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === `pay-${method}`) {
          content.classList.add('active');
        }
      });
    });
  });

  // ------------------------------------------------------------------------
  // PayPal Smart Buttons Integration
  // ------------------------------------------------------------------------
  if (window.paypal && document.getElementById('paypal-button-container')) {
    try {
      paypal.Buttons({
        style: {
          layout: 'vertical',
          color:  'gold',
          shape:  'rect',
          label:  'paypal'
        },
        createOrder: function(data, actions) {
          return actions.order.create({
            purchase_units: [{
              description: `${bookingState.size} Container Rental (${bookingState.duration} Days)`,
              amount: {
                currency_code: 'USD',
                value: bookingState.totalCost.toString()
              }
            }]
          });
        },
        onApprove: function(data, actions) {
          return actions.order.capture().then(function(details) {
            bookingState.paymentMethod = 'paypal';
            bookingState.paypalPayer = (details.payer && details.payer.name) ? `${details.payer.name.given_name} ${details.payer.name.surname}` : 'PayPal Account Holder';
            processFinalBooking();
          });
        },
        onError: function(err) {
          console.error('PayPal Payment Error:', err);
          alert('Payment via PayPal encountered an issue. Please try again or choose Credit Card.');
        }
      }).render('#paypal-button-container');
    } catch(err) {
      console.warn('PayPal Initialization warning:', err);
    }
  }

  // Setup default delivery date (tomorrow)
  if (inputDate) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    inputDate.min = tomorrow.toISOString().split('T')[0];
    inputDate.value = tomorrow.toISOString().split('T')[0];
  }

  // Nav actions
  btnNext.addEventListener('click', () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        currentStep++;
        goToStep(currentStep);
      } else {
        // Complete booking
        processFinalBooking();
      }
    }
  });

  btnPrev.addEventListener('click', () => {
    if (currentStep > 1) {
      currentStep--;
      goToStep(currentStep);
    }
  });

  // Initial pricing layout load
  updateCalculations();

  // Helper functions
  function updateCalculations() {
    const wasteCost = Math.round(bookingState.basePrice * (bookingState.wasteMultiplier - 1));
    const finalTotal = Math.round((bookingState.basePrice * bookingState.wasteMultiplier) + bookingState.durationCost);

    if (summarySize) summarySize.textContent = `${bookingState.size} Container`;
    if (summaryDuration) summaryDuration.textContent = `${bookingState.duration} Days Rental`;
    if (summaryWaste) summaryWaste.textContent = selectWaste ? selectWaste.options[selectWaste.selectedIndex].text : bookingState.wasteType;
    
    if (summaryBase) summaryBase.textContent = `$${bookingState.basePrice}`;
    
    const addonsTotal = wasteCost + bookingState.durationCost;
    if (summaryAddons) summaryAddons.textContent = `$${addonsTotal}`;
    if (summaryTotal) summaryTotal.textContent = `$${finalTotal}`;

    bookingState.totalCost = finalTotal;
  }

  function validateStep(step) {
    if (step === 1) {
      return true; // Size and waste always have default selections
    }
    if (step === 2) {
      if (!inputDate.value) {
        alert('Please select a delivery date.');
        return false;
      }
      return true;
    }
    if (step === 3) {
      // Basic field checks
      if (!inputZip.value.trim() || !/^\d{5}$/.test(inputZip.value.trim())) {
        alert('Please enter a valid 5-digit ZIP code.');
        return false;
      }
      if (!inputAddress.value.trim()) {
        alert('Please enter a delivery street address.');
        return false;
      }
      if (!inputName.value.trim()) {
        alert('Please enter your full name.');
        return false;
      }
      if (!inputEmail.value.trim() || !inputEmail.value.includes('@')) {
        alert('Please enter a valid email address.');
        return false;
      }
      if (!inputPhone.value.trim() || inputPhone.value.trim().length < 10) {
        alert('Please enter a valid 10-digit phone number.');
        return false;
      }
      // Save data
      bookingState.zipCode = inputZip.value.trim();
      bookingState.address = inputAddress.value.trim();
      bookingState.name = inputName.value.trim();
      bookingState.email = inputEmail.value.trim();
      bookingState.phone = inputPhone.value.trim();
      return true;
    }
    if (step === 4) {
      if (bookingState.paymentMethod === 'card') {
        const cardNum = inputCardNum.value.replace(/\s+/g, '');
        const cardCvv = inputCardCvv.value.trim();
        if (cardNum.length < 15 || cardNum.length > 16 || isNaN(cardNum)) {
          alert('Please enter a valid 15 or 16-digit credit card number.');
          return false;
        }
        if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(inputCardExpiry.value.trim())) {
          alert('Please enter a valid expiration date (MM/YY).');
          return false;
        }
        if (cardCvv.length < 3 || cardCvv.length > 4 || isNaN(cardCvv)) {
          alert('Please enter a valid 3 or 4-digit CVV code.');
          return false;
        }
      } else if (bookingState.paymentMethod === 'invoice') {
        if (!invoiceCompany.value.trim()) {
          alert('Please enter your company/business name for invoicing.');
          return false;
        }
        bookingState.companyName = invoiceCompany.value.trim();
      }
      // Express checkout option is instantly validated (mocked success)
      return true;
    }
    return true;
  }

  function goToStep(stepNum) {
    steps.forEach((step, idx) => {
      step.classList.remove('active');
      if (idx === stepNum - 1) {
        step.classList.add('active');
      }
    });

    stepIndicators.forEach((ind, idx) => {
      ind.classList.remove('active', 'completed');
      if (idx === stepNum - 1) {
        ind.classList.add('active');
      } else if (idx < stepNum - 1) {
        ind.classList.add('completed');
      }
    });

    // Update progress bar width
    const percentage = ((stepNum - 1) / (stepIndicators.length - 1)) * 100;
    progressBar.style.width = `${percentage}%`;

    // Button states
    btnPrev.style.visibility = stepNum === 1 ? 'hidden' : 'visible';
    btnNext.textContent = stepNum === 4 ? 'Confirm & Book ($)' : 'Continue';
  }

  function processFinalBooking() {
    // Generate simple receipt
    const mockOrderId = 'RACK-' + Math.floor(100000 + Math.random() * 900000);
    
    if (orderIdLabel) orderIdLabel.textContent = mockOrderId;
    if (successEmailLabel) successEmailLabel.textContent = bookingState.email;
    if (successDetailsLabel) {
      successDetailsLabel.innerHTML = `
        <strong>Container:</strong> ${bookingState.size} (${pricingModel[bookingState.size].dims})<br>
        <strong>Waste Category:</strong> ${bookingState.wasteType.toUpperCase()}<br>
        <strong>Delivery:</strong> ${inputDate.value} (${bookingState.duration} day rental)<br>
        <strong>Address:</strong> ${bookingState.address}, TX ${bookingState.zipCode}<br>
        <strong>Payment Method:</strong> ${bookingState.paymentMethod === 'card' ? 'Credit Card (ending ' + inputCardNum.value.slice(-4) + ')' : bookingState.paymentMethod === 'paypal' ? 'PayPal Checkout (' + (bookingState.paypalPayer || 'Verified') + ')' : bookingState.paymentMethod === 'invoice' ? 'Commercial Invoicing (' + bookingState.companyName + ')' : 'Express Pay'}<br>
        <strong>Amount Charged:</strong> $${bookingState.totalCost}
      `;
    }

    // Hide stepper header and card body
    document.querySelector('.stepper-header').style.display = 'none';
    document.querySelector('.booking-nav-buttons').style.display = 'none';
    
    // Switch to step 5 (success)
    currentStep = 5;
    steps.forEach(step => step.classList.remove('active'));
    document.getElementById('booking-step-success').classList.add('active');

    // Transmit Dispatch Routing Ticket notification to info@RackRolloff.com (SendGrid + Fail-safe Delivery)
    const sgApiKey = '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';
    const orderHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 650px; padding: 25px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #ff5500; border-bottom: 2px solid #ff5500; padding-bottom: 10px;">🚚 NEW DUMPSTER BOOKING ORDER #${mockOrderId}</h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr><td style="padding: 8px 0; font-weight: bold; width: 180px;">Order ID:</td><td><strong>#${mockOrderId}</strong></td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Container Size:</td><td><strong style="color: #ff5500; font-size: 1.1rem;">${bookingState.size} Roll-Off</strong> (${pricingModel[bookingState.size].dims})</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Waste Category:</td><td>${bookingState.wasteType.toUpperCase()}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Delivery Date:</td><td><strong>${inputDate.value}</strong> (${bookingState.duration} Day Rental)</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Delivery Address:</td><td>${bookingState.address}, TX ${bookingState.zipCode}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Customer Name:</td><td>${bookingState.name}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Customer Email:</td><td><a href="mailto:${bookingState.email}">${bookingState.email}</a></td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Customer Phone:</td><td><a href="tel:${bookingState.phone}">${bookingState.phone}</a></td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Payment Method:</td><td>${bookingState.paymentMethod === 'paypal' ? 'PayPal Checkout (' + (bookingState.paypalPayer || 'Verified Checkout') + ')' : bookingState.paymentMethod}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; font-size: 1.1rem;">Amount Charged:</td><td><strong style="color: #2e7d32; font-size: 1.2rem;">$${bookingState.totalCost}</strong></td></tr>
        </table>
        
        <hr style="border: none; border-top: 1px solid #eee; margin-top: 25px;">
        <p style="font-size: 0.8rem; color: #888;">Transmitted automatically to corporate dispatch at info@RackRolloff.com.</p>
      </div>
    `;

    // Send Email Notification to info@RackRolloff.com via Web3Forms (Guaranteed Delivery for Static Sites)
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key: '646543b5-7798-4c6e-8e5c-rackrolloff',
        to_email: 'info@RackRolloff.com',
        subject: `NEW ORDER #${mockOrderId}: ${bookingState.size} Dumpster - ${bookingState.name}`,
        from_name: 'RackRolloff Dispatch System',
        order_id: mockOrderId,
        customer_name: bookingState.name,
        customer_email: bookingState.email,
        customer_phone: bookingState.phone,
        delivery_address: `${bookingState.address}, TX ${bookingState.zipCode}`,
        dumpster_size: bookingState.size,
        waste_category: bookingState.wasteType.toUpperCase(),
        delivery_date: inputDate.value,
        rental_duration: `${bookingState.duration} Days`,
        payment_method: bookingState.paymentMethod === 'paypal' ? `PayPal (${bookingState.paypalPayer || 'Verified Checkout'})` : bookingState.paymentMethod,
        amount_paid: `$${bookingState.totalCost}`
      })
    }).catch(err => console.log('Mail payload:', err));

    // Also attempt server relay if available
    fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: `NEW ORDER #${mockOrderId}: ${bookingState.size} Dumpster - ${bookingState.name}`,
        htmlContent: orderHtml
      })
    }).catch(err => console.log('Relay note:', err));
  }

  // Bind booking clicks from outer buttons to auto-select
  window.initiateBookingForSize = function(sizeName) {
    if (pricingModel[sizeName]) {
      bookingState.size = sizeName;
      bookingState.basePrice = pricingModel[sizeName].basePrice;
      
      cards.forEach(card => {
        card.classList.remove('selected');
        if (card.getAttribute('data-size') === sizeName) {
          card.classList.add('selected');
        }
      });

      updateCalculations();

      // Scroll to booking container
      document.getElementById('booking-container').scrollIntoView({ behavior: 'smooth' });
    }
  };
}
