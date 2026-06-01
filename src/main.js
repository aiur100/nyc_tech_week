import './style.css';

// ─── Itinerary data ──────────────────────────────────────────────────────────
const DAYS = [
  {
    id: 'd1',
    label: 'Mon',
    date: 'Jun 01',
    full: 'Monday, June 1',
    events: [
      {
        time: '10:00',
        meridiem: 'AM',
        title: 'ATTAP Vibeathon & Agentathon',
        tag: 'hackathon',
        host: 'Eventide × Dreamy',
        venue: 'TBA',
        desc: 'Hands-on with leading LLMs + the ATTAP.ai platform. Build no-code, no-prompt "Vibes" for hyper-personalized workflows. Cutting through the hype to what actually ships.',
        url: 'https://partiful.com/e/GmOIWn5hMegxDT7gDfTX',
      },
    ],
  },
  {
    id: 'd2',
    label: 'Tue',
    date: 'Jun 02',
    full: 'Tuesday, June 2',
    events: [
      {
        time: '8:00',
        meridiem: 'AM',
        title: 'The Exit Breakfast',
        tag: 'founders',
        host: 'L40 · Pygma · Colectivo',
        venue: 'SoHo',
        desc: 'Invite-only breakfast for founders navigating the exit. Honest talk on acquisitions, IPOs, secondaries & strategic deals — no pitches, no keynotes.',
        url: 'https://partiful.com/e/GWxdINK4i24WU6zh9TCU',
      },
      {
        time: '2:00',
        meridiem: 'PM',
        end: '4:00 PM',
        title: 'Founders & Investors Afternoon Mixer',
        tag: 'networking',
        host: 'Comp AI',
        venue: 'TBA',
        desc: 'No agenda. Just IRL connecting with other smart people. Founders & investors hang, get to know each other.',
        url: 'https://partiful.com/e/nNJ80KODX1rqDJbIKCln',
      },
    ],
  },
  {
    id: 'd3',
    label: 'Wed',
    date: 'Jun 03',
    full: 'Wednesday, June 3',
    events: [
      {
        time: '5:00',
        meridiem: 'PM',
        end: '7:00 PM',
        title: 'Pinecone Nexus AI Launch Party',
        tag: 'launch',
        host: 'Pinecone',
        venue: 'TBA',
        desc: 'Celebrating the Nexus launch. Demo + talk by VP Product Jeff Zhu at 5:15, then Q&A and networking. Light snacks provided.',
        url: 'https://partiful.com/e/47mPwA31ZZoWx6Tzozgr',
      },
      {
        time: '7:00',
        meridiem: 'PM',
        end: '11:00 PM',
        title: 'AI Agents: From Prototype to Production',
        tag: 'hackathon',
        host: 'Phinite × GMI',
        venue: 'TBA',
        desc: 'Evening build sprint for production-ready multi-agent apps. Real infra, real guardrails, real stakes. Top 3 teams pitch a VC. Food & drinks.',
        url: 'https://partiful.com/e/DItIrZ4soRc9FKWDzvoT',
      },
    ],
  },
];

const TAG_LABELS = {
  hackathon: '> hackathon',
  founders: '> founders',
  networking: '> networking',
  launch: '> launch',
};

// ─── Render ──────────────────────────────────────────────────────────────────
const totalEvents = DAYS.reduce((n, d) => n + d.events.length, 0);

const app = document.getElementById('app');
app.innerHTML = `
  <header class="hero">
    <div class="hero-bar">
      <img src="/logo.png" class="logo" alt="Pasley Hill" />
      <span class="brand">PASLEY&nbsp;HILL<span class="brand-llc">LLC</span></span>
      <span class="status"><span class="dot"></span>${totalEvents} events locked</span>
    </div>
    <h1 class="title">
      <span class="title-line">NYC&nbsp;TECH&nbsp;WEEK</span>
      <span class="title-line accent">'26 ITINERARY</span>
    </h1>
    <p class="subtitle"><span class="prompt">~/nyc-tech-week $</span> <span id="typed"></span><span class="caret">█</span></p>
    <nav class="day-nav">
      ${DAYS.map(
        (d) => `<a href="#${d.id}" class="day-pill"><b>${d.label}</b> ${d.date}</a>`
      ).join('')}
    </nav>
  </header>

  <main class="timeline">
    ${DAYS.map(
      (d) => `
      <section class="day" id="${d.id}">
        <div class="day-head reveal">
          <span class="day-index">${d.label.toUpperCase()}</span>
          <h2>${d.full}</h2>
          <span class="day-count">${d.events.length} stop${d.events.length > 1 ? 's' : ''}</span>
        </div>
        ${d.events
          .map(
            (e) => `
          <article class="event reveal" data-tag="${e.tag}">
            <div class="node"></div>
            <div class="time">
              <span class="t">${e.time}</span>
              <span class="m">${e.meridiem}</span>
              ${e.end ? `<span class="til">→ ${e.end}</span>` : ''}
            </div>
            <div class="card">
              <div class="card-top">
                <span class="tag tag-${e.tag}">${TAG_LABELS[e.tag]}</span>
                <span class="venue">📍 ${e.venue}</span>
              </div>
              <h3>${e.title}</h3>
              <p class="host">hosted by <b>${e.host}</b></p>
              <p class="desc">${e.desc}</p>
              <a class="rsvp" href="${e.url}" target="_blank" rel="noopener">
                view on partiful <span class="arr">↗</span>
              </a>
            </div>
          </article>`
          )
          .join('')}
      </section>`
    ).join('')}
  </main>

  <footer class="foot">
    <img src="/logo.png" class="foot-logo" alt="" />
    <p>Built by <b>Pasley Hill LLC</b> — AI-native software development.</p>
    <p class="muted">See you out there. Find us at the after-parties.</p>
  </footer>
`;

// ─── Typing effect ─────────────────────────────────────────────────────────--
const phrases = [
  'plan --week=nyc-tech-2026',
  'load itinerary.json ✓',
  '5 events · 3 days · 0 FOMO',
];
const typed = document.getElementById('typed');
let pi = 0,
  ci = 0,
  deleting = false;
function tick() {
  const word = phrases[pi];
  typed.textContent = word.slice(0, ci);
  if (!deleting && ci < word.length) {
    ci++;
  } else if (!deleting && ci === word.length) {
    deleting = true;
    return setTimeout(tick, 1600);
  } else if (deleting && ci > 0) {
    ci--;
  } else {
    deleting = false;
    pi = (pi + 1) % phrases.length;
  }
  setTimeout(tick, deleting ? 35 : 70);
}
tick();

// ─── Scroll reveal ─────────────────────────────────────────────────────────--
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        io.unobserve(en.target);
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.setProperty('--d', `${(i % 4) * 80}ms`);
  io.observe(el);
});

// ─── Pointer glow on cards ─────────────────────────────────────────────────--
document.querySelectorAll('.card').forEach((card) => {
  card.addEventListener('pointermove', (ev) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${ev.clientX - r.left}px`);
    card.style.setProperty('--my', `${ev.clientY - r.top}px`);
  });
});

// ─── Active day pill on scroll ─────────────────────────────────────────────--
const pills = [...document.querySelectorAll('.day-pill')];
const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        const id = en.target.id;
        pills.forEach((p) =>
          p.classList.toggle('active', p.getAttribute('href') === `#${id}`)
        );
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);
document.querySelectorAll('.day').forEach((d) => spy.observe(d));
