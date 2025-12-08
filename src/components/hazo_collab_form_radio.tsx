/**
 * Collaboration form radio component
 * Provides a reusable radio button group with labels, error message, data OK checkbox, and chat icon functionality
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
 * Radio option interface
 */
export interface RadioOption {
  /**
   * Value of the radio option
   */
  value: string;
  
  /**
   * Label text for the radio option
   */
  label: string;
  
  /**
   * Whether this option is disabled
   */
  disabled?: boolean;
}

/**
 * Props for the HazoCollabFormRadio component
 */
export interface HazoCollabFormRadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'>,
    CollabFormFieldBaseProps {
  /**
   * Array of radio options
   */
  options: RadioOption[];
  
  /**
   * Current selected value
   */
  value: string;
  
  /**
   * Callback when selection changes
   */
  onChange: (value: string) => void;
  
  /**
   * Additional context data for chat functionality
   */
  additional_context?: Record<string, unknown>;
  
  /**
   * Custom className for the radio wrapper
   */
  radio_wrapper_class_name?: string;
  
  /**
   * Custom className for individual radio option wrapper
   */
  radio_option_wrapper_class_name?: string;
  
  /**
   * Layout direction for radio options
   * 'vertical' (default) or 'horizontal'
   */
  layout?: 'vertical' | 'horizontal';
}

/**
 * Exposed methods for HazoCollabFormRadio
 */
export interface HazoCollabFormRadioRef {
  /**
   * Get the current files data
   * Returns array of FileData objects
   */
  get_file_data: () => FileData[];
}

/**
 * Collaboration form radio component
 * Displays a labeled radio button group with error message, data OK checkbox, and chat icon
 */
export const HazoCollabFormRadio = React.forwardRef<
  HTMLInputElement & HazoCollabFormRadioRef,
  HazoCollabFormRadioProps
>((props, ref) => {
  // Create internal ref for component reference (for file_processor)
  const component_ref = React.useRef<HTMLInputElement>(null);
  const [internal_files, set_internal_files] = React.useState<FileData[]>([]);
  
  // Use controlled files if provided, otherwise use internal state
  const current_files = props.files !== undefined ? props.files : internal_files;
  
  // Expose get_file_data method and forward ref to input element
  React.useImperativeHandle(
    ref,
    () => {
      return {
        ...(component_ref.current as HTMLInputElement),
        get_file_data: () => current_files,
      } as HTMLInputElement & HazoCollabFormRadioRef;
    },
    [current_files]
  );

  const {
    label,
    error,
    field_id,
    field_data_id,
    field_name,
    options,
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
    radio_wrapper_class_name,
    radio_option_wrapper_class_name,
    error_class_name,
    required,
    layout = 'vertical',
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
    className,
    id,
    disabled,
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
    ...radio_props
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

  /**
   * Handle radio change event
   */
  const handle_change = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      {/* Label and actions wrapper - label on left, actions on right */}
      <div className="cls_collab_radio_label_actions_wrapper flex items-center justify-between gap-2">
        {/* Field label */}
        <CollabFormFieldLabel
          field_id_final={field_id_final}
          label={label}
          label_class_name={label_class_name}
          required={required}
        />

        {/* Data OK checkbox and chat icon wrapper - top right */}
        <div className="cls_collab_radio_actions flex items-center gap-2 flex-shrink-0" suppressHydrationWarning>
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

      {/* Radio wrapper with options */}
      <div className={cn(
        'cls_collab_radio_wrapper',
        layout === 'horizontal' && 'flex flex-row items-center gap-4',
        layout === 'vertical' && 'flex flex-col gap-4',
        radio_wrapper_class_name
      )}>
        {/* Radio options */}
        {options.map((option, index) => {
          const option_id = `${field_id_final}-${option.value}`;
          const is_checked = value === option.value;
          
          return (
            <div
              key={option.value}
              className={cn(
                'cls_collab_radio_option_wrapper flex items-center gap-2',
                radio_option_wrapper_class_name
              )}
            >
              <input
                ref={index === 0 ? component_ref : undefined}
                id={option_id}
                type="radio"
                name={field_id_final}
                value={option.value}
                checked={is_checked}
                onChange={handle_change}
                disabled={disabled || option.disabled || is_chat_active_disabled}
                className={cn(
                  'cls_collab_radio h-4 w-4 border border-input bg-transparent text-primary shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
                  error && 'border-destructive focus-visible:ring-destructive',
                  className
                )}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? `${field_id_final}-error` : undefined}
                {...radio_props}
              />
              <label
                htmlFor={option_id}
                className={cn(
                  'cls_collab_radio_label text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                  error && 'text-destructive'
                )}
              >
                {option.label}
              </label>
            </div>
          );
        })}
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

HazoCollabFormRadio.displayName = 'HazoCollabFormRadio';

