/**
 * Shared base functionality for collaboration form components
 * Provides common utilities and rendering logic for input and textarea fields
 */

'use client';

import React from 'react';
import { IoChatbox } from 'react-icons/io5';
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
   * Recipient user ID for chat functionality
   * Required for chat features to work properly
   * @deprecated Use hazo_chat_receiver_user_id instead
   */
  recipient_user_id?: string;

  /**
   * HazoChat receiver user ID
   * Required for chat to work, maps to HazoChat receiver_user_id
   * If recipient_user_id is provided, it will be used as fallback
   */
  hazo_chat_receiver_user_id?: string;

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
  hazo_chat_receiver_user_id,
  recipient_user_id,
  hazo_chat_on_open_change,
  hazo_chat_is_open,
}: Pick<
  CollabFormFieldBaseProps,
  | 'label'
  | 'field_id'
  | 'id'
  | 'field_data_id'
  | 'field_name'
  | 'on_chat_click'
  | 'hazo_chat_receiver_user_id'
  | 'recipient_user_id'
  | 'hazo_chat_on_open_change'
  | 'hazo_chat_is_open'
>) {
  // Generate field ID if not provided
  const field_id_final = id || field_id || `collab-field-${label.toLowerCase().replace(/\s+/g, '-')}`;

  // Internal state for chat open/close (if not controlled externally)
  const [internal_chat_is_open, set_internal_chat_is_open] = React.useState(false);

  // Use controlled value if provided, otherwise use internal state
  const chat_is_open = hazo_chat_is_open !== undefined ? hazo_chat_is_open : internal_chat_is_open;
  const is_chat_controlled = hazo_chat_is_open !== undefined;

  // Get receiver user ID (prefer hazo_chat_receiver_user_id, fallback to recipient_user_id)
  const receiver_user_id = hazo_chat_receiver_user_id || recipient_user_id;

  // Chat is disabled if no receiver_user_id is available (unless on_chat_click is provided as fallback)
  const is_chat_disabled = !receiver_user_id && !on_chat_click;

  /**
   * Handle chat icon click - trigger callback or open chat
   */
  const handle_chat_icon_click = React.useCallback(() => {
    // If custom on_chat_click is provided, use it (existing behavior)
    if (field_data_id && on_chat_click) {
      on_chat_click(field_data_id, field_name || label);
      return;
    }

    // If hazo_chat_receiver_user_id is provided, open chat internally
    if (receiver_user_id) {
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
    receiver_user_id,
    chat_is_open,
    is_chat_controlled,
    hazo_chat_on_open_change,
  ]);

  return {
    field_id_final,
    handle_chat_icon_click,
    chat_is_open,
    is_chat_disabled,
    receiver_user_id,
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
  hazo_chat_receiver_user_id,
  recipient_user_id,
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
  hazo_chat_on_open_change,
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
  | 'hazo_chat_receiver_user_id'
  | 'recipient_user_id'
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
  | 'hazo_chat_on_open_change'
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
  // Get receiver user ID (prefer hazo_chat_receiver_user_id, fallback to recipient_user_id)
  const receiver_user_id = hazo_chat_receiver_user_id || recipient_user_id;

  // Internal state for chat open/close (if not controlled externally)
  const [internal_chat_is_open, set_internal_chat_is_open] = React.useState(false);

  // Use controlled value if provided, otherwise use internal state
  const chat_is_open = hazo_chat_is_open !== undefined ? hazo_chat_is_open : internal_chat_is_open;
  const is_chat_controlled = hazo_chat_is_open !== undefined;

  // Determine if chat should be shown
  const show_chat = chat_is_open && receiver_user_id;

  // Auto-determine is_chat_active from chat_is_open if not explicitly provided
  const is_chat_active_final = is_chat_active !== undefined ? is_chat_active : chat_is_open;

  // Convert files to references
  const additional_references = files ? convert_files_to_references(files) : undefined;

  // Determine chat props
  const chat_reference_id = hazo_chat_reference_id || field_data_id || '';
  const chat_reference_type = hazo_chat_reference_type || 'field';
  const chat_title = hazo_chat_title || field_name || label;
  const chat_subtitle = hazo_chat_subtitle || `Discussing ${field_name || label}`;

  // Handle chat close
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
                  receiver_user_id={receiver_user_id}
                  reference_id={chat_reference_id}
                  reference_type={chat_reference_type}
                  api_base_url={hazo_chat_api_base_url}
                  timezone={hazo_chat_timezone}
                  title={chat_title}
                  subtitle={chat_subtitle}
                  on_close={handle_chat_close}
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
        title={is_button_disabled ? 'Chat unavailable (recipient not configured)' : `Chat about ${label}`}
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

