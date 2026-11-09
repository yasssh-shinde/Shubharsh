/* ==========================================================================
   SHUBHAM & HARSHADA · MODERN LUXURY FLORAL WEDDING INVITATION
   INTERACTIVE SCRIPT ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initDoorSealOpening();
  initPetalsCanvas();
  initAudioSystem();
  initScratchCard();
  initCountdownTimer();
  initScrollAnimations();
  initGalleryCarousel();
  initLightbox();
});

/* --------------------------------------------------------------------------
   1. ROYAL GATE & MONOGRAM WAX SEAL
   -------------------------------------------------------------------------- */
let isGateOpen = false;

function initDoorSealOpening() {
  const gateOverlay = document.getElementById('royal-gate-overlay');
  const sealContainer = document.getElementById('seal-container');
  const openGateBtn = document.getElementById('tap-prompt-btn');

  if (!gateOverlay || !sealContainer) return;

  function handleOpenGate(e) {
    if (isGateOpen) return;
    isGateOpen = true;

    // Trigger seal sparkle particles
    createSparkleBurst(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2, 24);

    // Open gate doors
    gateOverlay.classList.add('opened');

    // Start background music
    playBackgroundMusic();

    // Trigger celebration confetti
    setTimeout(() => {
      triggerConfettiBurst();
    }, 600);

    // Remove gate from DOM after transition
    setTimeout(() => {
      gateOverlay.style.display = 'none';
    }, 1800);
  }

  sealContainer.addEventListener('click', handleOpenGate);
  if (openGateBtn) {
    openGateBtn.addEventListener('click', handleOpenGate);
  }
}

/* --------------------------------------------------------------------------
   2. FALLING ROSE & GOLDEN PETALS (CANVAS)
   -------------------------------------------------------------------------- */
function initPetalsCanvas() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petalCount = 26;
  const petals = [];

  // Rose red, blush pink, golden petal colors
  const petalColors = [
    { r: 184, g: 107, b: 119 }, // Rose dust
    { r: 212, g: 175, b: 55 },  // Gold
    { r: 247, g: 232, b: 235 }, // Blush soft
    { r: 158, g: 71, b: 88 },   // Deep burgundy
    { r: 245, g: 213, b: 153 }  // Champagne
  ];

  for (let i = 0; i < petalCount; i++) {
    petals.push({
      x: Math.random() * width,
      y: Math.random() * height - height,
      size: Math.random() * 9 + 8,
      speedX: Math.random() * 1.5 - 0.75,
      speedY: Math.random() * 1.4 + 0.9,
      angle: Math.random() * Math.PI * 2,
      spin: Math.random() * 0.03 - 0.015,
      color: petalColors[Math.floor(Math.random() * petalColors.length)],
      opacity: Math.random() * 0.5 + 0.35,
      sway: Math.random() * 0.02 + 0.01
    });
  }

  function renderPetals() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < petals.length; i++) {
      const p = petals[i];
      p.y += p.speedY;
      p.x += Math.sin(p.y * p.sway) * 0.8 + p.speedX;
      p.angle += p.spin;

      if (p.y > height + 20) {
        p.y = -20;
        p.x = Math.random() * width;
      }
      if (p.x > width + 20) p.x = -20;
      if (p.x < -20) p.x = width + 20;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(p.size, -p.size * 0.6, p.size * 1.2, p.size * 0.8, 0, p.size * 1.4);
      ctx.bezierCurveTo(-p.size * 1.2, p.size * 0.8, -p.size, -p.size * 0.6, 0, 0);
      ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.opacity})`;
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(renderPetals);
  }

  renderPetals();
}

/* --------------------------------------------------------------------------
   3. BACKGROUND MUSIC & PROCEDURAL WEB-AUDIO FALLBACK
   -------------------------------------------------------------------------- */
let isPlayingMusic = false;
let audioElem = null;
let synthAudioContext = null;
let synthOscillators = [];
let synthGain = null;

function initAudioSystem() {
  audioElem = document.getElementById('wedding-audio');
  const musicToggle = document.getElementById('music-toggle-btn');
  const eqBars = document.getElementById('equalizer-bars');
  const musicLabel = document.getElementById('music-label');

  if (musicToggle) {
    musicToggle.addEventListener('click', () => {
      if (isPlayingMusic) {
        pauseBackgroundMusic();
      } else {
        playBackgroundMusic();
      }
    });
  }

  if (audioElem) {
    audioElem.addEventListener('ended', () => {
      audioElem.currentTime = 0;
      audioElem.play().catch(() => {});
    });
  }
}

function playBackgroundMusic() {
  const eqBars = document.getElementById('equalizer-bars');
  const musicLabel = document.getElementById('music-label');
  isPlayingMusic = true;

  if (eqBars) eqBars.classList.add('playing');
  if (musicLabel) musicLabel.textContent = 'Music Playing';

  if (audioElem) {
    audioElem.volume = 0.65;
    const playPromise = audioElem.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.log('Audio file blocked or offline, starting Indian raga procedural synthesizer:', err);
        startProceduralWeddingMusic();
      });
    }
  } else {
    startProceduralWeddingMusic();
  }
}

function pauseBackgroundMusic() {
  const eqBars = document.getElementById('equalizer-bars');
  const musicLabel = document.getElementById('music-label');
  isPlayingMusic = false;

  if (eqBars) eqBars.classList.remove('playing');
  if (musicLabel) musicLabel.textContent = 'Play Music';

  if (audioElem) {
    audioElem.pause();
  }
  stopProceduralWeddingMusic();
}

// Procedural soothing Indian raga flute & tanpura synthesizer
function startProceduralWeddingMusic() {
  if (synthAudioContext && synthAudioContext.state === 'running') return;

  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    synthAudioContext = new AudioContext();

    synthGain = synthAudioContext.createGain();
    synthGain.gain.setValueAtTime(0.08, synthAudioContext.currentTime);

    // Warm low-pass filter to sound organic & warm like a bansuri / shehnai
    const filter = synthAudioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, synthAudioContext.currentTime);

    synthGain.connect(filter);
    filter.connect(synthAudioContext.destination);

    // Tanpura drone base frequencies (C# / Pancham root: C#4, G#3, C#3)
    const baseFreqs = [138.59, 207.65, 277.18];
    baseFreqs.forEach((freq, idx) => {
      const osc = synthAudioContext.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, synthAudioContext.currentTime);

      const oscGain = synthAudioContext.createGain();
      oscGain.gain.setValueAtTime(0.035 / (idx + 1), synthAudioContext.currentTime);

      osc.connect(oscGain);
      oscGain.connect(synthGain);
      osc.start();
      synthOscillators.push(osc);
    });

    // Gentle raga melodic notes (Bhairavi / Yaman auspicious wedding notes)
    const ragaNotes = [277.18, 311.13, 349.23, 369.99, 415.3, 466.16, 523.25, 554.37];
    let noteIdx = 0;

    const melodyTimer = setInterval(() => {
      if (!isPlayingMusic || !synthAudioContext || synthAudioContext.state !== 'running') {
        clearInterval(melodyTimer);
        return;
      }

      const noteFreq = ragaNotes[Math.floor(Math.random() * ragaNotes.length)];
      const noteOsc = synthAudioContext.createOscillator();
      noteOsc.type = 'sine';
      noteOsc.frequency.setValueAtTime(noteFreq, synthAudioContext.currentTime);

      const noteEnv = synthAudioContext.createGain();
      const now = synthAudioContext.currentTime;
      noteEnv.gain.setValueAtTime(0.001, now);
      noteEnv.gain.linearRampToValueAtTime(0.05, now + 0.4);
      noteEnv.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

      noteOsc.connect(noteEnv);
      noteEnv.connect(synthGain);
      noteOsc.start(now);
      noteOsc.stop(now + 2.4);
    }, 1800);

  } catch (err) {
    console.error('Synthesizer init failed:', err);
  }
}

function stopProceduralWeddingMusic() {
  if (synthAudioContext) {
    try {
      synthAudioContext.close();
      synthAudioContext = null;
      synthOscillators = [];
    } catch (e) {}
  }
}

/* --------------------------------------------------------------------------
   4. INTERACTIVE SCRATCH-OFF CARD (DATE REVEAL)
   -------------------------------------------------------------------------- */
function initScratchCard() {
  const canvas = document.getElementById('scratch-canvas');
  const revealBtn = document.getElementById('reveal-date-btn');
  const revealStatus = document.getElementById('reveal-date-status');
  const hiddenDate = document.querySelector('.scratch-hidden-content');
  const detailsSections = document.querySelectorAll('[data-after-date-reveal]');
  if (!canvas) return;

  if (hiddenDate) hiddenDate.setAttribute('aria-hidden', 'true');
  detailsSections.forEach((section) => {
    section.hidden = true;
  });

  const ctx = canvas.getContext('2d');
  let isScratching = false;
  let isRevealed = false;

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    drawScratchCover(rect.width, rect.height);
  }

  function drawScratchCover(w, h) {
    // Elegant luxury gold metallic shimmer cover
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#fbf2d2');
    grad.addColorStop(0.3, '#d8b053');
    grad.addColorStop(0.7, '#a5791c');
    grad.addColorStop(1, '#e3be69');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Ornate gold border
    ctx.strokeStyle = 'rgba(100, 70, 15, 0.45)';
    ctx.lineWidth = 4;
    ctx.strokeRect(8, 8, w - 16, h - 16);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.strokeRect(14, 14, w - 28, h - 28);

    // Shimmer Text
    const labelFontSize = Math.min(15, Math.max(12, w / 25));
    ctx.fillStyle = '#3a2106';
    ctx.font = `bold ${labelFontSize}px Montserrat, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SCRATCH TO REVEAL', w / 2, h / 2 - 12);

    ctx.fillStyle = '#5c3a10';
    ctx.font = `italic ${labelFontSize + 1}px "Cormorant Garamond", serif`;
    ctx.fillText('your wedding date & time', w / 2, h / 2 + 14);
  }

  // Handle scratch
  function scratch(x, y) {
    if (isRevealed) return;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();

    checkScratchPercentage();
  }

  function checkScratchPercentage() {
    if (isRevealed) return;
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    let transparentCount = 0;
    const totalSampled = pixels.length / (4 * 16);

    for (let i = 3; i < pixels.length; i += 4 * 16) {
      if (pixels[i] < 128) {
        transparentCount++;
      }
    }

    const percent = (transparentCount / totalSampled) * 100;
    if (percent > 35) {
      revealFullDate();
    }
  }

  function revealFullDate() {
    if (isRevealed) return;
    isRevealed = true;
    if (revealStatus) revealStatus.textContent = 'Date revealed. Ceremony details are below.';
    if (revealBtn) {
      revealBtn.textContent = 'Date revealed';
      revealBtn.disabled = true;
    }
    if (hiddenDate) hiddenDate.removeAttribute('aria-hidden');
    detailsSections.forEach((section) => {
      section.hidden = false;
    });

    canvas.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    canvas.style.opacity = '0';
    canvas.style.transform = 'scale(1.04)';
    setTimeout(() => {
      canvas.style.display = 'none';
    }, 750);

    triggerConfettiBurst();
  }

  // Pointer & Touch Events
  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  canvas.addEventListener('mousedown', (e) => {
    isScratching = true;
    const pos = getPos(e);
    scratch(pos.x, pos.y);
  });

  window.addEventListener('mouseup', () => {
    isScratching = false;
  });

  canvas.addEventListener('mousemove', (e) => {
    if (!isScratching) return;
    const pos = getPos(e);
    scratch(pos.x, pos.y);
  });

  canvas.addEventListener('touchstart', (e) => {
    isScratching = true;
    const pos = getPos(e);
    scratch(pos.x, pos.y);
    e.preventDefault();
  }, { passive: false });

  canvas.addEventListener('touchmove', (e) => {
    if (!isScratching) return;
    const pos = getPos(e);
    scratch(pos.x, pos.y);
    e.preventDefault();
  }, { passive: false });

  window.addEventListener('touchend', () => {
    isScratching = false;
  });

  if (revealBtn) {
    revealBtn.addEventListener('click', revealFullDate);
  }

  // Initial draw
  setTimeout(resizeCanvas, 100);
  window.addEventListener('resize', () => {
    if (!isRevealed) resizeCanvas();
  });
}

/* --------------------------------------------------------------------------
   5. LIVE COUNTDOWN TIMER
   -------------------------------------------------------------------------- */
function initCountdownTimer() {
  // Target: 2026-12-05 12:13:00 IST
  const weddingDate = new Date('2026-12-05T12:13:00+05:30').getTime();

  const daysElem = document.getElementById('count-days');
  const hoursElem = document.getElementById('count-hours');
  const minutesElem = document.getElementById('count-minutes');
  const secondsElem = document.getElementById('count-seconds');

  if (!daysElem || !hoursElem || !minutesElem || !secondsElem) return;

  function updateTimer() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
      daysElem.textContent = '00';
      hoursElem.textContent = '00';
      minutesElem.textContent = '00';
      secondsElem.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysElem.textContent = days < 10 ? '0' + days : days;
    hoursElem.textContent = hours < 10 ? '0' + hours : hours;
    minutesElem.textContent = minutes < 10 ? '0' + minutes : minutes;
    secondsElem.textContent = seconds < 10 ? '0' + seconds : seconds;
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* --------------------------------------------------------------------------
   6. SCROLL REVEAL ANIMATIONS
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------------
   7. PHOTO GALLERY CAROUSEL & DOTS
   -------------------------------------------------------------------------- */
function initGalleryCarousel() {
  const track = document.getElementById('gallery-track');
  const dots = document.querySelectorAll('.gallery-dot');

  if (!track || !dots.length) return;

  track.addEventListener('scroll', () => {
    const scrollLeft = track.scrollLeft;
    const cardWidth = track.firstElementChild ? track.firstElementChild.offsetWidth + 16 : 296;
    const activeIndex = Math.min(Math.round(scrollLeft / cardWidth), dots.length - 1);

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === activeIndex);
    });
  }, { passive: true });

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const targetIndex = parseInt(dot.getAttribute('data-index') || '0', 10);
      const cardWidth = track.firstElementChild ? track.firstElementChild.offsetWidth + 16 : 296;
      track.scrollTo({
        left: targetIndex * cardWidth,
        behavior: 'smooth'
      });
    });
  });
}

/* --------------------------------------------------------------------------
   8. LIGHTBOX MODAL
   -------------------------------------------------------------------------- */
function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const modalCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  const polaroids = document.querySelectorAll('.polaroid-card');

  if (!modal || !modalImg) return;

  polaroids.forEach((card) => {
    card.addEventListener('click', () => {
      const img = card.querySelector('.polaroid-img');
      const caption = card.querySelector('.polaroid-caption');
      if (img) modalImg.src = img.src;
      if (modalCaption && caption) modalCaption.textContent = caption.textContent;
      modal.classList.add('active');
    });
  });

  function closeModal() {
    modal.classList.remove('active');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   CELEBRATION SPARKLES & CONFETTI
   -------------------------------------------------------------------------- */
function createSparkleBurst(x, y, count) {
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'sparkle-particle';
    const size = Math.random() * 8 + 6;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;

    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 80 + 40;
    const destX = Math.cos(angle) * velocity;
    const destY = Math.sin(angle) * velocity;

    p.style.transform = `translate(${destX}px, ${destY}px)`;
    p.style.transition = `transform ${Math.random() * 0.4 + 0.4}s ease-out, opacity 0.5s ease`;

    document.body.appendChild(p);

    setTimeout(() => {
      p.remove();
    }, 900);
  }
}

function triggerConfettiBurst() {
  const colors = ['#d4af37', '#f6e29f', '#b86b77', '#ffffff', '#c59b27'];
  const confettiCount = 50;
  const container = document.body;

  for (let i = 0; i < confettiCount; i++) {
    const conf = document.createElement('div');
    conf.style.position = 'fixed';
    conf.style.zIndex = '999';
    conf.style.width = `${Math.random() * 8 + 6}px`;
    conf.style.height = `${Math.random() * 14 + 8}px`;
    conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    conf.style.left = `${Math.random() * 80 + 10}vw`;
    conf.style.top = '-20px';
    conf.style.borderRadius = '2px';
    conf.style.pointerEvents = 'none';
    conf.style.transform = `rotate(${Math.random() * 360}deg)`;

    const fallDuration = Math.random() * 2 + 2;
    conf.style.transition = `top ${fallDuration}s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform ${fallDuration}s ease-out, opacity ${fallDuration}s linear`;

    container.appendChild(conf);

    setTimeout(() => {
      conf.style.top = '105vh';
      conf.style.transform = `rotate(${Math.random() * 720}deg) translateX(${Math.random() * 100 - 50}px)`;
      conf.style.opacity = '0';
    }, 20);

    setTimeout(() => {
      conf.remove();
    }, fallDuration * 1000 + 100);
  }
}
