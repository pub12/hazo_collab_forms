#!/bin/bash
# Initialize SQLite database with hazo_auth, hazo_chat, and HRBAC tables
# Updated for hazo_auth v4.0.0 and hazo_chat v3.0.0

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
-- hazo_auth HRBAC Scope Tables (v4.0.0)
-- ============================================

-- Scope Level 1 (e.g., Company/Organization)
CREATE TABLE IF NOT EXISTS hazo_scopes_l1 (
    id TEXT PRIMARY KEY,
    seq TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    changed_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Scope Level 2 (e.g., Division)
CREATE TABLE IF NOT EXISTS hazo_scopes_l2 (
    id TEXT PRIMARY KEY,
    seq TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    parent_scope_id TEXT REFERENCES hazo_scopes_l1(id),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    changed_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_hazo_scopes_l2_parent ON hazo_scopes_l2(parent_scope_id);

-- Scope Level 3 (e.g., Department)
CREATE TABLE IF NOT EXISTS hazo_scopes_l3 (
    id TEXT PRIMARY KEY,
    seq TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    parent_scope_id TEXT REFERENCES hazo_scopes_l2(id),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    changed_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_hazo_scopes_l3_parent ON hazo_scopes_l3(parent_scope_id);

-- Scope Level 4 (e.g., Team)
CREATE TABLE IF NOT EXISTS hazo_scopes_l4 (
    id TEXT PRIMARY KEY,
    seq TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    parent_scope_id TEXT REFERENCES hazo_scopes_l3(id),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    changed_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_hazo_scopes_l4_parent ON hazo_scopes_l4(parent_scope_id);

-- Scope Level 5 (e.g., Project)
CREATE TABLE IF NOT EXISTS hazo_scopes_l5 (
    id TEXT PRIMARY KEY,
    seq TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    parent_scope_id TEXT REFERENCES hazo_scopes_l4(id),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    changed_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_hazo_scopes_l5_parent ON hazo_scopes_l5(parent_scope_id);

-- Scope Level 6 (e.g., Sub-project)
CREATE TABLE IF NOT EXISTS hazo_scopes_l6 (
    id TEXT PRIMARY KEY,
    seq TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    parent_scope_id TEXT REFERENCES hazo_scopes_l5(id),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    changed_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_hazo_scopes_l6_parent ON hazo_scopes_l6(parent_scope_id);

-- Scope Level 7 (e.g., Task)
CREATE TABLE IF NOT EXISTS hazo_scopes_l7 (
    id TEXT PRIMARY KEY,
    seq TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    parent_scope_id TEXT REFERENCES hazo_scopes_l6(id),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    changed_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_hazo_scopes_l7_parent ON hazo_scopes_l7(parent_scope_id);

-- User scopes junction table
CREATE TABLE IF NOT EXISTS hazo_user_scopes (
    user_id TEXT NOT NULL REFERENCES hazo_users(id) ON DELETE CASCADE,
    scope_type TEXT NOT NULL,
    scope_id TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    changed_at TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (user_id, scope_type, scope_id)
);
CREATE INDEX IF NOT EXISTS idx_hazo_user_scopes_user ON hazo_user_scopes(user_id);
CREATE INDEX IF NOT EXISTS idx_hazo_user_scopes_scope ON hazo_user_scopes(scope_type, scope_id);

-- Scope labels table (custom labels per organization)
CREATE TABLE IF NOT EXISTS hazo_scope_labels (
    id TEXT PRIMARY KEY,
    org_id TEXT,
    scope_level INTEGER NOT NULL,
    label TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    changed_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_hazo_scope_labels_org ON hazo_scope_labels(org_id);

-- ============================================
-- hazo_chat Tables (v3.0.0 - Group-based Chat)
-- ============================================

-- Chat groups table (NEW in v3.0.0)
CREATE TABLE IF NOT EXISTS hazo_chat_group (
    id TEXT PRIMARY KEY,
    client_user_id TEXT NOT NULL REFERENCES hazo_users(id),
    name TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    changed_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_hazo_chat_group_client ON hazo_chat_group(client_user_id);

-- Chat group users junction table (NEW in v3.0.0)
CREATE TABLE IF NOT EXISTS hazo_chat_group_users (
    chat_group_id TEXT NOT NULL REFERENCES hazo_chat_group(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES hazo_users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('client', 'staff')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    changed_at TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (chat_group_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_hazo_chat_group_users_user ON hazo_chat_group_users(user_id);
CREATE INDEX IF NOT EXISTS idx_hazo_chat_group_users_group ON hazo_chat_group_users(chat_group_id);

-- Chat messages table (MODIFIED in v3.0.0: receiver_user_id -> chat_group_id)
CREATE TABLE IF NOT EXISTS hazo_chat (
    id TEXT PRIMARY KEY,
    reference_id TEXT NOT NULL,
    reference_type TEXT DEFAULT 'chat',
    sender_user_id TEXT NOT NULL REFERENCES hazo_users(id),
    chat_group_id TEXT NOT NULL REFERENCES hazo_chat_group(id),
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
CREATE INDEX IF NOT EXISTS idx_hazo_chat_group ON hazo_chat(chat_group_id);
CREATE INDEX IF NOT EXISTS idx_hazo_chat_created ON hazo_chat(created_at DESC);
EOF

echo "Database initialized successfully!"
echo ""
echo "Verifying tables..."
sqlite3 "$DB_PATH" ".tables"
echo ""
echo "Expected tables:"
echo "  hazo_auth core: hazo_users, hazo_refresh_tokens, hazo_permissions, hazo_roles,"
echo "                  hazo_role_permissions, hazo_user_roles"
echo "  hazo_auth HRBAC: hazo_scopes_l1 through hazo_scopes_l7, hazo_user_scopes, hazo_scope_labels"
echo "  hazo_chat v3.0:  hazo_chat_group, hazo_chat_group_users, hazo_chat"







