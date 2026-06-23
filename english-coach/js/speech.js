// Sprachausgabe (TTS), Spracherkennung (STT), Wake-Lock + Stimmenwahl.
// Browser-Stimme als Standard; sauber gekapselt, damit später eine
// Premium-/Realtime-Engine eingehängt werden kann.
const Speech = (() => {
  let voice = null;
  let voices = [];
  let chosenURI = localStorage.getItem('ec_voice') || '';
  let rate = parseFloat(localStorage.getItem('ec_rate') || '0.96');
  let wakeLock = null;
  let curAudio = null;

  // Premium-/Server-Stimme (OpenAI o. Ä. via PHP-Backend)
  const premium = {
    enabled: localStorage.getItem('ec_premium') === '1',
    available: false,
    voice: localStorage.getItem('ec_pvoice') || 'alloy',
    voices: [],
  };
  function setPremiumInfo(info) {
    premium.available = !!(info && info.available);
    if (info && Array.isArray(info.voices)) premium.voices = info.voices;
    if (info && info.default && !localStorage.getItem('ec_pvoice')) premium.voice = info.default;
  }
  function usePremium(b) { premium.enabled = !!b; localStorage.setItem('ec_premium', b ? '1' : '0'); }
  function setPremiumVoice(v) { premium.voice = v; localStorage.setItem('ec_pvoice', v); }
  const premiumState = () => ({ ...premium });

  function refreshVoices() {
    if (!('speechSynthesis' in window)) return;
    voices = speechSynthesis.getVoices();
    const en = voices.filter(v => /^en/i.test(v.lang));
    voice = (chosenURI && voices.find(v => v.voiceURI === chosenURI)) ||
            // bevorzuge hochwertige/natürliche Stimmen
            en.find(v => /natural|premium|neural|enhanced|siri|samantha|serena|aria|google/i.test(v.name)) ||
            en.find(v => /en[-_]GB/i.test(v.lang)) ||
            en.find(v => /en[-_]US/i.test(v.lang)) ||
            en[0] || null;
  }
  if ('speechSynthesis' in window) {
    refreshVoices();
    speechSynthesis.onvoiceschanged = refreshVoices;
  }

  function listVoices() { return voices.filter(v => /^en/i.test(v.lang)).map(v => ({ uri: v.voiceURI, name: v.name, lang: v.lang })); }
  function useVoice(uri) { chosenURI = uri; localStorage.setItem('ec_voice', uri); refreshVoices(); }
  function setRate(r) { rate = r; localStorage.setItem('ec_rate', String(r)); }
  function getRate() { return rate; }
  function currentVoiceURI() { return voice ? voice.voiceURI : ''; }

  function speakBrowser(text, onend) {
    if (!('speechSynthesis' in window) || !text) { onend && onend(); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (voice) u.voice = voice;
    u.lang = voice ? voice.lang : 'en-US';
    u.rate = rate;
    let done = false;
    const finish = () => { if (!done) { done = true; onend && onend(); } };
    u.onend = finish; u.onerror = finish;
    speechSynthesis.speak(u);
  }
  async function speakServer(text, onend) {
    try {
      stopAudio();
      const res = await fetch('api/tts.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Auth-Token': localStorage.getItem('ec_token') || '' },
        body: JSON.stringify({ text, voice: premium.voice }),
      });
      if (!res.ok) throw new Error('tts http ' + res.status);
      const blob = await res.blob();
      curAudio = new Audio(URL.createObjectURL(blob));
      curAudio.playbackRate = Math.min(1.2, Math.max(0.8, rate + 0.04));
      let done = false;
      const finish = () => { if (!done) { done = true; onend && onend(); } };
      curAudio.onended = finish; curAudio.onerror = finish;
      await curAudio.play();
    } catch (e) {
      // Bei Problemen sauber auf die Browser-Stimme zurückfallen
      speakBrowser(text, onend);
    }
  }
  function speak(text, { onend } = {}) {
    if (!text) { onend && onend(); return; }
    if (premium.enabled && premium.available) speakServer(text, onend);
    else speakBrowser(text, onend);
  }
  function stopAudio() { if (curAudio) { try { curAudio.pause(); } catch (_) {} curAudio = null; } }
  function stopSpeaking() { if ('speechSynthesis' in window) speechSynthesis.cancel(); stopAudio(); }

  // --- STT mit einstellbarer Überlegungszeit ---
  // Das Mikro bleibt offen und bricht bei Denkpausen NICHT ab. Es wird erst
  // gesendet, wenn nach gesprochenem Text die gewählte Pause verstrichen ist
  // (oder im Manuell-Modus, wenn finalizeNow() aufgerufen wird).
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const sttSupported = !!SR;
  let session = null;

  function listen({ pauseMs = 5000, manual = false, onresult, onfinal, onerror } = {}) {
    if (!SR) { onerror && onerror(new Error('Spracherkennung wird hier nicht unterstützt.')); onfinal && onfinal(''); return null; }
    let finalText = '';
    let stopped = false;
    let silence = null;
    let r = null;

    const clearSilence = () => { if (silence) { clearTimeout(silence); silence = null; } };
    const armSilence = () => {
      if (manual) return;                 // Manuell: nie automatisch senden
      clearSilence();
      if (!finalText.trim()) return;      // noch nichts gesagt -> weiter warten
      silence = setTimeout(finish, pauseMs);
    };
    function finish() {
      if (stopped) return;
      stopped = true; clearSilence();
      try { r && r.stop(); } catch (_) {}
      onfinal && onfinal(finalText.trim());
    }
    function startOnce() {
      r = new SR();
      r.lang = 'en-US'; r.interimResults = true; r.continuous = true;
      r.onresult = (e) => {
        let interim = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const t = e.results[i][0].transcript;
          if (e.results[i].isFinal) finalText += t + ' '; else interim += t;
        }
        onresult && onresult(finalText.trim(), interim.trim());
        armSilence();
      };
      r.onerror = (e) => {
        const err = e && e.error;
        if (err === 'not-allowed' || err === 'service-not-allowed' || err === 'aborted') {
          stopped = true; clearSilence(); onerror && onerror(e); onfinal && onfinal(finalText.trim());
        }
        // 'no-speech'/'audio-capture' u. Ä. -> onend startet neu
      };
      r.onend = () => {
        if (stopped) return;
        // Browser hat selbst beendet -> Mikro offen halten, neu starten.
        try { r.start(); } catch (_) { setTimeout(() => { if (!stopped) try { startOnce(); } catch (_) {} }, 250); }
      };
      try { r.start(); } catch (_) {}
    }

    session = { stop: () => { stopped = true; clearSilence(); try { r && r.stop(); } catch (_) {} }, finalizeNow: finish };
    startOnce();
    return session;
  }
  function stopListening() { if (session) session.stop(); }
  function finalizeNow() { if (session) session.finalizeNow(); }

  // --- Wake Lock ---
  async function keepAwake() {
    try { if ('wakeLock' in navigator) wakeLock = await navigator.wakeLock.request('screen'); } catch (_) {}
  }
  function releaseAwake() { if (wakeLock) { wakeLock.release().catch(() => {}); wakeLock = null; } }
  document.addEventListener('visibilitychange', () => {
    if (wakeLock && document.visibilityState === 'visible') keepAwake();
  });

  return {
    speak, stopSpeaking, listen, stopListening, finalizeNow, keepAwake, releaseAwake,
    listVoices, useVoice, setRate, getRate, currentVoiceURI,
    setPremiumInfo, usePremium, setPremiumVoice, premiumState,
    sttSupported, ttsSupported: 'speechSynthesis' in window,
  };
})();
