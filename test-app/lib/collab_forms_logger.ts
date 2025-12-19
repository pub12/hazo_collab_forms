'use client';

/**
 * Logger configuration for hazo_collab_forms in test app
 * Creates a client-side logger instance for the collab forms package
 */

import { createClientLogger } from 'hazo_logs/ui';

/**
 * Client-side logger for hazo_collab_forms components
 * Configured to send logs to the API and output to console
 */
export const collab_forms_logger = createClientLogger({
  packageName: 'hazo_collab_forms',
  apiBasePath: '/api/logs',
  consoleOutput: true,
  minLevel: 'debug',
});
