-- ETAF Trainer-Koordination — MySQL-Schema (artfiles.de)
-- Optional: kann über phpMyAdmin importiert werden.
-- Hinweis: Das Backend legt diese Tabellen beim ersten Start auch
-- automatisch selbst an (ensure_schema()). Dieses Skript ist nur für
-- alle, die das Schema lieber manuell einspielen möchten.

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS app_config (
  k VARCHAR(64) PRIMARY KEY,
  v TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS sessions (
  token VARCHAR(64) PRIMARY KEY,
  created_at VARCHAR(20),
  last_seen VARCHAR(20)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS login_attempts (
  ip VARCHAR(64) PRIMARY KEY,
  cnt INT,
  window_start VARCHAR(20)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS trainers (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(160), email VARCHAR(190), phone VARCHAR(64),
  spec TEXT, region VARCHAR(64), langs TEXT,
  uae INT DEFAULT 0, load_lvl INT DEFAULT 0,
  color VARCHAR(16), rating VARCHAR(8),
  created_at VARCHAR(20)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS clients (
  id VARCHAR(24) PRIMARY KEY,
  name VARCHAR(160), short VARCHAR(24), color VARCHAR(16),
  cal VARCHAR(24), country VARCHAR(16), sort_order INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS trainings (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  client_id VARCHAR(24),
  topic VARCHAR(190), city VARCHAR(96), country VARCHAR(16),
  kw VARCHAR(24), month VARCHAR(24), spec VARCHAR(96),
  start_date VARCHAR(12), end_date VARCHAR(12), code VARCHAR(16),
  need_cnt INT DEFAULT 5, participants INT DEFAULT 0,
  created_at VARCHAR(20),
  INDEX(client_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS materials (
  id VARCHAR(24) PRIMARY KEY,
  name VARCHAR(160), unit VARCHAR(24), cat VARCHAR(64), sort_order INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS training_materials (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  training_id INT, material_id VARCHAR(24), qty INT DEFAULT 0,
  INDEX(training_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS material_presets (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  spec VARCHAR(96), material_id VARCHAR(24), qty INT DEFAULT 0,
  INDEX(spec)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS templates (
  id VARCHAR(16) PRIMARY KEY,
  de_name VARCHAR(120), de_subject VARCHAR(255), de_body TEXT,
  en_name VARCHAR(120), en_subject VARCHAR(255), en_body TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS requests (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  training_id INT, trainer_id INT,
  status VARCHAR(16) DEFAULT 'asked',
  lang VARCHAR(4) DEFAULT 'en',
  tok VARCHAR(64),
  note TEXT,
  created_at VARCHAR(20), responded_at VARCHAR(20),
  INDEX(training_id), INDEX(trainer_id), INDEX(tok)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS email_log (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  training_id INT, trainer_id INT, to_email VARCHAR(190),
  subject VARCHAR(255), body TEXT, lang VARCHAR(4),
  status VARCHAR(16), created_at VARCHAR(20)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
