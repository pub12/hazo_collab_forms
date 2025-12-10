/**
 * Collaboration form combobox component
 * Provides a reusable combobox field with label, error message, and chat icon functionality
 * 
 * NOTE: This component requires shadcn/ui Popover and Command components to be installed
 * in the consuming application. Install them with:
 * npx shadcn@latest add popover command
 * 
 * Also requires lucide-react for icons (Check, ChevronsUpDown)
 */

'use client';

import React, { useState, useEffect } from 'react';
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
 * Option type for combobox
 */
export interface ComboboxOption {
  /**
   * Value of the option
   */
  value: string;
  
  /**
   * Label to display for the option
   */
  label: string;
}

/**
 * Props for the HazoCollabFormCombo component
 */
export interface HazoCollabFormComboProps extends CollabFormFieldBaseProps {
  /**
   * Array of options to display in the combobox
   */
  options: ComboboxOption[];
  
  /**
   * Current selected value
   */
  value: string;
  
  /**
   * Callback when selection changes
   */
  onChange: (value: string) => void;
  
  /**
   * Placeholder text when no option is selected
   */
  placeholder?: string;
  
  /**
   * Placeholder text for the search input
   */
  search_placeholder?: string;
  
  /**
   * Message to show when no options are found
   */
  empty_message?: string;
  
  /**
   * Whether to enable the search input bar
   * Default: false (search bar hidden)
   */
  enable_search?: boolean;
  
  /**
   * Additional context data for chat functionality
   */
  additional_context?: Record<string, unknown>;
  
  /**
   * Custom className for the combobox wrapper
   */
  combo_wrapper_class_name?: string;
  
  /**
   * Custom className for the button trigger
   */
  button_class_name?: string;
  
  /**
   * Whether the combobox is disabled
   */
  disabled?: boolean;
}

/**
 * Exposed methods for HazoCollabFormCombo
 */
export interface HazoCollabFormComboRef {
  /**
   * Get the current files data
   * Returns array of FileData objects
   */
  get_file_data: () => FileData[];
}

/**
 * Collaboration form combobox component
 * Displays a labeled combobox field with error message and chat icon
 */
export const HazoCollabFormCombo = React.forwardRef<
  HTMLButtonElement & HazoCollabFormComboRef,
  HazoCollabFormComboProps
>((props, ref) => {
  // Create internal ref for component reference (for file_processor)
  const component_ref = React.useRef<HTMLButtonElement>(null);
  const [internal_files, set_internal_files] = React.useState<FileData[]>([]);
  
  // Use controlled files if provided, otherwise use internal state
  const current_files = props.files !== undefined ? props.files : internal_files;
  
  // Expose get_file_data method and forward ref to button element
  React.useImperativeHandle(
    ref,
    () => {
      return {
        ...(component_ref.current as HTMLButtonElement),
        get_file_data: () => current_files,
      } as HTMLButtonElement & HazoCollabFormComboRef;
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
          placeholder = 'Select an option...',
          search_placeholder = 'Search...',
          empty_message = 'No option found.',
          enable_search = false,
          additional_context,
          on_chat_click,
          has_chat_messages,
          is_chat_active,
          chat_background_color = 'bg-muted',
          is_data_ok_default,
          container_class_name,
          label_class_name,
          combo_wrapper_class_name,
          button_class_name,
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
          disabled,
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
        } = props;

  const [open, set_open] = useState(false);

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
  // Combine with existing disabled prop
  const is_field_disabled = disabled || is_chat_active_disabled;

  // Helper object for chat props to pass to CollabFormFieldContainer
  const chat_container_props = {
    hazo_chat_is_open: chat_is_open,
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
    hazo_chat_on_close: handle_chat_close,
    hazo_chat_show_sidebar_toggle,
    hazo_chat_show_delete_button,
    hazo_chat_bubble_radius,
    field_data_id,
    field_name,
    label,
    files: current_files,
  };

  /**
   * Get the label for the selected value
   */
  const selected_label = value
    ? options.find((option) => option.value === value)?.label || placeholder
    : placeholder;

  // Dynamic imports for shadcn components
  // These will be resolved by the consuming application's bundler
  const [Components, setComponents] = React.useState<{
    Popover: any;
    PopoverTrigger: any;
    PopoverContent: any;
    Command: any;
    CommandInput: any;
    CommandList: any;
    CommandEmpty: any;
    CommandGroup: any;
    CommandItem: any;
    Check: any;
    ChevronsUpDown: any;
  } | null>(null);
  const [is_loading, set_is_loading] = React.useState(true);

  useEffect(() => {
    const loadComponents = async () => {
      try {
        set_is_loading(true);
        // Try to import from consuming app's components directory
        // This path will be resolved by Next.js/webpack in the consuming app
        // @ts-expect-error - These modules are provided by the consuming application
        const popoverModule = await import('@/components/ui/popover').catch(() => null);
        // @ts-expect-error - These modules are provided by the consuming application
        const commandModule = await import('@/components/ui/command').catch(() => null);
        const lucideModule = await import('lucide-react').catch(() => null);
        
        if (popoverModule && commandModule && lucideModule) {
          setComponents({
            Popover: popoverModule.Popover,
            PopoverTrigger: popoverModule.PopoverTrigger,
            PopoverContent: popoverModule.PopoverContent,
            Command: commandModule.Command,
            CommandInput: commandModule.CommandInput,
            CommandList: commandModule.CommandList,
            CommandEmpty: commandModule.CommandEmpty,
            CommandGroup: commandModule.CommandGroup,
            CommandItem: commandModule.CommandItem,
            Check: lucideModule.Check,
            ChevronsUpDown: lucideModule.ChevronsUpDown,
          });
        } else {
          console.warn(
            '[HazoCollabFormCombo] shadcn Popover, Command, or lucide-react not found. ' +
            'Please install them: npx shadcn@latest add popover command && npm install lucide-react'
          );
        }
      } catch (error) {
        console.warn('[HazoCollabFormCombo] Error loading components:', error);
      } finally {
        set_is_loading(false);
      }
    };

    loadComponents();
  }, []);

  /**
   * Handle option selection by value
   * When an option is selected, call onChange with the option value
   * If the same option is selected again, deselect it (empty value)
   */
  const handle_select_by_value = React.useCallback((selected_value: string) => {
    const new_value = selected_value === value ? '' : selected_value;
    onChange(new_value);
    set_open(false);
  }, [value, onChange]);

  /**
   * Handle option selection by label (fallback)
   * Used when CommandItem value is set to option.label for search
   */
  const handle_select_by_label = React.useCallback((selected_label: string) => {
    // Find the option by label (since CommandItem value is set to option.label for better search)
    const matching_option = options.find((opt) => opt.label === selected_label);
    if (matching_option) {
      handle_select_by_value(matching_option.value);
    }
  }, [options, handle_select_by_value]);

  // Show loading state while components are loading (prevents flash of error message)
  if (is_loading) {
    return (
      <CollabFormFieldContainer
        has_chat_messages={has_chat_messages}
        is_chat_active={is_chat_active}
        chat_background_color={chat_background_color}
        is_data_ok_default={is_data_ok_default}
        container_class_name={container_class_name}
        {...chat_container_props}
      >
        <CollabFormFieldLabel
          field_id_final={field_id_final}
          label={label}
          label_class_name={label_class_name}
          required={required}
        />
        <div className={cn('cls_collab_combo_wrapper flex items-center gap-2', combo_wrapper_class_name)} suppressHydrationWarning>
          <div className={cn(
            field_width_class_name || 'flex-1',
            field_width_class_name && 'flex-shrink-0'
          )}>
            <div className={cn(
              'w-full h-9 rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm md:text-sm flex items-center',
              error && 'border-destructive',
              button_class_name
            )}>
              <span className={cn('truncate text-muted-foreground')}>
                {placeholder}
              </span>
            </div>
          </div>
          {!disable_data_ok && (
            <CollabFormDataOkCheckbox
              label={label}
              data_ok_checked={data_ok_checked}
              on_data_ok_change={on_data_ok_change}
              editable={data_ok_editable}
            />
          )}
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
        <CollabFormFieldReferenceTag
          reference_value={reference_value}
          reference_label={reference_label}
          reference_tag_background_color={reference_tag_background_color}
        />
        <CollabFormFieldError
          field_id_final={field_id_final}
          error={error}
          error_class_name={error_class_name}
        />
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
  }

  // Fallback UI if components failed to load
  if (!Components) {
    return (
      <CollabFormFieldContainer
        has_chat_messages={has_chat_messages}
        is_chat_active={is_chat_active}
        chat_background_color={chat_background_color}
        is_data_ok_default={is_data_ok_default}
        container_class_name={container_class_name}
        {...chat_container_props}
      >
        <CollabFormFieldLabel
          field_id_final={field_id_final}
          label={label}
          label_class_name={label_class_name}
          required={required}
        />
        <div className={cn('cls_collab_combo_wrapper flex items-center gap-2', combo_wrapper_class_name)} suppressHydrationWarning>
          <div className={cn(
            field_width_class_name || 'flex-1',
            field_width_class_name && 'flex-shrink-0'
          )}>
            <div className="w-full rounded-md border border-destructive bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <div className="font-medium">Missing shadcn/ui components</div>
              <div className="mt-1 text-xs opacity-90">
                Run: <code className="bg-destructive/20 px-1 rounded">npx hazo-collab-forms-setup --combo</code>
              </div>
              <div className="mt-1 text-xs opacity-70">
                Or manually: <code className="bg-destructive/20 px-1 rounded">npx shadcn@latest add popover command</code>
              </div>
            </div>
          </div>
          <CollabFormDataOkCheckbox
            label={label}
            data_ok_checked={data_ok_checked}
            on_data_ok_change={on_data_ok_change}
          />
          <CollabFormChatIcon
            label={label}
            error={error}
            on_click={handle_chat_icon_click}
            multi_state_radio={multi_state_radio}
            has_chat_messages={has_chat_messages}
            button_disabled={is_chat_disabled}
          />
        </div>
        <CollabFormFieldReferenceTag
          reference_value={reference_value}
          reference_label={reference_label}
          reference_tag_background_color={reference_tag_background_color}
        />
        <CollabFormFieldError
          field_id_final={field_id_final}
          error={error}
          error_class_name={error_class_name}
        />
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
  }

  const {
    Popover,
    PopoverTrigger,
    PopoverContent,
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    Check,
    ChevronsUpDown,
  } = Components;

  return (
    <CollabFormFieldContainer
      has_chat_messages={has_chat_messages}
      is_chat_active={is_chat_active}
      chat_background_color={chat_background_color}
      is_data_ok_default={is_data_ok_default}
      container_class_name={container_class_name}
      {...chat_container_props}
    >
      {/* Label */}
      <CollabFormFieldLabel
        field_id_final={field_id_final}
        label={label}
        label_class_name={label_class_name}
        required={required}
      />

      {/* Combobox wrapper with chat icon */}
      <div className={cn('cls_collab_combo_wrapper flex items-center gap-2', combo_wrapper_class_name)} suppressHydrationWarning>
        {/* Width-constrained wrapper for the button - controls width independently */}
        <div className={cn(
          field_width_class_name || 'flex-1',
          field_width_class_name && 'flex-shrink-0'
        )}>
          <Popover open={open} onOpenChange={set_open}>
            <PopoverTrigger asChild>
              <button
                ref={component_ref}
                type="button"
                role="combobox"
                aria-expanded={open}
                aria-controls={`${field_id_final}-combobox`}
                disabled={is_field_disabled}
                className={cn(
                  'cls_collab_combo_button w-full h-9 justify-between rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm flex items-center',
                  error && 'border-destructive focus-visible:ring-destructive',
                  button_class_name
                )}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? `${field_id_final}-error` : undefined}
              >
                <span className={cn('truncate', !value && 'text-muted-foreground')}>
                  {selected_label}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </button>
            </PopoverTrigger>
          <PopoverContent 
            className="w-[var(--radix-popover-trigger-width)] p-0" 
            align="start"
            id={`${field_id_final}-combobox`}
          >
            <Command>
              {enable_search && (
                <CommandInput 
                  placeholder={search_placeholder} 
                  className="h-9"
                />
              )}
              <CommandList>
                <CommandEmpty>{empty_message}</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      keywords={[option.label]}
                      onSelect={(currentValue: string) => {
                        console.log('[HazoCollabFormCombo] onSelect called with:', currentValue);
                        handle_select_by_value(currentValue);
                      }}
                      onClick={(e: React.MouseEvent) => {
                        // Fallback click handler
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('[HazoCollabFormCombo] onClick called for:', option.value);
                        handle_select_by_value(option.value);
                      }}
                      className="cursor-pointer"
                      style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          value === option.value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        </div>

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

HazoCollabFormCombo.displayName = 'HazoCollabFormCombo';
