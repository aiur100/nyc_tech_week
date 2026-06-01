import './style.css';
import './gate.js';

// ─── Itinerary data ──────────────────────────────────────────────────────────
const DAYS = [
  {
    id: 'd1',
    label: 'Mon',
    date: 'Jun 01',
    full: 'Monday, June 1',
    events: [
      {
        time: '9:00',
        meridiem: 'AM',
        end: '12:00 PM',
        title: 'NYTW Kickoff Networking Breakfast',
        tag: 'networking',
        host: 'XLAI',
        venue: 'Gelatoville, 692 9th Ave',
        desc: 'Come for the coffee, stay for the connections. Curated morning gathering for founders, operators, engineers & builders in AI/tech, plus future-of-work investors. No agenda, no panels — just good conversation. Flow in and out as your schedule allows.',
        url: 'https://partiful.com/e/EbLHvoBrSl7ZV6xScsgz',
      },
      {
        time: '10:00',
        meridiem: 'AM',
        title: 'ATTAP Vibeathon & Agentathon',
        tag: 'hackathon',
        maybe: true,
        host: 'Eventide × Dreamy',
        venue: '873 Broadway, Suite 410',
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
        venue: 'Dante Aperitivo, 51 Bank St',
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
        venue: 'Somewhere Nowhere, 112 W 25th St',
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

// Cross-platform maps link: opens Google Maps on Android, hands off to
// Apple/Google Maps on iOS. Skips placeholder venues like "TBA".
const mapsUrl = (venue) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue + ', New York, NY')}`;
const isMappable = (venue) => venue && venue.toUpperCase() !== 'TBA';

const app = document.getElementById('app');
app.innerHTML = `
  <div class="term">
    <div class="term-bar">
      <span class="dots"><i></i><i></i><i></i></span>
      <span class="tb-title">pasleyhill@nyc-tech-week:&nbsp;~/itinerary</span>
      <span class="tb-online"><span class="dot"></span>ONLINE</span>
    </div>

    <header class="hero">
      <div class="hero-id">
        <img src="/logo.png" class="logo" alt="Pasley Hill" />
        <span class="brand">PASLEY_HILL<span class="brand-llc">LLC</span></span>
        <span class="x-join">×</span>
        <a class="partner" href="https://niuro.io" target="_blank" rel="noopener" aria-label="Niuro">
          <img src="/niuro.svg" class="niuro-logo" alt="Niuro" />
        </a>
      </div>
      <p class="partner-note"><span class="prompt">$</span> partners --field niuro.io <span class="ok">// rolling together</span></p>
      <h1 class="title">NYC_TECH_WEEK<span class="accent">_'26</span></h1>
      <p class="subtitle"><span class="prompt">$</span> <span id="typed"></span><span class="caret">█</span></p>

      <div class="readout">
        <span><b>${totalEvents}</b> EVENTS</span>
        <span><b>${DAYS.length}</b> DAYS</span>
        <span><b>0</b> FOMO</span>
        <span class="rd-loc">// NEW YORK CITY</span>
      </div>

      <nav class="day-nav">
        ${DAYS.map(
          (d) => `<a href="#${d.id}" class="day-pill"><b>${d.label}</b>:${d.date}</a>`
        ).join('')}
      </nav>
    </header>
  </div>

  <main class="timeline">
    ${DAYS.map(
      (d, di) => `
      <section class="day" id="${d.id}">
        <div class="day-head reveal">
          <span class="day-index">DAY_0${di + 1}</span>
          <h2>${d.full}</h2>
          <span class="day-count">[ ${d.events.length} stop${d.events.length > 1 ? 's' : ''} ]</span>
        </div>
        ${d.events
          .map(
            (e) => `
          <article class="event reveal" data-tag="${e.tag}">
            <span class="node"></span>
            <div class="card">
              <div class="card-head">
                <span class="time">${e.time}<small>${e.meridiem}</small></span>
                ${e.end ? `<span class="dur">→ ${e.end}</span>` : ''}
                <span class="tag tag-${e.tag}">${TAG_LABELS[e.tag]}</span>
                ${e.maybe ? `<span class="tag tag-maybe">? maybe</span>` : ''}
              </div>
              <h3>${e.title}</h3>
              <p class="meta">
                <span>host: <b>${e.host}</b></span>
                <span>loc: ${
                  isMappable(e.venue)
                    ? `<a class="map-link" href="${mapsUrl(e.venue)}" target="_blank" rel="noopener">${e.venue} <span class="arr">↗</span></a>`
                    : `<b>${e.venue}</b>`
                }</span>
              </p>
              <p class="desc">${e.desc}</p>
              <a class="rsvp" href="${e.url}" target="_blank" rel="noopener">
                ./rsvp --partiful <span class="arr">↗</span>
              </a>
            </div>
          </article>`
          )
          .join('')}
      </section>`
    ).join('')}
  </main>

  <footer class="foot">
    <p class="foot-cmd"><span class="prompt">$</span> exit</p>
    <p>Built by <b>Pasley Hill LLC</b> — AI-native software development.</p>
    <p class="muted">See you out there. Find us at the after-parties.</p>
  </footer>
`;

// ─── Typing effect ─────────────────────────────────────────────────────────--
const phrases = [
  'plan --week=nyc-tech-2026',
  'load itinerary.json ✓',
  '6 events · 3 days · 0 FOMO',
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
