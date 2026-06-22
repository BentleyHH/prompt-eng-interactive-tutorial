// Sprachausgabe (TTS), Spracherkennung (STT), Wake-Lock + Stimmenwahl.
// Browser-Stimme als Standard; sauber gekapselt, damit später eine
// Premium-/Realtime-Engine eingehängt werden kann.
const Speech = (() => {
  let voice = null;
  let voices = [];
  let chosenURI = localStorage.getItem('ec_voice') || '';
  let rate = parseFloat(localStorage.getItem('ec_rate') || '0.96');
  let wakeLock = null;

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

  function speak(text, { onend } = {}) {
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
  function stopSpeaking() { if ('speechSynthesis' in window) speechSynthesis.cancel(); }

  // --- STT ---
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const sttSupported = !!SR;
  let recog = null;

  function listen({ onresult, onend, onerror } = {}) {
    if (!SR) { onerror && onerror(new Error('Spracherkennung wird hier nicht unterstützt.')); return null; }
    recog = new SR();
    recog.lang = 'en-US';
    recog.interimResults = true;
    recog.continuous = false;
    let finalText = '';
    recog.onresult = (e) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText += t; else interim += t;
      }
      onresult && onresult(finalText, interim);
    };
    recog.onerror = (e) => onerror && onerror(e);
    recog.onend = () => onend && onend(finalText.trim());
    try { recog.start(); } catch (_) {}
    return recog;
  }
  function stopListening() { if (recog) try { recog.stop(); } catch (_) {} }

  // --- Wake Lock ---
  async function keepAwake() {
    try { if ('wakeLock' in navigator) wakeLock = await navigator.wakeLock.request('screen'); } catch (_) {}
  }
  function releaseAwake() { if (wakeLock) { wakeLock.release().catch(() => {}); wakeLock = null; } }
  document.addEventListener('visibilitychange', () => {
    if (wakeLock && document.visibilityState === 'visible') keepAwake();
  });

  return {
    speak, stopSpeaking, listen, stopListening, keepAwake, releaseAwake,
    listVoices, useVoice, setRate, getRate, currentVoiceURI,
    sttSupported, ttsSupported: 'speechSynthesis' in window,
  };
})();
