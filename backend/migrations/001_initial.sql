-- Migration 001: Initial schema
-- Creates the core tables for the budget tracker backend.

-- Tracks the user's income and savings target.
-- Single-row table (only one "user" for now).
CREATE TABLE IF NOT EXISTS income_settings (
  id         SERIAL PRIMARY KEY,
  income     NUMERIC(10, 2) NOT NULL DEFAULT 0,
  savings    NUMERIC(10, 2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed a default row so GET /settings always returns something.
INSERT INTO income_settings (income, savings)
SELECT 0, 0
WHERE NOT EXISTS (SELECT 1 FROM income_settings);

-- Stores every expense the user logs.
CREATE TABLE IF NOT EXISTS expenses (
  id         SERIAL PRIMARY KEY,
  date       DATE NOT NULL,
  amount     NUMERIC(10, 2) NOT NULL,
  category   TEXT NOT NULL CHECK (category IN ('Food', 'Transport', 'Bills', 'Other')),
  note       TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
