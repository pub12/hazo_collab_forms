/**
 * hazo_connect setup with admin UI enabled
 * This ensures the SQLite admin UI is enabled when using the singleton
 */

import { getHazoConnectSingleton } from 'hazo_connect/nextjs/setup';

/**
 * Get the hazo_connect singleton instance with admin UI enabled
 * This should be used instead of calling getHazoConnectSingleton() directly
 */
export function getHazoConnect() {
  return getHazoConnectSingleton({
    enableAdminUi: true,
    sqlitePath: process.env.HAZO_CONNECT_SQLITE_PATH || 
      '/Users/pubuduabayasiri/LocalDocuments/02.Nextjs/99.lib/hazo_collab_forms/test-app/data/hazo_auth.sqlite'
  });
}










