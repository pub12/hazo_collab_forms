/**
 * Collaboration form group component
 * Groups multiple collab form fields together with a single data ok checkbox and chat icon at the group level
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
 * Props for the HazoCollabFormGroup component
 */
export interface HazoCollabFormGroupProps extends CollabFormFieldBaseProps {
  /**
   * Child form fields to group together
   */
  children: React.ReactNode;

  /**
   * Custom className for the group wrapper
   */
  group_wrapper_class_name?: string;

  /**
   * Whether to disable the border/frame around the group
   * Default: false (border is shown by default)
   */
  disable_border?: boolean;
}

/**
 * List of collab form component display names to identify them
 */
const COLLAB_FORM_COMPONENT_NAMES = [
  'HazoCollabFormInputbox',
  'HazoCollabFormTextArea',
  'HazoCollabFormCheckbox',
  'HazoCollabFormCombo',
  'HazoCollabFormRadio',
];

/**
 * Check if a React element is a collab form component
 */
function is_collab_form_component(element: React.ReactElement): boolean {
  if (!element || typeof element !== 'object') {
    return false;
  }

  const element_type = element.type;

  // Helper function to check displayName
  const check_display_name = (type_to_check: any): boolean => {
    if (!type_to_check) return false;
    
    // Check displayName directly
    if (type_to_check.displayName) {
      if (COLLAB_FORM_COMPONENT_NAMES.includes(type_to_check.displayName)) {
        return true;
      }
      // Also check if it starts with "HazoCollabForm" as a fallback
      if (type_to_check.displayName.startsWith('HazoCollabForm')) {
        return true;
      }
    }
    
    // Check render.displayName for forwardRef components
    if (type_to_check.render && type_to_check.render.displayName) {
      if (COLLAB_FORM_COMPONENT_NAMES.includes(type_to_check.render.displayName)) {
        return true;
      }
      // Also check if it starts with "HazoCollabForm" as a fallback
      if (type_to_check.render.displayName.startsWith('HazoCollabForm')) {
        return true;
      }
    }
    
    return false;
  };

  // Check if it's a forwardRef component (object with render function)
  if (element_type && typeof element_type === 'object' && element_type !== null) {
    if (check_display_name(element_type)) {
      return true;
    }
  }

  // Check if it's a regular function component
  if (element_type && typeof element_type === 'function') {
    if (check_display_name(element_type)) {
      return true;
    }
  }

  // Fallback: Check props to see if it has collab form component props
  // This is a more lenient check - if it has the base props, assume it's a collab form component
  if (element.props) {
    const has_label = typeof element.props.label === 'string';
    
    // Check for any collab form component indicators
    const has_collab_value = 
      element.props.value !== undefined || 
      element.props.checked !== undefined || 
      element.props.options !== undefined;
    
    const has_collab_callbacks = 
      element.props.onChange !== undefined;
    
    // Also check for common collab form props
    const has_collab_props = 
      element.props.field_id !== undefined ||
      element.props.field_data_id !== undefined ||
      element.props.field_name !== undefined ||
      element.props.disable_data_ok !== undefined ||
      element.props.disable_chat !== undefined;
    
    // If it has a label and any collab form indicators, treat it as a collab form component
    // Very lenient: if it has a label and onChange, it's likely a collab form component
    if (has_label && (has_collab_value || has_collab_callbacks || has_collab_props || element.props.onChange)) {
      return true;
    }
  }

  return false;
}

/**
 * Exposed methods for HazoCollabFormGroup
 */
export interface HazoCollabFormGroupRef {
  /**
   * Get the current files data
   * Returns array of FileData objects
   */
  get_file_data: () => FileData[];
}

/**
 * Collaboration form group component
 * Groups multiple collab form fields together with group-level data ok checkbox and chat icon
 */
export const HazoCollabFormGroup = React.forwardRef<
  HTMLDivElement & HazoCollabFormGroupRef,
  HazoCollabFormGroupProps
>((props, ref) => {
  // Create internal ref for component reference (for file_processor)
  const component_ref = React.useRef<HTMLDivElement>(null);
  const [internal_files, set_internal_files] = React.useState<FileData[]>([]);
  
  // Use controlled files if provided, otherwise use internal state
  const current_files = props.files !== undefined ? props.files : internal_files;
  
  // Expose get_file_data method and forward ref to div element
  React.useImperativeHandle(
    ref,
    () => {
      return {
        ...(component_ref.current as HTMLDivElement),
        get_file_data: () => current_files,
      } as HTMLDivElement & HazoCollabFormGroupRef;
    },
    [current_files]
  );

  const {
    label,
    error,
    field_id,
    field_data_id,
    field_name,
    children,
    on_chat_click,
    has_chat_messages,
    is_chat_active,
    chat_background_color = 'bg-muted',
    is_data_ok_default,
    container_class_name,
    label_class_name,
    group_wrapper_class_name,
    error_class_name,
    multi_state_radio,
    data_ok_checked,
    on_data_ok_change,
    data_ok_editable,
    disable_border = false,
    accept_files,
    files_dir,
    max_size,
    min_files,
    max_files,
    file_accept,
    file_processor,
    files: controlled_files,
    on_files_change,
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
  } = props;

  const { field_id_final, handle_chat_icon_click, handle_chat_close, chat_is_open } = use_collab_form_field({
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

  /**
   * Clone children and add disable_data_ok and disable_chat props to collab form components
   */
  const cloned_children = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) {
      return child;
    }

    // Check if this child is a collab form component
    if (is_collab_form_component(child)) {
      // Clone the element and add disable props
      // Merge with existing props to ensure we don't override important props
      return React.cloneElement(child as React.ReactElement<any>, {
        ...child.props,
        disable_data_ok: true,
        disable_chat: true,
      });
    }

    // If not a collab form component, return as-is
    return child;
  });

  return (
    <div className="cls_collab_group_root space-y-2" ref={component_ref}>
      {/* Group label with actions - outside the border, right-justified */}
      <div className="cls_collab_group_label_row flex items-center justify-between gap-2">
        <CollabFormFieldLabel
          field_id_final={field_id_final}
          label={label}
          label_class_name={label_class_name}
        />
        
        {/* Group-level actions: Data OK checkbox and chat icon - right-justified */}
        <div className="cls_collab_group_actions flex items-center gap-2 flex-shrink-0" suppressHydrationWarning>
          {/* Data OK checkbox - group level */}
          <CollabFormDataOkCheckbox
            label={label}
            data_ok_checked={data_ok_checked}
            on_data_ok_change={on_data_ok_change}
            editable={data_ok_editable}
          />

          {/* Chat icon button - group level */}
          <CollabFormChatIcon
            label={label}
            error={error}
            on_click={handle_chat_icon_click}
            multi_state_radio={multi_state_radio}
            has_chat_messages={has_chat_messages}
          />
        </div>
      </div>

      <CollabFormFieldContainer
        has_chat_messages={has_chat_messages}
        is_chat_active={is_chat_active}
        chat_background_color={chat_background_color}
        is_data_ok_default={is_data_ok_default}
        container_class_name={cn(
          !disable_border && 'border border-input rounded-md p-4',
          container_class_name
        )}
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
        {/* Group wrapper with fields */}
        <div className={cn('cls_collab_group_wrapper space-y-2', group_wrapper_class_name)}>
          {/* Cloned children with disabled data ok and chat */}
          {cloned_children}
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
    </div>
  );
});

HazoCollabFormGroup.displayName = 'HazoCollabFormGroup';

