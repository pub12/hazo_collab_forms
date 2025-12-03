/**
 * Chat page
 * Embedded chat interface using hazo_chat package
 */

'use client';

import { HazoChat } from 'hazo_chat';

/**
 * Chat page component
 * Displays embedded chat interface with specified recipient
 */
export default function ChatPage() {
  const recipient_id = '2775a808-88d9-4e43-aae9-47420ae003dc';

  return (
    <div className="cls_chat_page_container h-full w-full">
      <HazoChat 
        receiver_user_id={recipient_id}
        title="Chat"
        subtitle="Chat with recipient"
      />
    </div>
  );
}

