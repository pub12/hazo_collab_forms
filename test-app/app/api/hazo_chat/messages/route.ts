/**
 * API route for chat message operations
 * Uses the exportable handler from hazo_chat
 */

import { createMessagesHandler } from 'hazo_chat/api';
import { getHazoConnectSingleton } from 'hazo_connect/nextjs/setup';

export const dynamic = 'force-dynamic';

const { GET, POST } = createMessagesHandler({
  getHazoConnect: () => getHazoConnectSingleton()
});

export { GET, POST };




