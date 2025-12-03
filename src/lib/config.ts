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

// Create a singleton instance of HazoConfig
let config_instance: HazoConfig | null = null;

/**
 * Get the HazoConfig instance, creating it if it doesn't exist
 * Looks for config file in the consuming application's root (process.cwd())
 * Falls back to package root if not found
 * @returns The HazoConfig instance
 */
function get_config_instance(): HazoConfig {
  if (!config_instance) {
    // First try to find config in the consuming app's root
    const app_root_config = path.resolve(process.cwd(), 'hazo_collab_forms_config.ini');
    // Fallback to package root (for development/testing)
    const package_root_config = path.resolve(__dirname, '../../hazo_collab_forms_config.ini');
    
    let config_path: string;
    if (existsSync(app_root_config)) {
      config_path = app_root_config;
    } else if (existsSync(package_root_config)) {
      config_path = package_root_config;
    } else {
      // Default to app root (will throw error if file doesn't exist, which is expected)
      config_path = app_root_config;
    }
    
    config_instance = new HazoConfig({
      filePath: config_path,
    });
  }
  return config_instance;
}

/**
 * Get configuration values from the config file
 * @param section - The section name in the config file
 * @param key - The key within the section
 * @returns The configuration value or undefined
 */
export function get_config(section: string, key: string): string | undefined {
  try {
    const config = get_config_instance();
    return config.get(section, key);
  } catch (error) {
    console.error('Error reading config:', error);
    return undefined;
  }
}

