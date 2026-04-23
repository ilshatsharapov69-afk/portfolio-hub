// BLADE & CROWN — Main JavaScript

// ===== Helpers =====
function sanitize(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ===== Lightbox =====
function openLightbox(el) {
  const img = el.querySelector('img');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  lightboxImg.src = img.src.replace('w=500', 'w=1200');
  lightboxImg.alt = img.alt;
  lightbox.classList.remove('hidden');
  lightbox.classList.add('flex');
  document.body.style.overflow = 'hidden';
}

// ===== AI Chat Widget =====
let chatOpen = false;

function toggleChat() {
  chatOpen = !chatOpen;
  const win = document.getElementById('chat-window');
  const iconOpen = document.getElementById('chat-icon-open');
  const iconClose = document.getElementById('chat-icon-close');
  const badge = document.getElementById('chat-badge');

  if (chatOpen) {
    win.classList.remove('hidden');
    win.style.animation = 'slideUp 0.3s ease forwards';
    iconOpen.classList.add('hidden');
    iconClose.classList.remove('hidden');
    if (badge) badge.style.display = 'none';
    const tooltip = document.getElementById('chat-tooltip');
    if (tooltip) tooltip.style.display = 'none';
    // Stop attention animations
    const rings = document.querySelectorAll('.chat-ring');
    rings.forEach(r => r.style.display = 'none');
  } else {
    win.style.animation = 'slideDown 0.2s ease forwards';
    setTimeout(() => win.classList.add('hidden'), 200);
    iconOpen.classList.remove('hidden');
    iconClose.classList.add('hidden');
  }
}

function sendQuick(text) {
  document.getElementById('chat-quick').style.display = 'none';
  addMessage(text, 'user');
  botReply(text);
}

function sendMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  document.getElementById('chat-quick').style.display = 'none';
  addMessage(text, 'user');
  botReply(text);
}

function addMessage(text, sender) {
  const container = document.getElementById('chat-messages');
  const div = document.createElement('div');

  if (sender === 'user') {
    div.className = 'flex justify-end';
    div.innerHTML = `<div class="bg-gold text-dark rounded-xl rounded-tr-sm px-4 py-3 max-w-[85%]"><p class="text-sm">${sanitize(text)}</p></div>`;
  } else {
    div.className = 'flex gap-2';
    div.innerHTML = `
      <div class="w-7 h-7 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 mt-1">
        <span class="text-gold text-[10px] font-bold">AI</span>
      </div>
      <div class="bg-dark border border-white/5 rounded-xl rounded-tl-sm px-4 py-3 max-w-[85%]">
        <p class="text-gray-300 text-sm leading-relaxed">${text}</p>
      </div>`;
  }

  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

// ===== Chat Mode Configuration =====
// Set to 'botpress' once you have a Botpress bot ID, or 'fallback' for built-in responses
const CHAT_MODE = 'fallback'; // Change to 'botpress' after setup

// ===== BLADE & CROWN Knowledge Base (built-in fallback) =====
const BC_KNOWLEDGE = {
  services: {
    'classic haircut': { price: '$35', desc: 'Precision cut tailored to your style' },
    'haircut': { price: '$35', desc: 'Precision cut tailored to your style' },
    'beard trim': { price: '$25', desc: 'Sculpted lines, clean edges' },
    'beard': { price: '$25', desc: 'Sculpted lines, clean edges' },
    'hot towel shave': { price: '$40', desc: 'Old-school straight razor, hot towels' },
    'shave': { price: '$40', desc: 'Old-school straight razor, hot towels' },
    'hair + beard combo': { price: '$55', desc: 'Full haircut plus beard grooming' },
    'combo': { price: '$55', desc: 'Full haircut plus beard grooming' },
    'kids cut': { price: '$20', desc: 'For the little gentlemen (under 12)' },
    'kids': { price: '$20', desc: 'For the little gentlemen (under 12)' },
    'premium package': { price: '$75', desc: 'Haircut + beard + hot towel + styling' },
    'premium': { price: '$75', desc: 'Haircut + beard + hot towel + styling' },
  },
  hours: 'Mon\u2013Fri 9AM\u20138PM, Sat 8AM\u20136PM, Sun 10AM\u20134PM',
  address: '123 Main Street, Downtown Austin, TX 78701',
  phone: '(512) 555-BLADE',
  email: 'hello@bladeandcrown.com',
  instagram: '@bladeandcrown',
  bookingUrl: '#contact',
  barbers: [
    { name: 'Alex Rivera', role: 'Master Barber', exp: '12 years', specialty: 'fades & razor work' },
    { name: 'Marcus Chen', role: 'Senior Stylist', exp: '8 years', specialty: 'beard sculpting' },
    { name: 'James Wilson', role: 'Junior Barber', exp: '3 years', specialty: 'trending styles & color' },
  ],
  policies: {
    walkins: 'Walk-ins welcome, but weekends fill up fast. Book online to skip the wait.',
    cancellation: 'Please cancel or reschedule at least 24 hours in advance.',
    payment: 'We accept cash, credit/debit cards, and Apple Pay.',
    touchup: 'Not happy? Come back within 7 days for a free touch-up.',
    hygiene: 'Every blade is fresh or sterilized between clients. Hospital-grade disinfectant on all tools.',
  }
};

function showTyping() {
  const container = document.getElementById('chat-messages');
  const typing = document.createElement('div');
  typing.className = 'flex gap-2 typing-indicator';
  typing.innerHTML = `
    <div class="w-7 h-7 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 mt-1">
      <span class="text-gold text-[10px] font-bold">AI</span>
    </div>
    <div class="bg-dark border border-white/5 rounded-xl rounded-tl-sm px-4 py-3">
      <div class="flex gap-1"><span class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay:0s"></span><span class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay:0.15s"></span><span class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay:0.3s"></span></div>
    </div>`;
  container.appendChild(typing);
  container.scrollTop = container.scrollHeight;
  return typing;
}

function botReply(userText) {
  const typing = showTyping();

  if (CHAT_MODE === 'botpress') {
    // Botpress handles everything via its own widget — this won't be called
    // When Botpress is active, the built-in chat UI is hidden
    typing.remove();
    return;
  }

  // Smart fallback with knowledge base
  setTimeout(() => {
    typing.remove();
    const lower = userText.toLowerCase();
    let reply;

    // Booking intent
    if (lower.includes('book') || lower.includes('appointment') || lower.includes('reserve') || lower.includes('schedule')) {
      reply = "I'd love to help you book! We have 3 awesome barbers: <strong>Alex</strong> (fades & razor work), <strong>Marcus</strong> (beard sculpting), and <strong>James</strong> (trending styles). <a href='" + BC_KNOWLEDGE.bookingUrl + "' class='text-gold underline' onclick='toggleChat()'>Book your slot here</a> or call <strong>" + BC_KNOWLEDGE.phone + "</strong>!";

    // Price/service intent
    } else if (lower.includes('price') || lower.includes('cost') || lower.includes('how much') || lower.includes('rate')) {
      // Check for specific service
      let found = null;
      for (const [key, svc] of Object.entries(BC_KNOWLEDGE.services)) {
        if (lower.includes(key)) { found = svc; break; }
      }
      if (found) {
        reply = "That's <strong>" + found.price + "</strong>. " + found.desc + ". Want to <a href='" + BC_KNOWLEDGE.bookingUrl + "' class='text-gold underline' onclick='toggleChat()'>book now</a>?";
      } else {
        reply = "Here are our services: Classic Haircut <strong>$35</strong> | Beard Trim <strong>$25</strong> | Hot Towel Shave <strong>$40</strong> | Hair + Beard Combo <strong>$55</strong> | Kids Cut <strong>$20</strong> | Premium Package <strong>$75</strong>. Which one catches your eye?";
      }

    // Hours intent
    } else if (lower.includes('hour') || lower.includes('open') || lower.includes('close') || lower.includes('when')) {
      reply = "We're open <strong>" + BC_KNOWLEDGE.hours + "</strong>. " + BC_KNOWLEDGE.policies.walkins;

    // Location intent
    } else if (lower.includes('where') || lower.includes('location') || lower.includes('address') || lower.includes('direction') || lower.includes('find')) {
      reply = "We're at <strong>" + BC_KNOWLEDGE.address + "</strong>. Free street parking available! <a href='#contact' class='text-gold underline' onclick='toggleChat()'>See map</a>.";

    // Barber/team intent
    } else if (lower.includes('barber') || lower.includes('who') || lower.includes('team') || lower.includes('stylist') || lower.includes('alex') || lower.includes('marcus') || lower.includes('james')) {
      const specific = BC_KNOWLEDGE.barbers.find(b => lower.includes(b.name.toLowerCase().split(' ')[0].toLowerCase()));
      if (specific) {
        reply = "<strong>" + specific.name + "</strong> (" + specific.role + ") \u2014 " + specific.exp + " experience. Specializes in " + specific.specialty + ". <a href='" + BC_KNOWLEDGE.bookingUrl + "' class='text-gold underline' onclick='toggleChat()'>Book with " + specific.name.split(' ')[0] + "</a>!";
      } else {
        reply = "Meet our crew: <strong>Alex Rivera</strong> (Master Barber, fades & razor work) | <strong>Marcus Chen</strong> (Senior Stylist, beard sculpting) | <strong>James Wilson</strong> (Junior Barber, trending styles). Who would you like?";
      }

    // Payment intent
    } else if (lower.includes('pay') || lower.includes('cash') || lower.includes('card') || lower.includes('apple')) {
      reply = BC_KNOWLEDGE.policies.payment + " Easy and flexible!";

    // Cancel/reschedule intent
    } else if (lower.includes('cancel') || lower.includes('reschedule') || lower.includes('change')) {
      reply = BC_KNOWLEDGE.policies.cancellation + " Call us at <strong>" + BC_KNOWLEDGE.phone + "</strong> to make changes.";

    // Walk-in intent
    } else if (lower.includes('walk') || lower.includes('drop')) {
      reply = BC_KNOWLEDGE.policies.walkins;

    // Hygiene/safety intent
    } else if (lower.includes('clean') || lower.includes('hygiene') || lower.includes('sanitize') || lower.includes('safe')) {
      reply = BC_KNOWLEDGE.policies.hygiene + " Your safety always comes first!";

    // Contact intent
    } else if (lower.includes('contact') || lower.includes('phone') || lower.includes('call') || lower.includes('email') || lower.includes('instagram')) {
      reply = "Reach us anytime! Phone: <strong>" + BC_KNOWLEDGE.phone + "</strong> | Email: <strong>" + BC_KNOWLEDGE.email + "</strong> | Instagram: <strong>" + BC_KNOWLEDGE.instagram + "</strong>";

    // Greeting
    } else if (lower.match(/^(hi|hey|hello|yo|sup|what'?s up|good (morning|afternoon|evening))/)) {
      reply = "Hey there! Welcome to Blade & Crown. I can help with bookings, prices, hours, or anything else. What do you need?";

    // Thanks
    } else if (lower.match(/(thank|thanks|thx|cheers|appreciate)/)) {
      reply = "You're welcome! Anything else I can help with? \u2702\uFE0F";

    // Fallback
    } else {
      reply = "Great question! I can help with <strong>bookings</strong>, <strong>prices</strong>, <strong>hours</strong>, and more. For anything else, call us at <strong>" + BC_KNOWLEDGE.phone + "</strong> or <a href='#contact' class='text-gold underline' onclick='toggleChat()'>drop us a message</a>.";
    }

    addMessage(reply, 'bot');

    // Voice: speak the reply if voice mode is active
    if (window._voiceMode && 'speechSynthesis' in window) {
      const clean = reply.replace(/<[^>]*>/g, '');
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = 'en-US';
      utterance.rate = 1.0;
      speechSynthesis.speak(utterance);
    }
  }, 1200);
}

// ===== Web Speech API — Voice Input =====
let _voiceRecognition = null;
window._voiceMode = false;

function initVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return null;
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  return recognition;
}

function toggleVoice() {
  const btn = document.getElementById('voice-btn');
  if (!btn) return;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    addMessage('Voice input is only supported in Chrome/Edge browsers. Please type your message instead.', 'bot');
    return;
  }

  if (!_voiceRecognition) {
    _voiceRecognition = initVoice();
  }

  if (window._voiceMode) {
    // Stop listening
    window._voiceMode = false;
    btn.classList.remove('bg-red-500', 'animate-pulse');
    btn.classList.add('bg-gold/20');
    try { _voiceRecognition.stop(); } catch(e) {}
    return;
  }

  // Start listening
  window._voiceMode = true;
  btn.classList.add('bg-red-500', 'animate-pulse');
  btn.classList.remove('bg-gold/20');

  _voiceRecognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    document.getElementById('chat-quick').style.display = 'none';
    addMessage(text, 'user');
    botReply(text);
  };

  _voiceRecognition.onerror = (event) => {
    window._voiceMode = false;
    btn.classList.remove('bg-red-500', 'animate-pulse');
    btn.classList.add('bg-gold/20');
    if (event.error !== 'aborted') {
      addMessage('Could not hear you. Please try again or type your message.', 'bot');
    }
  };

  _voiceRecognition.onend = () => {
    window._voiceMode = false;
    btn.classList.remove('bg-red-500', 'animate-pulse');
    btn.classList.add('bg-gold/20');
  };

  _voiceRecognition.start();
}

// ===== FAQ Accordion =====
function toggleFaq(btn) {
  const item = btn.parentElement;
  const answer = item.querySelector('.faq-answer');
  const icon = btn.querySelector('.faq-icon');
  const isOpen = answer.style.maxHeight && answer.style.maxHeight !== '0px';

  // Close all
  document.querySelectorAll('.faq-answer').forEach((a) => { a.style.maxHeight = '0px'; });
  document.querySelectorAll('.faq-icon').forEach((i) => { i.style.transform = ''; });
  document.querySelectorAll('.faq-item').forEach((f) => { f.classList.remove('border-gold/20'); f.classList.add('border-white/5'); });
  document.querySelectorAll('.faq-btn').forEach((b) => { b.setAttribute('aria-expanded', 'false'); });

  // Open clicked if was closed
  if (!isOpen) {
    answer.style.maxHeight = answer.scrollHeight + 'px';
    icon.style.transform = 'rotate(45deg)';
    item.classList.remove('border-white/5');
    item.classList.add('border-gold/20');
    btn.setAttribute('aria-expanded', 'true');
  }
}

function closeLightbox(e) {
  if (e.target.id === 'lightbox' || e.target.closest('button')) {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.add('hidden');
    lightbox.classList.remove('flex');
    document.body.style.overflow = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // ===== Preloader =====
  const preloader = document.getElementById('preloader');
  if (preloader && typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const tl = gsap.timeline();
    // Animate logo in
    tl.to('.preloader-logo', { opacity: 1, duration: 0.6, ease: 'power2.out' });
    // Animate tagline
    tl.to('.preloader-tagline', { opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.2');
    // Fill progress bar
    tl.to('#preloader-bar', { width: '100%', duration: 1.2, ease: 'power1.inOut' }, '-=0.2');
    // Fade out preloader
    tl.add(() => {
      preloader.classList.add('done');
      document.body.style.overflow = '';
    }, '+=0.3');
    // Prevent scroll during preloader
    document.body.style.overflow = 'hidden';
  }

  // ===== Navbar scroll effect =====
  const navbar = document.querySelector('.navbar');
  const mobileCta = document.querySelector('.mobile-cta');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Sticky navbar
    if (scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top button
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
      if (scrollY > window.innerHeight) {
        backToTop.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
        backToTop.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
      } else {
        backToTop.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
        backToTop.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
      }
    }

    // Mobile CTA appears after scrolling past hero
    if (mobileCta && scrollY > window.innerHeight * 0.5) {
      mobileCta.classList.add('visible');
    } else if (mobileCta) {
      mobileCta.classList.remove('visible');
    }
  });

  // ===== GSAP ScrollTrigger Animations =====
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
    gsap.registerPlugin(ScrollTrigger);

    // --- Hero video parallax via GSAP (hardware-accelerated) ---
    const heroVid = document.querySelector('.hero-video');
    if (heroVid) {
      gsap.set(heroVid, { scale: 1.15 });
      gsap.to(heroVid, {
        y: '25%',
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

    // Default scroll trigger settings
    const defaultTrigger = (trigger, start = 'top 85%') => ({
      trigger,
      start,
      once: true,
    });

    // --- Social Proof Bar: fade up with stagger ---
    const socialBar = document.querySelector('#social-proof');
    if (socialBar) {
      const socialItems = socialBar.querySelectorAll('#social-proof > div > div > div');
      gsap.from(socialItems, {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: defaultTrigger(socialBar),
      });
    }

    // --- Section header decorations (subtitle, line): fade in ---
    document.querySelectorAll('#services, #gallery, #team, #testimonials, #faq, #contact').forEach(section => {
      const header = section.querySelector('.text-center.mb-16, .text-center.mb-12');
      if (header) {
        // Animate the subtitle/decoration elements (not h2 — that's handled by SplitText)
        const decorElements = header.querySelectorAll('p, .flex.items-center.justify-center.gap-4');
        gsap.from(decorElements, {
          y: 20,
          opacity: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: defaultTrigger(header),
        });
      }
    });

    // --- Service cards: stagger from bottom with rotation ---
    gsap.set('.service-card', { y: 60, opacity: 0, rotateX: 8 });
    ScrollTrigger.batch('.service-card', {
      start: 'top 90%',
      once: true,
      onEnter: (batch) => {
        gsap.to(batch, {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
        });
      },
    });

    // --- CTA below services ---
    const servicesCta = document.querySelector('#services .text-center.mt-14');
    if (servicesCta) {
      gsap.from(servicesCta, {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: defaultTrigger(servicesCta),
      });
    }

    // --- Before/After sliders: alternate left/right ---
    const baGrid = document.querySelector('#gallery .grid');
    if (baGrid) {
      Array.from(baGrid.children).forEach((child, i) => {
        gsap.from(child, {
          x: i % 2 === 0 ? -80 : (i === 1 ? 0 : 80),
          y: i === 1 ? 50 : 0,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: defaultTrigger(child),
        });
      });
    }

    // --- Gallery grid items: zoom-in stagger ---
    gsap.set('.gallery-item', { scale: 0.8, opacity: 0 });
    ScrollTrigger.batch('.gallery-item', {
      start: 'top 92%',
      once: true,
      onEnter: (batch) => {
        gsap.to(batch, {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'back.out(1.2)',
        });
      },
    });

    // --- Team members: stagger from bottom ---
    const teamCards = document.querySelectorAll('#team .group.text-center');
    if (teamCards.length) {
      gsap.from(teamCards, {
        y: 50,
        opacity: 0,
        duration: 0.7,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: defaultTrigger(teamCards[0]),
      });
    }

    // --- Testimonials: fade up ---
    const testimHeader = document.querySelector('#testimonials .text-center.mb-16');
    if (testimHeader) {
      gsap.from(testimHeader, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: defaultTrigger(testimHeader),
      });
    }

    // --- How It Works: stagger slide from left ---
    const howHeader = document.querySelector('#how-it-works .text-center.mb-12');
    if (howHeader) {
      gsap.from(howHeader, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: defaultTrigger(howHeader),
      });
    }
    const howSteps = document.querySelectorAll('#how-it-works .grid > div');
    if (howSteps.length) {
      gsap.from(howSteps, {
        x: -60,
        opacity: 0,
        duration: 0.7,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: defaultTrigger(howSteps[0]),
      });
    }

    // --- FAQ items: stagger fade-up ---
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length) {
      gsap.from(faqItems, {
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: defaultTrigger(faqItems[0]),
      });
    }

    // --- Final CTA section: scale + fade ---
    const ctaInner = document.querySelector('#final-cta .relative.z-10');
    if (ctaInner) {
      gsap.from(ctaInner, {
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: defaultTrigger(ctaInner),
      });
    }

    // --- Contact section: left/right columns ---
    const contactGrid = document.querySelector('#contact .grid');
    if (contactGrid) {
      const cols = contactGrid.children;
      if (cols[0]) {
        gsap.from(cols[0], {
          x: -50,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: defaultTrigger(contactGrid),
        });
      }
      if (cols[1]) {
        gsap.from(cols[1], {
          x: 50,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: defaultTrigger(contactGrid),
        });
      }
    }

    // ===== Animated SVG Dividers =====
    // Scissors dividers: draw lines + animate scissors
    document.querySelectorAll('.scissors-divider').forEach(divider => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: divider, start: 'top 90%', once: true },
      });

      // Fade in container
      tl.to(divider, { opacity: 1, duration: 0.3 });

      // Draw left line
      const leftLine = divider.querySelector('.divider-line-left line');
      const rightLine = divider.querySelector('.divider-line-right line');
      if (leftLine) {
        tl.to(leftLine, { strokeDashoffset: 0, duration: 0.6, ease: 'power2.inOut' }, 0.2);
      }
      if (rightLine) {
        tl.to(rightLine, { strokeDashoffset: 0, duration: 0.6, ease: 'power2.inOut' }, 0.2);
      }

      // Snip scissors
      const scissors = divider.querySelector('.scissors-icon');
      if (scissors) {
        tl.add(() => scissors.classList.add('animated'), 0.4);
      }
    });

    // Gold line dividers: draw + reveal star
    document.querySelectorAll('.gold-divider').forEach(divider => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: divider, start: 'top 90%', once: true },
      });

      tl.to(divider, { opacity: 1, duration: 0.3 });

      const lines = divider.querySelectorAll('.divider-line line');
      lines.forEach(line => {
        tl.to(line, { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut' }, 0.2);
      });

      // Reveal star
      tl.add(() => divider.classList.add('active'), 0.5);
    });

    // ===== Counter Animation =====
    document.querySelectorAll('.counter').forEach(counter => {
      const target = parseFloat(counter.dataset.target);
      const decimals = parseInt(counter.dataset.decimals) || 0;
      const suffix = counter.dataset.suffix || '';
      const separator = counter.dataset.separator || '';
      const obj = { val: 0 };

      gsap.to(obj, {
        val: target,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: counter,
          start: 'top 90%',
          once: true,
        },
        onUpdate: () => {
          let num = decimals > 0 ? obj.val.toFixed(decimals) : Math.round(obj.val);
          if (separator) {
            num = Number(num).toLocaleString('en-US');
          }
          counter.textContent = num + suffix;
        },
      });
    });

    // ===== Scroll Progress Bar with Scissors + Hair Particles =====
    const progressBar = document.getElementById('scroll-progress');
    const hairContainer = document.getElementById('hair-particles');
    if (progressBar && hairContainer) {
      let lastProgress = 0;
      let snipPhase = 0;
      const bladeTop = document.querySelector('.blade-top');
      const bladeBottom = document.querySelector('.blade-bottom');

      gsap.to(progressBar, {
        width: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
          onUpdate: (self) => {
            const progress = self.progress;
            const delta = Math.abs(progress - lastProgress);

            // Snip scissors proportional to scroll speed
            if (delta > 0.0001) {
              snipPhase += delta * 600;
              const angle = Math.sin(snipPhase) * 12;
              if (bladeTop) bladeTop.style.transform = 'rotate(' + (-angle) + 'deg)';
              if (bladeBottom) bladeBottom.style.transform = 'rotate(' + angle + 'deg)';
            }

            // Hair particles — only when scrolling forward, count tied to speed
            if (progress > lastProgress && delta > 0.001) {
              const count = Math.min(2, Math.ceil(delta * 500));
              spawnHairParticles(progress, count);
            }

            lastProgress = progress;
          },
        },
      });

      function spawnHairParticles(progress, count) {
        const fallClasses = ['fall-1', 'fall-2', 'fall-3'];
        for (let i = 0; i < count; i++) {
          const strand = document.createElement('div');
          strand.className = 'hair-strand ' + fallClasses[Math.floor(Math.random() * 3)];
          const x = progress * window.innerWidth;
          strand.style.left = (x - 15 + Math.random() * 30) + 'px';
          strand.style.width = (1.5 + Math.random() * 1.5) + 'px';
          strand.style.height = (14 + Math.random() * 22) + 'px';
          strand.style.animationDelay = (Math.random() * 0.15) + 's';
          strand.style.borderRadius = Math.random() > 0.5 ? '50% 0 50% 0' : '0 50% 0 50%';
          const shades = ['#c9a84c', '#d4b85a', '#b8963e', '#a3882f'];
          strand.style.background = shades[Math.floor(Math.random() * shades.length)];
          hairContainer.appendChild(strand);
          setTimeout(() => strand.remove(), 1400);
        }
      }
    }

    // ===== SplitText Animations =====
    if (typeof SplitText !== 'undefined') {
      gsap.registerPlugin(SplitText);

      // --- Hero heading: chars reveal with stagger ---
      const heroH1 = document.querySelector('#hero-heading');
      if (heroH1) {
        heroH1.style.visibility = 'visible';
        const split = SplitText.create(heroH1, { type: 'chars,words' });
        gsap.from(split.chars, {
          y: 80,
          opacity: 0,
          rotateX: -40,
          duration: 0.8,
          stagger: 0.03,
          ease: 'back.out(1.5)',
          delay: 0.3,
        });
      }

      // --- Section h2 headings: words slide up on scroll ---
      document.querySelectorAll('.section-heading').forEach(heading => {
        const split = SplitText.create(heading, { type: 'words,chars' });
        // Animate words with a clip-mask effect
        gsap.set(split.words, { overflow: 'hidden', display: 'inline-block', verticalAlign: 'top' });
        gsap.from(split.chars, {
          y: '100%',
          duration: 0.6,
          stagger: 0.02,
          ease: 'power3.out',
          scrollTrigger: defaultTrigger(heading),
        });
      });
    }
  }

  // ===== Mobile hamburger menu =====
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
    });

    // Close menu on link click
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // ===== Escape key closes lightbox =====
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const lightbox = document.getElementById('lightbox');
      if (lightbox && !lightbox.classList.contains('hidden')) {
        lightbox.classList.add('hidden');
        lightbox.classList.remove('flex');
        document.body.style.overflow = '';
      }
    }
  });

  // ===== Back to top click =====
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== Chat tooltip auto-hide =====
  setTimeout(() => {
    const tooltip = document.getElementById('chat-tooltip');
    if (tooltip) tooltip.style.display = 'none';
  }, 6000);

  // ===== Before/After Sliders =====
  document.querySelectorAll('.ba-slider').forEach((slider) => {
    const beforeEl = slider.querySelector('.ba-before');
    const handle = slider.querySelector('.ba-handle');
    let isDragging = false;

    const updatePosition = (x) => {
      const rect = slider.getBoundingClientRect();
      let pos = ((x - rect.left) / rect.width) * 100;
      pos = Math.max(5, Math.min(95, pos));
      beforeEl.style.width = pos + '%';
      handle.style.left = pos + '%';
    };

    // Keyboard support
    let currentPos = 50;
    slider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        currentPos = e.key === 'ArrowLeft' ? Math.max(5, currentPos - 5) : Math.min(95, currentPos + 5);
        beforeEl.style.width = currentPos + '%';
        handle.style.left = currentPos + '%';
        slider.setAttribute('aria-valuenow', Math.round(currentPos));
      }
    });

    slider.addEventListener('mousedown', (e) => { isDragging = true; updatePosition(e.clientX); });
    slider.addEventListener('touchstart', (e) => { isDragging = true; updatePosition(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('mousemove', (e) => { if (isDragging) updatePosition(e.clientX); });
    window.addEventListener('touchmove', (e) => { if (isDragging) updatePosition(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('mouseup', () => { isDragging = false; });
    window.addEventListener('touchend', () => { isDragging = false; });
  });

  // ===== Testimonials carousel (mobile) =====
  const track = document.getElementById('testimonialTrack');
  const dots = document.querySelectorAll('.testimonial-dot');
  if (track && dots.length) {
    let current = 0;
    const slides = track.querySelectorAll('.testimonial-slide');
    const total = slides.length;

    const goTo = (i) => {
      current = i;
      if (window.innerWidth < 768) {
        track.style.transform = `translateX(-${current * 100}%)`;
      } else {
        track.style.transform = '';
      }
      dots.forEach((d, idx) => {
        d.classList.toggle('bg-gold', idx === current);
        d.classList.toggle('bg-white/20', idx !== current);
      });
    };

    dots.forEach((dot) => {
      dot.addEventListener('click', () => goTo(Number(dot.dataset.index)));
    });

    // Auto-rotate every 5s
    setInterval(() => {
      if (window.innerWidth < 768) goTo((current + 1) % total);
    }, 5000);
  }

  // ===== Smooth scroll for anchor links =====
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = (document.querySelector('.navbar')?.offsetHeight || 80) + 20;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ===== Vanilla Tilt on service cards =====
  const isDesktop = window.matchMedia('(min-width: 1024px) and (hover: hover)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (typeof VanillaTilt !== 'undefined' && isDesktop && !reducedMotion) {
    VanillaTilt.init(document.querySelectorAll('.service-card'), {
      max: 8,
      speed: 400,
      glare: true,
      'max-glare': 0.15,
      scale: 1.02,
    });
  }
});
