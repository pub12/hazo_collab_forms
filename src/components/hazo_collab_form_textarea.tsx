/**
 * Collaboration form textarea component
 * Provides a reusable textarea field with label, error message, and chat icon functionality
 */

'use client';

import React from 'react';
import { cn } from '../utils/cn.js';
import {
  use_collab_form_field,
  CollabFormFieldContainer,
  CollabFormFieldLabel,
  CollabFormChatIcon,
  CollabFormFieldError,
  CollabFormDataOkCheckbox,
  CollabFormFileUploadSection,
  type CollabFormFieldBaseProps,
  type FileData,
} from './hazo_collab_form_base.js';

/**
 * Props for the HazoCollabFormTextArea component
 */
export interface HazoCollabFormTextAreaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange'>,
    CollabFormFieldBaseProps {
  /**
   * Current value of the textarea
   */
  value: string;
  
  /**
   * Callback when textarea value changes
   */
  onChange: (value: string) => void;
  
  /**
   * Additional context data for chat functionality
   */
  additional_context?: Record<string, unknown>;
  
  /**
   * Custom className for the textarea wrapper
   */
  textarea_wrapper_class_name?: string;
}

/**
 * Exposed methods for HazoCollabFormTextArea
 */
export interface HazoCollabFormTextAreaRef {
  /**
   * Get the current files data
   * Returns array of FileData objects
   */
  get_file_data: () => FileData[];
}

/**
 * Collaboration form textarea component
 * Displays a labeled textarea field with error message and chat icon
 */
export const HazoCollabFormTextArea = React.forwardRef<
  HTMLTextAreaElement & HazoCollabFormTextAreaRef,
  HazoCollabFormTextAreaProps
>((props, ref) => {
  // Create internal ref for component reference (for file_processor)
  const component_ref = React.useRef<HTMLTextAreaElement>(null);
  const [internal_files, set_internal_files] = React.useState<FileData[]>([]);
  
  // Use controlled files if provided, otherwise use internal state
  const current_files = props.files !== undefined ? props.files : internal_files;
  
  // Expose get_file_data method and forward ref to textarea element
  React.useImperativeHandle(
    ref,
    () => {
      return {
        ...(component_ref.current as HTMLTextAreaElement),
        get_file_data: () => current_files,
      } as HTMLTextAreaElement & HazoCollabFormTextAreaRef;
    },
    [current_files]
  );

        const {
          label,
          error,
          field_id,
          field_data_id,
          field_name,
          value,
          onChange,
          additional_context,
          on_chat_click,
          has_chat_messages,
          is_chat_active,
          chat_background_color = 'bg-muted',
          is_data_ok_default,
          container_class_name,
          label_class_name,
          textarea_wrapper_class_name,
          error_class_name,
          field_width_class_name,
          required,
          multi_state_radio,
          data_ok_checked,
          on_data_ok_change,
          data_ok_editable,
          disable_data_ok,
          disable_chat,
          accept_files,
          files_dir,
          max_size,
          min_files,
          max_files,
          file_accept,
          file_processor,
          files: controlled_files_prop,
          on_files_change,
          className,
          id,
          // HazoChat props
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
          hazo_chat_is_open,
          hazo_chat_on_open_change,
          hazo_chat_show_sidebar_toggle,
          hazo_chat_show_delete_button,
          hazo_chat_bubble_radius,
          ...textarea_props
        } = props;

  const { field_id_final, handle_chat_icon_click, handle_chat_close, chat_is_open, is_chat_disabled } = use_collab_form_field({
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
    hazo_chat_on_close,
  });

  // Determine if field should be disabled when chat is active
  // Use is_chat_active if provided, otherwise use chat_is_open
  const is_field_disabled = is_chat_active !== undefined ? is_chat_active : chat_is_open;

  /**
   * Handle textarea change event
   */
  const handle_change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <CollabFormFieldContainer
      has_chat_messages={has_chat_messages}
      is_chat_active={is_chat_active}
      chat_background_color={chat_background_color}
      is_data_ok_default={is_data_ok_default}
      container_class_name={container_class_name}
      hazo_chat_is_open={chat_is_open}
      hazo_chat_receiver_user_id={hazo_chat_receiver_user_id}
      recipient_user_id={recipient_user_id}
      hazo_chat_reference_id={hazo_chat_reference_id}
      hazo_chat_reference_type={hazo_chat_reference_type}
      hazo_chat_api_base_url={hazo_chat_api_base_url}
      hazo_chat_timezone={hazo_chat_timezone}
      hazo_chat_title={hazo_chat_title}
      hazo_chat_subtitle={hazo_chat_subtitle}
      hazo_chat_realtime_mode={hazo_chat_realtime_mode}
      hazo_chat_polling_interval={hazo_chat_polling_interval}
      hazo_chat_messages_per_page={hazo_chat_messages_per_page}
      hazo_chat_class_name={hazo_chat_class_name}
      hazo_chat_on_close={handle_chat_close}
      hazo_chat_show_sidebar_toggle={hazo_chat_show_sidebar_toggle}
      hazo_chat_show_delete_button={hazo_chat_show_delete_button}
      hazo_chat_bubble_radius={hazo_chat_bubble_radius}
      field_data_id={field_data_id}
      field_name={field_name}
      label={label}
      files={current_files}
    >
      {/* Label */}
      <CollabFormFieldLabel
        field_id_final={field_id_final}
        label={label}
        label_class_name={label_class_name}
        required={required}
      />

      {/* Textarea wrapper with chat icon */}
      <div className={cn('cls_collab_textarea_wrapper flex items-start gap-2', textarea_wrapper_class_name)}>
        {/* Width-constrained wrapper for the textarea - controls width independently */}
        <div className={cn(
          field_width_class_name || 'flex-1',
          field_width_class_name && 'flex-shrink-0'
        )}>
          <textarea
            ref={component_ref}
            id={field_id_final}
            value={value}
            onChange={handle_change}
            disabled={is_field_disabled}
            className={cn(
              'cls_collab_textarea w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-y',
              error && 'border-destructive focus-visible:ring-destructive',
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${field_id_final}-error` : undefined}
            {...textarea_props}
          />
        </div>
        
        {/* Actions wrapper: Data OK checkbox and chat icon */}
        <div className="cls_collab_textarea_actions flex items-start gap-2 flex-shrink-0 pt-1" suppressHydrationWarning>
          {/* Data OK checkbox - conditionally visible */}
          {!disable_data_ok && (
            <CollabFormDataOkCheckbox
              label={label}
              data_ok_checked={data_ok_checked}
              on_data_ok_change={on_data_ok_change}
              editable={data_ok_editable}
            />
          )}
          
          {/* Chat icon button - conditionally visible */}
          {!disable_chat && (
            <CollabFormChatIcon
              label={label}
              error={error}
              on_click={handle_chat_icon_click}
              multi_state_radio={multi_state_radio}
              has_chat_messages={has_chat_messages}
              disabled={disable_chat}
              button_disabled={is_chat_disabled}
            />
          )}
        </div>
      </div>

      {/* Error message */}
      <CollabFormFieldError
        field_id_final={field_id_final}
        error={error}
        error_class_name={error_class_name}
      />

      {/* File upload section */}
      <CollabFormFileUploadSection
        field_id_final={field_id_final}
        accept_files={accept_files}
        files_dir={files_dir}
        max_size={max_size}
        min_files={min_files}
        max_files={max_files}
        file_accept={file_accept}
        file_processor={file_processor}
        files={current_files}
        on_files_change={(new_files) => {
          if (controlled_files_prop === undefined) {
            set_internal_files(new_files);
          }
          if (on_files_change) {
            on_files_change(new_files);
          }
        }}
        component_ref={component_ref}
      />
    </CollabFormFieldContainer>
  );
});

HazoCollabFormTextArea.displayName = 'HazoCollabFormTextArea';

