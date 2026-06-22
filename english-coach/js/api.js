// Kleiner Wrapper um fetch — hängt Auth-Token an und parst JSON.
const API = (() => {
  const base = './api/';
  let token = localStorage.getItem('ec_token') || '';

  function setToken(t) { token = t; localStorage.setItem('ec_token', t); }
  function clearToken() { token = ''; localStorage.removeItem('ec_token'); }
  function hasToken() { return !!token; }

  async function call(file, { method = 'GET', body = null, query = {} } = {}) {
    const qs = new URLSearchParams(query).toString();
    const url = base + file + (qs ? '?' + qs : '');
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': token,
      },
      body: body ? JSON.stringify(body) : null,
    });
    let data = {};
    try { data = await res.json(); } catch (_) {}
    if (!res.ok) {
      const err = new Error(data.error || ('HTTP ' + res.status));
      err.status = res.status;
      throw err;
    }
    return data;
  }

  return {
    setToken, clearToken, hasToken,
    login:   (password) => call('auth.php', { method: 'POST', body: { password } }),

    topics:  () => call('topics.php', { query: { action: 'list' } }),
    addTopic:(t) => call('topics.php', { method: 'POST', query: { action: 'create' }, body: t }),
    delTopic:(id) => call('topics.php', { method: 'POST', query: { action: 'delete' }, body: { id } }),

    startConv: (topic_id, level) => call('conversation.php', { method: 'POST', query: { action: 'start' }, body: { topic_id, level } }),
    sendMsg:   (conversation_id, text) => call('conversation.php', { method: 'POST', query: { action: 'message' }, body: { conversation_id, text } }),
    listConv:  () => call('conversation.php', { query: { action: 'list' } }),
    getConv:   (id) => call('conversation.php', { query: { action: 'get', id } }),

    vocab:    () => call('vocab.php', { query: { action: 'list' } }),
    due:      () => call('vocab.php', { query: { action: 'due' } }),
    review:   (id, quality) => call('vocab.php', { method: 'POST', query: { action: 'review' }, body: { id, quality } }),
    addVocab: (v) => call('vocab.php', { method: 'POST', query: { action: 'add' }, body: v }),

    stats:    () => call('progress.php', { query: { action: 'stats' } }),
    makePlan: () => call('progress.php', { query: { action: 'plan' } }),
    getPlan:  () => call('progress.php', { query: { action: 'get_plan' } }),

    getProfile:  () => call('profile.php', { query: { action: 'get' } }),
    saveProfile: (p) => call('profile.php', { method: 'POST', query: { action: 'save' }, body: p }),
    forgetMemory:() => call('profile.php', { method: 'POST', query: { action: 'forget' } }),

    ttsInfo: () => call('tts.php', { query: { action: 'info' } }),
  };
})();
