// Feine Strich-Icons (Line-Art) — ein einheitliches, ikonisches Set.
// stroke = currentColor, damit Farbe per CSS gesteuert wird (Ink/Rot).
const ICONS = (() => {
  const P = {
    // --- UI / Navigation ---
    talk:    '<path d="M5 5h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-7l-5 4v-4H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/>',
    cards:   '<rect x="3.5" y="7.5" width="13" height="11" rx="2"/><path d="M7.5 5.5h11a2 2 0 0 1 2 2v9"/>',
    map:     '<path d="M5 18V6l5 2 4-2 5 2v12l-5-2-4 2-5-2z"/><path d="M10 8v8M14 6v8"/>',
    chart:   '<path d="M4 4v16h16"/><path d="M7 15l3.5-4 3 2.5L20 7"/>',
    mic:     '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3M9 21h6"/>',
    send:    '<path d="M5 12l15-7-6 15-3-6-6-2z"/>',
    plus:    '<path d="M12 5v14M5 12h14"/>',
    close:   '<path d="M6 6l12 12M18 6L6 18"/>',
    spark:   '<path d="M12 4l1.6 4.8L18 10l-4.4 1.2L12 16l-1.6-4.8L6 10l4.4-1.2z"/>',
    sound:   '<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8 8 0 0 1 0 12"/>',
    flame:   '<path d="M12 3c2 3-1 4 0 7 .6 1.7 2 1.5 2 3a2 2 0 1 1-4 0c0-1-1-1.5-1-3 0 0-3 1-3 4a5 5 0 0 0 10 0c0-4-4-6-4-11z"/>',
    // --- Themen ---
    cup:     '<path d="M5 8h11v5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8z"/><path d="M16 9h2.5a2 2 0 0 1 0 4H16"/><path d="M8 3v2M11 3v2"/>',
    briefcase:'<rect x="3.5" y="8" width="17" height="11" rx="2"/><path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3.5 13h17"/>',
    plane:   '<path d="M10 4.5a1.5 1.5 0 0 1 3 0V10l8 4.5v2l-8-2.5V19l2 1.5v1.5l-3.5-1-3.5 1V20.5L9 19v-5L1 16.5v-2L9 10V4.5z" transform="scale(0.9) translate(1.2 0.5)"/>',
    fork:    '<path d="M7 3v7a2 2 0 0 0 4 0V3M9 10v11M16 3c-1.5 0-2.5 2-2.5 5S15 13 16 13s2.5 0 2.5-5S17.5 3 16 3zM16 13v8"/>',
    heart:   '<path d="M12 20s-7-4.5-7-9.5A3.5 3.5 0 0 1 12 7a3.5 3.5 0 0 1 7 3.5C19 15.5 12 20 12 20z"/>',
    bulb:    '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.3 1 2.5h6c0-1.2.2-1.7 1-2.5A6 6 0 0 0 12 3z"/>',
    phone:   '<path d="M6 3h3l2 5-2.5 1.5a11 11 0 0 0 5 5L16 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 3-2z"/>',
  };
  function icon(name, size = 24) {
    const p = P[name] || P.talk;
    return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  }
  // Passendes Themen-Icon anhand Slug/Kategorie wählen.
  const BY_SLUG = {
    'smalltalk-cafe':'cup', 'job-interview':'briefcase', 'office-meeting':'briefcase',
    'travel-airport':'plane', 'restaurant':'fork', 'doctor':'heart',
    'opinion-debate':'bulb', 'phone-call':'phone',
  };
  const BY_CAT = { everyday:'cup', work:'briefcase', travel:'plane', health:'heart', advanced:'bulb' };
  function topicIcon(topic, size = 26) {
    const name = BY_SLUG[topic.slug] || BY_CAT[topic.category] || 'talk';
    return icon(name, size);
  }
  return { icon, topicIcon, P };
})();
