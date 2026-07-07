// Erzeugt die Unterseiten aus dem Design-System der index.html.
// Das CSS wird zur Buildzeit aus index.html extrahiert (eine Quelle der Wahrheit),
// um Drift zwischen Start- und Unterseiten auszuschließen.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const index = readFileSync(join(ROOT, 'index.html'), 'utf8');
const baseCss = index.match(/<style>([\s\S]*?)<\/style>/)[1];

const IMG = {
  anreise:   'https://d8j0ntlcm91z4.cloudfront.net/user_3B4FXw36K2KIMQ6fgXs9vDxxWQ9/hf_20260707_183245_78687a67-adfe-4e92-8d33-869c58563459.png',
  erleben:   'https://d8j0ntlcm91z4.cloudfront.net/user_3B4FXw36K2KIMQ6fgXs9vDxxWQ9/hf_20260707_072826_d522c419-feab-4528-acc8-29b3d1be4b5d.png',
  events:    'https://d8j0ntlcm91z4.cloudfront.net/user_3B4FXw36K2KIMQ6fgXs9vDxxWQ9/hf_20260707_183253_0b133da9-76ed-4dfb-90b7-2f67807b09c2.png',
  gesundheit:'https://d8j0ntlcm91z4.cloudfront.net/user_3B4FXw36K2KIMQ6fgXs9vDxxWQ9/hf_20260707_183248_d2f3f05d-6e78-4c59-bf94-7c095cacb487.png',
  wohnen:    'https://d8j0ntlcm91z4.cloudfront.net/user_3B4FXw36K2KIMQ6fgXs9vDxxWQ9/hf_20260707_183250_7e688118-6675-4814-a47b-ae734276dd23.png',
  boerte:    'https://d8j0ntlcm91z4.cloudfront.net/user_3B4FXw36K2KIMQ6fgXs9vDxxWQ9/hf_20260707_072833_2fe145b3-fe9f-4c1b-9405-451325d9de14.png',
  duene:     'https://d8j0ntlcm91z4.cloudfront.net/user_3B4FXw36K2KIMQ6fgXs9vDxxWQ9/hf_20260707_091315_769688d3-9e2b-4b3f-848e-67d06f4b4852.png',
  robbe:     'https://d8j0ntlcm91z4.cloudfront.net/user_3B4FXw36K2KIMQ6fgXs9vDxxWQ9/hf_20260707_091346_139071bb-d6d0-42ad-b0e6-835a8e2678c5.png',
  lumme:     'https://d8j0ntlcm91z4.cloudfront.net/user_3B4FXw36K2KIMQ6fgXs9vDxxWQ9/hf_20260707_072831_17beea67-1acc-4d16-9279-801c9a6d07e2.png',
  buden:     'https://d8j0ntlcm91z4.cloudfront.net/user_3B4FXw36K2KIMQ6fgXs9vDxxWQ9/hf_20260707_072821_fe0bba4c-254f-4250-8050-91304c1e7d3d.png',
  hafen:     'https://d8j0ntlcm91z4.cloudfront.net/user_3B4FXw36K2KIMQ6fgXs9vDxxWQ9/hf_20260707_072824_81e3e7bf-2a45-41d1-8b8d-3d97211e33b5.png',
  still:     'https://d8j0ntlcm91z4.cloudfront.net/user_3B4FXw36K2KIMQ6fgXs9vDxxWQ9/hf_20260707_065915_785d4f3a-7dda-4a5d-af76-ff38d906f931.png',
};

const subCss = `
/* ---------- Unterseiten ---------- */
.subhero{position:relative;min-height:66vh;display:flex;align-items:flex-end;overflow:hidden;color:var(--schaum);background:var(--tiefsee)}
.subhero__bg{position:absolute;inset:0;z-index:0}
.subhero__bg img{width:100%;height:100%;object-fit:cover;transform:scale(1.04);animation:kenburns 30s ease-out forwards}
.subhero__veil{position:absolute;inset:0;z-index:1;background:linear-gradient(180deg,rgba(6,23,31,0.55) 0%,rgba(6,23,31,0.15) 40%,rgba(6,23,31,0.9) 100%)}
.subhero__inner{position:relative;z-index:2;width:100%;max-width:var(--wrap);margin:0 auto;padding:140px var(--gutter) clamp(44px,8vh,90px)}
.crumb{font-family:var(--f-mono);font-size:.68rem;letter-spacing:.18em;text-transform:uppercase;color:rgba(245,241,233,0.7);margin-bottom:1.4rem;display:flex;gap:.9em;flex-wrap:wrap}
.crumb a{color:rgba(245,241,233,0.7)}.crumb a:hover{color:var(--schaum)}
.crumb .sep{color:var(--rot)}
.subhero h1{font-size:clamp(2.8rem,7.5vw,6rem);line-height:.98}
.subhero h1 .breath{display:inline-block;animation:breathe 10s ease-in-out infinite;font-style:italic}
.subhero .sub{margin-top:1.4rem;max-width:46ch;font-size:clamp(1rem,1.6vw,1.22rem);color:rgba(245,241,233,0.88)}

/* Zeilen (Anreise-Routen, Event-Liste) */
.rows{margin-top:clamp(36px,5vh,56px);border-top:1px solid var(--linie)}
.dark .rows,.darker .rows{border-top-color:var(--linie-hell)}
.row{display:grid;grid-template-columns:190px 1fr 220px;gap:2rem;padding:2.3rem 0;border-bottom:1px solid var(--linie);align-items:baseline}
.dark .row,.darker .row{border-bottom-color:var(--linie-hell)}
.row .rk{font-family:var(--f-mono);font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--rot)}
.row .rk small{display:block;color:var(--grau);margin-top:.5em;letter-spacing:.1em}
.row h3{font-size:1.7rem;margin-bottom:.45rem}
.row p{font-size:.98rem;color:#3B4A50;max-width:56ch}
.dark .row p,.darker .row p{color:rgba(245,241,233,0.78)}
.row .rm{font-family:var(--f-mono);display:flex;flex-direction:column;gap:.85rem}
.row .rm b{font-size:1.02rem;font-weight:700}
.row .rm span{display:block;font-size:.6rem;letter-spacing:.12em;text-transform:uppercase;color:var(--grau)}
@media(max-width:860px){.row{grid-template-columns:1fr;gap:.8rem}.row .rm{flex-direction:row;gap:2rem}}

/* Zolltafel */
.tafel{background:var(--tiefsee);color:var(--schaum);border-radius:2px;padding:clamp(28px,4vw,46px)}
.tafel .tk{font-family:var(--f-mono);font-size:.66rem;letter-spacing:.18em;text-transform:uppercase;color:var(--grau);display:flex;justify-content:space-between;margin-bottom:1.6rem}
.tafel .li{display:flex;justify-content:space-between;align-items:baseline;gap:1rem;padding:.95rem 0;border-top:1px dashed rgba(245,241,233,0.22);font-family:var(--f-mono)}
.tafel .li .w{font-size:.88rem;color:rgba(245,241,233,0.85);letter-spacing:.02em}
.tafel .li .m{font-size:1rem;font-weight:700;white-space:nowrap}
.tafel .note{margin-top:1.6rem;font-family:var(--f-serif);font-style:italic;font-size:1.12rem;color:rgba(245,241,233,0.9)}

/* Karten (Unterkünfte, Angebote) */
.cards3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:clamp(36px,5vh,56px)}
@media(max-width:900px){.cards3{grid-template-columns:1fr 1fr}}
@media(max-width:560px){.cards3{grid-template-columns:1fr}}
.card{background:#fff;border:1px solid var(--linie);border-radius:2px;padding:28px 26px;display:flex;flex-direction:column;gap:.5rem;transition:transform .5s var(--ease),box-shadow .5s var(--ease)}
.card:hover{transform:translateY(-5px);box-shadow:0 24px 50px -28px rgba(11,45,60,.4)}
.card .ck{font-family:var(--f-mono);font-size:.64rem;letter-spacing:.18em;text-transform:uppercase;color:var(--rot)}
.card h3{font-size:1.5rem;margin-top:.4rem}
.card p{font-size:.94rem;color:#54636A;flex:1}
.card .cm{font-family:var(--f-mono);font-size:.78rem;color:var(--tinte);margin-top:1rem;padding-top:1rem;border-top:1px solid var(--linie)}
.card.dunkel{background:var(--tiefsee);border-color:transparent;color:var(--schaum)}
.card.dunkel p{color:rgba(245,241,233,0.78)}
.card.dunkel .cm{color:var(--schaum);border-top-color:var(--linie-hell)}

/* Saison-Kalender */
.kal{margin-top:clamp(36px,5vh,56px);display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
@media(max-width:900px){.kal{grid-template-columns:1fr 1fr}}
@media(max-width:520px){.kal{grid-template-columns:1fr}}
.kq{border-top:2px solid var(--rot);background:var(--tiefsee);color:var(--schaum);padding:24px 22px;min-height:200px;display:flex;flex-direction:column;gap:.5rem}
.kq:nth-child(2){border-top-color:var(--gruen)}
.kq:nth-child(3){border-top-color:var(--schaum)}
.kq .s{font-family:var(--f-mono);font-size:.64rem;letter-spacing:.18em;text-transform:uppercase;color:var(--grau)}
.kq h3{font-size:1.4rem;margin-top:auto}
.kq p{font-size:.88rem;color:rgba(245,241,233,0.78)}
`;

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />`;

const FAVICON = `<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' fill='%230B2D3C'/><path d='M9 40 H20 C25 40 27 22 32 22 S39 40 44 40 H55' fill='none' stroke='%23F5F1E9' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/></svg>" />`;

const NAVITEMS = [
  ['index.html#insel','Die Insel'],
  ['erleben.html','Erleben'],
  ['veranstaltungen.html','Veranstaltungen'],
  ['gesundheit.html','Gesundheit'],
  ['anreise.html','Anreise'],
  ['unterkuenfte.html','Unterkünfte'],
];

const puls = `<div class="puls" id="puls" aria-hidden="true">
  <div class="track">
    <span class="it"><span class="live"></span><span class="v">Insel-Puls</span></span>
    <span class="sep">·</span>
    <span class="it"><span class="k">Wetter</span><span class="v" id="pWetter">9°C · klar</span></span>
    <span class="sep">·</span>
    <span class="it hideS"><span class="k">Wind</span><span class="v">5 Bft · NW</span></span>
    <span class="sep hideS">·</span>
    <span class="it"><span class="k">Halunder&nbsp;Jet</span><span class="v" id="pJet">ab 09:00</span></span>
    <span class="sep">·</span>
    <span class="it hideS"><span class="k">Seegang</span><span class="v">ruhig</span></span>
    <span class="sep hideS">·</span>
    <span class="it"><span class="k">Pollen</span><span class="v">0/8</span></span>
    <span class="sep">·</span>
    <span class="it"><span class="k">Webcam</span><span class="v">● live</span></span>
  </div>
</div>`;

const glyph = `<svg class="glyph" viewBox="0 0 64 40" aria-hidden="true"><path d="M4 32 H20 C25 32 27 10 32 10 S39 32 44 32 H60" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

function nav(active){
  const links = NAVITEMS.map(([href,label]) =>
    `<a href="${href}"${label===active?' class="active"':''}>${label}</a>`).join('\n    ');
  const mob = NAVITEMS.map(([href,label],i) =>
    `<a href="${href}"><b>0${i+1}</b>${label}</a>`).join('\n  ');
  return `<nav class="nav" id="nav">
  <a class="brand" href="index.html" data-cursor>
    ${glyph}
    <span class="wm">Helgo<b>land</b></span>
  </a>
  <div class="nav-links" id="navLinks">
    ${links}
  </div>
  <div class="nav-right">
    <a href="anreise.html" class="btn btn--rot" data-cursor><span>Anreise</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
    </a>
    <button class="burger" id="burger" aria-label="Menü" aria-expanded="false"><span></span><span></span><span></span></button>
  </div>
</nav>

<div class="mobile" id="mobile">
  <button class="mclose" id="mclose">schließen ✕</button>
  ${mob}
</div>`;
}

const footer = `<footer class="footer">
  <div class="wrap">
    <div class="footer__grid">
      <div class="footer__intro">
        <a class="brand" href="index.html" data-cursor>
          ${glyph}
          <span class="wm">Helgo<b>land</b></span>
        </a>
        <p>Die einzige deutsche Hochseeinsel. Siebzig Kilometer draußen — und drinnen ein anderer Takt.</p>
        <div class="footer__coord">54°11′N · 7°53′E · Nordsee</div>
      </div>
      <div>
        <h5>Reise</h5>
        <ul>
          <li><a href="anreise.html">Anreise</a></li>
          <li><a href="unterkuenfte.html">Unterkünfte</a></li>
          <li><a href="erleben.html#zollfrei">Zollfrei einkaufen</a></li>
          <li><a href="anreise.html#praktisch">Gut zu wissen</a></li>
        </ul>
      </div>
      <div>
        <h5>Insel</h5>
        <ul>
          <li><a href="index.html#insel">Die Insel &amp; Düne</a></li>
          <li><a href="erleben.html">Erleben</a></li>
          <li><a href="veranstaltungen.html">Veranstaltungen</a></li>
          <li><a href="gesundheit.html">Gesundheit</a></li>
        </ul>
      </div>
      <div>
        <h5>Service</h5>
        <ul>
          <li><a href="index.html#top">Webcams</a></li>
          <li><a href="index.html#top">Wetter &amp; Seegang</a></li>
          <li><a href="index.html#top">Insel-Puls App</a></li>
          <li><a href="index.html#top">Kontakt</a></li>
        </ul>
      </div>
    </div>
    <div class="footer__bottom">
      <div>© 2026 Helgoland — Atmen · Konzeptstudie zur Markenwelt</div>
      <div>Grön is dat Land · rot is de Kant · witt is de Sand</div>
    </div>
  </div>
</footer>
<div class="disclaimer">Konzeptstudie zur Marke „ATMEN“ · kein offizieller Auftritt. Bildwelten KI-generiert (Higgsfield) und als solche gekennzeichnet · Fahrplan-, Preis- und Pulsangaben beispielhaft — verbindlich sind die Reedereien und die Gemeinde Helgoland.</div>`;

const script = `<script>
(function(){
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function lockBreath(){
    document.querySelectorAll('.breath').forEach(function(el){
      el.style.width='auto';
      var max=(getComputedStyle(el).getPropertyValue('--br-max')||'').trim()||'0.42em';
      var pa=el.style.animation, pl=el.style.letterSpacing;
      el.style.animation='none'; el.style.letterSpacing=max;
      var w=el.getBoundingClientRect().width;
      el.style.letterSpacing=pl; el.style.animation=pa;
      el.style.width=Math.ceil(w)+'px';
    });
  }
  lockBreath();
  if(document.fonts&&document.fonts.ready){document.fonts.ready.then(lockBreath);}
  var bt; addEventListener('resize',function(){clearTimeout(bt);bt=setTimeout(lockBreath,150);});
  var cur = document.getElementById('cursor');
  if(matchMedia('(hover:hover) and (pointer:fine)').matches && !reduce){
    var cx=innerWidth/2, cy=innerHeight/2, tx=cx, ty=cy;
    addEventListener('mousemove',function(e){tx=e.clientX;ty=e.clientY;cur.classList.add('on');});
    (function loop(){cx+=(tx-cx)*.2;cy+=(ty-cy)*.2;cur.style.transform='translate('+cx+'px,'+cy+'px) translate(-50%,-50%)';requestAnimationFrame(loop);})();
    document.querySelectorAll('a,button,[data-cursor]').forEach(function(el){
      el.addEventListener('mouseenter',function(){cur.classList.add('big');});
      el.addEventListener('mouseleave',function(){cur.classList.remove('big');});
    });
  }
  var puls=document.getElementById('puls'), nav=document.getElementById('nav'), prog=document.getElementById('progress');
  function onScroll(){
    var y=scrollY;
    puls.classList.toggle('hide', y>60);
    nav.classList.toggle('up', y>60);
    nav.classList.toggle('solid', y>60);
    var h=document.documentElement.scrollHeight-innerHeight;
    prog.style.width=(h>0?y/h*100:0)+'%';
  }
  addEventListener('scroll',onScroll,{passive:true}); onScroll();
  var burger=document.getElementById('burger'), mob=document.getElementById('mobile'), mclose=document.getElementById('mclose');
  function setMenu(o){mob.classList.toggle('open',o);burger.setAttribute('aria-expanded',o);}
  burger.addEventListener('click',function(){setMenu(true);});
  mclose.addEventListener('click',function(){setMenu(false);});
  mob.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){setMenu(false);});});
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('vis');io.unobserve(e.target);}});},{threshold:.16,rootMargin:'0px 0px -6% 0px'});
  document.querySelectorAll('.fade,.rl,[data-draw]').forEach(function(el){io.observe(el);});
  var sio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)e.target.classList.add('vis');});},{threshold:.2});
  document.querySelectorAll('[data-scene]').forEach(function(el){sio.observe(el);});
  function fmt(n){return n.toLocaleString('de-DE');}
  function run(el){
    var t=+el.dataset.count, suf=el.dataset.suffix||'', dur=1500, s=null;
    var hadU=el.querySelector('.u'); var uHTML=hadU?hadU.outerHTML:'';
    if(reduce){el.innerHTML=fmt(t)+(uHTML||suf);return;}
    function step(ts){if(!s)s=ts;var p=Math.min((ts-s)/dur,1);var v=Math.round(t*(1-Math.pow(1-p,3)));el.innerHTML=fmt(v)+(uHTML||suf);if(p<1)requestAnimationFrame(step);}
    requestAnimationFrame(step);
  }
  var cio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){run(e.target);cio.unobserve(e.target);}});},{threshold:.6});
  document.querySelectorAll('[data-count]').forEach(function(el){cio.observe(el);});
  var pio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.querySelectorAll('.gauge').forEach(function(g){g.classList.add('vis');});pio.unobserve(e.target);}});},{threshold:.4});
  document.querySelectorAll('[data-pollen]').forEach(function(el){pio.observe(el);});
  if(!reduce){
    var jets=['ab 09:00','ab 11:30','ab 16:00'], temps=['9°C · klar','8°C · frisch','10°C · Sonne'];
    var i=0;
    setInterval(function(){i++;var j=document.getElementById('pJet'),w=document.getElementById('pWetter');if(j)j.textContent=jets[i%jets.length];if(w)w.textContent=temps[i%temps.length];},4200);
  }
  if(!reduce && matchMedia('(pointer:fine)').matches){
    document.querySelectorAll('.btn').forEach(function(b){
      b.addEventListener('mousemove',function(e){var r=b.getBoundingClientRect();b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.2)+'px,'+((e.clientY-r.top-r.height/2)*.3)+'px)';});
      b.addEventListener('mouseleave',function(){b.style.transform='';});
    });
  }
})();
</${'script'}>`;

const divider = `<div class="divider" data-draw>
  <svg viewBox="0 0 130 44" fill="none"><path d="M6 30 H44 C56 30 58 8 65 8 S74 30 86 30 H124" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
</div>`;

function page({file, title, desc, active, hero, body}){
  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
<meta name="description" content="${desc}" />
${FAVICON}
${FONTS}
<style>${baseCss}${subCss}</style>
</head>
<body>

<div class="cursor" id="cursor" aria-hidden="true"></div>
<div class="progress" id="progress"></div>

${puls}

${nav(active)}

${hero}

${body}

${footer}

${script}
</body>
</html>
`;
}

function subhero({crumb, h1, sub, img, alt}){
  return `<header class="subhero">
  <div class="subhero__bg"><img src="${img}" alt="${alt}" fetchpriority="high" /></div>
  <div class="subhero__veil"></div>
  <div class="subhero__inner">
    <div class="crumb"><a href="index.html">Helgoland</a><span class="sep">→</span><span>${crumb}</span></div>
    <h1>${h1}</h1>
    <p class="sub">${sub}</p>
  </div>
</header>`;
}

/* ============================== ANREISE ============================== */
const anreise = page({
  file:'anreise.html',
  title:'Anreise — Helgoland · Atmen',
  desc:'So kommen Sie nach Helgoland: Halunder Jet ab Hamburg, Seebäderschiff ab Cuxhaven, Saisonschiffe ab Büsum und Bremerhaven, Flug ab Heide/Büsum — und das Ausbooten per Börteboot.',
  active:'Anreise',
  hero: subhero({
    crumb:'Anreise',
    h1:'Legen Sie <span class="breath">ab.</span>',
    sub:'Siebzig Kilometer Wasser liegen zwischen Ihnen und der Insel. Die Reise darüber ist kein Hindernis — sie ist der erste Programmpunkt.',
    img: IMG.anreise,
    alt:'Der Katamaran auf dem Weg über die Nordsee nach Helgoland'
  }),
  body: `
<section class="section">
  <div class="wrap">
    <div class="head fade">
      <span class="eyebrow">Vier Wege · Ein Ziel</span>
      <h2 class="h-lg" style="margin-top:1.4rem">Schiff, Jet oder Flug.<br/>Ankommen tun alle anders.</h2>
      <p class="body">Verbindlich sind immer die Fahrpläne der Reedereien — die See hat das letzte Wort. Was heute fährt, zeigt der Insel-Puls oben.</p>
    </div>
    <div class="rows">
      <div class="row fade">
        <div class="rk">Route 01 · Katamaran<small>FRS Helgoline</small></div>
        <div>
          <h3>Halunder Jet ab Hamburg</h3>
          <p>Ab den St.-Pauli-Landungsbrücken die Elbe hinunter, Zwischenhalt in Cuxhaven, dann offene See. Der schnellste Weg mitten aus der Stadt — Abfahrt in der Saison täglich gegen 9 Uhr, von Ende März bis Anfang November.</p>
        </div>
        <div class="rm"><div><b>≈ 4 Std</b><span>ab Hamburg</span></div><div><b>≈ 75 Min</b><span>ab Cuxhaven</span></div><div><b>35 kn</b><span>Reisegeschwindigkeit</span></div></div>
      </div>
      <div class="row fade">
        <div class="rk">Route 02 · Seebäderschiff<small>Cassen Eils</small></div>
        <div>
          <h3>MS „Helgoland“ ab Cuxhaven</h3>
          <p>Das einzige Schiff, das der Insel das ganze Jahr die Treue hält. Deck, Wind, Möwen — und nach gut zweieinhalb Stunden der erste Blick auf die rote Silhouette am Horizont.</p>
        </div>
        <div class="rm"><div><b>≈ 2,5 Std</b><span>Überfahrt</span></div><div><b>ganzjährig</b><span>auch im Winter</span></div></div>
      </div>
      <div class="row fade">
        <div class="rk">Route 03 · Saison<small>Adler-Eils · Cassen Eils</small></div>
        <div>
          <h3>Ab Büsum, Bremerhaven &amp; Hooksiel</h3>
          <p>In der Saison legen zusätzliche Seebäderschiffe ab Büsum und Bremerhaven ab, an ausgewählten Terminen auch ab Hooksiel. Ideal für die Tagestour von der schleswig-holsteinischen und niedersächsischen Küste.</p>
        </div>
        <div class="rm"><div><b>Saison</b><span>Frühjahr – Herbst</span></div><div><b>Tagestour</b><span>oder länger</span></div></div>
      </div>
      <div class="row fade">
        <div class="rk">Route 04 · Luft<small>ab Heide/Büsum</small></div>
        <div>
          <h3>Der Inselflieger</h3>
          <p>Wer es eilig hat oder die Insel einmal von oben sehen will: Ab dem Flugplatz Heide/Büsum sind es rund zwanzig Minuten. Gelandet wird auf der Düne — mit dem weißen Strand direkt neben der Bahn.</p>
        </div>
        <div class="rm"><div><b>≈ 20 Min</b><span>Flugzeit</span></div><div><b>Düne</b><span>Landebahn</span></div></div>
      </div>
    </div>
  </div>
</section>

<section class="scene" data-scene>
  <div class="scene__bg"><img src="${IMG.boerte}" alt="Börteboote beim Ausbooten vor Helgoland" /></div>
  <div class="scene__veil"></div>
  <div class="scene__inner">
    <p class="quote fade">„Das letzte Stück gehört<br/>den Börtebooten.“</p>
    <div class="attr fade d1">Ausbooten seit 1826 · Immaterielles Kulturerbe seit 2018 · Wenn die Seebäderschiffe auf Reede liegen, bringen offene Holzboote Sie an Land</div>
  </div>
</section>

<section class="section darker" id="praktisch">
  <div class="wrap">
    <div class="head fade">
      <span class="eyebrow">Gut zu wissen · Die ehrliche Stimme</span>
      <h2 class="h-lg" style="margin-top:1.4rem;color:var(--schaum)">Wir versprechen nur,<br/>was die Fähre hält.</h2>
    </div>
    <div class="zahlen" style="margin-top:clamp(40px,6vh,64px)">
      <div class="zahl fade"><b data-count="70"><span class="u">km</span></b><div class="l">offene See</div><div class="d">Die Nordsee entscheidet mit. Bei schwerer See fällt eine Abfahrt auch mal aus — der Insel-Puls sagt es zuerst.</div></div>
      <div class="zahl fade d1"><b data-count="0"><span class="u">Autos</span></b><div class="l">auf der Insel</div><div class="d">Ihr Auto bleibt am Festland — Parken direkt an den Abfahrtshäfen. Auf der Insel gehen Sie. Das ist der Punkt.</div></div>
      <div class="zahl fade d2"><b data-count="30"><span class="u">min</span></b><div class="l">vor Abfahrt</div><div class="d">Einchecken, Gepäck aufgeben, durchatmen. Koffer reisen im Container mit und werden an Land gebracht.</div></div>
    </div>
    <p class="fade" style="margin-top:2.4rem;font-family:var(--f-mono);font-size:.78rem;color:var(--grau);max-width:60ch">Fahrpläne, Preise und Buchung: FRS Helgoline (Hamburg/Cuxhaven) · Cassen Eils (Cuxhaven, ganzjährig) · Adler-Eils (Büsum). Angaben beispielhaft — verbindlich sind die Reedereien.</p>
  </div>
</section>

${divider}

<section class="section" style="padding-top:0">
  <div class="wrap" style="text-align:center;max-width:640px">
    <h2 class="h-md fade">Angekommen?</h2>
    <p class="body fade d1" style="margin:1rem auto 2rem">Dann ist das Schwerste geschafft. Der Rest ist Insel.</p>
    <div class="fade d2" style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
      <a href="unterkuenfte.html" class="btn btn--rot" data-cursor><span>Unterkunft finden</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
      <a href="erleben.html" class="btn btn--ghost" data-cursor><span>Was Sie erwartet</span></a>
    </div>
  </div>
</section>`
});

/* ============================== ERLEBEN ============================== */
const erleben = page({
  file:'erleben.html',
  title:'Erleben — Helgoland · Atmen',
  desc:'Klippenrandweg und Lange Anna, Lummenfelsen, Robben auf der Düne, Bluehouse, Bunkerführungen, Hummerbuden — und zollfreies Einkaufen mit allen Freimengen.',
  active:'Erleben',
  hero: subhero({
    crumb:'Erleben',
    h1:'Wenig los.<br/>Zum <span class="breath">Glück.</span>',
    sub:'Kein Programm, das man abarbeitet. Sondern Orte, die man nur hier findet — und nach denen man anders atmet.',
    img: IMG.erleben,
    alt:'Der Klippenrandweg über der Nordsee auf Helgoland'
  }),
  body: `
<section class="section">
  <div class="wrap">
    <div class="head fade">
      <span class="eyebrow">Die Orte · Was die Insel trägt</span>
      <h2 class="h-lg" style="margin-top:1.4rem">Sechs Orte,<br/>null Eintrittsschlangen.</h2>
    </div>
    <div class="rows">
      <div class="row fade">
        <div class="rk">01 · Oberland<small>immer offen</small></div>
        <div>
          <h3>Klippenrandweg &amp; Lange Anna</h3>
          <p>Einmal um das grüne Oberland, immer das Meer im Blick, bis zum 47 Meter hohen freistehenden Felsturm am Nordende. Rund 400 Atemzüge — und ab der halben Strecke kein Empfang. Endlich.</p>
        </div>
        <div class="rm"><div><b>47 m</b><span>Lange Anna</span></div><div><b>≈ 3 km</b><span>Rundweg</span></div></div>
      </div>
      <div class="row fade">
        <div class="rk">02 · Vogelfelsen<small>Frühjahr bis Sommer</small></div>
        <div>
          <h3>Der Lummenfelsen</h3>
          <p>Deutschlands einziger Vogelfelsen: Trottellummen, Basstölpel und Dreizehenmöwen brüten zu Tausenden in der roten Wand. Im Juni springen die Lummenküken — noch flugunfähig — die Klippe hinab ins Meer. Ein Schauspiel, das es nur hier gibt.</p>
        </div>
        <div class="rm"><div><b>Juni</b><span>Lummensprung</span></div><div><b>1.000e</b><span>Brutpaare</span></div></div>
      </div>
      <div class="row fade">
        <div class="rk">03 · Düne<small>Fähre ab Hafen</small></div>
        <div>
          <h3>Robben auf der Düne</h3>
          <p>Ein paar Fährminuten zur Nachbarinsel: weißer Sand, klares Wasser — und Kegelrobben, die sich davon nicht stören lassen. Im Winter kommen hier über tausend Junge zur Welt. Dreißig Meter Abstand, bitte. Hier wird geschlafen.</p>
        </div>
        <div class="rm"><div><b>1.049</b><span>Geburten/Saison</span></div><div><b>30 m</b><span>Abstand</span></div></div>
      </div>
      <div class="row fade">
        <div class="rk">04 · Forschung<small>neu</small></div>
        <div>
          <h3>Bluehouse Helgoland</h3>
          <p>Die neue Meeresausstellung des Alfred-Wegener-Instituts: 80.000 Liter lebende Nordsee unter einem Dach — Hummer, Kelpwald, Felswatt. Forschung zum Anfassen, hundert Meter vom Anleger.</p>
        </div>
        <div class="rm"><div><b>80.000 l</b><span>Nordsee</span></div><div><b>AWI</b><span>Forschung seit 1892</span></div></div>
      </div>
      <div class="row fade">
        <div class="rk">05 · Geschichte<small>Führungen</small></div>
        <div>
          <h3>Der Bunker</h3>
          <p>Unter der Insel liegen kilometerlange Stollen aus dem Zweiten Weltkrieg. Die Führung erzählt vom Krieg, vom „Big Bang“ 1947 — der größten nicht-nuklearen Sprengung der Geschichte — und vom Wiederaufbau. Unbequem, ehrlich, wichtig.</p>
        </div>
        <div class="rm"><div><b>1947</b><span>Big Bang</span></div><div><b>1952</b><span>Rückkehr der Insulaner</span></div></div>
      </div>
      <div class="row fade">
        <div class="rk">06 · Unterland<small>täglich</small></div>
        <div>
          <h3>Hummerbuden &amp; Museum</h3>
          <p>Die bunten Buden am Binnenhafen: früher Werkstätten der Hummerfischer, heute Galerien, Läden und die beste Fischfrikadelle weit und breit. Daneben das Museum Helgoland mit der ganzen Inselgeschichte.</p>
        </div>
        <div class="rm"><div><b>anno</b><span>Fischerhandwerk</span></div><div><b>Knieper</b><span>Spezialität</span></div></div>
      </div>
    </div>
  </div>
</section>

<section class="section dark" id="zollfrei">
  <div class="wrap gesund">
    <div class="fade">
      <span class="eyebrow" style="display:block;margin-bottom:1.2rem">Zollfrei · Kein EU-Zollgebiet</span>
      <h2 class="h-md" style="color:var(--schaum)">Einkaufen<br/>ohne Aufschlag.</h2>
      <p class="body" style="margin-top:1.2rem">Helgoland gehört weder zum Zollgebiet der EU noch zum deutschen Steuergebiet — eine Eigenheit aus der Geschichte der Insel. Parfum, Spirituosen und Tabak kosten hier, was sie kosten. Ohne Mehrwertsteuer, ohne Zoll.</p>
      <p class="body" style="margin-top:1rem">Die ehrliche Stimme dazu: Die Freimengen gelten pro Person und Rückfahrt. Mehr geht auch — dann winkt der Zoll am Festland.</p>
    </div>
    <div class="tafel fade d1">
      <div class="tk"><span>Ihre Freimengen · pro Person</span><span>ab 18</span></div>
      <div class="li"><span class="w">Zigaretten</span><span class="m">200 Stück</span></div>
      <div class="li"><span class="w">— oder Zigarren</span><span class="m">50 Stück</span></div>
      <div class="li"><span class="w">— oder Rauchtabak</span><span class="m">250 g</span></div>
      <div class="li"><span class="w">Spirituosen über 22 % vol.</span><span class="m">1 Liter</span></div>
      <div class="li"><span class="w">— oder bis 22 % vol.</span><span class="m">2 Liter</span></div>
      <div class="li"><span class="w">Wein (nicht schäumend), zusätzlich</span><span class="m">4 Liter</span></div>
      <div class="li"><span class="w">Sonstige Waren, mit Schiff oder Flug</span><span class="m">bis 430 €</span></div>
      <div class="li"><span class="w">— mit eigenem Boot</span><span class="m">bis 300 €</span></div>
      <p class="note">Genug für ein gutes Gewissen.</p>
    </div>
  </div>
</section>

${divider}

<section class="section" style="padding-top:0">
  <div class="wrap" style="text-align:center;max-width:640px">
    <h2 class="h-md fade">Und wann sind Sie dran?</h2>
    <p class="body fade d1" style="margin:1rem auto 2rem">Das Jahr auf der Insel hat mehr Termine, als man einer Hochseeinsel zutraut.</p>
    <div class="fade d2" style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
      <a href="veranstaltungen.html" class="btn btn--rot" data-cursor><span>Veranstaltungen ansehen</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
      <a href="anreise.html" class="btn btn--ghost" data-cursor><span>Anreise planen</span></a>
    </div>
  </div>
</section>`
});

/* ============================== VERANSTALTUNGEN ============================== */
const veranstaltungen = page({
  file:'veranstaltungen.html',
  title:'Veranstaltungen — Helgoland · Atmen',
  desc:'Das Helgoländer Jahr: Nordseewoche zu Pfingsten, Börteboot-Regatta im August, Lummensprung im Juni, Robbenzeit im Winter — und neue Formate wie die Lange Tafel.',
  active:'Veranstaltungen',
  hero: subhero({
    crumb:'Veranstaltungen',
    h1:'Das Jahr,<br/>das <span class="breath">atmet.</span>',
    sub:'Eine Insel, die nichts beweisen muss, feiert anders: mit der See, mit den Vögeln, mit einer Tafel durchs Unterland. Die wichtigsten Termine im Überblick.',
    img: IMG.events,
    alt:'Segelregatta rund um den roten Felsen von Helgoland'
  }),
  body: `
<section class="section">
  <div class="wrap">
    <div class="head fade">
      <span class="eyebrow">Bewährt · Die großen Termine 2026</span>
      <h2 class="h-lg" style="margin-top:1.4rem">Was diese Insel<br/>groß gemacht hat.</h2>
      <p class="body">Von Seglern bis Vogelkundlern: Diese Termine tragen seit Jahrzehnten — und bleiben in den Händen derer, die sie groß gemacht haben.</p>
    </div>
    <div class="rows">
      <div class="row fade">
        <div class="rk">22. – 25. Mai<small>Pfingsten 2026</small></div>
        <div>
          <h3>91. Nordseewoche</h3>
          <p>Deutschlands große Hochsee-Segelregatta rund um den roten Felsen. Am Pfingstmontag startet das Pantaenius Rund Skagen Rennen — mit rund 510 Seemeilen eine der längsten Offshore-Regatten des Landes. Der Hafen wird zum Festival.</p>
        </div>
        <div class="rm"><div><b>seit 1921</b><span>Tradition</span></div><div><b>510 sm</b><span>Rund Skagen</span></div></div>
      </div>
      <div class="row fade">
        <div class="rk">Juni<small>Naturschauspiel</small></div>
        <div>
          <h3>Der Lummensprung</h3>
          <p>Die Küken der Trottellummen springen — drei Wochen alt, flugunfähig — von der roten Wand ins Meer, wo die Väter rufen. Geführte Abende am Lummenfelsen mit den Rangern des Vereins Jordsand.</p>
        </div>
        <div class="rm"><div><b>ca. 40 m</b><span>Sprunghöhe</span></div><div><b>abends</b><span>beste Zeit</span></div></div>
      </div>
      <div class="row fade">
        <div class="rk">10. August<small>2026 · 14:00 Uhr</small></div>
        <div>
          <h3>Börteboot-Regatta</h3>
          <p>Die offenen Holzboote, sonst würdevolle Ausbooter, rudern um die Wette — zur Erinnerung an den Tag, an dem die Insel 1890 deutsch wurde. Halb Wettkampf, halb Volksfest, ganz Helgoland.</p>
        </div>
        <div class="rm"><div><b>1826</b><span>Börte seit</span></div><div><b>Kulturerbe</b><span>seit 2018</span></div></div>
      </div>
      <div class="row fade">
        <div class="rk">Sept. – Okt.<small>Zugzeit</small></div>
        <div>
          <h3>Der große Vogelzug</h3>
          <p>Im Herbst wird die Insel zur Raststätte für Millionen Zugvögel — und zum Wallfahrtsort für Birder aus ganz Europa. Die Vogelwarte Helgoland beringt hier seit über hundert Jahren.</p>
        </div>
        <div class="rm"><div><b>426</b><span>Arten gezählt</span></div><div><b>1910</b><span>Vogelwarte seit</span></div></div>
      </div>
      <div class="row fade">
        <div class="rk">Nov. – Jan.<small>Winter</small></div>
        <div>
          <h3>Robbenzeit auf der Düne</h3>
          <p>Über tausend Kegelrobben-Geburten in einer Saison — Rekord. Wintererlebnispfad, Fotobuchten und Ranger-Touren machen das Staunen möglich, ohne zu stören.</p>
        </div>
        <div class="rm"><div><b>1.049</b><span>Geburten</span></div><div><b>Ranger</b><span>geführt</span></div></div>
      </div>
    </div>
  </div>
</section>

<section class="section dark">
  <div class="wrap">
    <div class="head fade">
      <span class="eyebrow">Neu gedacht · Formate der Marke ATMEN</span>
      <h2 class="h-lg" style="margin-top:1.4rem;color:var(--schaum)">Daneben wächst Neues.</h2>
      <p class="body">Vier Formate aus der neuen Markenwelt — als Konzept, getragen mit den Menschen der Insel. Ehrlich gekennzeichnet: Das hier ist Zukunft, kein Fahrplan.</p>
    </div>
    <div class="events fade">
      <div class="event">
        <span class="season">Sommer · Konzept</span>
        <span class="date">ein Abend im Juli</span>
        <h3>Die Lange Tafel</h3>
        <p>Eine weiße Tafel vom Unterland bis zur Landungsbrücke, Insulaner und Gäste durcheinander. Ein Bild, das eine Jahreskampagne ersetzt.</p>
      </div>
      <div class="event">
        <span class="season">Sommer · Konzept</span>
        <span class="date">an Sommerabenden</span>
        <h3>Budenwandern</h3>
        <p>Ein Gang pro Hummerbude — die Budenzeile wird zur Menü-Meile. Die Gastronomen verdienen direkt.</p>
      </div>
      <div class="event">
        <span class="season">Sommer · Konzept</span>
        <span class="date">Binnenhafen</span>
        <h3>Hafenklang</h3>
        <p>Musik von einer schwimmenden Bühne, der Hafen wird zum Saal. Erst recht, wenn die Bühne ein Börteboot ist.</p>
      </div>
      <div class="event">
        <span class="season">Herbst · Konzept</span>
        <span class="date">zur Scherensaison</span>
        <h3>Knieper-Wochen</h3>
        <p>Ein Gericht, das nur dieser Insel gehört — als gemeinsames Fenster der Gastronomen zum Saisonausklang.</p>
      </div>
    </div>
  </div>
</section>

${divider}

<section class="section" style="padding-top:0">
  <div class="wrap" style="text-align:center;max-width:640px">
    <h2 class="h-md fade">Termin gefunden?</h2>
    <p class="body fade d1" style="margin:1rem auto 2rem">Dann fehlt nur noch ein Bett mit Meerrauschen.</p>
    <div class="fade d2" style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
      <a href="unterkuenfte.html" class="btn btn--rot" data-cursor><span>Unterkunft finden</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
      <a href="anreise.html" class="btn btn--ghost" data-cursor><span>Anreise planen</span></a>
    </div>
  </div>
</section>`
});

/* ============================== GESUNDHEIT ============================== */
const gesundheit = page({
  file:'gesundheit.html',
  title:'Gesundheit — Helgoland · Atmen',
  desc:'200 Jahre Nordseeheilbad: pollenarme Hochseeluft, Reizklima, Thalasso im Mare Frisicum Spa mit Meerwasserbad — Atmen auf Rezept.',
  active:'Gesundheit',
  hero: subhero({
    crumb:'Gesundheit',
    h1:'Atmen. Diesmal<br/>auf <span class="breath">Rezept.</span>',
    sub:'Seit 1826 Seebad, seit jeher pollenarm: Auf Helgoland ist gute Luft keine Werbung, sondern Geographie. Siebzig Kilometer Wasser filtern zuverlässiger als jede Anlage.',
    img: IMG.gesundheit,
    alt:'Meerwasser-Außenbecken an der Nordsee in der Dämmerung'
  }),
  body: `
<section class="section">
  <div class="wrap gesund">
    <div class="fade">
      <span class="eyebrow" style="display:block;margin-bottom:1.2rem">Das Reizklima · Amtlich</span>
      <h2 class="h-md">Was hier in der Luft liegt:<br/>fast nichts. Zum Glück.</h2>
      <p class="body" style="margin-top:1.2rem">Hochseeklima heißt: kaum Pollen, kaum Feinstaub, dafür salzhaltige Aerosole, die bis in die feinsten Bronchien reichen. Wer mit Allergien oder Asthma lebt, hat hier gute Chancen auf beschwerdefreie Tage — jeder Spaziergang ist Klimatherapie.</p>
      <p class="body" style="margin-top:1rem">Deshalb trägt die Insel das Prädikat Nordseeheilbad. Kein Werbewort, eine Verpflichtung — seit zweihundert Jahren.</p>
    </div>
    <div class="pollen fade d1" data-pollen>
      <div class="pk"><span>Pollenbelastung heute</span><span class="live">● live</span></div>
      <div class="gauge hh">
        <div class="top"><span class="place">Hamburg</span><span class="val">8/8</span></div>
        <div class="bar"><div class="fill"></div></div>
      </div>
      <div class="gauge hgl">
        <div class="top"><span class="place">Helgoland</span><span class="val">0/8</span></div>
        <div class="bar"><div class="fill"></div></div>
      </div>
      <p class="note">Ihre Lunge hat angerufen.</p>
    </div>
  </div>
</section>

<section class="section darker">
  <div class="wrap">
    <div class="head fade">
      <span class="eyebrow">Mare Frisicum Spa · Am Südstrand</span>
      <h2 class="h-lg" style="margin-top:1.4rem;color:var(--schaum)">Die Nordsee.<br/>Auf 27 Grad gebracht.</h2>
      <p class="body">Eines der modernsten Bäder auf einer deutschen Insel, eröffnet 2007: echtes, aufbereitetes Nordseewasser innen wie außen — und der Blick geht dahin, wo das Wasser herkommt.</p>
    </div>
    <div class="zahlen" style="margin-top:clamp(40px,6vh,64px)">
      <div class="zahl fade"><b data-count="27"><span class="u">°C</span></b><div class="l">Meerwasser</div><div class="d">Ganzjährig — auch wenn draußen 4 Grad und Windstärke 8 herrschen. Gerade dann.</div></div>
      <div class="zahl fade d1"><b data-count="230"><span class="u">m²</span></b><div class="l">Außenbecken</div><div class="d">Schwimmen unter freiem Himmel, verbunden mit dem Innenbecken samt Geysir.</div></div>
      <div class="zahl fade d2"><b data-count="50000">0</b><div class="l">Gäste im Jahr</div><div class="d">Und trotzdem nie Schlange am Beckenrand. Insel-Arithmetik.</div></div>
    </div>
    <div class="events fade" style="margin-top:clamp(36px,5vh,56px)">
      <div class="event">
        <span class="season">Anwendung</span>
        <span class="date">ganzjährig</span>
        <h3>Thalasso</h3>
        <p>Meerwasser, Kreide, Schlick und Sand — die Heilmittel liegen vor der Tür. Das Reizklima vollendet die Wirkung.</p>
      </div>
      <div class="event">
        <span class="season">Draußen</span>
        <span class="date">täglich · geführt</span>
        <h3>Atemwandern</h3>
        <p>Einatmen vier, ausatmen sechs — am Klippenrand, wo die Luft am reinsten ist. Der einfachste Kurs der Welt.</p>
      </div>
      <div class="event">
        <span class="season">Frühjahr</span>
        <span class="date">wenn drüben die Pollen fliegen</span>
        <h3>Durchatmen-Wochen</h3>
        <p>Gesundheitswochen für alle, die dem Heuschnupfen davonfahren wollen. Siebzig Kilometer reichen.</p>
      </div>
      <div class="event">
        <span class="season">Kur</span>
        <span class="date">auf Verordnung</span>
        <h3>Seewasserkur</h3>
        <p>Zweihundert Jahre Erfahrung, moderne Badeärzte, echtes Hochseeklima. Reden Sie mit Ihrer Ärztin — die Insel ist verschreibungsfähig.</p>
      </div>
    </div>
  </div>
</section>

${divider}

<section class="section" style="padding-top:0">
  <div class="wrap" style="text-align:center;max-width:640px">
    <h2 class="h-md fade">Die Kur beginnt an der Kaimauer.</h2>
    <p class="body fade d1" style="margin:1rem auto 2rem">Der erste tiefe Atemzug ist inklusive. Alles Weitere macht der Wind.</p>
    <div class="fade d2" style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
      <a href="anreise.html" class="btn btn--rot" data-cursor><span>Anreise planen</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
      <a href="unterkuenfte.html" class="btn btn--ghost" data-cursor><span>Länger bleiben</span></a>
    </div>
  </div>
</section>`
});

/* ============================== UNTERKÜNFTE ============================== */
const unterkuenfte = page({
  file:'unterkuenfte.html',
  title:'Unterkünfte — Helgoland · Atmen',
  desc:'Übernachten auf Helgoland: Hotels und Pensionen, Ferienwohnungen, das Dünendorf mit 57 Bungalows, Wikkelhouses, Camping und Schlafstrandkörbe auf der Düne.',
  active:'Unterkünfte',
  hero: subhero({
    crumb:'Unterkünfte',
    h1:'Bleiben Sie<br/>über <span class="breath">Nacht.</span>',
    sub:'Wer bleibt, bekommt die Insel, die Tagesgäste nie sehen: den leeren Klippenweg im Morgenlicht, den Abend an der Kaimauer — und Sterne ohne eine einzige Straßenlaterne.',
    img: IMG.wohnen,
    alt:'Das bunte Bungalowdorf auf der Helgoländer Düne am Abend'
  }),
  body: `
<section class="section">
  <div class="wrap">
    <div class="head fade">
      <span class="eyebrow">Vom Viersternehaus bis zum Strandkorb</span>
      <h2 class="h-lg" style="margin-top:1.4rem">Sechs Arten,<br/>hier aufzuwachen.</h2>
      <p class="body">Gebucht wird über das Gastgeberverzeichnis der Insel — oder direkt bei den Häusern. Die ehrliche Stimme: In der Hochsaison ist früh dran, wer gut schläft.</p>
    </div>
    <div class="cards3">
      <div class="card fade" data-cursor>
        <span class="ck">Hauptinsel</span>
        <h3>Hotels &amp; Pensionen</h3>
        <p>Vom Viersternehaus über der Kurpromenade bis zum einfachen Zimmer mit Hafenblick — kurze Wege hat hier jedes Haus. Weiter als zehn Gehminuten ist nichts.</p>
        <div class="cm">bis ★★★★ · ganzjährig</div>
      </div>
      <div class="card fade d1" data-cursor>
        <span class="ck">Hauptinsel</span>
        <h3>Ferienwohnungen</h3>
        <p>Die eigene Bude auf dem Felsen: Wohnungen im Unter-, Mittel- und Oberland, viele mit Meerblick. Morgens Brötchen holen wie ein Insulaner.</p>
        <div class="cm">Gastgeberverzeichnis · online buchbar</div>
      </div>
      <div class="card dunkel fade d2" data-cursor>
        <span class="ck">Düne</span>
        <h3>Das Dünendorf</h3>
        <p>57 bunte Bungalows zwischen Dünengras und weißem Strand — und die Nachbarn sind Kegelrobben. Die vielleicht norddeutscheste Art, Urlaub zu machen.</p>
        <div class="cm">57 Bungalows · direkt am Strand</div>
      </div>
      <div class="card fade" data-cursor>
        <span class="ck">Düne · Nachhaltig</span>
        <h3>Wikkelhouses</h3>
        <p>Kleine Häuser aus 24 Lagen gewickelter Pappe — ohne Fundament, komplett recycelbar und erstaunlich gemütlich. Nachhaltigkeit, die man anfassen kann.</p>
        <div class="cm">24 Lagen · 100 % recycelbar</div>
      </div>
      <div class="card fade d1" data-cursor>
        <span class="ck">Düne · Draußen</span>
        <h3>Camping</h3>
        <p>Zelt auf, Nordsee an: Der Platz auf der Düne liegt einen Wurf vom Wasser. Nachts das Rauschen, morgens der erste Blick auf die See — ungefiltert.</p>
        <div class="cm">Saison · direkt hinterm Strand</div>
      </div>
      <div class="card fade d2" data-cursor>
        <span class="ck">Düne · Eigenwillig</span>
        <h3>Schlafstrandkörbe</h3>
        <p>Ein Strandkorb, groß genug für zwei, verschließbar, unter freiem Himmel. Einschlafen mit den Wellen, aufwachen mit der Brise. Mehr Bett braucht die Insel nicht.</p>
        <div class="cm">für 2 · Sommer</div>
      </div>
    </div>
    <p class="fade" style="margin-top:2.4rem;font-family:var(--f-mono);font-size:.78rem;color:var(--grau);max-width:60ch">Übernachtungsgäste zahlen die Kurabgabe der Gemeinde — dafür gehört ihnen der Abend, das Bad im Mare Frisicum ist ermäßigt, und die Insel sagt Du.</p>
  </div>
</section>

<section class="scene" data-scene>
  <div class="scene__bg"><img src="${IMG.still}" alt="Stille See vor Helgoland in der Dämmerung" /></div>
  <div class="scene__veil"></div>
  <div class="scene__inner">
    <p class="quote fade">„Um 17 Uhr fahren die Tagesgäste.<br/>Dann gehört die Insel Ihnen.“</p>
    <div class="attr fade d1">Die ehrliche Stimme · Übernachten auf Helgoland</div>
  </div>
</section>

${divider}

<section class="section" style="padding-top:0">
  <div class="wrap" style="text-align:center;max-width:640px">
    <h2 class="h-md fade">Noch Fragen offen?</h2>
    <p class="body fade d1" style="margin:1rem auto 2rem">Anreise, Termine, Freimengen — alles Weitere steht bereit.</p>
    <div class="fade d2" style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
      <a href="anreise.html" class="btn btn--rot" data-cursor><span>Anreise planen</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
      <a href="veranstaltungen.html" class="btn btn--ghost" data-cursor><span>Veranstaltungen</span></a>
    </div>
  </div>
</section>`
});

for (const [file, html] of [
  ['anreise.html', anreise],
  ['erleben.html', erleben],
  ['veranstaltungen.html', veranstaltungen],
  ['gesundheit.html', gesundheit],
  ['unterkuenfte.html', unterkuenfte],
]) {
  writeFileSync(join(ROOT, file), html);
  console.log('wrote', file, html.length, 'bytes');
}
