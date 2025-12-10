/**
 * Shared base functionality for collaboration form components
 * Provides common utilities and rendering logic for input and textarea fields
 */

'use client';

import React from 'react';
import { IoChatbox, IoDocumentText } from 'react-icons/io5';
import { cn } from '../utils/cn.js';
import { DataOkCheckbox } from './data_ok_checkbox.js';
import { CollabFormFileUpload } from './collab_form_file_upload.js';
import { HazoChat } from 'hazo_chat';
import type { ReferenceItem } from 'hazo_chat';

/**
 * Common props shared by all collaboration form field components
 */
export interface CollabFormFieldBaseProps {
  /**
   * Label text for the field
   */
  label: string;
  
  /**
   * Error message to display below the field
   */
  error?: string;
  
  /**
   * Field identifier for chat context
   */
  field_id?: string;
  
  /**
   * Field data ID - separate identifier for data storage/retrieval
   */
  field_data_id?: string;
  
  /**
   * Field name for chat context
   */
  field_name?: string;
  
  /**
   * Callback when chat icon is clicked
   * Called with field_data_id and field_name
   */
  on_chat_click?: (field_data_id: string, field_name?: string) => void;
  
  /**
   * Whether this field has chat messages
   * When true, adds a red border to indicate active chat
   */
  has_chat_messages?: boolean;
  
  /**
   * Whether this field's chat is currently active/open
   * When true, adds a grey background to the field container
   */
  is_chat_active?: boolean;
  
  /**
   * Background color class to apply when chat is active
   * Default: "bg-muted"
   */
  chat_background_color?: string;
  
  /**
   * Whether this field has the default value for the data_ok checkbox
   * When true, adds a visual indicator (e.g., border) to show the field is in its default state
   */
  is_data_ok_default?: boolean;
  
  /**
   * Data OK checkbox state
   * If provided, controls the data OK checkbox state externally
   */
  data_ok_checked?: boolean;
  
  /**
   * Callback when data OK checkbox state changes
   */
  on_data_ok_change?: (checked: boolean) => void;
  
  /**
   * Custom className for the container
   */
  container_class_name?: string;
  
  /**
   * Custom className for the label
   */
  label_class_name?: string;
  
  /**
   * Custom className for the field wrapper
   */
  field_wrapper_class_name?: string;
  
  /**
   * Custom className for the error message
   */
  error_class_name?: string;
  
  /**
   * HTML id attribute
   */
  id?: string;

  /**
   * HazoChat group ID (v3.0.0+)
   * Required for chat to work, maps to HazoChat chat_group_id
   * Identifies the chat group for group-based messaging
   */
  hazo_chat_group_id?: string;

  /**
   * HazoChat reference ID
   * Maps to HazoChat reference_id, defaults to field_data_id
   */
  hazo_chat_reference_id?: string;

  /**
   * HazoChat reference type
   * Maps to HazoChat reference_type, default: 'field'
   */
  hazo_chat_reference_type?: string;

  /**
   * HazoChat API base URL
   * Maps to HazoChat api_base_url
   */
  hazo_chat_api_base_url?: string;

  /**
   * HazoChat timezone
   * Maps to HazoChat timezone
   */
  hazo_chat_timezone?: string;

  /**
   * HazoChat title
   * Maps to HazoChat title, defaults to field_name or label
   */
  hazo_chat_title?: string;

  /**
   * HazoChat subtitle
   * Maps to HazoChat subtitle
   */
  hazo_chat_subtitle?: string;

  /**
   * HazoChat realtime mode
   * Maps to HazoChat realtime_mode: 'polling' (automatic) or 'manual' (refresh only)
   */
  hazo_chat_realtime_mode?: 'polling' | 'manual';

  /**
   * HazoChat polling interval
   * Maps to HazoChat polling_interval (milliseconds, only used when realtime_mode = 'polling')
   */
  hazo_chat_polling_interval?: number;

  /**
   * HazoChat messages per page
   * Maps to HazoChat messages_per_page
   */
  hazo_chat_messages_per_page?: number;

  /**
   * HazoChat className
   * Maps to HazoChat className
   */
  hazo_chat_class_name?: string;

  /**
   * HazoChat on close callback
   * Maps to HazoChat on_close
   */
  hazo_chat_on_close?: () => void;

  /**
   * Whether HazoChat is open
   * Controls chat visibility externally
   */
  hazo_chat_is_open?: boolean;

  /**
   * HazoChat on open change callback
   * Called when chat open state changes
   */
  hazo_chat_on_open_change?: (is_open: boolean) => void;

  /**
   * HazoChat show sidebar toggle
   * Maps to HazoChat show_sidebar_toggle: Show/hide the hamburger menu button
   * Default: false
   */
  hazo_chat_show_sidebar_toggle?: boolean;

  /**
   * HazoChat show delete button
   * Maps to HazoChat show_delete_button: Show/hide delete button on chat bubbles
   * Default: true
   */
  hazo_chat_show_delete_button?: boolean;

  /**
   * HazoChat bubble radius
   * Maps to HazoChat bubble_radius: Bubble border radius style
   * 'default' (rounded with tail) or 'full' (fully round)
   * Default: 'default'
   */
  hazo_chat_bubble_radius?: 'default' | 'full';

  /**
   * Whether to disable the data OK checkbox
   * When true, the data OK checkbox will not be rendered
   * Useful when data OK is handled at a group level
   */
  disable_data_ok?: boolean;

  /**
   * Whether to disable the chat icon
   * When true, the chat icon will not be rendered
   * Useful when chat is handled at a group level
   */
  disable_chat?: boolean;

  /**
   * Whether the data OK checkbox is editable (clickable)
   * When false, the checkbox is disabled.
   * Default: false
   */
  data_ok_editable?: boolean;

  /**
   * Custom className for field width
   * Used to control the width of the field container
   */
  field_width_class_name?: string;

  /**
   * Whether the field is required
   * When true, displays required indicator on label
   */
  required?: boolean;

  /**
   * Multi-state radio configuration
   * If provided, displays a MultiStateRadio component next to the chat icon
   */
  multi_state_radio?: {
    /**
     * Array of 3 icon options for the multi-state radio
     * Each item should have label, value, and icon names
     */
    data: Array<{
      label: string;
      value: string;
      icon_selected?: string;
      icon_unselected?: string;
    }>;
    /**
     * Current selected value
     */
    value: string;
    /**
     * Callback when selection changes
     */
    onChange: (value: string) => void;
    /**
     * Icon set to use (e.g., 'fa', 'md', 'io5')
     * Default: 'io5'
     */
    icon_set?: string;
    /**
     * Selection mode: 'single' or 'multi'
     * Default: 'single'
     */
    selection?: 'single' | 'multi';
    /**
     * Background color for the buttons
     * Can be a Tailwind CSS class name (e.g., "bg-red-100") or a hex color (e.g., "#fee2e2")
     * Default: "bg-red-100"
     */
    bgcolor?: string;
    /**
     * Foreground/icon color for the buttons
     * Can be a Tailwind CSS class name (e.g., "text-red-600") or a hex color (e.g., "#dc2626")
     * Default: "text-red-600"
     */
    fgcolor?: string;
  };

  /**
   * File upload configuration
   */
  /**
   * Whether to enable file upload functionality
   * When true, displays a Files accordion with upload capabilities
   * Default: false
   */
  accept_files?: boolean;

  /**
   * Server directory path where files should be saved
   * Required if accept_files is true
   */
  files_dir?: string;

  /**
   * Maximum file size in bytes per file
   * If not specified, no size limit is enforced
   */
  max_size?: number;

  /**
   * Minimum number of files required
   * If not specified, no minimum is enforced
   */
  min_files?: number;

  /**
   * Maximum number of files allowed
   * Default: 10
   */
  max_files?: number;

  /**
   * File type accept attribute (e.g., "image/*", ".pdf,.doc")
   * Follows HTML input accept attribute format
   */
  file_accept?: string;

  /**
   * Callback function called after a file is successfully uploaded
   * Receives file data and component reference
   */
  file_processor?: (
    file_data: FileData,
    component_ref: React.RefObject<any>
  ) => Promise<void> | void;

  /**
   * Controlled files state
   * When provided, component is controlled and uses this array
   * When not provided, component manages files internally
   */
  files?: FileData[];

  /**
   * Callback when files change
   * Called with the updated files array
   */
  on_files_change?: (files: FileData[]) => void;

  /**
   * Whether to enable the notes feature for this field
   * When true, displays a notes icon next to the chat icon
   * Default: false
   */
  enable_notes?: boolean;

  /**
   * Whether to disable the notes icon
   * When true, the notes icon will not be rendered even if enable_notes is true
   * Useful when notes are handled at a group level
   */
  disable_notes?: boolean;

  /**
   * Array of existing notes for this field
   * Each note contains user info, timestamp, and note content
   */
  notes?: NoteEntry[];

  /**
   * Callback when notes array changes
   * Called with the updated notes array after adding a new note
   */
  on_notes_change?: (notes: NoteEntry[]) => void;

  /**
   * Whether this field has any notes
   * When true, adds visual indicator (amber styling on notes icon)
   */
  has_notes?: boolean;

  /**
   * Whether the notes panel is currently active/open
   * When true, provides visual feedback (optional, for external control)
   */
  is_notes_active?: boolean;

  /**
   * Current user information for creating new notes
   * Format: { name: string; email: string }
   * If not provided, will attempt to fetch from /api/hazo_auth/me
   */
  current_user?: {
    name: string;
    email: string;
  };

  /**
   * Reference value to display in a tag below the field input
   * If provided, displays in format "reference_label: reference_value" or just "reference_value"
   */
  reference_value?: string;

  /**
   * Reference label to display in a tag below the field input
   * If provided alone, displays just "reference_label"
   * If provided with reference_value, displays "reference_label: reference_value"
   */
  reference_label?: string;

  /**
   * Background color class for the reference tag
   * Default: "bg-muted"
   */
  reference_tag_background_color?: string;
}

/**
 * File data structure for uploaded files
 */
export interface FileData {
  /**
   * Server path where file is saved
   */
  file_path: string;

  /**
   * Original filename
   */
  file_name: string;

  /**
   * File size in bytes
   */
  file_size: number;

  /**
   * MIME type
   */
  file_type: string;

  /**
   * Unique identifier for the file
   */
  file_id: string;

  /**
   * Upload timestamp
   */
  uploaded_at: Date;
}

/**
 * Single note entry structure for field notes
 */
export interface NoteEntry {
  /**
   * User identifier in "Name <email>" format
   */
  user: string;

  /**
   * ISO timestamp when the note was created
   */
  timestamp: string;

  /**
   * The note content
   */
  notes: string;
}

/**
 * Convert FileData array to ReferenceItem array for HazoChat
 */
function convert_files_to_references(files: FileData[]): ReferenceItem[] {
  return files.map((file) => {
    // Determine reference type from file type
    let reference_type: 'document' | 'field' | 'url' = 'document';
    const mime_type = file.file_type.toLowerCase();
    if (mime_type.startsWith('image/')) {
      reference_type = 'document';
    } else if (mime_type === 'application/pdf' || mime_type.includes('document') || mime_type.includes('text')) {
      reference_type = 'document';
    }

    // Construct file URL
    const file_url = file.file_path.startsWith('/')
      ? file.file_path
      : `/api/collab-forms/files/${encodeURIComponent(file.file_path)}`;

    return {
      id: file.file_id,
      type: reference_type,
      scope: 'field',
      name: file.file_name,
      url: file_url,
      mime_type: file.file_type,
    };
  });
}

/**
 * Hook for common collaboration form field functionality
 */
export function use_collab_form_field({
  label,
  field_id,
  id,
  field_data_id,
  field_name,
  on_chat_click,
  hazo_chat_group_id,
  hazo_chat_on_open_change,
  hazo_chat_is_open,
  hazo_chat_on_close,
}: Pick<
  CollabFormFieldBaseProps,
  | 'label'
  | 'field_id'
  | 'id'
  | 'field_data_id'
  | 'field_name'
  | 'on_chat_click'
  | 'hazo_chat_group_id'
  | 'hazo_chat_on_open_change'
  | 'hazo_chat_is_open'
  | 'hazo_chat_on_close'
>) {
  // Generate field ID if not provided
  const field_id_final = id || field_id || `collab-field-${label.toLowerCase().replace(/\s+/g, '-')}`;

  // Internal state for chat open/close (if not controlled externally)
  const [internal_chat_is_open, set_internal_chat_is_open] = React.useState(false);

  // Use controlled value if provided, otherwise use internal state
  const chat_is_open = hazo_chat_is_open !== undefined ? hazo_chat_is_open : internal_chat_is_open;
  const is_chat_controlled = hazo_chat_is_open !== undefined;

  // Get chat group ID
  const chat_group_id = hazo_chat_group_id;

  // Chat is disabled if no chat_group_id is available (unless on_chat_click is provided as fallback)
  const is_chat_disabled = !chat_group_id && !on_chat_click;

  /**
   * Handle chat icon click - trigger callback or open chat
   */
  const handle_chat_icon_click = React.useCallback(() => {
    // If custom on_chat_click is provided, use it (existing behavior)
    if (field_data_id && on_chat_click) {
      on_chat_click(field_data_id, field_name || label);
      return;
    }

    // If hazo_chat_group_id is provided, open chat internally
    if (chat_group_id) {
      const new_open_state = !chat_is_open;
      if (!is_chat_controlled) {
        set_internal_chat_is_open(new_open_state);
      }
      if (hazo_chat_on_open_change) {
        hazo_chat_on_open_change(new_open_state);
      }
    }
  }, [
    field_data_id,
    field_name,
    label,
    on_chat_click,
    chat_group_id,
    chat_is_open,
    is_chat_controlled,
    hazo_chat_on_open_change,
  ]);

  /**
   * Handle chat close - called when close button is clicked in HazoChat
   */
  const handle_chat_close = React.useCallback(() => {
    // Update internal state if not controlled
    if (!is_chat_controlled) {
      set_internal_chat_is_open(false);
    }
    // Call on_close callback if provided
    if (hazo_chat_on_close) {
      hazo_chat_on_close();
    }
    // Call on_open_change callback if provided
    if (hazo_chat_on_open_change) {
      hazo_chat_on_open_change(false);
    }
  }, [hazo_chat_on_close, hazo_chat_on_open_change, is_chat_controlled]);

  return {
    field_id_final,
    handle_chat_icon_click,
    handle_chat_close,
    chat_is_open,
    is_chat_disabled,
    chat_group_id,
    set_internal_chat_is_open,
  };
}

/**
 * Render the container wrapper with red border for chat messages and grey background when chat is active
 */
export function CollabFormFieldContainer({
  has_chat_messages,
  is_chat_active,
  chat_background_color = 'bg-muted',
  is_data_ok_default,
  container_class_name,
  children,
  // Chat-related props
  hazo_chat_is_open,
  hazo_chat_group_id,
  hazo_chat_reference_id,
  hazo_chat_reference_type,
  hazo_chat_api_base_url,
  hazo_chat_timezone,
  hazo_chat_title,
  hazo_chat_subtitle,
  hazo_chat_realtime_mode,
  hazo_chat_polling_interval,
  hazo_chat_messages_per_page,
  hazo_chat_class_name,
  hazo_chat_on_close,
  hazo_chat_show_sidebar_toggle,
  hazo_chat_show_delete_button,
  hazo_chat_bubble_radius,
  field_data_id,
  field_name,
  label,
  files,
}: Pick<
  CollabFormFieldBaseProps,
  | 'has_chat_messages'
  | 'is_chat_active'
  | 'chat_background_color'
  | 'is_data_ok_default'
  | 'container_class_name'
  | 'hazo_chat_is_open'
  | 'hazo_chat_group_id'
  | 'hazo_chat_reference_id'
  | 'hazo_chat_reference_type'
  | 'hazo_chat_api_base_url'
  | 'hazo_chat_timezone'
  | 'hazo_chat_title'
  | 'hazo_chat_subtitle'
  | 'hazo_chat_realtime_mode'
  | 'hazo_chat_polling_interval'
  | 'hazo_chat_messages_per_page'
  | 'hazo_chat_class_name'
  | 'hazo_chat_on_close'
  | 'hazo_chat_show_sidebar_toggle'
  | 'hazo_chat_show_delete_button'
  | 'hazo_chat_bubble_radius'
  | 'field_data_id'
  | 'field_name'
  | 'label'
  | 'files'
> & {
  children: React.ReactNode;
}) {
  // Get chat group ID
  const chat_group_id = hazo_chat_group_id;

  // Determine if chat should be shown (hazo_chat_is_open is passed from the hook)
  const show_chat = hazo_chat_is_open && chat_group_id;

  // Auto-determine is_chat_active from hazo_chat_is_open if not explicitly provided
  const is_chat_active_final = is_chat_active !== undefined ? is_chat_active : hazo_chat_is_open;

  // Convert files to references
  const additional_references = files ? convert_files_to_references(files) : undefined;

  // Determine chat props
  const chat_reference_id = hazo_chat_reference_id || field_data_id || '';
  const chat_reference_type = hazo_chat_reference_type || 'field';
  const chat_title = hazo_chat_title || field_name || label;
  const chat_subtitle = hazo_chat_subtitle || `Discussing ${field_name || label}`;

  // Container content
  const container_content = (
    <div
      className={cn(
        'cls_collab_field_container space-y-2 rounded-md p-2 transition-colors',
        has_chat_messages && 'border-2 border-destructive',
        is_chat_active_final && chat_background_color,
        is_data_ok_default && 'border border-primary/30',
        container_class_name
      )}
    >
      {children}
    </div>
  );

  // If chat is open, wrap in flex layout
  if (show_chat) {
    return (
      <div className="cls_collab_field_with_chat flex items-start gap-4">
        <div className="cls_collab_field_content flex-1 min-w-0">{container_content}</div>
        <div className="cls_collab_chat_wrapper w-96 flex-shrink-0">
          <div
            className={cn(
              'cls_collab_chat_card flex flex-col min-h-0 rounded-md',
              chat_background_color
            )}
            style={{ height: '400px' }}
          >
            <div className="cls_collab_chat_content flex-1 flex flex-col min-h-0">
              <div className="cls_collab_chat_inner flex-1 min-h-0 w-full">
                <HazoChat
                  chat_group_id={chat_group_id}
                  reference_id={chat_reference_id}
                  reference_type={chat_reference_type}
                  api_base_url={hazo_chat_api_base_url}
                  timezone={hazo_chat_timezone}
                  title={chat_title}
                  subtitle={chat_subtitle}
                  on_close={hazo_chat_on_close}
                  realtime_mode={hazo_chat_realtime_mode}
                  polling_interval={hazo_chat_polling_interval}
                  messages_per_page={hazo_chat_messages_per_page}
                  show_sidebar_toggle={hazo_chat_show_sidebar_toggle}
                  show_delete_button={hazo_chat_show_delete_button}
                  bubble_radius={hazo_chat_bubble_radius}
                  className={cn('h-full w-full', hazo_chat_class_name)}
                  additional_references={additional_references}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, just return the container
  return container_content;
}

/**
 * Render the field label
 */
export function CollabFormFieldLabel({
  field_id_final,
  label,
  label_class_name,
  required,
}: {
  field_id_final: string;
  label: string;
  label_class_name?: string;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={field_id_final}
      className={cn(
        'cls_collab_field_label text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        label_class_name
      )}
    >
      {label}
      {required && <span className="text-destructive ml-1">*</span>}
    </label>
  );
}

/**
 * Render the chat icon button
 */
export function CollabFormChatIcon({
  label,
  error,
  on_click,
  multi_state_radio,
  has_chat_messages,
  disabled,
  button_disabled,
}: {
  label: string;
  error?: string;
  on_click: () => void;
  multi_state_radio?: CollabFormFieldBaseProps['multi_state_radio'];
  has_chat_messages?: boolean;
  disabled?: boolean;
  button_disabled?: boolean;
}) {
  // Don't render if explicitly disabled (hide completely)
  if (disabled) {
    return null;
  }

  // Button is disabled if button_disabled is true (but icon is still visible)
  const is_button_disabled = button_disabled === true;

  return (
    <div className="cls_collab_chat_icon_wrapper flex items-center gap-2">
      <button
        type="button"
        onClick={on_click}
        disabled={is_button_disabled}
        className={cn(
          'cls_collab_chat_icon flex h-9 w-9 items-center justify-center rounded-md border border-input bg-transparent text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-destructive',
          has_chat_messages && 'bg-destructive/10 border-destructive'
        )}
        aria-label={`Chat about ${label}`}
        title={is_button_disabled ? 'Chat unavailable (chat group not configured)' : `Chat about ${label}`}
      >
        <IoChatbox className={cn("h-5 w-5", has_chat_messages && "text-destructive")} />
      </button>
    </div>
  );
}

/**
 * Render the error message
 */
export function CollabFormFieldError({
  field_id_final,
  error,
  error_class_name,
}: {
  field_id_final: string;
  error?: string;
  error_class_name?: string;
}) {
  if (!error) return null;

  return (
    <p
      id={`${field_id_final}-error`}
      className={cn(
        'cls_collab_field_error text-sm text-destructive',
        error_class_name
      )}
      role="alert"
    >
      {error}
    </p>
  );
}

/**
 * Render the reference tag below the field input
 * Displays reference_value and/or reference_label in a subdued, tag-like appearance
 */
export function CollabFormFieldReferenceTag({
  reference_value,
  reference_label,
  reference_tag_background_color = 'bg-muted',
}: {
  reference_value?: string;
  reference_label?: string;
  reference_tag_background_color?: string;
}) {
  // Don't render if neither value is provided
  if (!reference_value && !reference_label) {
    return null;
  }

  // Determine display text
  let display_text: string;
  if (reference_label && reference_value) {
    display_text = `${reference_label}: ${reference_value}`;
  } else {
    display_text = reference_label || reference_value!;
  }

  return (
    <div
      className={cn(
        'cls_collab_field_reference_tag inline-flex items-center px-2 py-0.5 rounded text-xs text-muted-foreground',
        reference_tag_background_color
      )}
    >
      {display_text}
    </div>
  );
}

/**
 * Render the data OK checkbox
 * Provides consistent data OK checkbox functionality across all form fields
 */
export function CollabFormDataOkCheckbox({
  label,
  data_ok_checked: controlled_data_ok_checked,
  on_data_ok_change,
  disabled,
  editable = false,
}: {
  label: string;
  data_ok_checked?: boolean;
  on_data_ok_change?: (checked: boolean) => void;
  disabled?: boolean;
  editable?: boolean;
}) {
  if (disabled) {
    return null;
  }

  // Internal state for data OK checkbox (uncontrolled mode)
  // Always initialize to false for consistent server/client rendering
  const [internal_data_ok_checked, set_internal_data_ok_checked] = React.useState(false);

  // Use controlled value if provided, otherwise use internal state
  // Always default to false for consistent server/client rendering
  const data_ok_checked = controlled_data_ok_checked !== undefined 
    ? controlled_data_ok_checked 
    : internal_data_ok_checked;
  const is_controlled = controlled_data_ok_checked !== undefined;

  /**
   * Handle data OK checkbox change
   */
  const handle_data_ok_change = (checked: boolean) => {
    if (!is_controlled) {
      set_internal_data_ok_checked(checked);
    }
    if (on_data_ok_change) {
      on_data_ok_change(checked);
    }
  };

  return (
    <DataOkCheckbox
      checked={data_ok_checked}
      onChange={handle_data_ok_change}
      aria-label={`Data OK for ${label}`}
      disabled={!editable}
    />
  );
}

/**
 * Render the file upload component
 * Provides file upload functionality for collaboration form fields
 */
export function CollabFormFileUploadSection({
  field_id_final,
  accept_files,
  files_dir,
  max_size,
  min_files,
  max_files,
  file_accept,
  file_processor,
  files,
  on_files_change,
  component_ref,
}: Pick<
  CollabFormFieldBaseProps,
  | 'accept_files'
  | 'files_dir'
  | 'max_size'
  | 'min_files'
  | 'max_files'
  | 'file_accept'
  | 'file_processor'
  | 'files'
  | 'on_files_change'
> & {
  field_id_final: string;
  component_ref?: React.RefObject<any>;
}) {
  // Always render wrapper div to maintain consistent DOM structure
  // This prevents hydration mismatches when accept_files changes between server and client
  return (
    <div className="cls_collab_file_upload_section_wrapper" suppressHydrationWarning>
      {accept_files ? (
        <CollabFormFileUpload
          field_id_final={field_id_final}
          accept_files={accept_files}
          files_dir={files_dir}
          max_size={max_size}
          min_files={min_files}
          max_files={max_files}
          file_accept={file_accept}
          file_processor={file_processor}
          files={files}
          on_files_change={on_files_change}
          component_ref={component_ref}
        />
      ) : null}
    </div>
  );
}

/**
 * Notes panel content displayed in the popover
 * Shows existing notes (read-only) and textarea for new note
 * Styled as a sticky note with yellow background
 */
function CollabFormNotesPanel({
  notes,
  new_note_text,
  on_new_note_change,
  effective_user,
  field_label,
  ProfileStampComponent,
}: {
  notes: NoteEntry[];
  new_note_text: string;
  on_new_note_change: (text: string) => void;
  effective_user: { name: string; email: string; profile_image?: string } | null;
  field_label: string;
  ProfileStampComponent?: React.ComponentType<any> | null;
}) {
  /**
   * Format timestamp for display
   */
  const format_timestamp = (iso_timestamp: string): string => {
    try {
      const date = new Date(iso_timestamp);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso_timestamp;
    }
  };

  /**
   * Parse user string to extract name and email
   */
  const parse_user = (user_string: string): { name: string; email: string } => {
    const match = user_string.match(/^(.+)\s+<(.+)>$/);
    if (match) {
      return { name: match[1], email: match[2] };
    }
    return { name: user_string, email: '' };
  };

  /**
   * Get initials from name for avatar
   */
  const get_initials = (name: string): string => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  /**
   * Generate consistent hex color from name for avatar background
   */
  const get_avatar_color = (name: string): string => {
    const colors = [
      '#ef4444', '#f97316', '#d97706', '#22c55e',
      '#14b8a6', '#3b82f6', '#6366f1', '#a855f7',
      '#ec4899', '#f43f5e'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  /**
   * Render avatar - uses ProfileStamp if available, otherwise falls back to initials
   */
  const render_avatar = (name: string, timestamp?: string) => {
    if (ProfileStampComponent) {
      const custom_fields = timestamp ? [{ label: 'Posted', value: format_timestamp(timestamp) }] : [];
      return (
        <ProfileStampComponent
          size="sm"
          show_name={false}
          show_email={false}
          custom_fields={custom_fields}
        />
      );
    }
    // Fallback to initials avatar
    return (
      <span
        className="cls_collab_note_avatar"
        style={{
          backgroundColor: get_avatar_color(name),
          color: '#ffffff',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '11px',
          fontWeight: 'bold',
          flexShrink: 0,
        }}
        title={name}
      >
        {get_initials(name)}
      </span>
    );
  };

  return (
    <div className="cls_collab_notes_panel_content flex flex-col bg-yellow-100 max-h-[400px]">
      {/* Header - sticky note style */}
      <div className="cls_collab_notes_panel_header px-4 py-3 border-b border-yellow-300 bg-yellow-200 flex-shrink-0">
        <h4 className="font-medium text-sm text-yellow-900">{field_label}</h4>
        <p className="text-xs text-yellow-700 mt-1">
          {notes.length} note{notes.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Existing notes (scrollable area) */}
      <div className="cls_collab_notes_list flex-1 overflow-y-auto bg-yellow-50 min-h-0">
        {notes.length === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-yellow-700">
            No notes yet.
          </div>
        ) : (
          <div className="divide-y divide-yellow-300">
            {notes.map((note, index) => {
              const { name } = parse_user(note.user);
              return (
                <div key={index} className="cls_collab_note_entry p-3">
                  {/* Note header: avatar and timestamp */}
                  <div className="flex items-center gap-2 mb-2">
                    {/* Profile avatar */}
                    {render_avatar(name, note.timestamp)}
                    {!ProfileStampComponent && (
                      <span className="text-xs text-yellow-700 flex-shrink-0">
                        {format_timestamp(note.timestamp)}
                      </span>
                    )}
                  </div>
                  {/* Note content as read-only textarea with yellow-grey background */}
                  <div className="cls_collab_note_content ml-9">
                    <textarea
                      value={note.notes}
                      readOnly
                      className="w-full min-h-[60px] rounded-md border border-yellow-400 bg-amber-100 px-3 py-2 text-sm text-yellow-900 resize-none cursor-default"
                      style={{ backgroundColor: '#d4c896' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* New note textarea */}
      <div className="cls_collab_notes_new_note border-t border-yellow-300 px-4 py-3 bg-yellow-100 flex-shrink-0">
        <div className="flex items-center gap-2 mb-2">
          {effective_user && (
            ProfileStampComponent ? (
              <ProfileStampComponent size="sm" show_name={false} show_email={false} />
            ) : effective_user.profile_image ? (
              <img
                src={effective_user.profile_image}
                alt={effective_user.name}
                title={effective_user.name}
                className="cls_collab_note_avatar"
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  flexShrink: 0,
                }}
              />
            ) : (
              <span
                className="cls_collab_note_avatar"
                style={{
                  backgroundColor: get_avatar_color(effective_user.name),
                  color: '#ffffff',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  flexShrink: 0,
                }}
                title={effective_user.name}
              >
                {get_initials(effective_user.name)}
              </span>
            )
          )}
          <label className="text-xs font-medium text-yellow-800">
            Add a new note
          </label>
        </div>
        <textarea
          value={new_note_text}
          onChange={(e) => on_new_note_change(e.target.value)}
          className="cls_collab_notes_textarea w-full min-h-[80px] rounded-md border border-yellow-400 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-yellow-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-yellow-500 resize-y"
          disabled={!effective_user}
        />
        {!effective_user && (
          <p className="text-xs text-red-600 mt-1">
            Please log in to add notes.
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Render the notes icon button with popover panel
 * Similar to CollabFormChatIcon but triggers notes panel
 */
export function CollabFormNotesIcon({
  label,
  error,
  has_notes,
  notes = [],
  on_notes_change,
  disabled,
  current_user,
}: {
  label: string;
  error?: string;
  has_notes?: boolean;
  notes?: NoteEntry[];
  on_notes_change?: (notes: NoteEntry[]) => void;
  disabled?: boolean;
  current_user?: { name: string; email: string; profile_image?: string };
}) {
  // Don't render if explicitly disabled
  if (disabled) {
    return null;
  }

  // State for popover open/close
  const [popover_open, set_popover_open] = React.useState(false);

  // State for new note text
  const [new_note_text, set_new_note_text] = React.useState('');

  // State for fetched user info (if current_user not provided)
  const [fetched_user, set_fetched_user] = React.useState<{ name: string; email: string; profile_image?: string } | null>(null);

  // Dynamic imports for shadcn Popover
  const [Components, setComponents] = React.useState<{
    Popover: React.ComponentType<any>;
    PopoverTrigger: React.ComponentType<any>;
    PopoverContent: React.ComponentType<any>;
  } | null>(null);

  // Dynamic import for ProfileStamp from hazo_auth
  const [ProfileStampComponent, setProfileStampComponent] = React.useState<React.ComponentType<any> | null>(null);

  // Fetch user info if not provided
  React.useEffect(() => {
    if (!current_user) {
      const fetch_user = async () => {
        try {
          const response = await fetch('/api/hazo_auth/me');
          if (response.ok) {
            const data = await response.json();
            if (data.authenticated) {
              // Support both naming conventions: user_name/user_email and name/email
              const name = data.user_name || data.name;
              const email = data.user_email || data.email;
              const profile_image = data.profile_image || data.avatar_url || data.image;
              if (name && email) {
                set_fetched_user({ name, email, profile_image });
              }
            }
          }
        } catch (error) {
          console.error('[CollabFormNotesIcon] Error fetching user:', error);
        }
      };
      fetch_user();
    }
  }, [current_user]);

  // Load Popover component dynamically
  React.useEffect(() => {
    const loadComponents = async () => {
      try {
        // @ts-expect-error - These modules are provided by the consuming application
        const popoverModule = await import('@/components/ui/popover').catch(() => null);
        if (popoverModule) {
          setComponents({
            Popover: popoverModule.Popover,
            PopoverTrigger: popoverModule.PopoverTrigger,
            PopoverContent: popoverModule.PopoverContent,
          });
        }
      } catch (error) {
        console.warn('[CollabFormNotesIcon] Error loading Popover:', error);
      }
    };
    loadComponents();
  }, []);

  // Load ProfileStamp from hazo_auth dynamically
  React.useEffect(() => {
    const loadProfileStamp = async () => {
      try {
        // Dynamic import with explicit type casting to avoid TS errors when hazo_auth isn't installed
        const modulePath = 'hazo_auth/client';
        const hazoAuthModule = await import(/* webpackIgnore: true */ modulePath).catch(() => null) as Record<string, unknown> | null;
        if (hazoAuthModule?.ProfileStamp) {
          setProfileStampComponent(() => hazoAuthModule.ProfileStamp as React.ComponentType<any>);
        }
      } catch {
        // ProfileStamp not available, will fall back to initials
        console.debug('[CollabFormNotesIcon] ProfileStamp not available, using fallback');
      }
    };
    loadProfileStamp();
  }, []);

  // Get effective user
  const effective_user = current_user || fetched_user;

  // Handle save on close
  const handle_popover_close = (open: boolean) => {
    if (!open && new_note_text.trim() && effective_user && on_notes_change) {
      // Create new note entry
      const new_note: NoteEntry = {
        user: `${effective_user.name} <${effective_user.email}>`,
        timestamp: new Date().toISOString(),
        notes: new_note_text.trim(),
      };

      // Add to existing notes
      on_notes_change([...notes, new_note]);

      // Clear the textarea
      set_new_note_text('');
    }
    set_popover_open(open);
  };

  // Fallback if Popover not available
  if (!Components) {
    return (
      <button
        type="button"
        disabled
        className={cn(
          'cls_collab_notes_icon flex h-9 w-9 items-center justify-center rounded-md border border-input bg-transparent text-muted-foreground opacity-50 cursor-not-allowed'
        )}
        aria-label={`Notes for ${label} (unavailable)`}
        title="Notes unavailable - missing shadcn/ui popover component"
      >
        <IoDocumentText className="h-5 w-5" />
      </button>
    );
  }

  const { Popover, PopoverTrigger, PopoverContent } = Components;

  return (
    <div className="cls_collab_notes_icon_wrapper flex items-center">
      <Popover open={popover_open} onOpenChange={handle_popover_close}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              'cls_collab_notes_icon flex h-9 w-9 items-center justify-center rounded-md border border-input bg-transparent text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
              error && 'border-destructive',
              has_notes && 'bg-amber-100 border-amber-500'
            )}
            aria-label={`Notes for ${label}`}
            title={`Notes for ${label}`}
          >
            <IoDocumentText className={cn("h-5 w-5", has_notes && "text-amber-600")} />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="cls_collab_notes_panel w-80 p-0"
          align="end"
          side="bottom"
          sideOffset={5}
          collisionPadding={16}
          avoidCollisions={true}
        >
          <CollabFormNotesPanel
            notes={notes}
            new_note_text={new_note_text}
            on_new_note_change={set_new_note_text}
            effective_user={effective_user}
            field_label={label}
            ProfileStampComponent={ProfileStampComponent}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

