/**
 * Collaboration form checkbox component
 * Provides a reusable checkbox field with label, error message, and chat icon functionality
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
  CollabFormFieldReferenceTag,
  CollabFormDataOkCheckbox,
  CollabFormFileUploadSection,
  CollabFormNotesIcon,
  type CollabFormFieldBaseProps,
  type FileData,
} from './hazo_collab_form_base.js';

/**
 * Props for the HazoCollabFormCheckbox component
 */
export interface HazoCollabFormCheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'>,
    CollabFormFieldBaseProps {
  /**
   * Current checked state of the checkbox
   */
  checked: boolean;
  
  /**
   * Callback when checkbox state changes
   */
  onChange: (checked: boolean) => void;
  
  /**
   * Label text that appears next to the checkbox
   * If not provided, falls back to the base label prop
   */
  checkbox_label?: string;
  
  /**
   * Additional context data for chat functionality
   */
  additional_context?: Record<string, unknown>;
  
  /**
   * Custom className for the checkbox wrapper
   */
  checkbox_wrapper_class_name?: string;
  
  /**
   * Custom className for the checkbox-specific label (next to checkbox)
   */
  checkbox_label_class_name?: string;
}

/**
 * Exposed methods for HazoCollabFormCheckbox
 */
export interface HazoCollabFormCheckboxRef {
  /**
   * Get the current files data
   * Returns array of FileData objects
   */
  get_file_data: () => FileData[];
}

/**
 * Collaboration form checkbox component
 * Displays a labeled checkbox field with error message and chat icon
 */
export const HazoCollabFormCheckbox = React.forwardRef<
  HTMLInputElement & HazoCollabFormCheckboxRef,
  HazoCollabFormCheckboxProps
>((props, ref) => {
  // Create internal ref for component reference (for file_processor)
  const component_ref = React.useRef<HTMLInputElement>(null);
  const [internal_files, set_internal_files] = React.useState<FileData[]>([]);
  
  // Use controlled files if provided, otherwise use internal state
  const current_files = props.files !== undefined ? props.files : internal_files;
  
  // Expose get_file_data method and forward ref to checkbox element
  React.useImperativeHandle(
    ref,
    () => {
      return {
        ...(component_ref.current as HTMLInputElement),
        get_file_data: () => current_files,
      } as HTMLInputElement & HazoCollabFormCheckboxRef;
    },
    [current_files]
  );

        const {
          label,
          error,
          field_id,
          field_data_id,
          field_name,
          checked,
          onChange,
          checkbox_label,
          additional_context,
          on_chat_click,
          has_chat_messages,
          is_chat_active,
          chat_background_color = 'bg-muted',
          is_data_ok_default,
          container_class_name,
          label_class_name,
          checkbox_wrapper_class_name,
          checkbox_label_class_name,
          error_class_name,
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
          files: controlled_files,
          on_files_change,
          // Notes props
          enable_notes,
          disable_notes,
          notes,
          on_notes_change,
          has_notes,
          is_notes_active,
          current_user,
          className,
          id,
          // HazoChat props
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
          hazo_chat_is_open,
          hazo_chat_on_open_change,
          hazo_chat_show_sidebar_toggle,
          hazo_chat_show_delete_button,
          hazo_chat_bubble_radius,
          // Reference tag props
          reference_value,
          reference_label,
          reference_tag_background_color,
          ...checkbox_props
        } = props;

  const { field_id_final, handle_chat_icon_click, handle_chat_close, chat_is_open, is_chat_disabled } = use_collab_form_field({
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
  });

  // Determine if field should be disabled when chat is active
  // Use is_chat_active if provided, otherwise use chat_is_open
  const is_chat_active_disabled = is_chat_active !== undefined ? is_chat_active : chat_is_open;
  // Combine with existing disabled prop from checkbox_props if it exists
  const is_field_disabled = (checkbox_props?.disabled) || is_chat_active_disabled;

  /**
   * Handle checkbox change event
   */
  const handle_change = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  // Use checkbox_label if provided, otherwise fall back to label
  const checkbox_label_text = checkbox_label ?? label;

  return (
    <CollabFormFieldContainer
      has_chat_messages={has_chat_messages}
      is_chat_active={is_chat_active}
      chat_background_color={chat_background_color}
      is_data_ok_default={is_data_ok_default}
      container_class_name={container_class_name}
      hazo_chat_is_open={chat_is_open}
      hazo_chat_group_id={hazo_chat_group_id}
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
      {/* Base label - above the checkbox */}
      <CollabFormFieldLabel
        field_id_final={field_id_final}
        label={label}
        label_class_name={label_class_name}
        required={required}
      />

      {/* Checkbox wrapper with checkbox-specific label and chat icon */}
      <div className={cn('cls_collab_checkbox_wrapper flex items-center gap-2', checkbox_wrapper_class_name)} suppressHydrationWarning>
        <input
          ref={component_ref}
          id={field_id_final}
          type="checkbox"
          checked={checked}
          onChange={handle_change}
          disabled={is_field_disabled}
          className={cn(
            'cls_collab_checkbox h-4 w-4 rounded border border-input bg-transparent text-primary shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${field_id_final}-error` : undefined}
          {...checkbox_props}
        />
        
        {/* Checkbox-specific label - next to the checkbox */}
        <label
          htmlFor={field_id_final}
          className={cn(
            'cls_collab_checkbox_label text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1',
            checkbox_label_class_name
          )}
        >
          {checkbox_label_text}
        </label>
        
        {/* Data OK checkbox, notes icon, and chat icon - right-justified */}
        <div className="cls_collab_checkbox_actions flex items-center gap-2 flex-shrink-0">
          {/* Data OK checkbox - conditionally visible */}
          {!disable_data_ok && (
            <CollabFormDataOkCheckbox
              label={label}
              data_ok_checked={data_ok_checked}
              on_data_ok_change={on_data_ok_change}
              editable={data_ok_editable}
            />
          )}

          {/* Notes icon - conditionally visible */}
          {enable_notes && !disable_notes && (
            <CollabFormNotesIcon
              label={label}
              error={error}
              has_notes={has_notes}
              notes={notes}
              on_notes_change={on_notes_change}
              current_user={current_user}
              disabled={disable_notes}
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

      {/* Reference tag - below input, above error */}
      <CollabFormFieldReferenceTag
        reference_value={reference_value}
        reference_label={reference_label}
        reference_tag_background_color={reference_tag_background_color}
      />

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
          if (controlled_files === undefined) {
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

HazoCollabFormCheckbox.displayName = 'HazoCollabFormCheckbox';

