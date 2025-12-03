/**
 * Shared utility hook for collaboration form chat functionality
 * Provides a reusable handler for chat icon clicks that displays field value and context
 */

'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';

/**
 * Context information for the chat handler
 */
export interface CollabChatContext {
  field_id?: string;
  field_name?: string;
  [key: string]: unknown;
}

/**
 * Hook to create a chat handler function for collaboration form fields
 * @param field_id - Optional field identifier
 * @param field_name - Optional field name/label
 * @param additional_context - Optional additional context data
 * @returns Handler function that accepts field value and shows toast
 */
export function use_collab_chat(
  field_id?: string,
  field_name?: string,
  additional_context?: Record<string, unknown>
) {
  /**
   * Handler function that displays field value and context in a toast
   * @param field_value - The current value of the field
   */
  const handle_chat_click = useCallback(
    (field_value: string) => {
      // Build context message
      const context_parts: string[] = [];
      
      if (field_name) {
        context_parts.push(`Field: ${field_name}`);
      }
      
      if (field_id) {
        context_parts.push(`ID: ${field_id}`);
      }
      
      // Add any additional context
      if (additional_context && Object.keys(additional_context).length > 0) {
        const context_str = Object.entries(additional_context)
          .map(([key, value]) => `${key}: ${String(value)}`)
          .join(', ');
        if (context_str) {
          context_parts.push(context_str);
        }
      }
      
      const context_message = context_parts.length > 0 
        ? context_parts.join(' | ')
        : 'Field value';
      
      // Show toast with field value and context
      toast.info(field_value || '(empty)', {
        description: context_message,
        duration: 5000,
      });
    },
    [field_id, field_name, additional_context]
  );

  return handle_chat_click;
}




