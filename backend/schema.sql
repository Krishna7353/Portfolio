-- Optional: Hibernate creates this table for you (ddl-auto=update).
-- Use this file if you prefer to create it by hand or via Flyway.
CREATE DATABASE IF NOT EXISTS portfolio;
USE portfolio;

CREATE TABLE IF NOT EXISTS contact_messages (
  id         BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL,
  message    TEXT         NOT NULL,
  created_at DATETIME(6)  NOT NULL
);

-- See your messages:
-- SELECT id, name, email, message, created_at FROM contact_messages ORDER BY created_at DESC;
