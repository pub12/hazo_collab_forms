/**
 * Hook to check if unread chat messages exist for a given reference_id
 * Used to determine if a field has active unread chat conversations
 * Checks for messages where the current user is the receiver and read_at is null
 */

'use client';

import { useState, useEffect } from 'react';

export interface UseChatMessagesCheckOptions {
  /**
   * Reference ID to check for messages (typically field_data_id)
   */
  reference_id: string | null | undefined;
  
  /**
   * Reference type (typically empty string for form fields)
   */
  reference_type?: string;
  
  /**
   * Recipient user ID for the chat (used to determine the receiver)
   * Note: The current user should be the receiver for unread messages
   */
  recipient_user_id?: string;
  
  /**
   * Whether to enable the check (default: true)
   */
  enabled?: boolean;
  
  /**
   * Polling interval in milliseconds (default: 5000ms)
   * Set to 0 to disable polling
   */
  poll_interval?: number;
}

/**
 * Hook to check if unread chat messages exist for a given reference_id
 * Checks for messages where the current user is the receiver and read_at is null
 * @param options Configuration options
 * @returns Object with has_messages boolean and loading state
 */
export function use_chat_messages_check({
  reference_id,
  reference_type = '',
  recipient_user_id,
  enabled = true,
  poll_interval = 5000,
}: UseChatMessagesCheckOptions) {
  const [has_messages, set_has_messages] = useState(false);
  const [is_loading, set_is_loading] = useState(false);

  useEffect(() => {
    if (!enabled || !reference_id || !recipient_user_id) {
      set_has_messages(false);
      return;
    }

    /**
     * Check for unread messages by calling the chat API
     * The API should return messages where the current user is the receiver
     * We filter for messages where read_at is null (unread)
     */
    const check_messages = async () => {
      try {
        set_is_loading(true);
        const params = new URLSearchParams({
          receiver_user_id: recipient_user_id,
          reference_id,
          ...(reference_type && { reference_type }),
        });

        const response = await fetch(`/api/hazo_chat/messages?${params.toString()}`);
        
        if (response.ok) {
          const data = await response.json();
          // Check if messages array exists and has items
          // API returns { success: true, messages: [], current_user_id }
          const messages = data.messages || data;
          
          // Filter for unread messages only (read_at is null)
          // Only count messages where the current user is the receiver
          const unread_messages = Array.isArray(messages)
            ? messages.filter((msg) => {
                // Check if message is unread (read_at is null or undefined)
                const is_unread = msg.read_at === null || msg.read_at === undefined;
                return is_unread;
              })
            : [];
          
          const has_messages_result = unread_messages.length > 0;
          set_has_messages(has_messages_result);
        } else {
          set_has_messages(false);
        }
      } catch (error) {
        console.error('[use_chat_messages_check] Error checking messages:', error);
        set_has_messages(false);
      } finally {
        set_is_loading(false);
      }
    };

    // Initial check
    check_messages();

    // Set up polling if interval is greater than 0
    let interval_id: NodeJS.Timeout | null = null;
    if (poll_interval > 0) {
      interval_id = setInterval(check_messages, poll_interval);
    }

    return () => {
      if (interval_id) {
        clearInterval(interval_id);
      }
    };
  }, [reference_id, reference_type, recipient_user_id, enabled, poll_interval]);

  return { has_messages, is_loading };
}




