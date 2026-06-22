/* =========================================================================
 *  NUR FÜR DIE VORSCHAU (preview.html).
 *  Ersetzt das echte Backend durch einen Demo-Coach mit Beispieltexten,
 *  damit man die App ohne Server/KI durchklicken kann.
 *  Stellt dasselbe API-Objekt bereit wie js/api.js.
 * ========================================================================= */
const API = (() => {
  const wait = (ms, val) => new Promise(r => setTimeout(() => r(val), ms));
  let convCount = 0, curTopic = 'a chat', turn = 0;

  const TOPICS = [
    { id:1, slug:'smalltalk-cafe', title:'Smalltalk im Café', description:'Lockeres Gespräch beim Kaffee.', emoji:'☕', is_custom:0 },
    { id:2, slug:'job-interview', title:'Vorstellungsgespräch', description:'Ein realistisches Job-Interview üben.', emoji:'💼', is_custom:0 },
    { id:3, slug:'office-meeting', title:'Meeting im Büro', description:'Standpunkte vertreten, nachfragen.', emoji:'🗂️', is_custom:0 },
    { id:4, slug:'travel-airport', title:'Reisen & Flughafen', description:'Check-in, Umsteigen, Probleme lösen.', emoji:'✈️', is_custom:0 },
    { id:5, slug:'restaurant', title:'Im Restaurant', description:'Bestellen, nachfragen, reklamieren.', emoji:'🍽️', is_custom:0 },
    { id:6, slug:'doctor', title:'Beim Arzt', description:'Beschwerden schildern.', emoji:'🩺', is_custom:0 },
    { id:7, slug:'opinion-debate', title:'Meinung & Diskussion', description:'Eine Position begründen — ideal für C1.', emoji:'🧠', is_custom:0 },
    { id:8, slug:'phone-call', title:'Telefonat', description:'Ohne Mimik verstehen — fordernd.', emoji:'📞', is_custom:0 },
  ];

  const GREET = {
    1:"Hey, good to see you! Grab a seat — I just ordered a flat white. So, how has your week been so far?",
    2:"Welcome, thanks for coming in. Please, take a seat. To start us off — could you tell me a little about yourself and what drew you to this role?",
    3:"Morning, everyone — let's get started. We're here to align on the new timeline. What's your take on where we currently stand?",
    4:"Hi there, welcome to the check-in desk. May I see your passport and booking, please? And are you checking in any bags today?",
    5:"Good evening and welcome! Here are your menus. Can I start you off with something to drink while you decide?",
    6:"Hello, come on in and have a seat. So, what brings you in today — what's been bothering you?",
    7:"Great, let's dig into this. I'd argue that remote work has done more good than harm. Where do you stand on that?",
    8:"Hello, thanks for calling! This is Alex from support. How can I help you today?",
  };

  const VOCAB_POOL = {
    1:[{en:'to catch up',de:'sich austauschen / auf den neuesten Stand bringen',example:"Let's catch up over coffee soon."},
       {en:'hectic',de:'hektisch',example:"It's been a hectic week at work."}],
    2:[{en:'to be drawn to',de:'sich hingezogen fühlen zu',example:'I was drawn to this role by the team culture.'},
       {en:'a track record',de:'eine Erfolgsbilanz',example:'She has a strong track record in sales.'}],
    7:[{en:'to make a case for',de:'für etwas argumentieren',example:'He made a compelling case for the change.'},
       {en:'on balance',de:'alles in allem',example:'On balance, the benefits outweigh the costs.'}],
  };
  const GENERIC_VOCAB = [
    {en:'to be honest',de:'ehrlich gesagt',example:"To be honest, I'm not entirely sure."},
    {en:"I'd say",de:'ich würde sagen',example:"I'd say it depends on the situation."},
    {en:'in terms of',de:'in Bezug auf',example:"In terms of cost, it's reasonable."},
    {en:'come to think of it',de:'wenn ich so darüber nachdenke',example:'Come to think of it, that makes sense.'},
  ];

  const FOLLOWUPS = [
    "What about you — how do you usually handle that?",
    "Interesting! Can you tell me a bit more about why?",
    "Nice. And how did that make you feel?",
    "Got it. What would you do differently next time?",
    "That makes sense. Could you give me an example?",
    "I see. What's the hardest part about that for you?",
  ];
  const ENCOURAGE = [
    "Super, du traust dich zu sprechen — genau so wächst dein Englisch!",
    "Toll formuliert! Kleine Fehler sind völlig egal, du wirst verstanden.",
    "Stark — du benutzt schon längere Sätze. Bleib dran!",
    "Klasse, dass du einfach drauflos redest. Das ist der wichtigste Schritt.",
  ];

  let idc = 0;
  const pick = (a) => a[Math.floor(Math.random()*a.length)];

  function coachReply(userText) {
    turn++;
    const tid = Number(curTopic) || 0;
    const vpool = VOCAB_POOL[tid] || GENERIC_VOCAB;
    const reply = `That's a great point. ${pick(FOLLOWUPS)}`;
    const msg = {
      reply,
      reply_de: 'Das ist ein guter Punkt. ' + '(Übersetzung der Rückfrage erscheint hier.)',
      feedback: (turn % 2 === 0 && userText && userText.length > 8)
        ? [{ original: userText.slice(0,40), better: 'A slightly more natural phrasing here.',
             note_de:'Im echten Betrieb erklärt der Coach hier kurz das Warum.' }]
        : [],
      vocab: [ pick(vpool), pick(GENERIC_VOCAB) ].filter((v,i,a)=>a.indexOf(v)===i),
      encouragement_de: pick(ENCOURAGE),
      remember: turn === 1 && userText ? ['(Demo) merkt sich etwas aus deiner Antwort'] : [],
      goal_met: turn === 3,
      level_estimate: 'B2',
    };
    return msg;
  }

  let VOCAB = [
    {id:1,en:'to catch up',de:'sich austauschen',example:"Let's catch up soon.",due_at:'2026-06-22'},
    {id:2,en:'a track record',de:'eine Erfolgsbilanz',example:'A strong track record.',due_at:'2026-06-22'},
    {id:3,en:'on balance',de:'alles in allem',example:'On balance, it works.',due_at:'2026-06-22'},
    {id:4,en:'to make a case for',de:'für etwas argumentieren',example:'He made a case for it.',due_at:'2026-06-22'},
    {id:5,en:'hectic',de:'hektisch',example:'A hectic week.',due_at:'2026-06-22'},
  ];

  function days30(){
    const out=[]; const t=new Date('2026-06-22');
    for(let i=29;i>=0;i--){const d=new Date(t);d.setDate(t.getDate()-i);
      out.push({day:d.toISOString().slice(0,10),messages_count: i<7?Math.floor(Math.random()*9):Math.floor(Math.random()*5),new_vocab:0});}
    return out;
  }

  const PLAN = {
    summary_de:'Du bist auf einem soliden B2-Niveau. In vier Wochen bringen wir dich näher an C1 — mit täglich nur ~15 Minuten Sprechen, ohne Druck. Der Schlüssel: reden, reden, reden.',
    weeks:[
      {week:1,focus_de:'Sprechangst abbauen',actions_de:['Jeden Tag 1 kurzes Gespräch (Smalltalk).','Keine Korrekturen-Panik: einfach drauflos.','5 neue Vokabeln pro Tag wiederholen.']},
      {week:2,focus_de:'Flüssigkeit & Füllwörter',actions_de:['Natürliche Wendungen üben (I\'d say, to be honest).','Gespräche zu „Meinung & Diskussion".','Eigene Themen hinzufügen.']},
      {week:3,focus_de:'Genauigkeit (C1-Wortschatz)',actions_de:['Längere Antworten mit Begründung.','Feedback gezielt umsetzen.','Vokabeln im Satz benutzen.']},
      {week:4,focus_de:'Anspruchsvolle Szenarien',actions_de:['Vorstellungsgespräch & Telefonat.','Position begründen & widersprechen.','Fortschritt im Tab „Fortschritt" prüfen.']},
    ],
    daily_de:['1 Gespräch (5–10 Min).','Fällige Vokabeln wiederholen.','1 neuen Ausdruck aktiv verwenden.'],
  };

  return {
    setToken(){}, clearToken(){ location.reload(); }, hasToken(){ return true; },
    login:  () => wait(300, { token:'demo' }),

    topics: () => wait(150, { topics: TOPICS }),
    addTopic: (t) => { const id = 100+(++idc); TOPICS.push({id,slug:'custom-'+id,title:t.title,description:t.description,emoji:t.emoji||'💬',is_custom:1}); return wait(150,{id}); },
    delTopic: (id) => { const i=TOPICS.findIndex(x=>x.id===id); if(i>=0)TOPICS.splice(i,1); return wait(120,{deleted:1}); },

    startConv: (topic_id) => { curTopic=topic_id; turn=0; convCount++;
      return wait(700, { conversation_id: convCount, message:{
        reply: GREET[topic_id] || "Hi! Let's just have a relaxed chat. What's on your mind today?",
        reply_de:'(Deutsche Übersetzung auf Knopfdruck — hier im Demo verkürzt.)',
        feedback:[], vocab:[ (VOCAB_POOL[topic_id]||GENERIC_VOCAB)[0] ],
        encouragement_de:'Leg einfach los — du machst das super!',
        goal_de:'Stell eine Frage und erzähle einen Satz über dich.', level_estimate:'B2' } }); },
    sendMsg: (cid, text) => wait(800, { message: coachReply(text) }),
    listConv: () => wait(100, { conversations: [] }),
    getConv: () => wait(100, { messages: [] }),

    vocab: () => wait(150, { vocab: VOCAB }),
    due:   () => wait(150, { due: VOCAB }),
    review:(id) => { return wait(120, { id, next_due:'soon' }); },
    addVocab:(v)=>{ VOCAB.unshift({id:900+(++idc),...v}); return wait(120,{ok:true}); },

    stats: () => wait(150, { level:'B2', streak:4, total_msgs:37, total_vocab:VOCAB.length, due_vocab:VOCAB.length, days:days30() }),
    makePlan: () => wait(1200, { plan: PLAN }),
    getPlan:  () => wait(150, { plan: PLAN }),

    getProfile:  () => wait(120, { profile:{name:'',job:'',interests:'',goals:''}, memory:[] }),
    saveProfile: (p) => wait(120, { ok:true, profile:p }),
    forgetMemory:() => wait(120, { ok:true }),
    ttsInfo:     () => wait(80, { available:false, voices:[], default:'alloy' }),
  };
})();
