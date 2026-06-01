// ─── Humanity Gate ────────────────────────────────────────────────────────────
// Opt-in front-camera "scan" before entering the site. Camera only starts on an
// explicit user gesture, the stream is stopped the moment the scan ends, and no
// frame ever leaves the device. There's always a way past without the camera.

// already cleared this session? skip the gate entirely.
const SESSION_KEY = 'humanity-verified';
const verified = (() => {
  try { return sessionStorage.getItem(SESSION_KEY) === '1'; } catch { return false; }
})();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const HUD_LINES = [
  'initializing optical sensor',
  'calibrating depth field .. OK',
  'face geometry ............ LOCKED',
  'micro-expression scan .... STABLE',
  'liveness check ........... PASS',
  'pulse oximetry ........... 72 BPM',
  'carbon signature ......... DETECTED',
  'bot probability .......... 0.02%',
  'verifying humanity',
];

// ─── Mount ─────────────────────────────────────────────────────────────────--
const gate = document.createElement('div');
gate.className = 'gate';
gate.setAttribute('role', 'dialog');
gate.setAttribute('aria-modal', 'true');
gate.setAttribute('aria-label', 'Humanity verification');
gate.innerHTML = `
  <div class="gate-grid" aria-hidden="true"></div>
  <div class="gate-panel" data-state="intro">
    <div class="term-bar">
      <span class="dots"><i></i><i></i><i></i></span>
      <span class="tb-title">pasleyhill@nyc-tech-week:&nbsp;~/auth/humanity</span>
      <span class="tb-online"><span class="dot"></span>SECURE</span>
    </div>

    <div class="gate-body">
      <!-- intro -->
      <section class="gate-intro">
        <h2 class="gate-h">BIOMETRIC_GATE<span class="accent">_v1</span></h2>
        <p class="gate-line"><span class="prompt">$</span> ./verify --humanity --sensor=front-cam</p>
        <p class="gate-note">
          Access requires a quick humanity scan. We'll open your front camera,
          run a local liveness check, and never store or transmit a single frame.
        </p>
        <div class="gate-actions">
          <button class="gate-btn primary" data-act="scan">INITIATE SCAN <span class="arr">▸</span></button>
          <button class="gate-btn ghost" data-act="skip">skip — enter as guest</button>
        </div>
      </section>

      <!-- scanning -->
      <section class="gate-scan" hidden>
        <div class="reticle">
          <video class="cam" playsinline muted autoplay></video>
          <div class="cam-fallback" hidden>NO OPTICAL FEED</div>
          <div class="scan-bar" aria-hidden="true"></div>
          <span class="bracket tl"></span><span class="bracket tr"></span>
          <span class="bracket bl"></span><span class="bracket br"></span>
          <span class="crosshair" aria-hidden="true"></span>
          <div class="cam-brand" aria-hidden="true">
            <img src="/logo.png" class="cam-logo" alt="" />
            <span class="cam-x">×</span>
            <img src="/niuro.svg" class="cam-niuro" alt="" />
          </div>
        </div>
        <pre class="hud" aria-live="polite"></pre>
        <div class="bar"><span class="bar-fill"></span></div>
        <p class="bar-pct"><span>00</span>% — analyzing biological markers…</p>
      </section>

      <!-- result -->
      <section class="gate-result" hidden>
        <div class="stamp">APPROVED</div>
        <p class="gate-line ok"><span class="prompt">$</span> humanity verified ✓ — welcome, carbon unit</p>
        <p class="gate-pct entering">entering itinerary…</p>
      </section>

      <!-- denied -->
      <section class="gate-denied" hidden>
        <div class="stamp warn">NO READ</div>
        <p class="gate-line warn-t"><span class="prompt">$</span> optical sensor unavailable — manual override required</p>
        <div class="gate-actions">
          <button class="gate-btn primary" data-act="override">MANUAL OVERRIDE <span class="arr">▸</span></button>
        </div>
      </section>

      <!-- brand strip (persists across states) -->
      <div class="gate-foot">
        <img src="/logo.png" class="gate-logo" alt="Pasley Hill" />
        <span class="gate-x">×</span>
        <img src="/niuro.svg" class="gate-niuro" alt="Niuro" />
        <span class="gate-foot-t">secured by <b>PASLEY_HILL</b> × <b>niuro</b></span>
      </div>
    </div>
  </div>
`;
// only mount + lock scroll if the user hasn't already passed this session
if (!verified) {
  document.body.appendChild(gate);
  document.documentElement.classList.add('gate-locked');
}

// ─── Refs ──────────────────────────────────────────────────────────────────--
const panel = gate.querySelector('.gate-panel');
const intro = gate.querySelector('.gate-intro');
const scan = gate.querySelector('.gate-scan');
const result = gate.querySelector('.gate-result');
const denied = gate.querySelector('.gate-denied');
const video = gate.querySelector('.cam');
const camFallback = gate.querySelector('.cam-fallback');
const hud = gate.querySelector('.hud');
const barFill = gate.querySelector('.bar-fill');
const pct = gate.querySelector('.bar-pct span');

let stream = null;

// ─── Flow ──────────────────────────────────────────────────────────────────--
gate.addEventListener('click', (e) => {
  const act = e.target.closest('[data-act]')?.dataset.act;
  if (act === 'scan') startScan();
  else if (act === 'skip' || act === 'override') enter();
});

async function startScan() {
  intro.hidden = true;
  scan.hidden = false;
  panel.dataset.state = 'scan';

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user' },
      audio: false,
    });
    video.srcObject = stream;
  } catch (err) {
    // denied, no camera, or no permission — offer a clean way in
    scan.hidden = true;
    denied.hidden = false;
    panel.dataset.state = 'denied';
    return;
  }

  runHud();
}

function runHud() {
  // type HUD lines + drive the progress bar, then approve
  let li = 0;
  const step = () => {
    if (li < HUD_LINES.length) {
      hud.textContent += (li ? '\n' : '') + '> ' + HUD_LINES[li] + (li < HUD_LINES.length - 1 ? ' ✓' : '…');
      li++;
      setTimeout(step, reduceMotion ? 0 : 720);
    }
  };
  step();

  let p = 0;
  const dur = reduceMotion ? 1 : 6600;
  const start = performance.now();
  const tickBar = (now) => {
    p = Math.min(100, Math.round(((now - start) / dur) * 100));
    barFill.style.width = p + '%';
    pct.textContent = String(p).padStart(2, '0');
    if (p < 100) requestAnimationFrame(tickBar);
    else approve();
  };
  requestAnimationFrame(tickBar);
}

function approve() {
  stopCam();
  scan.hidden = true;
  result.hidden = false;
  panel.dataset.state = 'result';
  setTimeout(enter, reduceMotion ? 200 : 1500);
}

function stopCam() {
  if (stream) stream.getTracks().forEach((t) => t.stop());
  stream = null;
  video.srcObject = null;
}

let exited = false;
function enter() {
  if (exited) return;
  exited = true;

  stopCam();
  try { sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* ignore */ }
  gate.classList.add('done');
  document.documentElement.classList.remove('gate-locked');
  setTimeout(() => gate.remove(), reduceMotion ? 0 : 650);
}

// surface a fallback label if the video never paints
video.addEventListener('error', () => (camFallback.hidden = false));

// release the camera if the page is hidden/closed mid-scan
window.addEventListener('pagehide', stopCam);
