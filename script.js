/* ═══════════════════════════════════════════════════════
   BECOMING HER AGAIN — script.js
   For Albertha Ampomah Quaicoe

   TABLE OF CONTENTS
   1.  CONFIG — Edit your personal settings here
   2.  CONTENT LOADER — Fetches and injects content/*.html
   3.  PARTICLES — Canvas ambient particle system
   4.  CURSOR — Custom rose gold cursor + ring
   5.  INTRO — Cinematic sentence reveal sequence
   6.  NAVIGATION — Nav dots + scroll tracking + progress bar
   7.  SCROLL ANIMATIONS — fade-up / fade-left / fade-right
   8.  MUSIC — Ambient audio toggle
   9.  EASTER EGG — Hidden romantic message
   10. CHALLENGE CARDS — Discovery board build + unlock
   11. COUNTDOWN — Days/hours/minutes since anniversary
   12. INIT — Runs everything after content loads

   ═══════════════════════════════════════════════════════ */


/* ─────────────────────────────────────────
   1. CONFIG
   Edit these values to personalise the site.
   ───────────────────────────────────────── */
const CONFIG = {
  // ← Change this to your real anniversary date
  ANNIVERSARY_DATE: '2025-02-14T00:00:00',

  // Content files to load in order
  CONTENT_FILES: [
    'content/01-intro.html',
    'content/02-girl-i-see.html',
    'content/03-before-pain.html',
    'content/04-discovery.html',
    'content/05-future-her.html',
    'content/06-us.html',
  ],

  // Section IDs matching the loaded content
  SECTION_IDS: ['intro', 'room1', 'room2', 'room3', 'room4', 'room5'],

  // Particle system
  PARTICLE_COUNT: 80,
}


/* ─────────────────────────────────────────
   2. CONTENT LOADER
   Fetches each content file and injects it
   into #site-content, then boots everything.
   ───────────────────────────────────────── */
async function loadContent() {
  const container = document.getElementById('site-content')
  if (!container) return

  for (const file of CONFIG.CONTENT_FILES) {
    try {
      const res  = await fetch(file)
      const html = await res.text()
      container.insertAdjacentHTML('beforeend', html)
    } catch (err) {
      console.warn(`Could not load ${file}:`, err)
    }
  }

  // All content is in the DOM — boot everything
  init()
}


/* ─────────────────────────────────────────
   3. PARTICLES
   Soft ambient rose-gold particles drifting
   across the fixed canvas background.
   ───────────────────────────────────────── */
function initParticles() {
  const canvas = document.getElementById('particles-canvas')
  if (!canvas) return
  const ctx = canvas.getContext('2d')

  const resize = () => {
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
  }
  resize()
  window.addEventListener('resize', resize)

  const particles = Array.from({ length: CONFIG.PARTICLE_COUNT }, () => ({
    x:  Math.random() * canvas.width,
    y:  Math.random() * canvas.height,
    r:  Math.random() * 1.4 + 0.4,
    vx: (Math.random() - 0.5) * 0.18,
    vy: (Math.random() - 0.5) * 0.18 - 0.04,
    o:  Math.random() * 0.36 + 0.05,
    fl: Math.random() * Math.PI * 2,
  }))

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    particles.forEach(p => {
      p.fl += 0.018
      const alpha = p.o * (0.7 + 0.3 * Math.sin(p.fl))
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(245,198,208,${alpha})`
      ctx.fill()
      p.x += p.vx
      p.y += p.vy
      if (p.x < 0) p.x = canvas.width
      if (p.x > canvas.width) p.x = 0
      if (p.y < 0) p.y = canvas.height
      if (p.y > canvas.height) p.y = 0
    })
    requestAnimationFrame(animate)
  }
  animate()
}


/* ─────────────────────────────────────────
   4. CURSOR
   Custom rose-gold dot + trailing ring.
   Scales up on interactive elements.
   ───────────────────────────────────────── */
function initCursor() {
  const cur  = document.getElementById('cursor')
  const ring = document.getElementById('cursor-ring')
  if (!cur || !ring) return

  let mx = 0, my = 0, rx = 0, ry = 0

  document.addEventListener('mousemove', e => {
    mx = e.clientX
    my = e.clientY
    cur.style.left = mx + 'px'
    cur.style.top  = my + 'px'
  })

  ;(function animRing() {
    rx += (mx - rx) * 0.1
    ry += (my - ry) * 0.1
    ring.style.left = rx + 'px'
    ring.style.top  = ry + 'px'
    requestAnimationFrame(animRing)
  })()

  // Magnify on interactive elements
  const SELECTORS = 'button, .enter-btn, .challenge-card, .nav-dot, .easter-egg-trigger, .polaroid, .promise-card, .admire-item, a'

  function attachHover() {
    document.querySelectorAll(SELECTORS).forEach(el => {
      el.addEventListener('mouseenter', () => {
        cur.style.transform  = 'translate(-50%,-50%) scale(2.4)'
        ring.style.transform = 'translate(-50%,-50%) scale(1.4)'
      })
      el.addEventListener('mouseleave', () => {
        cur.style.transform  = 'translate(-50%,-50%) scale(1)'
        ring.style.transform = 'translate(-50%,-50%) scale(1)'
      })
    })
  }
  attachHover()

  // Re-attach after dynamic content (challenge cards)
  const observer = new MutationObserver(attachHover)
  observer.observe(document.body, { childList: true, subtree: true })
}


/* ─────────────────────────────────────────
   5. INTRO
   Cinematic sentence reveal sequence.
   Sentences appear one at a time, then the
   title and enter button fade in.
   ───────────────────────────────────────── */
function initIntro() {
  const g = id => document.getElementById(id)
  if (!g('s1')) return

  // Timing (ms)
  setTimeout(() => g('s1').classList.add('visible'), 700)
  setTimeout(() => g('s2').classList.add('visible'), 1900)
  setTimeout(() => g('s3').classList.add('visible'), 3300)
  setTimeout(() => { if (g('heartbeat-line')) g('heartbeat-line').style.opacity = '0.5' }, 4600)
  setTimeout(() => g('s4').classList.add('visible'), 5400)
  setTimeout(() => g('title-main').classList.add('visible'), 7000)
  setTimeout(() => g('subtitle-main').classList.add('visible'), 8200)
  setTimeout(() => g('enter-btn').classList.add('visible'), 8800)
}

// Called by the Enter button in 01-intro.html
function enterSite() {
  const ov = document.getElementById('transition-overlay')
  ov.style.opacity = '1'
  setTimeout(() => {
    document.getElementById('room1').scrollIntoView({ behavior: 'smooth' })
    setTimeout(() => { ov.style.opacity = '0' }, 400)
  }, 500)
}

// Called by nav dots
function scrollToSection(index) {
  const id = CONFIG.SECTION_IDS[index]
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}


/* ─────────────────────────────────────────
   6. NAVIGATION
   Progress bar + nav dot active state
   tracking based on scroll position.
   ───────────────────────────────────────── */
function initNavigation() {
  const pb   = document.getElementById('progress-bar')
  const dots = document.querySelectorAll('.nav-dot')

  function onScroll() {
    // Progress bar
    const scrolled = window.scrollY
    const total    = document.body.scrollHeight - window.innerHeight
    if (pb && total > 0) pb.style.width = (scrolled / total * 100) + '%'

    // Active dot
    CONFIG.SECTION_IDS.forEach((id, i) => {
      const el = document.getElementById(id)
      if (!el) return
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
        dots.forEach(d => d.classList.remove('active'))
        if (dots[i]) dots[i].classList.add('active')
      }
    })
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
}


/* ─────────────────────────────────────────
   7. SCROLL ANIMATIONS
   Elements with .fade-up, .fade-left, or
   .fade-right animate in when scrolled into
   view (88% of viewport height threshold).
   ───────────────────────────────────────── */
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.01, rootMargin: '0px 0px 0px 0px' }
  )

  function observeAll() {
    document.querySelectorAll('.fade-up, .fade-left, .fade-right').forEach(el => {
      if (!el.classList.contains('in')) observer.observe(el)
    })
  }

  observeAll()

  // Fallback: force-show anything still hidden after 3 seconds of scrolling
  window.addEventListener('scroll', () => {
    document.querySelectorAll('.fade-up, .fade-left, .fade-right').forEach(el => {
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('in')
      }
    })
  }, { passive: true })

  // Also observe any elements added dynamically (e.g. challenge cards)
  const mutationObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) {
          if (node.matches?.('.fade-up, .fade-left, .fade-right')) observer.observe(node)
          node.querySelectorAll?.('.fade-up, .fade-left, .fade-right').forEach(el => observer.observe(el))
        }
      })
    })
    observeAll()
  })
  mutationObserver.observe(document.body, { childList: true, subtree: true })
}


/* ─────────────────────────────────────────
   8. MUSIC
   Ambient audio toggle. Tries local file
   first, falls back to CDN (set in index.html
   <audio> source order).
   ───────────────────────────────────────── */
let musicOn = false

function toggleMusic() {
  const audio = document.getElementById('ambient-audio')
  const btn   = document.getElementById('music-btn')
  if (!audio || !btn) return

  audio.volume = 0.28

  if (musicOn) {
    audio.pause()
    btn.textContent = '♪ AMBIENCE'
  } else {
    audio.play().catch(() => {
      console.log('Audio autoplay blocked — user must interact first.')
    })
    btn.textContent = '♫ PLAYING'
  }
  musicOn = !musicOn
}


/* ─────────────────────────────────────────
   9. EASTER EGG
   Hidden romantic message, bottom-left corner.
   ───────────────────────────────────────── */
let eggOpen = false

function toggleEasterEgg() {
  eggOpen = !eggOpen
  const popup = document.getElementById('easter-egg-popup')
  if (popup) popup.classList.toggle('show', eggOpen)
}

// Close easter egg if clicking outside
document.addEventListener('click', e => {
  const popup   = document.getElementById('easter-egg-popup')
  const trigger = document.querySelector('.easter-egg-trigger')
  if (eggOpen && popup && !popup.contains(e.target) && !trigger.contains(e.target)) {
    eggOpen = false
    popup.classList.remove('show')
  }
})


/* ─────────────────────────────────────────
   10. CHALLENGE CARDS
   Builds the discovery board cards from the
   CHALLENGES array and handles unlock logic.
   ───────────────────────────────────────── */
const CHALLENGES = [
  {
    icon: '📸',
    title: 'Photograph Your World',
    desc: "Take photos of 3 things that made you smile today not for anyone else, just for you. Your eyes notice beauty in a way that is entirely your own.",
    note: "I would genuinely love to see what you notice, Albie ♡",
    locked: false,
  },
  {
    icon: '🌿',
    title: 'One Hour, Entirely Yours',
    desc: "Spend one full hour doing exactly what you want, no checking in, no obligations, no explaining yourself to anyone. Just you and whatever feels right.",
    note: "You deserve your own undivided attention ♡",
    locked: false,
  },
  {
    icon: '✍️',
    title: 'Write About Albertha',
    desc: "Write one full page about yourself, who you are, what you love, what you dream about without mentioning anyone else. Not even me. Just her.",
    note: "She deserves to be the whole story sometimes ♡",
    locked: false,
  },
  {
    icon: '🎨',
    title: 'Make Something',
    desc: "Create anything with your hands. Draw, write poetry, bake, arrange flowers. Let it out without judgment. It doesn't need to be good. It just needs to be yours.",
    note: "Everything you make is a small act of becoming ♡",
    locked: true,
  },
  {
    icon: '🌅',
    title: 'Watch the Sky Change',
    desc: "Sit somewhere and watch a sunrise or a full sunset all the way through. Just you and the sky. Let it remind you that everything changes, and change can be beautiful.",
    note: "New beginnings were made for someone like you ♡",
    locked: true,
  },
  {
    icon: '💌',
    title: 'Write to Future Albie',
    desc: "Write a letter to yourself one year from now. Tell her what you hope she knows, who you hope she has become, and how proud you already are of her.",
    note: "She will treasure it. I promise you that ♡",
    locked: true,
  },
  {
    icon: '🎵',
    title: 'Build Your Soundtrack',
    desc: "Create a playlist of songs that feel like YOU not your emotions right now, not old memories, but who you are at your core. What does Albertha sound like?",
    note: "Music remembers parts of us we forget to claim ♡",
    locked: true,
  },
  {
    icon: '🌸',
    title: 'Do One Thing Alone',
    desc: "Do something you would normally want company for, go somewhere, try something new but do it alone. Notice what it feels like to be your own company. She is good company, Albie.",
    note: "Being with yourself is not loneliness. It is coming home ♡",
    locked: true,
  },
  {
    icon: '🫶',
    title: 'Speak to Yourself Kindly',
    desc: "For one full day, catch every time you are hard on yourself and replace it with what you would say to someone you deeply love. Because you are someone worth loving deeply.",
    note: "You deserve that same grace more than anyone I know ♡",
    locked: true,
  },
]

function initChallengeCards() {
  const grid = document.getElementById('challenge-grid')
  if (!grid) return

  CHALLENGES.forEach((c, i) => {
    const card = document.createElement('div')
    card.className = 'challenge-card' + (c.locked ? ' locked' : '')

    card.innerHTML = `
      ${c.locked ? '<span class="lock-icon">🔒</span>' : ''}
      <div class="challenge-number">For Albie · ${String(i + 1).padStart(2, '0')}</div>
      <span class="challenge-icon">${c.icon}</span>
      <div class="challenge-title">${c.title}</div>
      <div class="challenge-desc">${c.desc}</div>
      <div class="challenge-note">${c.note}</div>
    `

    if (c.locked) {
      card.addEventListener('click', () => {
        card.classList.remove('locked')
        card.querySelector('.lock-icon')?.remove()
        card.classList.add('unlocking')
        setTimeout(() => card.classList.remove('unlocking'), 800)
      })
    }

    grid.appendChild(card)
  })
}


/* ─────────────────────────────────────────
   11. COUNTDOWN
   Shows days/hours/minutes since anniversary.
   Update ANNIVERSARY_DATE in CONFIG above.
   ───────────────────────────────────────── */
function initCountdown() {
  function update() {
    const start = new Date(CONFIG.ANNIVERSARY_DATE)
    const now   = new Date()
    const diff  = Math.max(0, now - start)

    const el = id => document.getElementById(id)
    if (el('cd-days'))  el('cd-days').textContent  = Math.floor(diff / 864e5)
    if (el('cd-hours')) el('cd-hours').textContent = String(now.getHours()).padStart(2, '0')
    if (el('cd-mins'))  el('cd-mins').textContent  = String(now.getMinutes()).padStart(2, '0')
  }

  update()
  setInterval(() => {
    const el = document.getElementById('cd-mins')
    if (el) el.textContent = String(new Date().getMinutes()).padStart(2, '0')
  }, 60000)
}


/* ─────────────────────────────────────────
   12. INIT
   Called after all content files are loaded.
   ───────────────────────────────────────── */
function init() {
  initParticles()
  initCursor()
  initIntro()
  initNavigation()
  initScrollAnimations()
  initChallengeCards()
  initCountdown()
}


/* ─────────────────────────────────────────
   BOOT
   Start by loading the content, which calls
   init() when all sections are in the DOM.
   ───────────────────────────────────────── */
loadContent()
