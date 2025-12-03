/**
 * Initialize default permissions and super user for hazo_auth
 * Reads from hazo_auth_config.ini and:
 * - Creates default permissions from application_permission_list_defaults
 * - Creates a default_super_user_role role with all permissions
 * - Assigns the role to the user specified in default_super_user_email
 */

import { HazoConfig } from 'hazo_config';
import Database from 'better-sqlite3';
import { randomUUID } from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get project root (test-app directory)
const project_root = path.resolve(__dirname, '..');

console.log('\n🐸 Initializing hazo_auth users, roles, and permissions\n');

// Load config
const config_path = path.join(project_root, 'hazo_auth_config.ini');
const config = new HazoConfig({ filePath: config_path });

// Get configuration values
const default_super_user_email = config.get('hazo_auth__initial_setup', 'default_super_user_email');
const application_permission_list_defaults = config.get('hazo_auth__user_management', 'application_permission_list_defaults') || '';

if (!default_super_user_email) {
  console.error('❌ Error: default_super_user_email not set in hazo_auth_config.ini');
  console.error('   Please set it in [hazo_auth__initial_setup] section');
  process.exit(1);
}

// Get database connection
const sqlite_path = config.get('hazo_connect', 'sqlite_path') || 
  path.join(project_root, 'data', 'hazo_auth.sqlite');

// Check if database file exists
if (!existsSync(sqlite_path)) {
  console.error(`❌ Error: Database file not found: ${sqlite_path}`);
  console.error('   Please run the database initialization script first:');
  console.error('   bash scripts/init-db.sh');
  process.exit(1);
}

const db = new Database(sqlite_path);

try {
  console.log(`📧 Super user email: ${default_super_user_email}`);
  console.log(`📁 Database: ${sqlite_path}\n`);

  // Step 1: Check if user exists
  console.log('1️⃣  Checking if user exists...');
  const user = db.prepare('SELECT id, email_address FROM hazo_users WHERE email_address = ?').get(default_super_user_email);
  
  if (!user) {
    console.error(`❌ Error: User with email ${default_super_user_email} does not exist.`);
    console.error('   Please register the user first at /hazo_auth/register');
    process.exit(1);
  }
  
  console.log(`   ✓ User found: ${user.email_address} (ID: ${user.id})\n`);

  // Step 2: Create default permissions from application_permission_list_defaults
  console.log('2️⃣  Creating default permissions...');
  const permissions_list = application_permission_list_defaults
    .split(',')
    .map(p => p.trim())
    .filter(p => p.length > 0);

  const permission_ids = [];

  if (permissions_list.length > 0) {
    for (const permission_name of permissions_list) {
      // Check if permission already exists
      let permission = db.prepare('SELECT id FROM hazo_permissions WHERE permission_name = ?').get(permission_name);
      
      if (!permission) {
        const permission_id = randomUUID();
        db.prepare(`
          INSERT INTO hazo_permissions (id, permission_name, description, created_at, changed_at)
          VALUES (?, ?, ?, datetime('now'), datetime('now'))
        `).run(permission_id, permission_name, `Default permission: ${permission_name}`);
        permission_ids.push(permission_id);
        console.log(`   ✓ Created permission: ${permission_name}`);
      } else {
        permission_ids.push(permission.id);
        console.log(`   ⊘ Permission already exists: ${permission_name}`);
      }
    }
  } else {
    console.log('   ⊘ No permissions specified in application_permission_list_defaults');
  }
  console.log('');

  // Step 3: Get all permissions (both newly created and existing)
  console.log('3️⃣  Gathering all permissions for super user role...');
  const all_permissions = db.prepare('SELECT id FROM hazo_permissions').all();
  const all_permission_ids = all_permissions.map(p => p.id);

  if (all_permission_ids.length === 0) {
    console.log('   ⚠️  Warning: No permissions found in database');
    console.log('   The super user role will have no permissions\n');
  } else {
    console.log(`   ✓ Found ${all_permission_ids.length} permission(s)\n`);
  }

  // Step 4: Create default_super_user_role or get existing
  console.log('4️⃣  Creating/updating default_super_user_role...');
  const role_name = 'default_super_user_role';
  
  let role = db.prepare('SELECT id FROM hazo_roles WHERE role_name = ?').get(role_name);
  
  if (!role) {
    const role_id = randomUUID();
    db.prepare(`
      INSERT INTO hazo_roles (id, role_name, created_at, changed_at)
      VALUES (?, ?, datetime('now'), datetime('now'))
    `).run(role_id, role_name);
    role = { id: role_id };
    console.log(`   ✓ Created role: ${role_name}`);
  } else {
    console.log(`   ⊘ Role already exists: ${role_name}`);
  }
  console.log('');

  // Step 5: Assign all permissions to the role
  console.log('5️⃣  Assigning permissions to role...');
  let permissions_assigned = 0;
  let permissions_skipped = 0;

  for (const permission_id of all_permission_ids) {
    // Check if role_permission already exists
    const existing = db.prepare(`
      SELECT role_id FROM hazo_role_permissions 
      WHERE role_id = ? AND permission_id = ?
    `).get(role.id, permission_id);

    if (!existing) {
      db.prepare(`
        INSERT INTO hazo_role_permissions (role_id, permission_id, created_at, changed_at)
        VALUES (?, ?, datetime('now'), datetime('now'))
      `).run(role.id, permission_id);
      permissions_assigned++;
    } else {
      permissions_skipped++;
    }
  }

  console.log(`   ✓ Assigned ${permissions_assigned} new permission(s)`);
  if (permissions_skipped > 0) {
    console.log(`   ⊘ Skipped ${permissions_skipped} existing permission(s)`);
  }
  console.log('');

  // Step 6: Assign role to user
  console.log('6️⃣  Assigning role to user...');
  const existing_user_role = db.prepare(`
    SELECT user_id FROM hazo_user_roles 
    WHERE user_id = ? AND role_id = ?
  `).get(user.id, role.id);

  if (!existing_user_role) {
    db.prepare(`
      INSERT INTO hazo_user_roles (user_id, role_id, created_at, changed_at)
      VALUES (?, ?, datetime('now'), datetime('now'))
    `).run(user.id, role.id);
    console.log(`   ✓ Assigned role ${role_name} to ${default_super_user_email}`);
  } else {
    console.log(`   ⊘ User already has role ${role_name}`);
  }
  console.log('');

  console.log('='.repeat(50));
  console.log('✅ Initialization complete!');
  console.log('');
  console.log(`Super user: ${default_super_user_email}`);
  console.log(`Role: ${role_name}`);
  console.log(`Permissions: ${all_permission_ids.length}`);
  console.log('');
  console.log('🦊\n');

} catch (error) {
  console.error('\n❌ Error during initialization:');
  console.error(error);
  process.exit(1);
}

