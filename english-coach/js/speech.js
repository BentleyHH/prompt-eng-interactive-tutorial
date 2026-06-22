// Sprachausgabe (TTS), Spracherkennung (STT) und Wake-Lock.
// Hinweis: Spracherkennung läuft am zuverlässigsten in Chrome/Edge/Safari.
const Speech = (() => {
  let voice = null;
  let wakeLock = null;

  // --- TTS: englische Stimme wählen ---
  function pickVoice() {
    const voices = speechSynthesis.getVoices();
    voice = voices.find(v => /en[-_]GB/i.test(v.lang)) ||
            voices.find(v => /en[-_]US/i.test(v.lang)) ||
            voices.find(v => /^en/i.test(v.lang)) || null;
  }
  if ('speechSynthesis' in window) {
    pickVoice();
    speechSynthesis.onvoiceschanged = pickVoice;
  }

  function speak(text, { onend } = {}) {
    if (!('speechSynthesis' in window) || !text) { onend && onend(); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (voice) u.voice = voice;
    u.lang = voice ? voice.lang : 'en-US';
    u.rate = 0.96;
    u.onend = () => onend && onend();
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
    recog.start();
    return recog;
  }
  function stopListening() { if (recog) try { recog.stop(); } catch (_) {} }

  // --- Wake Lock: hält den Bildschirm im Gespräch an ---
  async function keepAwake() {
    try {
      if ('wakeLock' in navigator) wakeLock = await navigator.wakeLock.request('screen');
    } catch (_) {}
  }
  function releaseAwake() { if (wakeLock) { wakeLock.release().catch(()=>{}); wakeLock = null; } }
  document.addEventListener('visibilitychange', () => {
    if (wakeLock && document.visibilityState === 'visible') keepAwake();
  });

  return { speak, stopSpeaking, listen, stopListening, sttSupported, ttsSupported: 'speechSynthesis' in window, keepAwake, releaseAwake };
})();
