#!/bin/bash
# Initialize SQLite database with hazo_auth and hazo_chat tables

DB_PATH="data/hazo_auth.sqlite"

echo "Initializing database at $DB_PATH..."

sqlite3 "$DB_PATH" << 'EOF'
-- ============================================
-- hazo_auth Tables
-- ============================================

-- Users table (shared by hazo_auth and hazo_chat)
CREATE TABLE IF NOT EXISTS hazo_users (
    id TEXT PRIMARY KEY,
    email_address TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT,
    email_verified INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    login_attempts INTEGER NOT NULL DEFAULT 0,
    last_logon TEXT,
    profile_picture_url TEXT,
    profile_source TEXT,
    mfa_secret TEXT,
    url_on_logon TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    changed_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Index for email lookups
CREATE INDEX IF NOT EXISTS idx_hazo_users_email ON hazo_users(email_address);

-- Refresh tokens table
CREATE TABLE IF NOT EXISTS hazo_refresh_tokens (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES hazo_users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL,
    token_type TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Permissions table
CREATE TABLE IF NOT EXISTS hazo_permissions (
    id TEXT PRIMARY KEY,
    permission_name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    changed_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Roles table
CREATE TABLE IF NOT EXISTS hazo_roles (
    id TEXT PRIMARY KEY,
    role_name TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    changed_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Role permissions junction table
CREATE TABLE IF NOT EXISTS hazo_role_permissions (
    role_id TEXT NOT NULL REFERENCES hazo_roles(id) ON DELETE CASCADE,
    permission_id TEXT NOT NULL REFERENCES hazo_permissions(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    changed_at TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (role_id, permission_id)
);

-- User roles junction table
CREATE TABLE IF NOT EXISTS hazo_user_roles (
    user_id TEXT NOT NULL REFERENCES hazo_users(id) ON DELETE CASCADE,
    role_id TEXT NOT NULL REFERENCES hazo_roles(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    changed_at TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (user_id, role_id)
);

-- ============================================
-- hazo_chat Tables
-- ============================================

-- Chat messages table
CREATE TABLE IF NOT EXISTS hazo_chat (
    id TEXT PRIMARY KEY,
    reference_id TEXT NOT NULL,
    reference_type TEXT DEFAULT 'chat',
    sender_user_id TEXT NOT NULL,
    receiver_user_id TEXT NOT NULL,
    message_text TEXT,
    reference_list TEXT,  -- JSON array of ChatReferenceItem
    read_at TEXT,
    deleted_at TEXT,
    created_at TEXT NOT NULL,
    changed_at TEXT NOT NULL
);

-- Performance indexes for hazo_chat
CREATE INDEX IF NOT EXISTS idx_hazo_chat_reference_id ON hazo_chat(reference_id);
CREATE INDEX IF NOT EXISTS idx_hazo_chat_sender ON hazo_chat(sender_user_id);
CREATE INDEX IF NOT EXISTS idx_hazo_chat_receiver ON hazo_chat(receiver_user_id);
CREATE INDEX IF NOT EXISTS idx_hazo_chat_created ON hazo_chat(created_at DESC);
EOF

echo "Database initialized successfully!"
echo ""
echo "Verifying tables..."
sqlite3 "$DB_PATH" ".tables"
echo ""
echo "Expected tables:"
echo "  hazo_users, hazo_refresh_tokens, hazo_permissions, hazo_roles,"
echo "  hazo_role_permissions, hazo_user_roles, hazo_chat"



