/**
 * Type declarations for hazo_chat module
 * Temporary workaround until hazo_chat package includes proper type definitions
 */

declare module 'hazo_chat' {
  import type { ReactNode } from 'react';

  export interface ReferenceItem {
    id: string;
    type: 'document' | 'field' | 'url';
    scope: 'chat' | 'field';
    name: string;
    url: string;
    mime_type?: string;
    file_size?: number;
    message_id?: string;
  }

  export interface HazoChatProps {
    receiver_user_id: string;
    reference_id?: string;
    reference_type?: string;
    api_base_url?: string;
    timezone?: string;
    title?: string;
    subtitle?: string;
    on_close?: () => void;
    realtime_mode?: 'polling' | 'manual';
    polling_interval?: number;
    messages_per_page?: number;
    additional_references?: ReferenceItem[];
    show_sidebar_toggle?: boolean;
    show_delete_button?: boolean;
    bubble_radius?: 'default' | 'full';
    className?: string;
  }

  export function HazoChat(props: HazoChatProps): ReactNode;
}
