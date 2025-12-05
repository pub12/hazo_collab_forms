/**
 * Configuration management using hazo_config
 * Reads from hazo_collab_forms_config.ini
 *
 * NOTE: This module is server-only and cannot be imported in client components
 */

import 'server-only';
import { HazoConfig } from 'hazo_config';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Config file name
const CONFIG_FILE_NAME = 'hazo_collab_forms_config.ini';

// Create a singleton instance of HazoConfig
let config_instance: HazoConfig | null = null;
let config_path_used: string | null = null;
let config_missing_warned = false;

/**
 * Get the HazoConfig instance, creating it if it doesn't exist
 * Looks for config file in the consuming application's root (process.cwd())
 * Falls back to package root if not found
 * @returns The HazoConfig instance or null if config file not found
 */
function get_config_instance(): HazoConfig | null {
  if (config_instance) {
    return config_instance;
  }

  // First try to find config in the consuming app's root
  const app_root_config = path.resolve(process.cwd(), CONFIG_FILE_NAME);
  // Fallback to package root (for development/testing)
  const package_root_config = path.resolve(__dirname, '../../', CONFIG_FILE_NAME);

  let config_path: string | null = null;

  if (existsSync(app_root_config)) {
    config_path = app_root_config;
  } else if (existsSync(package_root_config)) {
    config_path = package_root_config;
  }

  if (!config_path) {
    // Only warn once to avoid log spam
    if (!config_missing_warned) {
      config_missing_warned = true;
      console.warn(
        `[hazo_collab_forms] Config file not found. Searched locations:\n` +
        `  1. ${app_root_config}\n` +
        `  2. ${package_root_config}\n\n` +
        `To create a config file, copy the template:\n` +
        `  cp node_modules/hazo_collab_forms/templates/${CONFIG_FILE_NAME} ./\n\n` +
        `Or run: npx hazo-collab-forms-verify to check your setup.`
      );
    }
    return null;
  }

  config_path_used = config_path;
  config_instance = new HazoConfig({
    filePath: config_path,
  });

  return config_instance;
}

/**
 * Get configuration values from the config file
 * @param section - The section name in the config file
 * @param key - The key within the section
 * @returns The configuration value or undefined if not found or config file missing
 */
export function get_config(section: string, key: string): string | undefined {
  try {
    const config = get_config_instance();
    if (!config) {
      return undefined;
    }
    return config.get(section, key);
  } catch (error) {
    console.error(
      `[hazo_collab_forms] Error reading config [${section}].${key}:`,
      error instanceof Error ? error.message : error
    );
    return undefined;
  }
}

/**
 * Get the path to the config file currently in use
 * @returns The config file path or null if no config loaded
 */
export function get_config_path(): string | null {
  return config_path_used;
}

/**
 * Check if a config file has been loaded
 * @returns true if config file exists and was loaded
 */
export function has_config(): boolean {
  return get_config_instance() !== null;
}

