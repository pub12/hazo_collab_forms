/**
 * Collaboration form date picker component
 * Provides a reusable date picker field with label, error message, and chat icon functionality
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
 * Date range value type
 */
export interface DateRangeValue {
  from: string;
  to: string;
}

/**
 * Props for the HazoCollabFormDate component
 */
export interface HazoCollabFormDateProps extends CollabFormFieldBaseProps {
  /**
   * Current value of the date picker
   * For single date mode: ISO date string (YYYY-MM-DD) or empty string
   * For range mode: DateRangeValue object with from and to ISO date strings
   */
  value: string | DateRangeValue | undefined;
  
  /**
   * Callback when date value changes
   * For single date mode: receives ISO date string (YYYY-MM-DD) or empty string
   * For range mode: receives DateRangeValue object
   */
  onChange: (value: string | DateRangeValue) => void;
  
  /**
   * Date picker mode: 'single' for single date selection, 'range' for date range selection
   * Default: 'single'
   */
  date_mode?: 'single' | 'range';
  
  /**
   * Minimum selectable date (ISO date string YYYY-MM-DD)
   */
  min_date?: string;
  
  /**
   * Maximum selectable date (ISO date string YYYY-MM-DD)
   */
  max_date?: string;
  
  /**
   * Array of disabled dates (ISO date strings YYYY-MM-DD)
   */
  disabled_dates?: string[];
  
  /**
   * Custom className for the date picker wrapper
   */
  date_wrapper_class_name?: string;
  
  /**
   * Placeholder text for the date picker button
   */
  placeholder?: string;
}

/**
 * Exposed methods for HazoCollabFormDate
 */
export interface HazoCollabFormDateRef {
  /**
   * Get the current files data
   * Returns array of FileData objects
   */
  get_file_data: () => FileData[];
}

/**
 * Convert ISO date string to Date object
 */
function iso_string_to_date(iso_string: string | undefined): Date | undefined {
  if (!iso_string) return undefined;
  const date = new Date(iso_string + 'T00:00:00');
  return isNaN(date.getTime()) ? undefined : date;
}

/**
 * Convert Date object to ISO date string (YYYY-MM-DD)
 */
function date_to_iso_string(date: Date | undefined): string {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format date for display
 */
function format_date_display(iso_string: string | undefined): string {
  if (!iso_string) return '';
  const date = iso_string_to_date(iso_string);
  if (!date) return '';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/**
 * Collaboration form date picker component
 * Displays a labeled date picker field with error message and chat icon
 */
export const HazoCollabFormDate = React.forwardRef<
  HTMLButtonElement & HazoCollabFormDateRef,
  HazoCollabFormDateProps
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
      } as HTMLButtonElement & HazoCollabFormDateRef;
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
    on_chat_click,
    has_chat_messages,
    is_chat_active,
    chat_background_color = 'bg-muted',
    is_data_ok_default,
    container_class_name,
    label_class_name,
    date_wrapper_class_name,
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
    id,
    date_mode = 'single',
    min_date,
    max_date,
    disabled_dates,
    placeholder,
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

  // State for popover open/close
  const [popover_open, set_popover_open] = React.useState(false);

  // Dynamic imports for shadcn components
  const [Components, setComponents] = React.useState<{
    Popover: any;
    PopoverTrigger: any;
    PopoverContent: any;
    Calendar: any;
    Button: any;
    CalendarIcon: any;
  } | null>(null);
  const [is_loading, set_is_loading] = React.useState(true);
  const [is_mounted, set_is_mounted] = React.useState(false);

  React.useEffect(() => {
    set_is_mounted(true);
  }, []);

  React.useEffect(() => {
    if (!is_mounted) return;

    const loadComponents = async () => {
      try {
        set_is_loading(true);
        // Try to import from consuming app's components directory
        // This path will be resolved by Next.js/webpack in the consuming app
        // @ts-expect-error - These modules are provided by the consuming application
        const popoverModule = await import('@/components/ui/popover').catch(() => null);
        // @ts-expect-error - These modules are provided by the consuming application
        const calendarModule = await import('@/components/ui/calendar').catch(() => null);
        // @ts-expect-error - These modules are provided by the consuming application
        const buttonModule = await import('@/components/ui/button').catch(() => null);
        const lucideModule = await import('lucide-react').catch(() => null);
        
        if (popoverModule && calendarModule && buttonModule && lucideModule) {
          setComponents({
            Popover: popoverModule.Popover,
            PopoverTrigger: popoverModule.PopoverTrigger,
            PopoverContent: popoverModule.PopoverContent,
            Calendar: calendarModule.Calendar,
            Button: buttonModule.Button,
            CalendarIcon: lucideModule.CalendarIcon,
          });
        } else {
          console.warn(
            '[HazoCollabFormDate] shadcn Popover, Calendar, Button, or lucide-react not found. ' +
            'Please install them: npx shadcn@latest add popover calendar button && npm install lucide-react'
          );
        }
      } catch (error) {
        console.warn('[HazoCollabFormDate] Error loading components:', error);
      } finally {
        set_is_loading(false);
      }
    };

    loadComponents();
  }, [is_mounted]);

  /**
   * Get current date value(s) as Date objects for Calendar component
   */
  const get_calendar_date = React.useMemo(() => {
    if (date_mode === 'single') {
      return iso_string_to_date(value as string | undefined);
    } else {
      const range_value = value as DateRangeValue | undefined;
      if (!range_value) return undefined;
      return {
        from: iso_string_to_date(range_value.from),
        to: iso_string_to_date(range_value.to),
      };
    }
  }, [value, date_mode]);

  /**
   * Get disabled dates as Date objects
   */
  const disabled_dates_as_dates = React.useMemo(() => {
    if (!disabled_dates || disabled_dates.length === 0) return undefined;
    return disabled_dates.map(iso_string_to_date).filter((d): d is Date => d !== undefined);
  }, [disabled_dates]);

  /**
   * Get min/max dates as Date objects
   */
  const min_date_obj = React.useMemo(() => iso_string_to_date(min_date), [min_date]);
  const max_date_obj = React.useMemo(() => iso_string_to_date(max_date), [max_date]);

  /**
   * Handle date selection from Calendar
   */
  const handle_date_select = React.useCallback((selected_date: Date | { from?: Date; to?: Date } | undefined) => {
    if (!selected_date) {
      if (date_mode === 'single') {
        onChange('');
      } else {
        onChange({ from: '', to: '' });
      }
      return;
    }

    if (date_mode === 'single') {
      const date = selected_date as Date;
      onChange(date_to_iso_string(date));
      set_popover_open(false);
    } else {
      const range = selected_date as { from?: Date; to?: Date };
      // For range mode, we need to handle the selection differently
      // The Calendar component in range mode will provide { from, to }
      const new_range: DateRangeValue = {
        from: date_to_iso_string(range.from),
        to: date_to_iso_string(range.to),
      };
      onChange(new_range);
      // Close popover when both dates are selected
      if (range.from && range.to) {
        set_popover_open(false);
      }
    }
  }, [date_mode, onChange]);

  /**
   * Get display text for the date picker button
   */
  const get_button_text = React.useMemo(() => {
    if (date_mode === 'single') {
      const date_str = value as string | undefined;
      if (!date_str) return placeholder || 'Pick a date';
      return format_date_display(date_str);
    } else {
      const range_value = value as DateRangeValue | undefined;
      if (!range_value || (!range_value.from && !range_value.to)) {
        return placeholder || 'Pick a date range';
      }
      if (range_value.from && range_value.to) {
        return `${format_date_display(range_value.from)} - ${format_date_display(range_value.to)}`;
      }
      if (range_value.from) {
        return `${format_date_display(range_value.from)} - ...`;
      }
      return placeholder || 'Pick a date range';
    }
  }, [value, date_mode, placeholder]);

  // Show loading state while components are loading
  if (is_loading) {
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
        <CollabFormFieldLabel
          field_id_final={field_id_final}
          label={label}
          label_class_name={label_class_name}
          required={required}
        />
        <div className={cn('cls_collab_date_wrapper flex items-center gap-2', date_wrapper_class_name)} suppressHydrationWarning>
          <div className={cn(
            field_width_class_name || 'flex-1',
            field_width_class_name && 'flex-shrink-0'
          )}>
            <div className="cls_collab_date_loading w-full h-9 rounded-md border border-input bg-muted animate-pulse" />
          </div>
        </div>
      </CollabFormFieldContainer>
    );
  }

  // If components are not available, show fallback
  if (!Components) {
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
        <CollabFormFieldLabel
          field_id_final={field_id_final}
          label={label}
          label_class_name={label_class_name}
          required={required}
        />
        <div className={cn('cls_collab_date_wrapper flex items-center gap-2', date_wrapper_class_name)} suppressHydrationWarning>
          <div className={cn(
            field_width_class_name || 'flex-1',
            field_width_class_name && 'flex-shrink-0'
          )}>
            <div className="cls_collab_date_fallback w-full rounded-md border border-destructive bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <div className="font-medium">Missing shadcn/ui components</div>
              <div className="mt-1 text-xs opacity-90">
                Run: <code className="bg-destructive/20 px-1 rounded">npx hazo-collab-forms-setup --date</code>
              </div>
              <div className="mt-1 text-xs opacity-70">
                Or manually: <code className="bg-destructive/20 px-1 rounded">npx shadcn@latest add popover calendar button</code>
              </div>
            </div>
          </div>
        </div>
        {error && (
          <CollabFormFieldError
            field_id_final={field_id_final}
            error={error}
            error_class_name={error_class_name}
          />
        )}
      </CollabFormFieldContainer>
    );
  }

  const { Popover, PopoverTrigger, PopoverContent, Calendar, Button, CalendarIcon } = Components;

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

      {/* Date picker wrapper with chat icon */}
      <div className={cn('cls_collab_date_wrapper flex items-center gap-2', date_wrapper_class_name)} suppressHydrationWarning>
        {/* Width-constrained wrapper for the button - controls width independently of Button component */}
        <div className={cn(
          field_width_class_name || 'flex-1',
          field_width_class_name && 'flex-shrink-0'
        )}>
          <Popover open={popover_open} onOpenChange={set_popover_open}>
            <PopoverTrigger asChild>
              <Button
                ref={component_ref}
                id={field_id_final}
                variant="outline"
                disabled={is_field_disabled}
                className={cn(
                  'cls_collab_date_button w-full h-9 justify-start text-left font-normal',
                  !value && 'text-muted-foreground',
                  error && 'border-destructive focus-visible:ring-destructive'
                )}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? `${field_id_final}-error` : undefined}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {get_button_text}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode={date_mode}
                selected={get_calendar_date}
                onSelect={handle_date_select}
                disabled={(date: Date) => {
                  // Normalize date to midnight for accurate comparison
                  const normalized_date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                  
                  // Check if date is before min_date
                  if (min_date_obj) {
                    const normalized_min = new Date(min_date_obj.getFullYear(), min_date_obj.getMonth(), min_date_obj.getDate());
                    if (normalized_date < normalized_min) return true;
                  }
                  // Check if date is after max_date
                  if (max_date_obj) {
                    const normalized_max = new Date(max_date_obj.getFullYear(), max_date_obj.getMonth(), max_date_obj.getDate());
                    if (normalized_date > normalized_max) return true;
                  }
                  // Check if date is in disabled_dates
                  if (disabled_dates_as_dates) {
                    const date_str = date_to_iso_string(date);
                    return disabled_dates_as_dates.some(d => date_to_iso_string(d) === date_str);
                  }
                  return false;
                }}
                initialFocus
              />
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

HazoCollabFormDate.displayName = 'HazoCollabFormDate';

