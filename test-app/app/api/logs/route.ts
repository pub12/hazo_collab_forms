/**
 * API route for hazo_logs log viewer
 * Handles reading logs and receiving client-side log submissions
 */

import { createLogApiHandler } from 'hazo_logs/ui/server';

const handler = createLogApiHandler();

export const { GET, POST } = handler;
