// English Coach — Frontend-Steuerung
(() => {
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => (s || '').replace(/[&<>]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;' }[c]));

  const state = { convId: null, listening: false, autoSpeak: true, showDe: false, handsFree: false, topics: [], shareUser: 0, shareCoach: 0 };

  const READY_HINT = () => Speech.sttSupported ? 'Du bist dran — tippe 🎙️ und sprich' : 'Du bist dran — schreib unten';
  function setOrb(mode, status) {
    const orb = $('#orb');
    if (orb) { orb.classList.remove('speaking', 'listening'); if (mode) orb.classList.add(mode); }
    if (status !== undefined) { const s = $('#orb-status'); if (s) s.textContent = status; }
  }
  function speakCoach(text) {
    const afterwards = () => { if (state.handsFree && state.convId) startListening(); else setOrb(null, READY_HINT()); };
    if (!text) { afterwards(); return; }
    setOrb('speaking', 'Coach spricht …');
    Speech.speak(text, { onend: afterwards });
  }

  function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.classList.remove('hidden');
    clearTimeout(t._t); t._t = setTimeout(() => t.classList.add('hidden'), 2600);
  }

  /* ---------------- Login ---------------- */
  async function doLogin() {
    const pw = $('#login-pw').value;
    $('#login-err').textContent = '';
    try {
      const { token } = await API.login(pw);
      API.setToken(token);
      enterApp();
    } catch (e) {
      $('#login-err').textContent = e.message || 'Login fehlgeschlagen.';
    }
  }

  function enterApp() {
    $('#login').classList.add('hidden');
    $('#app').classList.remove('hidden');
    loadTopics();
    refreshStreak();
  }

  function logout() {
    API.clearToken();
    location.reload();
  }

  /* ---------------- Navigation ---------------- */
  const titles = { talk: 'Reden', vocab: 'Vokabeln', plan: 'Lernplan', progress: 'Fortschritt' };
  function switchView(name) {
    $$('.view').forEach(v => v.classList.add('hidden'));
    $('#view-' + name).classList.remove('hidden');
    $$('.tab').forEach(t => t.classList.toggle('active', t.dataset.view === name));
    $('#topbar-title').textContent = titles[name];
    if (name === 'vocab') loadReview();
    if (name === 'plan') loadPlan();
    if (name === 'progress') { loadProgress(); loadProfile(); populateVoices(); setTimeout(populateVoices, 600); }
  }

  async function refreshStreak() {
    try {
      const s = await API.stats();
      $('#topbar-streak').textContent = s.streak > 0 ? `🔥 ${s.streak} Tage` : '';
    } catch (_) {}
  }

  /* ---------------- Themen ---------------- */
  async function loadTopics() {
    try {
      const { topics } = await API.topics();
      state.topics = topics;
      const grid = $('#topic-grid');
      grid.innerHTML = topics.map(t => `
        <button class="topic-card" data-id="${t.id}">
          ${Number(t.is_custom) ? `<button class="del" data-del="${t.id}" title="Löschen">✕</button>` : ''}
          <div class="emo">${esc(t.emoji)}</div>
          <div class="t">${esc(t.title)}</div>
          <div class="d">${esc(t.description || '')}</div>
        </button>`).join('');
    } catch (e) { toast(e.message); }
  }

  async function startConversation(topicId) {
    showConversation();
    const chat = $('#chat'); chat.innerHTML = '';
    addTyping();
    try {
      const level = $('#level-select').value;
      const { conversation_id, message } = await API.startConv(topicId, level);
      state.convId = conversation_id;
      removeTyping();
      renderCoachTurn(message);
    } catch (e) { removeTyping(); toast(e.message); showPicker(); }
  }

  /* ---------------- Gespräch UI ---------------- */
  function showConversation() {
    $('#topic-picker').classList.add('hidden'); $('#conversation').classList.remove('hidden');
    $('#goal-chip').classList.add('hidden'); resetShare(); Speech.keepAwake();
  }
  function showPicker() { $('#conversation').classList.add('hidden'); $('#topic-picker').classList.remove('hidden'); Speech.releaseAwake(); Speech.stopSpeaking(); state.convId = null; }

  function addTyping() {
    const d = document.createElement('div');
    d.className = 'typing'; d.id = 'typing'; d.textContent = 'Coach denkt nach…';
    setOrb(null, 'Coach denkt nach …');
    $('#chat').appendChild(d); scrollChat();
  }
  function removeTyping() { const t = $('#typing'); if (t) t.remove(); }

  function bubbleMe(text) {
    const d = document.createElement('div');
    d.className = 'bubble me'; d.textContent = text;
    $('#chat').appendChild(d); scrollChat();
  }

  function renderCoachTurn(m) {
    const reply = m.reply || '';
    // Mini-Ziel des Szenarios
    if (m.goal_de) { const c = $('#goal-chip'); c.textContent = '🎯 ' + m.goal_de; c.classList.remove('hidden', 'met'); c.dataset.text = m.goal_de; }
    if (m.goal_met) { const c = $('#goal-chip'); c.classList.remove('hidden'); c.classList.add('met'); c.textContent = '✅ ' + (c.dataset.text || 'Ziel erreicht!'); toast('🎉 Ziel erreicht — stark!'); }
    addShare('assistant', reply);
    // Coach-Sprechblase
    const b = document.createElement('div');
    b.className = 'bubble coach';
    b.innerHTML = `<div class="reply">${esc(reply)}</div>
      ${m.reply_de ? `<div class="de ${state.showDe ? '' : 'hidden'}">${esc(m.reply_de)}</div>` : ''}
      <button class="speak">🔊 Vorlesen</button>`;
    b.querySelector('.speak').onclick = () => speakCoach(reply);
    $('#chat').appendChild(b);

    // Feedback (sanft, max 1–2)
    if (Array.isArray(m.feedback) && m.feedback.length) {
      const f = document.createElement('div');
      f.className = 'feedback';
      f.innerHTML = '<strong>💡 Kleiner Tipp:</strong>' + m.feedback.map(x => `
        <div class="fb"><span class="o">${esc(x.original)}</span> → <span class="b">${esc(x.better)}</span>
        ${x.note_de ? `<div class="n">${esc(x.note_de)}</div>` : ''}</div>`).join('');
      $('#chat').appendChild(f);
    }
    // Neue Vokabeln
    if (Array.isArray(m.vocab) && m.vocab.length) {
      const v = document.createElement('div');
      v.className = 'vocab-chiprow';
      v.innerHTML = m.vocab.map(x => `<span class="vchip"><b>${esc(x.en)}</b> — ${esc(x.de)}</span>`).join('');
      $('#chat').appendChild(v);
    }
    // Ermutigung
    if (m.encouragement_de) {
      const e = document.createElement('div');
      e.className = 'encourage'; e.textContent = '🌱 ' + m.encouragement_de;
      $('#chat').appendChild(e);
    }
    scrollChat();
    if (state.autoSpeak && reply) speakCoach(reply); else setOrb(null, READY_HINT());
  }

  function scrollChat() { requestAnimationFrame(() => { const el = $('.content'); if (el) el.scrollTop = el.scrollHeight; }); }

  async function sendMessage() {
    const input = $('#msg-input');
    const text = input.value.trim();
    if (!text || !state.convId) return;
    input.value = ''; input.style.height = 'auto';
    bubbleMe(text);
    addShare('user', text);
    addTyping();
    try {
      const { message } = await API.sendMsg(state.convId, text);
      removeTyping();
      renderCoachTurn(message);
      refreshStreak();
    } catch (e) { removeTyping(); toast(e.message); }
  }

  /* ---------------- Mikrofon (STT) ---------------- */
  function startListening() {
    if (state.listening) return;
    if (!Speech.sttSupported) { toast('Spracheingabe hier nicht verfügbar — bitte tippen.'); return; }
    Speech.stopSpeaking();
    const btn = $('#mic-btn');
    state.listening = true; btn.classList.add('rec'); setOrb('listening', 'Ich höre zu … 🎧');
    Speech.listen({
      onresult: (final, interim) => { $('#msg-input').value = (final + ' ' + interim).trim(); },
      onerror: () => { state.listening = false; btn.classList.remove('rec'); setOrb(null, READY_HINT()); },
      onend: (finalText) => {
        state.listening = false; btn.classList.remove('rec'); setOrb(null);
        if (finalText) { $('#msg-input').value = finalText; sendMessage(); }
        else if (state.handsFree) setOrb(null, 'Ich habe nichts gehört — tippe 🎙️, wenn du bereit bist.');
      },
    });
  }
  function toggleMic() {
    if (state.listening) { Speech.stopListening(); return; }
    startListening();
  }

  /* ---------------- Redeanteil (Du vs. Coach) ---------------- */
  function resetShare() { state.shareUser = 0; state.shareCoach = 0; $('#share-bar').classList.add('hidden'); }
  function addShare(role, text) {
    const n = (text || '').length;
    if (role === 'user') state.shareUser += n; else state.shareCoach += n;
    const total = state.shareUser + state.shareCoach;
    if (total < 5) return;
    const pct = Math.round(state.shareUser / total * 100);
    $('#share-bar').classList.remove('hidden');
    $('#share-fill').style.width = pct + '%';
    $('#share-label').textContent = `Du ${pct}% · Coach ${100 - pct}%`;
  }

  /* ---------------- Vokabeln ---------------- */
  let reviewQueue = [], reviewShown = false;
  async function loadReview() {
    const box = $('#vocab-review');
    box.innerHTML = '<div class="empty">Lade…</div>';
    try {
      const { due } = await API.due();
      reviewQueue = due || [];
      nextCard();
    } catch (e) { box.innerHTML = `<div class="empty">${esc(e.message)}</div>`; }
  }
  function nextCard() {
    const box = $('#vocab-review');
    if (!reviewQueue.length) {
      box.innerHTML = '<div class="empty">🎉 Alles wiederholt! Komm später wieder — die Vokabeln tauchen nach dem Spaced-Repetition-Plan erneut auf.</div>';
      return;
    }
    const c = reviewQueue[0]; reviewShown = false;
    box.innerHTML = `
      <div class="flashcard" id="fc">
        <div class="en">${esc(c.en)}</div>
        <div class="de hidden">${esc(c.de || '—')}</div>
        ${c.example ? `<div class="ex hidden">„${esc(c.example)}"</div>` : ''}
        <button class="btn ghost" id="reveal" style="margin-top:1rem">Umdrehen</button>
      </div>
      <div class="grade-row hidden" id="grades">
        <button class="grade g-bad" data-q="1">Nochmal</button>
        <button class="grade g-ok" data-q="3">OK</button>
        <button class="grade g-good" data-q="5">Leicht</button>
      </div>
      <p class="muted small" style="text-align:center;margin-top:.6rem">Noch ${reviewQueue.length} Karte(n)</p>`;
    $('#reveal').onclick = () => {
      $$('#fc .de, #fc .ex').forEach(e => e.classList.remove('hidden'));
      $('#reveal').classList.add('hidden');
      $('#grades').classList.remove('hidden');
      Speech.speak(c.en);
      reviewShown = true;
    };
    $$('#grades .grade').forEach(g => g.onclick = async () => {
      try { await API.review(c.id, +g.dataset.q); } catch (_) {}
      reviewQueue.shift(); nextCard();
    });
  }
  async function loadVocabAll() {
    const box = $('#vocab-all');
    box.innerHTML = '<div class="empty">Lade…</div>';
    try {
      const { vocab } = await API.vocab();
      box.innerHTML = vocab.length ? vocab.map(v => `
        <div class="vocab-item"><div><div class="en">${esc(v.en)}</div><div class="de">${esc(v.de || '')}</div></div></div>`).join('')
        : '<div class="empty">Noch keine Vokabeln. Führe ein Gespräch — der Coach sammelt sie automatisch.</div>';
    } catch (e) { box.innerHTML = `<div class="empty">${esc(e.message)}</div>`; }
  }

  /* ---------------- Plan ---------------- */
  function renderPlan(plan) {
    const box = $('#plan-content');
    if (!plan) { box.innerHTML = '<div class="empty">Noch kein Plan. Tippe unten auf „Lernplan erstellen".</div>'; return; }
    box.innerHTML = `
      <div class="plan-summary">${esc(plan.summary_de || '')}</div>
      ${(plan.weeks || []).map(w => `
        <div class="week"><h4>Woche ${w.week} — ${esc(w.focus_de || '')}</h4>
        <ul>${(w.actions_de || []).map(a => `<li>${esc(a)}</li>`).join('')}</ul></div>`).join('')}
      ${(plan.daily_de && plan.daily_de.length) ? `<div class="daily"><strong>Jeden Tag (~15 Min):</strong>
        <ul>${plan.daily_de.map(d => `<li>${esc(d)}</li>`).join('')}</ul></div>` : ''}`;
  }
  async function loadPlan() {
    try { const { plan } = await API.getPlan(); renderPlan(plan); }
    catch (e) { toast(e.message); }
  }
  async function makePlan() {
    $('#plan-content').innerHTML = '<div class="empty">Coach erstellt deinen Plan…</div>';
    try { const { plan } = await API.makePlan(); renderPlan(plan); }
    catch (e) { toast(e.message); loadPlan(); }
  }

  /* ---------------- Fortschritt ---------------- */
  async function loadProgress() {
    const box = $('#progress-content');
    try {
      const s = await API.stats();
      const max = Math.max(1, ...s.days.map(d => d.messages_count));
      box.innerHTML = `
        <div class="stat-grid">
          <div class="stat"><div class="num">${s.level}</div><div class="lbl">Geschätztes Level</div></div>
          <div class="stat"><div class="num">🔥 ${s.streak}</div><div class="lbl">Tage in Folge</div></div>
          <div class="stat"><div class="num">${s.total_vocab}</div><div class="lbl">Vokabeln gesammelt</div></div>
          <div class="stat"><div class="num">${s.due_vocab}</div><div class="lbl">heute fällig</div></div>
        </div>
        <h3>Letzte 30 Tage (Nachrichten)</h3>
        <div class="bars">${s.days.map(d => `<div class="bar" style="height:${Math.round(d.messages_count/max*100)}%" title="${d.day}: ${d.messages_count}"></div>`).join('')}</div>`;
    } catch (e) { box.innerHTML = `<div class="empty">${esc(e.message)}</div>`; }
  }

  /* ---------------- Profil & Stimme ---------------- */
  async function loadProfile() {
    try {
      const { profile } = await API.getProfile();
      if (profile) {
        $('#pf-name').value = profile.name || '';
        $('#pf-job').value = profile.job || '';
        $('#pf-interests').value = profile.interests || '';
        $('#pf-goals').value = profile.goals || '';
      }
    } catch (_) {}
  }
  async function saveProfile() {
    try {
      await API.saveProfile({
        name: $('#pf-name').value.trim(), job: $('#pf-job').value.trim(),
        interests: $('#pf-interests').value.trim(), goals: $('#pf-goals').value.trim(),
      });
      toast('Profil gespeichert ✓');
    } catch (e) { toast(e.message); }
  }
  function populateVoices() {
    const sel = $('#voice-select');
    const voices = Speech.listVoices();
    if (!voices.length) { sel.innerHTML = '<option>Keine englische Stimme gefunden</option>'; return; }
    const cur = Speech.currentVoiceURI();
    sel.innerHTML = voices.map(v => `<option value="${esc(v.uri)}" ${v.uri === cur ? 'selected' : ''}>${esc(v.name)} (${esc(v.lang)})</option>`).join('');
    const r = Speech.getRate();
    $('#rate-range').value = r; $('#rate-val').textContent = r.toFixed(2) + '×';
  }

  /* ---------------- Modal Thema ---------------- */
  function openTopicModal() { $('#topic-modal').classList.remove('hidden'); }
  function closeTopicModal() { $('#topic-modal').classList.add('hidden'); $('#nt-emoji').value = $('#nt-title').value = $('#nt-desc').value = ''; }
  async function saveTopic() {
    const title = $('#nt-title').value.trim();
    if (!title) { toast('Bitte einen Titel eingeben.'); return; }
    try {
      await API.addTopic({ title, description: $('#nt-desc').value.trim(), emoji: $('#nt-emoji').value.trim() || '💬' });
      closeTopicModal(); loadTopics(); toast('Thema hinzugefügt ✓');
    } catch (e) { toast(e.message); }
  }

  /* ---------------- Events ---------------- */
  function bind() {
    $('#login-btn').onclick = doLogin;
    $('#login-pw').addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
    $('#logout').onclick = logout;

    $$('.tab').forEach(t => t.onclick = () => switchView(t.dataset.view));

    // Themen-Grid (Delegation: Karte starten / löschen)
    $('#topic-grid').onclick = async (e) => {
      const del = e.target.closest('[data-del]');
      if (del) { e.stopPropagation(); if (confirm('Thema löschen?')) { await API.delTopic(+del.dataset.del); loadTopics(); } return; }
      const card = e.target.closest('.topic-card');
      if (card) startConversation(+card.dataset.id);
    };
    $('#add-topic-btn').onclick = openTopicModal;
    $('#nt-cancel').onclick = closeTopicModal;
    $('#nt-save').onclick = saveTopic;

    $('#send-btn').onclick = sendMessage;
    $('#msg-input').addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } });
    $('#msg-input').addEventListener('input', e => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; });
    $('#mic-btn').onclick = toggleMic;
    $('#end-conv').onclick = showPicker;
    $('#auto-speak').onchange = e => { state.autoSpeak = e.target.checked; if (!state.autoSpeak) Speech.stopSpeaking(); };
    $('#show-de').onchange = e => { state.showDe = e.target.checked; $$('.bubble .de').forEach(d => d.classList.toggle('hidden', !state.showDe)); };
    $('#hands-free').onchange = e => {
      state.handsFree = e.target.checked;
      if (state.handsFree) { toast('Freisprech an — nach dem Coach höre ich automatisch zu.'); if (state.convId && !state.listening) setOrb(null, 'Sag etwas, sobald du bereit bist …'); }
      else { Speech.stopListening(); }
    };

    // Profil & Stimme
    $('#pf-save').onclick = saveProfile;
    $('#voice-select').onchange = e => { Speech.useVoice(e.target.value); };
    $('#rate-range').oninput = e => { const r = parseFloat(e.target.value); Speech.setRate(r); $('#rate-val').textContent = r.toFixed(2) + '×'; };
    $('#voice-test').onclick = () => Speech.speak("Hi! This is how I sound. Let's practise together — you're doing great.");
    $('#forget-mem').onclick = async () => { if (confirm('Soll der Coach alles über dich vergessen?')) { try { await API.forgetMemory(); toast('Gedächtnis geleert.'); } catch (e) { toast(e.message); } } };

    $$('.seg-btn').forEach(b => b.onclick = () => {
      $$('.seg-btn').forEach(x => x.classList.remove('active')); b.classList.add('active');
      const isAll = b.dataset.vocab === 'all';
      $('#vocab-all').classList.toggle('hidden', !isAll);
      $('#vocab-review').classList.toggle('hidden', isAll);
      if (isAll) loadVocabAll(); else loadReview();
    });

    $('#make-plan').onclick = makePlan;

    // Geräte-Fähigkeiten anzeigen
    $('#caps-info').textContent =
      `Spracheingabe (Mikro): ${Speech.sttSupported ? 'verfügbar' : 'nicht verfügbar'} · ` +
      `Vorlesen: ${Speech.ttsSupported ? 'verfügbar' : 'nicht verfügbar'}.`;
    if (!Speech.sttSupported) { const hf = $('#hands-free'); hf.disabled = true; hf.parentElement.style.opacity = .5; }
  }

  /* ---------------- Start ---------------- */
  bind();
  if (API.hasToken()) enterApp(); else $('#login').classList.remove('hidden');

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();
