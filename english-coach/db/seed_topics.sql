-- Start-Themen. Du kannst in der App jederzeit eigene hinzufügen.
INSERT IGNORE INTO topics (slug, title, description, category, emoji, is_custom) VALUES
('smalltalk-cafe',     'Smalltalk im Café',            'Lockeres Gespräch beim Kaffee — Wetter, Wochenende, Pläne.', 'everyday',  '☕', 0),
('job-interview',      'Vorstellungsgespräch',          'Ein realistisches Job-Interview auf Englisch üben.',          'work',      '💼', 0),
('office-meeting',     'Meeting im Büro',               'Standpunkte vertreten, nachfragen, zustimmen/widersprechen.', 'work',      '🗂️', 0),
('travel-airport',     'Reisen & Flughafen',            'Check-in, Umsteigen, Probleme lösen unterwegs.',              'travel',    '✈️', 0),
('restaurant',         'Im Restaurant',                 'Bestellen, nachfragen, Empfehlungen, reklamieren.',           'everyday',  '🍽️', 0),
('doctor',             'Beim Arzt',                     'Beschwerden schildern, Fragen verstehen.',                    'health',    '🩺', 0),
('opinion-debate',     'Meinung & Diskussion',          'Eine Position begründen — ideal für C1-Wortschatz.',          'advanced',  '🧠', 0),
('phone-call',         'Telefonat',                     'Ohne Mimik verstehen — fordernd, aber sehr nützlich.',        'work',      '📞', 0);
