-- English Coach — MySQL/MariaDB Schema
-- Import via phpMyAdmin (Artfiles DCP > Datenbanken) into your database.
-- Works on MySQL 5.7+ / MariaDB 10.2+. JSON-ähnliche Felder als LONGTEXT
-- gehalten, damit es auch auf älteren MariaDB-Versionen sicher läuft.

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- Themen / Szenarien für Gespräche --------------------------------------
CREATE TABLE IF NOT EXISTS topics (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  slug         VARCHAR(80)  NOT NULL,
  title        VARCHAR(160) NOT NULL,
  description  TEXT,
  category     VARCHAR(80)  DEFAULT 'general',
  emoji        VARCHAR(12)  DEFAULT '💬',
  is_custom    TINYINT(1)   DEFAULT 0,
  created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Einzelne Gespräche -----------------------------------------------------
CREATE TABLE IF NOT EXISTS conversations (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  topic_id    INT NULL,
  title       VARCHAR(200),
  level       VARCHAR(8) DEFAULT 'B2',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_conv_topic FOREIGN KEY (topic_id)
    REFERENCES topics(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Nachrichten innerhalb eines Gesprächs ----------------------------------
CREATE TABLE IF NOT EXISTS messages (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  conversation_id  INT NOT NULL,
  role             ENUM('user','assistant') NOT NULL,
  content          MEDIUMTEXT NOT NULL,   -- gesprochener Text
  meta             LONGTEXT NULL,         -- JSON: feedback, vocab, reply_de, ...
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_msg_conv FOREIGN KEY (conversation_id)
    REFERENCES conversations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Vokabeln mit Spaced-Repetition (SM-2 lite) -----------------------------
CREATE TABLE IF NOT EXISTS vocabulary (
  id                      INT AUTO_INCREMENT PRIMARY KEY,
  en                      VARCHAR(255) NOT NULL,
  de                      VARCHAR(255),
  example                 TEXT,
  topic_id                INT NULL,
  source_conversation_id  INT NULL,
  ease                    FLOAT DEFAULT 2.5,
  interval_days           INT   DEFAULT 0,
  repetitions             INT   DEFAULT 0,
  due_at                  DATE,
  last_reviewed_at        DATE NULL,
  created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_en (en)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Täglicher Fortschritt --------------------------------------------------
CREATE TABLE IF NOT EXISTS progress (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  day             DATE NOT NULL,
  minutes         INT DEFAULT 0,
  messages_count  INT DEFAULT 0,
  new_vocab       INT DEFAULT 0,
  level_estimate  VARCHAR(8),
  UNIQUE KEY uniq_day (day)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Einfacher Key/Value-Speicher (Lernplan, Profil, Einstellungen) ---------
CREATE TABLE IF NOT EXISTS settings (
  k  VARCHAR(80) PRIMARY KEY,
  v  LONGTEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
