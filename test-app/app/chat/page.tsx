/**
 * Chat page
 * Embedded chat interface using hazo_chat package v3.0.0+
 * Uses group-based chat architecture
 */

'use client';

import { HazoChat } from 'hazo_chat';

/**
 * Chat page component
 * Displays embedded chat interface with specified chat group
 */
export default function ChatPage() {
  // Chat group ID - in production this would come from user context or API
  const chat_group_id = '00000000-0000-0000-0000-000000000001';

  return (
    <div className="cls_chat_page_container h-full w-full">
      <HazoChat
        chat_group_id={chat_group_id}
        title="Chat"
        subtitle="Group chat"
      />
    </div>
  );
}

