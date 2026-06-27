-- ============================================================
--  EXPENSE TRACKER — Full MySQL Schema  (v2 + Income)
--  Tables: users, categories, expenses, expense_category,
--          budgets, income_sources, incomes
-- ============================================================

CREATE DATABASE IF NOT EXISTS expense_tracker
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE expense_tracker;




-- ============================================================
-- 1. USERS
-- ============================================================
CREATE TABLE users (
  id                          INT UNSIGNED  NOT NULL AUTO_INCREMENT,

  -- identity
  username                    VARCHAR(50)   NOT NULL UNIQUE,          -- lowercase, trimmed, indexed
  fullname                    VARCHAR(100)  NULL,
  email                       VARCHAR(150)  NOT NULL UNIQUE,
  password_hash               VARCHAR(255)  NOT NULL,                 -- bcrypt/argon2, never plain text

  -- avatar
  avatar_url                  VARCHAR(500)  NOT NULL DEFAULT 'https://placehold.co/200x200',
  avatar_local_path           VARCHAR(500)  NOT NULL DEFAULT '',

  -- email verification
  is_email_verified           TINYINT(1)    NOT NULL DEFAULT 0,
  email_verification_token    VARCHAR(255)  NULL,
  email_verification_expiry   TIMESTAMP     NULL,

  -- forgot / reset password
  forget_password_token       VARCHAR(255)  NULL,
  forget_password_expiry      TIMESTAMP     NULL,

  -- session
  refresh_token               VARCHAR(500)  NULL,                     -- JWT refresh token

  created_at                  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at                  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
                                            ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_users_email    (email),
  INDEX idx_users_username (username),
  INDEX idx_users_email_verification_token (email_verification_token),
  INDEX idx_users_forget_password_token    (forget_password_token)
) ENGINE=InnoDB;


-- ============================================================
-- 2. CATEGORIES  (user-created custom categories)
-- ============================================================
CREATE TABLE categories (
  id         INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  user_id    INT UNSIGNED   NOT NULL,
  type       VARCHAR(100)   NOT NULL,              -- e.g. "Food & Drinks", "Travel"
  created_at TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE  KEY uq_category_per_user (user_id, type),
  INDEX   idx_categories_user (user_id),

  CONSTRAINT fk_categories_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;


-- ============================================================
-- 3. EXPENSES
-- ============================================================
CREATE TABLE expenses (
  id           INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  user_id      INT UNSIGNED   NOT NULL,
  category_id  INT UNSIGNED   NOT NULL,
  name         VARCHAR(200)   NOT NULL,
  expense_date DATE           NOT NULL,
  amount       DECIMAL(12,2)  NOT NULL CHECK (amount > 0),
  deleted_at   TIMESTAMP      NULL DEFAULT NULL,

  created_at   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
                              ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_expenses_user     (user_id),
  INDEX idx_expenses_category (category_id),
  INDEX idx_expenses_date     (expense_date),
  INDEX idx_expenses_deleted  (deleted_at),

  CONSTRAINT fk_expenses_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT fk_expenses_category
    FOREIGN KEY (category_id) REFERENCES categories (id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;



-- ============================================================
-- 5. BUDGETS
-- ============================================================
CREATE TABLE budgets (
  id          INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  user_id     INT UNSIGNED   NOT NULL,
  category_id INT UNSIGNED   NULL,                 -- NULL = overall budget
  amount      DECIMAL(12,2)  NOT NULL CHECK (amount > 0),
  period      ENUM('weekly','monthly','yearly') NOT NULL DEFAULT 'monthly',
  start_date  DATE           NOT NULL,

  created_at  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
                             ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_budgets_user     (user_id),
  INDEX idx_budgets_category (category_id),
  UNIQUE KEY uq_budget_per_scope (user_id, category_id, period, start_date),

  CONSTRAINT fk_budgets_user
    FOREIGN KEY (user_id)     REFERENCES users      (id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT fk_budgets_category
    FOREIGN KEY (category_id) REFERENCES categories (id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;


-- ============================================================
-- 6. INCOME_SOURCES  (types of income per user)
--    e.g. "Salary", "Freelance", "Business", "Rental"
-- ============================================================
CREATE TABLE income_sources (
  id         INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  user_id    INT UNSIGNED  NOT NULL,
  name       VARCHAR(100)  NOT NULL,               -- "Salary", "Freelance", etc.
  created_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_source_per_user (user_id, name),   -- no duplicate source names per user
  INDEX idx_income_sources_user (user_id),

  CONSTRAINT fk_income_sources_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;


-- ============================================================
-- 7. INCOMES  (actual income entries logged by user)
-- ============================================================
CREATE TABLE incomes (
  id               INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  user_id          INT UNSIGNED  NOT NULL,
  income_source_id INT UNSIGNED  NOT NULL,
  amount           DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  income_date      DATE          NOT NULL,
  note             VARCHAR(255)  NULL,              -- optional description

  created_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
                                 ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_incomes_user        (user_id),
  INDEX idx_incomes_source      (income_source_id),
  INDEX idx_incomes_date        (income_date),

  CONSTRAINT fk_incomes_user
    FOREIGN KEY (user_id)          REFERENCES users          (id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT fk_incomes_source
    FOREIGN KEY (income_source_id) REFERENCES income_sources (id)
    ON DELETE RESTRICT ON UPDATE CASCADE
    -- RESTRICT: don't allow deleting a source that has income entries logged against it
) ENGINE=InnoDB;


-- ============================================================
-- SEED DATA  (uncomment and run after creating first user)
-- ============================================================
/*
INSERT INTO users (username, fullname, email, password_hash) VALUES
  ('munafhajir', 'Munaf Hajir', 'munaf@example.com', '$2b$12$placeholder_hash');

INSERT INTO categories (user_id, type) VALUES
  (1, 'Food & Drinks'),
  (1, 'Groceries'),
  (1, 'Travel'),
  (1, 'Health');

INSERT INTO income_sources (user_id, name) VALUES
  (1, 'Salary'),
  (1, 'Freelance'),
  (1, 'Business');

INSERT INTO budgets (user_id, category_id, amount, period, start_date) VALUES
  (1, NULL, 20000.00, 'monthly', '2024-01-01');   -- overall monthly budget
*/


-- ============================================================
-- VIEWS
-- ============================================================

-- Active expenses (excludes soft-deleted)
CREATE OR REPLACE VIEW v_active_expenses AS
SELECT
  e.id,
  e.user_id,
  e.name,
  e.expense_date,
  e.amount,
  c.type AS category,
  e.created_at
FROM expenses e
LEFT JOIN categories c
  ON c.id = e.category_id
WHERE e.deleted_at IS NULL;


-- Monthly spend per category per user
CREATE OR REPLACE VIEW v_monthly_spend AS
SELECT
  e.user_id,
  c.id AS category_id,
  c.type AS category,
  DATE_FORMAT(e.expense_date, '%Y-%m') AS month,
  SUM(e.amount) AS total_spent
FROM expenses e
JOIN categories c
  ON c.id = e.category_id
WHERE e.deleted_at IS NULL
GROUP BY
  e.user_id,
  c.id,
  c.type,
  month;


-- Budget vs actual spend (current month)
CREATE OR REPLACE VIEW v_budget_vs_actual AS
SELECT
  b.user_id,
  b.id AS budget_id,
  COALESCE(c.type, 'Overall') AS category,
  b.amount AS budget_amount,
  b.period,
  COALESCE(SUM(e.amount), 0) AS spent,
  b.amount - COALESCE(SUM(e.amount), 0) AS remaining
FROM budgets b
LEFT JOIN categories c
  ON c.id = b.category_id
LEFT JOIN expenses e
  ON e.category_id = b.category_id
  AND e.user_id = b.user_id
  AND e.deleted_at IS NULL
  AND DATE_FORMAT(e.expense_date, '%Y-%m')
      = DATE_FORMAT(CURDATE(), '%Y-%m')
GROUP BY
  b.id,
  b.user_id,
  c.type,
  b.amount,
  b.period;


-- Monthly income per source per user
CREATE OR REPLACE VIEW v_monthly_income AS
SELECT
  i.user_id,
  s.id                                  AS source_id,
  s.name                                AS source,
  DATE_FORMAT(i.income_date, '%Y-%m')   AS month,
  SUM(i.amount)                         AS total_income
FROM incomes i
JOIN income_sources s ON s.id = i.income_source_id
GROUP BY i.user_id, s.id, month;


-- Income vs Expense summary (current month) — feeds the dashboard stat cards
CREATE OR REPLACE VIEW v_income_vs_expense AS
SELECT
  u.id                          AS user_id,
  COALESCE(inc.total_income, 0) AS total_income,
  COALESCE(exp.total_expense,0) AS total_expense,
  COALESCE(inc.total_income, 0)
    - COALESCE(exp.total_expense, 0)    AS net_savings
FROM users u
LEFT JOIN (
  SELECT user_id, SUM(amount) AS total_income
  FROM incomes
  WHERE DATE_FORMAT(income_date, '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m')
  GROUP BY user_id
) inc ON inc.user_id = u.id
LEFT JOIN (
  SELECT user_id, SUM(amount) AS total_expense
  FROM expenses
  WHERE deleted_at IS NULL
    AND DATE_FORMAT(expense_date, '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m')
  GROUP BY user_id
) exp ON exp.user_id = u.id;

