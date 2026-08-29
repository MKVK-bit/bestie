/* Target unlock time: 30 August 2026, 12:00 AM India time (midnight tonight) */
const SURPRISE_TARGET = new Date("2026-08-30T00:00:00+05:30").getTime();

/* ---------------- Progress dots ---------------- */
function markProgress(pageNum){
  document.querySelectorAll('.pdot').forEach((d,i)=>{
    d.classList.toggle('active', i < pageNum);
  });
}

/* ---------------- Intro: particles converge + title + gates open ---------------- */
function startIntro(){
  const gate = document.getElementById('introGate');
  const gates = document.getElementById('gates');
  if(!gate) return;
  const canvas = document.getElementById('introCanvas');
  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  const cx = W/2, cy = H/2;
  const N = 90;
  const particles = [];
  for(let i=0;i<N;i++){
    const angle = Math.random()*Math.PI*2;
    const dist = 200 + Math.random()*300;
    particles.push({
      x: cx + Math.cos(angle)*dist,
      y: cy + Math.sin(angle)*dist,
      tx: cx + (Math.random()-0.5)*40,
      ty: cy + (Math.random()-0.5)*40,
      r: Math.random()*2+0.8
    });
  }
  let progress = 0;
  function draw(){
    ctx.clearRect(0,0,W,H);
    progress += 0.012;
    const p = Math.min(1, progress);
    for(const pt of particles){
      const x = pt.x + (pt.tx - pt.x)*p;
      const y = pt.y + (pt.ty - pt.y)*p;
      ctx.beginPath();
      ctx.arc(x,y,pt.r,0,Math.PI*2);
      ctx.fillStyle = `rgba(212,175,55,${0.5+p*0.5})`;
      ctx.shadowColor = 'rgba(212,175,55,0.8)';
      ctx.shadowBlur = 6;
      ctx.fill();
    }
    if(p < 1){ requestAnimationFrame(draw); }
  }
  draw();

  setTimeout(()=>{ animateTitle('#introTitleText', document.getElementById('introTitleText')); }, 500);
  setTimeout(()=>{ gate.classList.add('fade'); }, 2600);
  setTimeout(()=>{
    if(gates){ gates.classList.add('open'); }
  }, 2700);
  setTimeout(()=>{
    if(gates){ gates.classList.add('hide'); }
    if(gate){ gate.style.display = 'none'; }
  }, 4400);
}

/* ---------------- Title letter-by-letter animation ---------------- */
function animateTitle(selector){
  const el = document.querySelector(selector);
  if(!el) return;
  const text = el.textContent;
  el.textContent = '';
  [...text].forEach((ch, i)=>{
    const span = document.createElement('span');
    span.className = 'letter-anim';
    span.style.animationDelay = (i*0.05) + 's';
    span.textContent = ch === ' ' ? '\u00A0' : ch;
    el.appendChild(span);
  });
}

/* ---------------- Sparkle / gold dust background ---------------- */
function startSparkles(){
  const canvas = document.getElementById('sparkles');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  function resize(){
    W = canvas.width = window.innerWidth;
    H = canvas.height = document.documentElement.scrollHeight;
  }
  function init(){
    particles = [];
    const count = Math.floor((W*H)/15000);
    for(let i=0;i<count;i++){
      particles.push({
        x: Math.random()*W, y: Math.random()*H,
        r: Math.random()*1.6 + 0.4,
        drift: Math.random()*0.3 + 0.05,
        sway: Math.random()*0.6,
        phase: Math.random()*Math.PI*2,
        speed: Math.random()*0.02+0.01
      });
    }
  }
  resize(); init();
  window.addEventListener('resize', ()=>{ resize(); init(); });
  let t = 0;
  function draw(){
    ctx.clearRect(0,0,W,H);
    t += 1;
    for(const p of particles){
      p.y += p.drift;
      p.x += Math.sin(t*0.01 + p.phase)*p.sway*0.05;
      if(p.y > H) p.y = -5;
      const alpha = 0.35 + Math.sin(t*p.speed + p.phase)*0.35;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(212,175,55,${Math.max(0,alpha)})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
}

/* ---------------- Fireworks burst (canvas), used at unlock moment ---------------- */
function fireworksBurst(count){
  const canvas = document.getElementById('fireworks');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  let particles = [];
  const bursts = count || 3;
  for(let b=0; b<bursts; b++){
    const bx = W*(0.25 + Math.random()*0.5);
    const by = H*(0.25 + Math.random()*0.35);
    const num = 44;
    for(let i=0;i<num;i++){
      const angle = (Math.PI*2/num)*i;
      const speed = 2 + Math.random()*3;
      particles.push({
        x:bx, y:by,
        vx:Math.cos(angle)*speed, vy:Math.sin(angle)*speed,
        life:1, decay: 0.008 + Math.random()*0.008,
        color: Math.random() > 0.5 ? '212,175,55' : '255,224,138'
      });
    }
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    let alive = false;
    for(const p of particles){
      if(p.life <= 0) continue;
      alive = true;
      p.x += p.vx; p.y += p.vy; p.vy += 0.03; p.life -= p.decay;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.4, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${p.color},${Math.max(0,p.life)})`;
      ctx.fill();
    }
    if(alive){ requestAnimationFrame(draw); }
    else{ ctx.clearRect(0,0,W,H); }
  }
  draw();
}

/* ---------------- Floating risers (stars/balloons) ---------------- */
function startRisers(symbol, intervalMs){
  setInterval(()=>{
    const el = document.createElement('div');
    el.className = 'riser';
    el.textContent = symbol || '★';
    el.style.left = Math.random()*100 + 'vw';
    el.style.setProperty('--drift', (Math.random()*80-40)+'px');
    el.style.animationDuration = (6 + Math.random()*5) + 's';
    el.style.fontSize = (14 + Math.random()*14) + 'px';
    document.body.appendChild(el);
    setTimeout(()=>el.remove(), 12000);
  }, intervalMs || 900);
}

/* ---------------- Page guard: locked pages redirect home before unlock time ---------------- */
function guardLockedPage(){
  if(Date.now() < SURPRISE_TARGET){
    window.location.href = "index.html";
  }
}

/* ---------------- Countdown ---------------- */
function startCountdown(onComplete){
  const prev = {d:null,h:null,m:null,s:null};
  function bump(id, val, key){
    const el = document.getElementById(id);
    if(!el) return;
    const str = String(val).padStart(2,'0');
    if(prev[key] !== str){
      el.textContent = str;
      el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
      prev[key] = str;
    }
  }
  function tick(){
    const now = Date.now();
    const diff = SURPRISE_TARGET - now;
    if(diff <= 0){ onComplete(); return; }
    const d = Math.floor(diff/(1000*60*60*24));
    const h = Math.floor((diff/(1000*60*60))%24);
    const m = Math.floor((diff/(1000*60))%60);
    const s = Math.floor((diff/1000)%60);
    bump('cd-days', d, 'd'); bump('cd-hours', h, 'h'); bump('cd-min', m, 'm'); bump('cd-sec', s, 's');
    setTimeout(tick, 250);
  }
  tick();
}

/* ---------------- Scroll reveal ---------------- */
function startReveal(){
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{ if(entry.isIntersecting){ entry.target.classList.add('in'); } });
  },{threshold:0.15});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
}

/* ---------------- Cool ambient royal music (generated, no copyrighted audio) ---------------- */
let audioCtx, musicOn = false, musicTimer;
function playTone(freq, time, dur, gainVal, type){
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type || 'sine';
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(gainVal, time + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
  osc.connect(gain); gain.connect(audioCtx.destination);
  osc.start(time); osc.stop(time + dur + 0.05);
}
const padChords = [
  [130.81, 164.81, 196.00],  // C3 E3 G3
  [146.83, 174.61, 220.00],  // D3 F3 A3
  [130.81, 164.81, 196.00],
  [110.00, 164.81, 196.00],  // A2 E3 G3
];
let chordIndex = 0;
function scheduleLoop(){
  const now = audioCtx.currentTime;
  const chord = padChords[chordIndex % padChords.length];
  chordIndex++;
  chord.forEach(freq=>{ playTone(freq, now, 4.2, 0.028, 'sine'); });
  playTone(chord[2]*2, now + 1.4, 2, 0.012, 'triangle');
  musicTimer = setTimeout(scheduleLoop, 4000);
}
function gongSwell(){
  if(!audioCtx) return;
  const now = audioCtx.currentTime;
  [65.41, 98.00, 130.81, 196.00].forEach((f,i)=>{
    playTone(f, now, 3.5, 0.05, 'sine');
  });
}
function startMusic(){
  if(!audioCtx){ audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
  if(audioCtx.state === 'suspended'){ audioCtx.resume(); }
  musicOn = true;
  scheduleLoop();
  const t = document.getElementById('soundToggle'); if(t) t.textContent = '♪';
}
function stopMusic(){
  musicOn = false;
  clearTimeout(musicTimer);
  const t = document.getElementById('soundToggle'); if(t) t.textContent = '✕';
}
function wireSoundToggle(){
  const t = document.getElementById('soundToggle');
  if(!t) return;
  t.addEventListener('click', ()=>{ musicOn ? stopMusic() : startMusic(); });
}
