/**
 * Collaboration form data table component
 * Provides a dynamic data table with inline editing, configurable columns,
 * validation, file uploads, and aggregation support
 */

'use client';

import React from 'react';
import { HiPlus, HiTrash, HiQuestionMarkCircle, HiX } from 'react-icons/hi';
import { IoDocumentAttachOutline } from 'react-icons/io5';
import { cn } from '../utils/cn.js';
import { use_logger } from '../logger/context.js';
import {
  use_collab_form_field,
  CollabFormFieldContainer,
  CollabFormFieldLabel,
  CollabFormChatIcon,
  CollabFormFieldError,
  CollabFormFieldReferenceTag,
  CollabFormDataOkCheckbox,
  CollabFormNotesIcon,
  type CollabFormFieldBaseProps,
  type FileData,
  type NoteEntry,
} from './hazo_collab_form_base.js';

// =========================================
// TYPE DEFINITIONS
// =========================================

/**
 * Column field types supported by the data table
 */
export type DataTableFieldType =
  | 'text'
  | 'numeric'
  | 'dropdown'
  | 'files'
  | 'checkbox'
  | 'radiobutton';

/**
 * Aggregation types for column totals
 */
export type AggregationType = 'sum' | 'average' | 'count' | 'none';

/**
 * Option type for dropdown/radio columns
 */
export interface DataTableOption {
  label: string;
  value: string;
}

/**
 * Header styling configuration
 */
export interface HeaderStyling {
  bold?: boolean;
  italic?: boolean;
  size?: string;
  color?: string;
}

/**
 * Constraints for field validation
 */
export interface ColumnConstraints {
  min?: number;
  max?: number;
  length?: number;
  regex?: string;
  required?: boolean;
  num_decimals?: number;
}

/**
 * File upload configuration for files column
 */
export interface FilesColumnConfig {
  target_path: string;
  max_files?: number;
  file_accept?: string;
  max_size?: number;
}

/**
 * Aggregation configuration
 */
export interface AggregationConfig {
  type: AggregationType;
  label?: string;
}

/**
 * Tooltip configuration using shadcn HoverCard
 */
export interface TooltipConfig {
  enabled: boolean;
  title?: string;
  content: string;
}

/**
 * Column configuration
 */
export interface DataTableColumn {
  /**
   * Unique identifier for the column
   */
  id: string;

  /**
   * Display label for the column header
   */
  label: string;

  /**
   * Field type for the column cells
   */
  field_type: DataTableFieldType;

  /**
   * Whether cells in this column are editable
   * Default: true
   */
  editable?: boolean;

  /**
   * Background color class for cells (Tailwind class)
   */
  background_color?: string;

  /**
   * Header styling configuration
   */
  header_styling?: HeaderStyling;

  /**
   * Width class for the column (Tailwind class, e.g., 'w-32', 'w-48')
   */
  width?: string;

  /**
   * Validation constraints for text/numeric fields
   */
  constraints?: ColumnConstraints;

  /**
   * Options for dropdown/radiobutton fields
   */
  options?: DataTableOption[];

  /**
   * File upload configuration for files field type
   */
  files_config?: FilesColumnConfig;

  /**
   * Aggregation configuration for subtotal row
   */
  aggregation?: AggregationConfig;

  /**
   * Tooltip configuration for column header
   */
  tooltip?: TooltipConfig;
}

/**
 * Table configuration
 */
export interface DataTableConfig {
  /**
   * Array of column definitions
   */
  columns: DataTableColumn[];

  /**
   * Whether to show add row button
   * Default: true
   */
  allow_add_row?: boolean;

  /**
   * Whether to show delete row button on each row
   * Default: true
   */
  allow_delete_row?: boolean;

  /**
   * Whether to show row numbers column
   * Default: false
   */
  show_row_numbers?: boolean;

  /**
   * Whether to show subtotal/aggregation row at bottom
   * Default: true (if any column has aggregation configured)
   */
  show_subtotal_row?: boolean;

  /**
   * Message to display when table has no rows
   */
  empty_message?: string;

  /**
   * Maximum number of rows allowed
   */
  max_rows?: number;

  /**
   * Whether to enable row-level collaboration features (chat, notes, data-ok)
   * Default: true
   */
  enable_row_collab?: boolean;
}

/**
 * Row data structure
 */
export interface DataTableRow {
  /**
   * Unique identifier for the row (auto-generated)
   */
  _row_id: string;

  /**
   * Row-level data-ok state
   */
  _data_ok?: boolean;

  /**
   * Row-level files data (keyed by column id)
   */
  _files?: Record<string, FileData[]>;

  /**
   * Whether this row has chat messages (for highlighting)
   */
  _has_chat_messages?: boolean;

  /**
   * Row-level notes entries
   */
  _notes?: NoteEntry[];

  /**
   * Whether this row has notes
   */
  _has_notes?: boolean;

  /**
   * Dynamic column values
   */
  [column_id: string]: any;
}

/**
 * Props for HazoCollabFormDataTable
 */
export interface HazoCollabFormDataTableProps extends CollabFormFieldBaseProps {
  /**
   * Table configuration (columns, settings)
   */
  table_config: DataTableConfig;

  /**
   * Current table data (array of rows)
   */
  value: DataTableRow[];

  /**
   * Callback when table data changes
   */
  onChange: (rows: DataTableRow[]) => void;

  /**
   * Custom className for the table element
   */
  table_class_name?: string;

  /**
   * Custom className for header row
   */
  header_class_name?: string;

  /**
   * Custom className for data rows
   */
  row_class_name?: string;

  /**
   * Custom className for cells
   */
  cell_class_name?: string;

  /**
   * Whether the entire table is disabled
   */
  disabled?: boolean;

  /**
   * Callback when row-level chat icon is clicked
   * Receives the row_id and row_index
   */
  on_row_chat_click?: (row_id: string, row_index: number) => void;

  /**
   * Callback when row-level notes change
   * Receives the row_id and notes entries
   */
  on_row_notes_change?: (row_id: string, notes: NoteEntry[]) => void;
}

/**
 * Exposed methods for HazoCollabFormDataTable
 */
export interface HazoCollabFormDataTableRef {
  /**
   * Get all file data from the table
   */
  get_file_data: () => FileData[];

  /**
   * Add a new row to the table
   */
  add_row: () => void;

  /**
   * Delete a row by its row ID
   */
  delete_row: (row_id: string) => void;

  /**
   * Get computed aggregation values
   */
  get_aggregations: () => Record<string, number>;
}

// =========================================
// UTILITY FUNCTIONS
// =========================================

/**
 * Generate a unique row ID
 */
function generate_row_id(): string {
  return `row_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Calculate aggregation value for a column
 */
function calculate_aggregation(
  column: DataTableColumn,
  rows: DataTableRow[]
): number | null {
  if (!column.aggregation || column.aggregation.type === 'none') {
    return null;
  }

  const values = rows
    .map((row) => {
      const val = row[column.id];
      if (typeof val === 'number') return val;
      if (typeof val === 'string') {
        const parsed = parseFloat(val);
        return isNaN(parsed) ? null : parsed;
      }
      return null;
    })
    .filter((val): val is number => val !== null);

  switch (column.aggregation.type) {
    case 'sum':
      return values.reduce((acc, val) => acc + val, 0);
    case 'average':
      return values.length > 0
        ? values.reduce((acc, val) => acc + val, 0) / values.length
        : 0;
    case 'count':
      return values.length;
    default:
      return null;
  }
}

/**
 * Format number for display with optional decimals
 */
function format_number(value: number, decimals?: number): string {
  if (decimals !== undefined) {
    return value.toFixed(decimals);
  }
  return value.toLocaleString();
}

/**
 * Validate a cell value against column constraints
 */
function validate_cell(
  value: any,
  column: DataTableColumn
): string | undefined {
  const constraints = column.constraints;
  if (!constraints) return undefined;

  // Required check
  if (constraints.required && (value === undefined || value === null || value === '')) {
    return 'Required';
  }

  // Skip further validation if empty and not required
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  // Numeric validations
  if (column.field_type === 'numeric') {
    const num_value = typeof value === 'number' ? value : parseFloat(value);
    if (isNaN(num_value)) {
      return 'Invalid number';
    }
    if (constraints.min !== undefined && num_value < constraints.min) {
      return `Minimum: ${constraints.min}`;
    }
    if (constraints.max !== undefined && num_value > constraints.max) {
      return `Maximum: ${constraints.max}`;
    }
  }

  // Text validations
  if (column.field_type === 'text') {
    const str_value = String(value);
    if (constraints.length !== undefined && str_value.length > constraints.length) {
      return `Maximum ${constraints.length} characters`;
    }
    if (constraints.regex) {
      const regex = new RegExp(constraints.regex);
      if (!regex.test(str_value)) {
        return 'Invalid format';
      }
    }
  }

  return undefined;
}

// =========================================
// CELL RENDERER COMPONENTS
// =========================================

/**
 * Text cell renderer
 */
function TextCell({
  column,
  value,
  onChange,
  disabled,
  error,
}: {
  column: DataTableColumn;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
}) {
  const is_editable = column.editable !== false && !disabled;

  // Render as plain text label when not editable
  if (!is_editable) {
    return (
      <span
        className={cn(
          'cls_data_table_text_cell_readonly flex items-center h-8 px-2 text-sm font-medium',
          column.background_color
        )}
        title={value || ''}
      >
        {value || ''}
      </span>
    );
  }

  return (
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      maxLength={column.constraints?.length}
      className={cn(
        'cls_data_table_text_cell w-full h-8 px-2 text-sm border rounded-md',
        'bg-transparent focus:outline-none focus:ring-1 focus:ring-ring',
        error && 'border-destructive',
        column.background_color
      )}
      title={error}
    />
  );
}

/**
 * Numeric cell renderer
 */
function NumericCell({
  column,
  value,
  onChange,
  disabled,
  error,
}: {
  column: DataTableColumn;
  value: string | number;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
}) {
  const is_editable = column.editable !== false && !disabled;
  const str_value = value === undefined || value === null ? '' : String(value);

  const handle_change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input_value = e.target.value;
    // Allow empty, numbers, decimals, and negative sign
    if (input_value === '' || /^-?\d*\.?\d*$/.test(input_value)) {
      onChange(input_value);
    }
  };

  // Render as plain text label when not editable
  if (!is_editable) {
    return (
      <span
        className={cn(
          'cls_data_table_numeric_cell_readonly flex items-center justify-end h-8 px-2 text-sm font-medium',
          column.background_color
        )}
        title={str_value}
      >
        {str_value}
      </span>
    );
  }

  return (
    <input
      type="text"
      inputMode="decimal"
      value={str_value}
      onChange={handle_change}
      className={cn(
        'cls_data_table_numeric_cell w-full h-8 px-2 text-sm text-right border rounded-md',
        'bg-transparent focus:outline-none focus:ring-1 focus:ring-ring',
        error && 'border-destructive',
        column.background_color
      )}
      title={error}
    />
  );
}

/**
 * Dropdown cell renderer
 */
function DropdownCell({
  column,
  value,
  onChange,
  disabled,
  error,
}: {
  column: DataTableColumn;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
}) {
  const is_editable = column.editable !== false && !disabled;
  const options = column.options || [];

  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={!is_editable}
      className={cn(
        'cls_data_table_dropdown_cell w-full h-8 px-2 text-sm border rounded-md',
        'bg-transparent focus:outline-none focus:ring-1 focus:ring-ring',
        !is_editable && 'cursor-not-allowed opacity-70 bg-muted',
        error && 'border-destructive',
        column.background_color
      )}
      title={error}
    >
      <option value="">Select...</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

/**
 * Checkbox cell renderer
 */
function CheckboxCell({
  column,
  value,
  onChange,
  disabled,
}: {
  column: DataTableColumn;
  value: boolean | string;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}) {
  const is_editable = column.editable !== false && !disabled;
  const checked = value === true || value === 'true';

  return (
    <div className="flex items-center justify-center h-8">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={!is_editable}
        className={cn(
          'cls_data_table_checkbox_cell h-4 w-4 rounded border-input',
          !is_editable && 'cursor-not-allowed opacity-70'
        )}
      />
    </div>
  );
}

/**
 * Radio button cell renderer
 */
function RadioCell({
  column,
  value,
  onChange,
  disabled,
  row_id,
}: {
  column: DataTableColumn;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  row_id: string;
}) {
  const is_editable = column.editable !== false && !disabled;
  const options = column.options || [];
  const radio_name = `${row_id}_${column.id}`;

  return (
    <div className="flex items-center gap-2 h-8 px-1">
      {options.map((opt) => (
        <label
          key={opt.value}
          className={cn(
            'flex items-center gap-1 text-xs cursor-pointer',
            !is_editable && 'cursor-not-allowed opacity-70'
          )}
        >
          <input
            type="radio"
            name={radio_name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            disabled={!is_editable}
            className="h-3 w-3"
          />
          <span>{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

/**
 * Files cell renderer (compact badge + modal)
 */
/**
 * Helper function to truncate filename with ellipsis
 * Keeps extension visible: "verylongfilename.pdf" -> "verylong...pdf"
 */
function truncate_filename(filename: string, max_length: number = 12): string {
  if (filename.length <= max_length) return filename;

  const last_dot = filename.lastIndexOf('.');
  if (last_dot === -1) {
    // No extension
    return filename.slice(0, max_length - 3) + '...';
  }

  const extension = filename.slice(last_dot);
  const name = filename.slice(0, last_dot);
  const available_for_name = max_length - extension.length - 3; // 3 for "..."

  if (available_for_name <= 0) {
    return filename.slice(0, max_length - 3) + '...';
  }

  return name.slice(0, available_for_name) + '...' + extension;
}

function FilesCell({
  column,
  files,
  onFilesChange,
  disabled,
  row_id,
}: {
  column: DataTableColumn;
  files: FileData[];
  onFilesChange: (files: FileData[]) => void;
  disabled?: boolean;
  row_id: string;
}) {
  const is_editable = column.editable !== false && !disabled;
  const file_count = files?.length || 0;
  const max_files = column.files_config?.max_files || 10;
  const can_add_more = file_count < max_files;

  /**
   * Remove a file by index
   */
  const remove_file = (idx: number) => {
    if (!is_editable) return;
    const new_files = files.filter((_, i) => i !== idx);
    onFilesChange(new_files);
  };

  /**
   * Handle file input change
   */
  const handle_file_input = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input_files = e.target.files;
    if (!input_files) return;

    const new_files: FileData[] = Array.from(input_files).map((f) => ({
      file_path: column.files_config?.target_path || '/uploads',
      file_name: f.name,
      file_size: f.size,
      file_type: f.type,
      file_id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      uploaded_at: new Date(),
    }));

    const combined = [...(files || []), ...new_files].slice(0, max_files);
    onFilesChange(combined);
    e.target.value = '';
  };

  /**
   * Handle file click - open in new tab or download
   */
  const handle_file_click = (file: FileData) => {
    if (file.file_path) {
      // Open file in new tab
      window.open(file.file_path, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="flex items-center gap-1 flex-wrap min-h-[32px] py-1 px-1">
      {/* File tags */}
      {files && files.length > 0 && files.map((file, idx) => (
        <span
          key={file.file_id || idx}
          className={cn(
            'cls_data_table_file_tag inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs',
            'bg-primary/10 text-primary border border-primary/20',
            'max-w-[120px]'
          )}
          title={file.file_name}
        >
          <button
            type="button"
            onClick={() => handle_file_click(file)}
            className="truncate hover:underline cursor-pointer"
            title={`Open ${file.file_name}`}
          >
            {truncate_filename(file.file_name, 10)}
          </button>
          {is_editable && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                remove_file(idx);
              }}
              className="text-primary/60 hover:text-destructive flex-shrink-0"
              title="Remove file"
            >
              <HiX className="h-3 w-3" />
            </button>
          )}
        </span>
      ))}

      {/* Add file button */}
      {is_editable && can_add_more && (
        <>
          <input
            type="file"
            multiple
            accept={column.files_config?.file_accept}
            onChange={handle_file_input}
            className="hidden"
            id={`file-input-${row_id}-${column.id}`}
          />
          <label
            htmlFor={`file-input-${row_id}-${column.id}`}
            className={cn(
              'cls_data_table_add_file inline-flex items-center justify-center px-1.5 py-0.5 rounded text-xs cursor-pointer',
              'border border-dashed border-input text-muted-foreground hover:border-primary hover:text-primary',
              'transition-colors'
            )}
            title="Add files"
          >
            <IoDocumentAttachOutline className="h-4 w-4" />
          </label>
        </>
      )}

      {/* Empty state */}
      {file_count === 0 && !is_editable && (
        <span className="text-xs text-muted-foreground">No files</span>
      )}
    </div>
  );
}

// =========================================
// TOOLTIP COMPONENT
// =========================================

/**
 * Column header tooltip using HoverCard
 */
function ColumnTooltip({
  tooltip,
}: {
  tooltip: TooltipConfig;
}) {
  const logger = use_logger();
  const [HoverCardComponents, setHoverCardComponents] = React.useState<{
    HoverCard: React.ComponentType<any>;
    HoverCardTrigger: React.ComponentType<any>;
    HoverCardContent: React.ComponentType<any>;
  } | null>(null);

  React.useEffect(() => {
    const loadComponents = async () => {
      try {
        // @ts-expect-error - These modules are provided by the consuming application
        const hoverCardModule = await import('@/components/ui/hover-card').catch(() => null);
        if (hoverCardModule) {
          setHoverCardComponents({
            HoverCard: hoverCardModule.HoverCard,
            HoverCardTrigger: hoverCardModule.HoverCardTrigger,
            HoverCardContent: hoverCardModule.HoverCardContent,
          });
        }
      } catch (error) {
        logger.warn('[ColumnTooltip] Error loading HoverCard', {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    };
    loadComponents();
  }, []);

  if (!HoverCardComponents) {
    return (
      <span title={tooltip.content}>
        <HiQuestionMarkCircle className="h-4 w-4 text-muted-foreground" />
      </span>
    );
  }

  const { HoverCard, HoverCardTrigger, HoverCardContent } = HoverCardComponents;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button type="button" className="inline-flex">
          <HiQuestionMarkCircle className="h-4 w-4 text-muted-foreground hover:text-foreground" />
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-64">
        {tooltip.title && (
          <h4 className="font-medium text-sm mb-1">{tooltip.title}</h4>
        )}
        <p className="text-sm text-muted-foreground">{tooltip.content}</p>
      </HoverCardContent>
    </HoverCard>
  );
}

// =========================================
// MAIN COMPONENT
// =========================================

/**
 * Collaboration form data table component
 */
export const HazoCollabFormDataTable = React.forwardRef<
  HazoCollabFormDataTableRef,
  HazoCollabFormDataTableProps
>((props, ref) => {
  const {
    label,
    error,
    field_id,
    field_data_id,
    field_name,
    table_config,
    value,
    onChange,
    table_class_name,
    header_class_name,
    row_class_name,
    cell_class_name,
    disabled,
    on_chat_click,
    has_chat_messages,
    is_chat_active,
    chat_background_color = 'bg-muted',
    is_data_ok_default,
    container_class_name,
    label_class_name,
    error_class_name,
    required,
    data_ok_checked,
    on_data_ok_change,
    data_ok_editable,
    disable_data_ok,
    disable_chat,
    enable_notes,
    disable_notes,
    notes,
    on_notes_change,
    has_notes,
    current_user,
    id,
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
    reference_value,
    reference_label,
    reference_tag_background_color,
    on_row_chat_click,
    on_row_notes_change,
  } = props;

  const logger = use_logger();

  // Initialize rows with empty array if undefined
  const rows = value || [];

  // Cell validation errors state
  const [cell_errors, set_cell_errors] = React.useState<Record<string, Record<string, string>>>({});

  // Row-level chat state - tracks which row's chat is currently open
  const [active_row_chat, set_active_row_chat] = React.useState<{ row_id: string; row_index: number } | null>(null);

  // Dynamic import for HazoChat component
  const [HazoChatComponent, setHazoChatComponent] = React.useState<React.ComponentType<any> | null>(null);

  // Use the common collab form field hook
  const { field_id_final, handle_chat_icon_click, handle_chat_close, chat_is_open, is_chat_disabled } =
    use_collab_form_field({
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

  // Config defaults
  const columns = table_config.columns || [];
  const allow_add_row = table_config.allow_add_row !== false;
  const allow_delete_row = table_config.allow_delete_row !== false;
  const show_row_numbers = table_config.show_row_numbers === true;
  const enable_row_collab = table_config.enable_row_collab !== false;
  const max_rows = table_config.max_rows;
  const empty_message = table_config.empty_message || 'No data. Click "Add Row" to begin.';

  // Check if any row action is actually enabled
  const has_row_data_ok = enable_row_collab && !disable_data_ok;
  const has_row_notes = enable_row_collab && enable_notes && !disable_notes;
  const has_row_chat = enable_row_collab && !disable_chat;
  const show_actions_column = has_row_data_ok || has_row_notes || has_row_chat || allow_delete_row;

  // Load HazoChat dynamically when row chat is enabled
  React.useEffect(() => {
    if (has_row_chat && hazo_chat_group_id && !HazoChatComponent) {
      const loadHazoChat = async () => {
        try {
          const module = await import('hazo_chat');
          if (module.HazoChat) {
            setHazoChatComponent(() => module.HazoChat);
          }
        } catch (error) {
          logger.warn('[HazoCollabFormDataTable] HazoChat not available', {
            error: error instanceof Error ? error.message : String(error),
          });
        }
      };
      loadHazoChat();
    }
  }, [has_row_chat, hazo_chat_group_id, HazoChatComponent]);

  // Check if any column has aggregation
  const has_aggregations = columns.some(
    (col) => col.aggregation && col.aggregation.type !== 'none'
  );
  const show_subtotal_row = table_config.show_subtotal_row !== false && has_aggregations;

  /**
   * Add a new row
   */
  const add_row = React.useCallback(() => {
    if (max_rows && rows.length >= max_rows) {
      return;
    }

    const new_row: DataTableRow = {
      _row_id: generate_row_id(),
    };

    // Initialize default values for each column
    columns.forEach((col) => {
      if (col.field_type === 'checkbox') {
        new_row[col.id] = false;
      } else if (col.field_type === 'files') {
        // Files are stored in _files
      } else {
        new_row[col.id] = '';
      }
    });

    onChange([...rows, new_row]);
  }, [rows, columns, max_rows, onChange]);

  /**
   * Delete a row
   */
  const delete_row = React.useCallback(
    (row_id: string) => {
      onChange(rows.filter((row) => row._row_id !== row_id));
      // Clean up errors for deleted row
      set_cell_errors((prev) => {
        const updated = { ...prev };
        delete updated[row_id];
        return updated;
      });
    },
    [rows, onChange]
  );

  /**
   * Update a cell value
   */
  const update_cell = React.useCallback(
    (row_id: string, column_id: string, value: any) => {
      const updated_rows = rows.map((row) => {
        if (row._row_id === row_id) {
          return { ...row, [column_id]: value };
        }
        return row;
      });
      onChange(updated_rows);

      // Validate the cell
      const column = columns.find((c) => c.id === column_id);
      if (column) {
        const error = validate_cell(value, column);
        set_cell_errors((prev) => {
          const row_errors = { ...prev[row_id] };
          if (error) {
            row_errors[column_id] = error;
          } else {
            delete row_errors[column_id];
          }
          return { ...prev, [row_id]: row_errors };
        });
      }
    },
    [rows, columns, onChange]
  );

  /**
   * Update files for a cell
   */
  const update_files = React.useCallback(
    (row_id: string, column_id: string, files: FileData[]) => {
      const updated_rows = rows.map((row) => {
        if (row._row_id === row_id) {
          return {
            ...row,
            _files: {
              ...(row._files || {}),
              [column_id]: files,
            },
          };
        }
        return row;
      });
      onChange(updated_rows);
    },
    [rows, onChange]
  );

  /**
   * Get all file data from the table
   */
  const get_file_data = React.useCallback((): FileData[] => {
    const all_files: FileData[] = [];
    rows.forEach((row) => {
      if (row._files) {
        Object.values(row._files).forEach((files) => {
          all_files.push(...files);
        });
      }
    });
    return all_files;
  }, [rows]);

  /**
   * Get computed aggregation values
   */
  const get_aggregations = React.useCallback((): Record<string, number> => {
    const aggregations: Record<string, number> = {};
    columns.forEach((col) => {
      const result = calculate_aggregation(col, rows);
      if (result !== null) {
        aggregations[col.id] = result;
      }
    });
    return aggregations;
  }, [columns, rows]);

  // Expose ref methods
  React.useImperativeHandle(
    ref,
    () => ({
      get_file_data,
      add_row,
      delete_row,
      get_aggregations,
    }),
    [get_file_data, add_row, delete_row, get_aggregations]
  );

  /**
   * Render a cell based on field type
   */
  const render_cell = (row: DataTableRow, column: DataTableColumn) => {
    const cell_error = cell_errors[row._row_id]?.[column.id];

    switch (column.field_type) {
      case 'text':
        return (
          <TextCell
            column={column}
            value={row[column.id] || ''}
            onChange={(val) => update_cell(row._row_id, column.id, val)}
            disabled={disabled}
            error={cell_error}
          />
        );

      case 'numeric':
        return (
          <NumericCell
            column={column}
            value={row[column.id]}
            onChange={(val) => update_cell(row._row_id, column.id, val)}
            disabled={disabled}
            error={cell_error}
          />
        );

      case 'dropdown':
        return (
          <DropdownCell
            column={column}
            value={row[column.id] || ''}
            onChange={(val) => update_cell(row._row_id, column.id, val)}
            disabled={disabled}
            error={cell_error}
          />
        );

      case 'checkbox':
        return (
          <CheckboxCell
            column={column}
            value={row[column.id]}
            onChange={(val) => update_cell(row._row_id, column.id, val)}
            disabled={disabled}
          />
        );

      case 'radiobutton':
        return (
          <RadioCell
            column={column}
            value={row[column.id] || ''}
            onChange={(val) => update_cell(row._row_id, column.id, val)}
            disabled={disabled}
            row_id={row._row_id}
          />
        );

      case 'files':
        return (
          <FilesCell
            column={column}
            files={row._files?.[column.id] || []}
            onFilesChange={(files) => update_files(row._row_id, column.id, files)}
            disabled={disabled}
            row_id={row._row_id}
          />
        );

      default:
        return <span className="text-sm text-muted-foreground">Unsupported</span>;
    }
  };

  /**
   * Render column header with optional tooltip
   */
  const render_header = (column: DataTableColumn) => {
    const styling = column.header_styling || {};

    return (
      <div className="flex items-center gap-1">
        <span
          className={cn(
            'text-sm',
            styling.bold && 'font-bold',
            styling.italic && 'italic',
            styling.size,
            styling.color
          )}
        >
          {column.label}
        </span>
        {column.tooltip?.enabled && <ColumnTooltip tooltip={column.tooltip} />}
      </div>
    );
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
    >
      {/* Label */}
      <div className="flex items-center justify-between">
        <CollabFormFieldLabel
          field_id_final={field_id_final}
          label={label}
          label_class_name={label_class_name}
          required={required}
        />

        {/* Table-level actions */}
        <div className="flex items-center gap-2">
          {/* Data OK checkbox - table level */}
          {!disable_data_ok && (
            <CollabFormDataOkCheckbox
              label={label}
              data_ok_checked={data_ok_checked}
              on_data_ok_change={on_data_ok_change}
              editable={data_ok_editable}
            />
          )}

          {/* Notes icon - table level */}
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

          {/* Chat icon - table level */}
          {!disable_chat && (
            <CollabFormChatIcon
              label={label}
              error={error}
              on_click={handle_chat_icon_click}
              has_chat_messages={has_chat_messages}
              disabled={disable_chat}
              button_disabled={is_chat_disabled}
            />
          )}
        </div>
      </div>

      {/* Reference tag */}
      <CollabFormFieldReferenceTag
        reference_value={reference_value}
        reference_label={reference_label}
        reference_tag_background_color={reference_tag_background_color}
      />

      {/* Table */}
      <div className="cls_data_table_wrapper overflow-x-auto border rounded-md">
        <table
          className={cn('cls_data_table w-full border-collapse', table_class_name)}
        >
          {/* Header */}
          <thead>
            <tr className={cn('cls_data_table_header bg-muted/50', header_class_name)}>
              {/* Row number column */}
              {show_row_numbers && (
                <th className="cls_data_table_row_num_header w-10 px-2 py-2 text-left text-xs font-medium text-muted-foreground border-b">
                  #
                </th>
              )}

              {/* Data columns */}
              {columns.map((column) => (
                <th
                  key={column.id}
                  className={cn(
                    'cls_data_table_col_header px-2 py-2 text-left border-b',
                    column.width,
                    column.background_color
                  )}
                >
                  {render_header(column)}
                </th>
              ))}

              {/* Row actions column (collab + delete) */}
              {show_actions_column && (
                <th className="cls_data_table_actions_header w-24 px-2 py-2 text-center text-xs font-medium text-muted-foreground border-b">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    columns.length +
                    (show_row_numbers ? 1 : 0) +
                    (enable_row_collab || allow_delete_row ? 1 : 0)
                  }
                  className="px-4 py-8 text-center text-sm text-muted-foreground"
                >
                  {empty_message}
                </td>
              </tr>
            ) : (
              rows.map((row, row_index) => (
                <tr
                  key={row._row_id}
                  className={cn(
                    'cls_data_table_row border-b last:border-b-0 hover:bg-muted/30',
                    row._has_chat_messages && 'bg-destructive/10 hover:bg-destructive/15',
                    row_class_name
                  )}
                >
                  {/* Row number */}
                  {show_row_numbers && (
                    <td className="cls_data_table_row_num w-10 px-2 py-1 text-xs text-muted-foreground">
                      {row_index + 1}
                    </td>
                  )}

                  {/* Data cells */}
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      className={cn(
                        'cls_data_table_cell px-1 py-1',
                        column.width,
                        cell_class_name
                      )}
                    >
                      {render_cell(row, column)}
                    </td>
                  ))}

                  {/* Row actions */}
                  {show_actions_column && (
                    <td className="cls_data_table_row_actions px-1 py-1">
                      <div className="flex items-center justify-center gap-1">
                        {/* Row-level data OK */}
                        {has_row_data_ok && (
                          <CollabFormDataOkCheckbox
                            label={`Row ${row_index + 1}`}
                            data_ok_checked={row._data_ok}
                            on_data_ok_change={(checked) => {
                              const updated_rows = rows.map((r) =>
                                r._row_id === row._row_id
                                  ? { ...r, _data_ok: checked }
                                  : r
                              );
                              onChange(updated_rows);
                            }}
                            editable={data_ok_editable}
                          />
                        )}

                        {/* Row-level notes */}
                        {has_row_notes && (
                          <CollabFormNotesIcon
                            label={`Row ${row_index + 1}`}
                            has_notes={row._has_notes}
                            notes={row._notes}
                            on_notes_change={(notes_entries) => {
                              // Update row notes and has_notes flag
                              const updated_rows = rows.map((r) =>
                                r._row_id === row._row_id
                                  ? { ...r, _notes: notes_entries, _has_notes: notes_entries.length > 0 }
                                  : r
                              );
                              onChange(updated_rows);
                              // Also call the external callback if provided
                              on_row_notes_change?.(row._row_id, notes_entries);
                            }}
                            current_user={current_user}
                          />
                        )}

                        {/* Row-level chat */}
                        {has_row_chat && (
                          <CollabFormChatIcon
                            label={`Row ${row_index + 1}`}
                            error={error}
                            has_chat_messages={row._has_chat_messages}
                            on_click={() => {
                              // Open row-level chat if hazo_chat_group_id is configured
                              if (hazo_chat_group_id) {
                                set_active_row_chat({ row_id: row._row_id, row_index });
                              }
                              // Also call the external callback if provided
                              on_row_chat_click?.(row._row_id, row_index);
                            }}
                          />
                        )}

                        {/* Delete button */}
                        {allow_delete_row && (
                          <button
                            type="button"
                            onClick={() => delete_row(row._row_id)}
                            disabled={disabled}
                            className={cn(
                              'cls_data_table_delete_btn flex items-center justify-center h-8 w-8 rounded-md',
                              'text-muted-foreground hover:text-destructive hover:bg-destructive/10',
                              'focus:outline-none focus:ring-1 focus:ring-ring',
                              disabled && 'cursor-not-allowed opacity-50'
                            )}
                            title="Delete row"
                          >
                            <HiTrash className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}

            {/* Subtotal row */}
            {show_subtotal_row && rows.length > 0 && (
              <tr className="cls_data_table_subtotal_row bg-muted/50 font-medium">
                {/* Row number cell (empty) */}
                {show_row_numbers && <td className="px-2 py-2" />}

                {/* Aggregation cells */}
                {columns.map((column, idx) => {
                  const agg_value = calculate_aggregation(column, rows);
                  const agg_label = column.aggregation?.label || 'Total';

                  return (
                    <td
                      key={column.id}
                      className={cn(
                        'cls_data_table_subtotal_cell px-2 py-2 text-sm',
                        column.field_type === 'numeric' && 'text-right'
                      )}
                    >
                      {idx === 0 && agg_value === null && (
                        <span className="text-muted-foreground">{agg_label}</span>
                      )}
                      {agg_value !== null && (
                        <span>
                          {idx === 0 && `${agg_label}: `}
                          {format_number(agg_value, column.constraints?.num_decimals)}
                        </span>
                      )}
                    </td>
                  );
                })}

                {/* Actions cell (empty) */}
                {show_actions_column && <td className="px-2 py-2" />}
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add row button */}
      {allow_add_row && (
        <div className="cls_data_table_add_row_wrapper mt-2">
          <button
            type="button"
            onClick={add_row}
            disabled={disabled || (max_rows !== undefined && rows.length >= max_rows)}
            className={cn(
              'cls_data_table_add_row_btn flex items-center gap-1 px-3 py-1.5 rounded-md text-sm',
              'border border-input bg-transparent hover:bg-accent',
              'focus:outline-none focus:ring-1 focus:ring-ring',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
          >
            <HiPlus className="h-4 w-4" />
            Add Row
          </button>
          {max_rows !== undefined && (
            <span className="text-xs text-muted-foreground ml-2">
              {rows.length}/{max_rows} rows
            </span>
          )}
        </div>
      )}

      {/* Error message */}
      <CollabFormFieldError
        field_id_final={field_id_final}
        error={error}
        error_class_name={error_class_name}
      />

      {/* Row-level chat panel */}
      {active_row_chat && hazo_chat_group_id && HazoChatComponent && (
        <div
          className={cn(
            'cls_data_table_row_chat mt-4 border rounded-lg overflow-hidden',
            chat_background_color
          )}
        >
          <div className="cls_data_table_row_chat_header flex items-center justify-between px-4 py-2 border-b bg-background">
            <span className="text-sm font-medium">
              Chat - Row {active_row_chat.row_index + 1}
            </span>
            <button
              type="button"
              onClick={() => set_active_row_chat(null)}
              className="text-muted-foreground hover:text-foreground"
              title="Close chat"
            >
              <HiX className="h-4 w-4" />
            </button>
          </div>
          <div className="cls_data_table_row_chat_content h-[400px]">
            <HazoChatComponent
              chat_group_id={hazo_chat_group_id}
              reference_id={`${hazo_chat_reference_id || field_id_final}_row_${active_row_chat.row_id}`}
              reference_type={hazo_chat_reference_type || 'table_row'}
              api_base_url={hazo_chat_api_base_url}
              timezone={hazo_chat_timezone}
              title={`${hazo_chat_title || label} - Row ${active_row_chat.row_index + 1}`}
              subtitle={hazo_chat_subtitle}
              realtime_mode={hazo_chat_realtime_mode}
              polling_interval={hazo_chat_polling_interval}
              messages_per_page={hazo_chat_messages_per_page}
              show_sidebar_toggle={hazo_chat_show_sidebar_toggle}
              show_delete_button={hazo_chat_show_delete_button}
              bubble_radius={hazo_chat_bubble_radius}
              className={cn('h-full w-full', hazo_chat_class_name)}
            />
          </div>
        </div>
      )}
    </CollabFormFieldContainer>
  );
});

HazoCollabFormDataTable.displayName = 'HazoCollabFormDataTable';
