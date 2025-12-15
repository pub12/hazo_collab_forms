/**
 * Collaboration form set component
 * Dynamically generates forms from JSON configuration
 * Supports nested groups, field dependencies, and all HazoCollabForm component types
 */

'use client';

import React from 'react';
// Import directly from each component file to avoid circular dependencies
// (index.js exports HazoCollabFormSet which imports from these files)
import { HazoCollabFormInputbox } from './hazo_collab_form_inputbox.js';
import { HazoCollabFormTextArea } from './hazo_collab_form_textarea.js';
import { HazoCollabFormCheckbox } from './hazo_collab_form_checkbox.js';
import { HazoCollabFormCombo, type ComboboxOption } from './hazo_collab_form_combo.js';
import { HazoCollabFormRadio, type RadioOption } from './hazo_collab_form_radio.js';
import { HazoCollabFormDate } from './hazo_collab_form_date.js';
import { HazoCollabFormGroup } from './hazo_collab_form_group.js';
import { HazoCollabFormDataTable, type DataTableConfig, type DataTableRow } from './hazo_collab_form_data_table.js';
import type { NoteEntry } from './hazo_collab_form_base.js';

/**
 * Input option for radio, checkbox, or combo components
 */
export interface InputOption {
  /**
   * Label text for the option
   */
  label: string;
  
  /**
   * Value of the option
   */
  value: string;
}

/**
 * Input format configuration for validation
 */
export interface InputFormat {
  /**
   * Format guide text to display
   */
  format_guide?: string;
  
  /**
   * Minimum text length
   */
  text_min_len?: number;
  
  /**
   * Maximum text length
   */
  text_max_len?: number;
  
  /**
   * Minimum numeric value
   */
  num_min?: number;
  
  /**
   * Maximum numeric value
   */
  num_max?: number;
  
  /**
   * Regular expression pattern for validation
   */
  regex?: string;
  
  /**
   * Number of decimal places allowed
   */
  num_decimals?: number;
}

/**
 * Field configuration - can be a regular field or a group
 */
export interface FieldConfig {
  /**
   * Unique identifier for the field
   */
  id: string;
  
  /**
   * Label text for the field
   */
  label: string;
  
  /**
   * Field type: "field" for regular fields, "group" for groups
   */
  field_type: 'field' | 'group';
  
  /**
   * Description text for the field
   */
  description?: string;
  
  /**
   * Component type (only for field_type: "field")
   * One of: HazoCollabFormInputbox, HazoCollabFormRadio, HazoCollabFormCheckbox, HazoCollabFormCombo, HazoCollabFormTextArea, HazoCollabFormDate
   */
  component_type?: string;
  
  /**
   * Current value of the field
   */
  value: string | boolean;
  
  /**
   * Input type for validation (mixed, numeric, email, alpha)
   */
  input_type?: 'mixed' | 'numeric' | 'email' | 'alpha';
  
  /**
   * Whether to accept files
   */
  accept_files?: boolean;
  
  /**
   * Input format configuration
   */
  input_format?: InputFormat;
  
  /**
   * Input options for radio, checkbox, or combo components
   */
  input_options?: InputOption[];
  
  /**
   * Sub-fields for group type fields
   */
  sub_fields?: FieldConfig[];
  
  /**
   * Dependency condition (e.g., "field_id:value")
   * Field will only be shown if the dependency field has the specified value
   */
  dependency?: string;
  
  /**
   * Input width: "auto" for auto width, "full" for full width
   */
  input_width?: 'auto' | 'full';
  
  /**
   * Whether this field is required
   * When true, displays a red asterisk next to the label
   */
  required?: boolean;

  /**
   * Whether to enable notes for this field
   * When true, displays a notes icon that allows users to add/view notes
   */
  enable_notes?: boolean;

  /**
   * Array of notes for this field
   * Each note contains user info, timestamp, and note content
   */
  notes?: NoteEntry[];

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

  /**
   * Table configuration (only for component_type: "HazoCollabFormDataTable")
   * Defines columns, settings, and behavior for data table fields
   */
  table_config?: DataTableConfig;
}

/**
 * Fields set configuration - main structure for the form
 */
export interface FieldsSet {
  /**
   * Name of the form group
   */
  group_name: string;
  
  /**
   * Whether to accept files at the group level
   */
  accept_files: boolean;
  
  /**
   * List of fields in the form
   */
  field_list: FieldConfig[];
}

/**
 * Props for the HazoCollabFormSet component
 */
export interface HazoCollabFormSetProps {
  /**
   * Fields set configuration (JSON structure)
   */
  fields_set: FieldsSet;

  /**
   * Chat group ID for hazo_chat v3.0.0+ (group-based chat)
   */
  chat_group_id?: string;

  /**
   * Optional callback when a field value changes
   */
  on_field_change?: (field_id: string, value: any) => void;

  /**
   * Optional callback when form data changes (all fields)
   */
  on_form_data_change?: (form_data: Record<string, any>) => void;

  /**
   * Initial form data (optional, for controlled component)
   */
  initial_data?: Record<string, any>;

  /**
   * Enable notes for all fields in the form set
   * When true, all fields will have the notes icon enabled
   * Individual fields can still override this with their own enable_notes setting
   */
  enable_notes?: boolean;

  /**
   * Optional callback when notes change for any field
   * Called with field_id and the updated notes array
   * Use this to persist notes to your backend
   */
  on_notes_change?: (field_id: string, notes: NoteEntry[]) => void;

  /**
   * Optional callback when all notes data changes
   * Called with a map of field_id -> notes array
   * Use this to get all notes when any field's notes change
   */
  on_all_notes_change?: (all_notes: Record<string, NoteEntry[]>) => void;
}

/**
 * Exposed methods for HazoCollabFormSet
 */
export interface HazoCollabFormSetRef {
  /**
   * Get all form data
   */
  get_form_data: () => Record<string, any>;

  /**
   * Set form data
   */
  set_form_data: (data: Record<string, any>) => void;

  /**
   * Reset form to initial values
   */
  reset_form: () => void;

  /**
   * Get all notes data
   * Returns a map of field_id -> notes array
   */
  get_notes_data: () => Record<string, NoteEntry[]>;
}

/**
 * Component type mapping
 */
const COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
  HazoCollabFormInputbox,
  HazoCollabFormTextArea,
  HazoCollabFormCheckbox,
  HazoCollabFormCombo,
  HazoCollabFormRadio,
  HazoCollabFormDate,
  HazoCollabFormDataTable,
};

/**
 * Parse dependency string (e.g., "field_id:value")
 * Returns { field_id, value } or null if invalid
 */
function parse_dependency(dependency: string): { field_id: string; value: string } | null {
  const parts = dependency.split(':');
  if (parts.length !== 2) {
    return null;
  }
  return {
    field_id: parts[0].trim(),
    value: parts[1].trim(),
  };
}

/**
 * Check if a field should be visible based on its dependency
 */
function check_dependency(
  dependency: string | undefined,
  form_data: Record<string, any>
): boolean {
  if (!dependency) {
    return true; // No dependency, always show
  }
  
  const parsed = parse_dependency(dependency);
  if (!parsed) {
    return true; // Invalid dependency format, show by default
  }
  
  const dependency_value = form_data[parsed.field_id];
  return String(dependency_value) === parsed.value;
}

/**
 * Initialize form data from field configuration
 */
function initialize_form_data(field_list: FieldConfig[]): Record<string, any> {
  const data: Record<string, any> = {};
  
  const process_field = (field: FieldConfig) => {
    data[field.id] = field.value;
    
    if (field.field_type === 'group' && field.sub_fields) {
      field.sub_fields.forEach(process_field);
    }
  };
  
  field_list.forEach(process_field);
  return data;
}

/**
 * Collaboration form set component
 * Dynamically generates forms from JSON configuration
 */
export const HazoCollabFormSet = React.forwardRef<
  HazoCollabFormSetRef,
  HazoCollabFormSetProps
>((props, ref) => {
  const { fields_set, chat_group_id: chat_group_id_prop, on_field_change, on_form_data_change, initial_data, enable_notes: enable_notes_prop, on_notes_change: on_notes_change_prop, on_all_notes_change } = props;

  // State for default chat_group_id from config
  const [default_chat_group_id, set_default_chat_group_id] = React.useState<string | undefined>(undefined);

  // Fetch default chat_group_id from config if chat_group_id prop is not provided
  React.useEffect(() => {
    // Only fetch if chat_group_id prop is not provided
    if (!chat_group_id_prop) {
      const fetch_default_chat_group_id = async () => {
        try {
          // First, get the current user from hazo_auth
          const auth_response = await fetch('/api/hazo_auth/me');
          if (!auth_response.ok) {
            console.debug('[HazoCollabFormSet] Auth API not available or user not authenticated');
            return; // User not authenticated or API route doesn't exist
          }

          const auth_data = await auth_response.json();
          if (!auth_data.authenticated || !auth_data.user_id) {
            console.debug('[HazoCollabFormSet] User not authenticated');
            return; // User not authenticated
          }

          const current_user_id = auth_data.user_id;
          console.log('[HazoCollabFormSet] Current user ID:', current_user_id);
          console.log('[HazoCollabFormSet] Auth data:', auth_data);

          // Fetch the config array for chat groups
          const config_response = await fetch(
            `/api/config?section=${encodeURIComponent('chat')}&key=${encodeURIComponent('default_testing_chat_group_id')}`
          );

          if (config_response.ok) {
            const config_data = await config_response.json();
            console.log('[HazoCollabFormSet] Config API response:', config_data);

            if (config_data.value) {
              try {
                // Parse the JSON array
                const chat_group_mappings = JSON.parse(config_data.value) as Array<{
                  current_user: string;
                  chat_group: string;
                }>;

                console.log('[HazoCollabFormSet] Chat group mappings:', chat_group_mappings);
                console.log('[HazoCollabFormSet] Looking for current user:', current_user_id);

                // Find the matching entry for the current user
                const mapping = chat_group_mappings.find(
                  (m) => m.current_user === current_user_id
                );

                if (mapping && mapping.chat_group) {
                  console.log('[HazoCollabFormSet] Found chat group mapping:', mapping.chat_group);
                  set_default_chat_group_id(mapping.chat_group);
                } else {
                  console.warn('[HazoCollabFormSet] No chat group mapping found for current user:', current_user_id);
                  console.log('[HazoCollabFormSet] Available mappings:', chat_group_mappings.map(m => m.current_user));
                }
              } catch (parse_error) {
                // Invalid JSON format
                console.error('[HazoCollabFormSet] Could not parse default_testing_chat_group_id config:', parse_error);
                console.error('[HazoCollabFormSet] Config value:', config_data.value);
              }
            } else {
              console.warn('[HazoCollabFormSet] Config value is empty or null. Full response:', config_data);
            }
          } else {
            console.error('[HazoCollabFormSet] Config API not available or returned error:', config_response.status);
          }
        } catch (error) {
          // Log error but allow component to work even if API route doesn't exist
          console.error('[HazoCollabFormSet] Could not fetch default_testing_chat_group_id from config:', error);
        }
      };

      fetch_default_chat_group_id();
    }
  }, [chat_group_id_prop]);

  // Use chat_group_id prop if provided, otherwise use default from config
  const chat_group_id = chat_group_id_prop || default_chat_group_id;
  
  // State for current user ID
  const [current_user_id, set_current_user_id] = React.useState<string | undefined>(undefined);
  
  // State for mapping of field_id to has_chat_messages
  const [field_chat_messages, set_field_chat_messages] = React.useState<Record<string, boolean>>({});

  // State for notes per field
  const [field_notes, set_field_notes] = React.useState<Record<string, NoteEntry[]>>({});

  // Initialize notes from field config
  React.useEffect(() => {
    const notes_map: Record<string, NoteEntry[]> = {};
    const process_field_notes = (field_list: FieldConfig[]) => {
      field_list.forEach((field) => {
        if (field.notes && field.notes.length > 0) {
          notes_map[field.id] = field.notes;
        }
        if (field.field_type === 'group' && field.sub_fields) {
          process_field_notes(field.sub_fields);
        }
      });
    };
    process_field_notes(fields_set.field_list);
    set_field_notes(notes_map);
  }, [fields_set.field_list]);

  /**
   * Handle notes change for a field
   */
  const handle_notes_change = React.useCallback((field_id: string, new_notes: NoteEntry[]) => {
    set_field_notes((prev) => {
      const updated_notes = {
        ...prev,
        [field_id]: new_notes,
      };
      // Call the callbacks to allow parent to persist
      if (on_notes_change_prop) {
        on_notes_change_prop(field_id, new_notes);
      }
      if (on_all_notes_change) {
        on_all_notes_change(updated_notes);
      }
      return updated_notes;
    });
  }, [on_notes_change_prop, on_all_notes_change]);

  // Get current user ID
  React.useEffect(() => {
    const fetch_current_user = async () => {
      try {
        const auth_response = await fetch('/api/hazo_auth/me');
        if (auth_response.ok) {
          const auth_data = await auth_response.json();
          if (auth_data.authenticated && auth_data.user_id) {
            set_current_user_id(auth_data.user_id);
          }
        }
      } catch (error) {
        console.error('[HazoCollabFormSet] Could not fetch current user:', error);
      }
    };
    
    fetch_current_user();
  }, []);
  
  // Check for unread messages and create mapping of reference_id to has_chat_messages
  React.useEffect(() => {
    if (!current_user_id || !chat_group_id) {
      console.log('[HazoCollabFormSet] Skipping unread check - missing:', { current_user_id, chat_group_id });
      return;
    }

    /**
     * Check hazo_chat table for records where:
     * - chat_group_id matches the specified group (v3.0.0 group-based chat)
     * - read_at IS NULL (unread messages)
     * Get unique reference_id values and match with field_id
     */
    const check_unread_messages = async () => {
      try {
        // Collect all field IDs (which are used as reference_id in chat)
        const all_field_ids: string[] = [];
        const process_fields_for_ids = (field_list: FieldConfig[]) => {
          field_list.forEach((field) => {
            all_field_ids.push(field.id);
            if (field.field_type === 'group' && field.sub_fields) {
              process_fields_for_ids(field.sub_fields);
            }
          });
        };
        process_fields_for_ids(fields_set.field_list);

        // Check each field for unread messages
        // We need to query each reference_id individually since the API requires it
        const unread_reference_ids = new Set<string>();

        console.log('[HazoCollabFormSet] Checking unread messages for fields:', all_field_ids);
        console.log('[HazoCollabFormSet] Current user ID for unread check:', current_user_id);
        console.log('[HazoCollabFormSet] Chat group ID:', chat_group_id);

        // Query all fields in parallel
        // The API returns messages for the chat group
        // We need to check if there are unread messages in the group
        const check_promises = all_field_ids.map(async (field_id) => {
          try {
            // Query messages for this reference_id with the chat group
            const params = new URLSearchParams({
              chat_group_id: chat_group_id || '',
              reference_id: field_id,
            });

            console.log(`[HazoCollabFormSet] Checking field ${field_id} with params:`, params.toString());

            const response = await fetch(`/api/hazo_chat/messages?${params.toString()}`);

            if (response.ok) {
              const data = await response.json();
              const messages = data.messages || [];
              const api_current_user_id = data.current_user_id;

              console.log(`[HazoCollabFormSet] Field ${field_id} - API response:`, {
                messages_count: messages.length,
                api_current_user_id,
                local_current_user_id: current_user_id,
                messages: messages.map((m: any) => ({
                  id: m.id,
                  sender_user_id: m.sender_user_id,
                  chat_group_id: m.chat_group_id,
                  read_at: m.read_at,
                }))
              });

              // Filter for unread messages not sent by the current user
              // (messages from other group members that haven't been read)
              const effective_current_user_id = api_current_user_id || current_user_id;

              const has_unread = Array.isArray(messages) && messages.some((msg: any) => {
                const is_unread = msg.read_at === null || msg.read_at === undefined;
                const is_from_others = msg.sender_user_id !== effective_current_user_id;
                console.log(`[HazoCollabFormSet] Message check:`, {
                  message_id: msg.id,
                  is_unread,
                  is_from_others,
                  sender_user_id: msg.sender_user_id,
                  effective_current_user_id,
                  read_at: msg.read_at,
                });
                return is_unread && is_from_others;
              });

              console.log(`[HazoCollabFormSet] Field ${field_id} has_unread:`, has_unread);

              if (has_unread) {
                unread_reference_ids.add(field_id);
              }
            } else {
              console.error(`[HazoCollabFormSet] Field ${field_id} - API error:`, response.status);
            }
          } catch (error) {
            console.error(`[HazoCollabFormSet] Error checking field ${field_id}:`, error);
          }
        });

        await Promise.all(check_promises);

        // Create mapping of field_id -> has_chat_messages
        const chat_messages_map: Record<string, boolean> = {};
        const process_fields_for_mapping = (field_list: FieldConfig[]) => {
          field_list.forEach((field) => {
            // field.id is used as field_data_id, which is used as reference_id in chat
            chat_messages_map[field.id] = unread_reference_ids.has(field.id);

            // Process sub_fields if it's a group
            if (field.field_type === 'group' && field.sub_fields) {
              process_fields_for_mapping(field.sub_fields);
            }
          });
        };

        process_fields_for_mapping(fields_set.field_list);

        console.log('[HazoCollabFormSet] Unread reference IDs:', Array.from(unread_reference_ids));
        console.log('[HazoCollabFormSet] Chat messages map:', chat_messages_map);

        set_field_chat_messages(chat_messages_map);
      } catch (error) {
        console.error('[HazoCollabFormSet] Error checking unread messages:', error);
        set_field_chat_messages({});
      }
    };

    check_unread_messages();

    // Set up polling to check for unread messages every 5 seconds
    const interval_id = setInterval(check_unread_messages, 5000);

    return () => {
      clearInterval(interval_id);
    };
  }, [current_user_id, chat_group_id, fields_set.field_list]);
  
  // Initialize form data from field config or initial_data
  const initial_form_data = React.useMemo(() => {
    if (initial_data) {
      return { ...initialize_form_data(fields_set.field_list), ...initial_data };
    }
    return initialize_form_data(fields_set.field_list);
  }, [fields_set.field_list, initial_data]);
  
  const [form_data, set_form_data_state] = React.useState<Record<string, any>>(initial_form_data);
  
  // Expose ref methods
  React.useImperativeHandle(ref, () => ({
    get_form_data: () => form_data,
    set_form_data: (data: Record<string, any>) => {
      set_form_data_state(data);
      if (on_form_data_change) {
        on_form_data_change(data);
      }
    },
    reset_form: () => {
      set_form_data_state(initial_form_data);
      if (on_form_data_change) {
        on_form_data_change(initial_form_data);
      }
    },
    get_notes_data: () => field_notes,
  }), [form_data, initial_form_data, on_form_data_change, field_notes]);
  
  /**
   * Handle field value change
   */
  const handle_field_change = React.useCallback((field_id: string, value: any) => {
    set_form_data_state((prev) => {
      const new_data = { ...prev, [field_id]: value };
      if (on_field_change) {
        on_field_change(field_id, value);
      }
      if (on_form_data_change) {
        on_form_data_change(new_data);
      }
      return new_data;
    });
  }, [on_field_change, on_form_data_change]);
  
  /**
   * Map input format to component props
   */
  const map_input_format_to_props = (input_format?: InputFormat): Record<string, any> => {
    if (!input_format) {
      return {};
    }
    
    const props: Record<string, any> = {};
    
    if (input_format.format_guide !== undefined) {
      props.format_guide = input_format.format_guide;
      props.format_guide_info = true; // Default to true if format_guide exists
    }
    if (input_format.text_min_len !== undefined) {
      props.text_len_min = input_format.text_min_len;
    }
    if (input_format.text_max_len !== undefined) {
      props.text_len_max = input_format.text_max_len;
    }
    if (input_format.num_min !== undefined) {
      props.num_min = input_format.num_min;
    }
    if (input_format.num_max !== undefined) {
      props.num_max = input_format.num_max;
    }
    if (input_format.regex !== undefined) {
      props.regex = input_format.regex;
    }
    if (input_format.num_decimals !== undefined) {
      props.num_decimals = input_format.num_decimals;
    }
    
    return props;
  };
  
  /**
   * Render a single field
   */
  const render_field = (field: FieldConfig): React.ReactNode => {
    // Check dependency
    const dependency_satisfied = check_dependency(field.dependency, form_data);
    if (!dependency_satisfied) {
      return null;
    }
    
    // Handle group fields
    if (field.field_type === 'group') {
      if (!field.sub_fields || field.sub_fields.length === 0) {
        return null;
      }
      
      return (
        <HazoCollabFormGroup
          key={field.id}
          label={field.label}
          field_data_id={field.id}
          field_name={field.label}
          accept_files={field.accept_files ?? fields_set.accept_files}
          hazo_chat_group_id={chat_group_id}
          has_chat_messages={field_chat_messages[field.id] || false}
          enable_notes={field.enable_notes ?? enable_notes_prop}
          notes={field_notes[field.id] || []}
          on_notes_change={(new_notes: NoteEntry[]) => handle_notes_change(field.id, new_notes)}
          has_notes={(field_notes[field.id]?.length || 0) > 0}
          reference_value={field.reference_value}
          reference_label={field.reference_label}
          reference_tag_background_color={field.reference_tag_background_color}
        >
          {field.sub_fields.map(render_field)}
        </HazoCollabFormGroup>
      );
    }
    
    // Handle regular fields
    if (!field.component_type) {
      return null;
    }
    
    const Component = COMPONENT_MAP[field.component_type];
    if (!Component) {
      console.warn(`Unknown component type: ${field.component_type}`);
      return null;
    }
    
    // Map input_width to field_width_class_name
    let field_width_class_name: string | undefined;
    if (field.input_width === 'auto') {
      field_width_class_name = 'w-auto';
    } else if (field.input_width === 'full') {
      field_width_class_name = 'flex-1';
    }
    
    // Determine if field should be required
    // If dependency is not satisfied, field is not required even if required: true in JSON
    // If dependency is satisfied or no dependency, use the required value from JSON
    const is_required = dependency_satisfied && field.required === true;
    
    // Base props for all components (key is passed separately)
    const base_props: Record<string, any> = {
      label: field.label,
      field_data_id: field.id,
      field_name: field.label,
      hazo_chat_group_id: chat_group_id,
      accept_files: field.accept_files ?? fields_set.accept_files,
      field_width_class_name,
      required: is_required,
      has_chat_messages: field_chat_messages[field.id] || false,
      // Notes props - field-level enable_notes takes precedence, then formset-level prop
      enable_notes: field.enable_notes ?? enable_notes_prop,
      notes: field_notes[field.id] || [],
      on_notes_change: (new_notes: NoteEntry[]) => handle_notes_change(field.id, new_notes),
      has_notes: (field_notes[field.id]?.length || 0) > 0,
      // Reference tag props
      reference_value: field.reference_value,
      reference_label: field.reference_label,
      reference_tag_background_color: field.reference_tag_background_color,
    };
    
    // Component-specific props
    const current_value = form_data[field.id] ?? field.value;
    
    if (field.component_type === 'HazoCollabFormInputbox') {
      return (
        <Component
          key={field.id}
          {...base_props}
          value={String(current_value)}
          onChange={(value: string) => handle_field_change(field.id, value)}
          input_type={field.input_type}
          {...map_input_format_to_props(field.input_format)}
        />
      );
    }
    
    if (field.component_type === 'HazoCollabFormTextArea') {
      return (
        <Component
          key={field.id}
          {...base_props}
          value={String(current_value)}
          onChange={(value: string) => handle_field_change(field.id, value)}
        />
      );
    }
    
    if (field.component_type === 'HazoCollabFormCheckbox') {
      // Checkbox uses checked boolean
      const checked = typeof current_value === 'boolean' 
        ? current_value 
        : current_value === 'true' || current_value === true || String(current_value).toLowerCase() === 'true';
      
      return (
        <Component
          key={field.id}
          {...base_props}
          checked={checked}
          onChange={(checked: boolean) => handle_field_change(field.id, checked)}
        />
      );
    }
    
    if (field.component_type === 'HazoCollabFormRadio' || field.component_type === 'HazoCollabFormCombo') {
      // Convert input_options to component options format
      const options: RadioOption[] | ComboboxOption[] = (field.input_options || []).map(opt => ({
        label: opt.label,
        value: opt.value,
      }));

      return (
        <Component
          key={field.id}
          {...base_props}
          value={String(current_value)}
          onChange={(value: string) => handle_field_change(field.id, value)}
          options={options}
        />
      );
    }

    if (field.component_type === 'HazoCollabFormDate') {
      // Date component - supports single date and date range
      return (
        <Component
          key={field.id}
          {...base_props}
          value={current_value}
          onChange={(value: string | { from: string; to: string }) => handle_field_change(field.id, value)}
          date_mode={field.input_format?.format_guide === 'range' ? 'range' : 'single'}
          min_date={field.input_format?.format_guide === 'range' ? undefined : field.input_format?.format_guide}
          placeholder={field.description}
        />
      );
    }

    if (field.component_type === 'HazoCollabFormDataTable') {
      // Data table component - supports dynamic columns and inline editing
      if (!field.table_config) {
        console.warn(`[HazoCollabFormSet] Missing table_config for data table field: ${field.id}`);
        return null;
      }

      // Ensure value is an array
      const table_value = Array.isArray(current_value) ? current_value : [];

      return (
        <Component
          key={field.id}
          {...base_props}
          table_config={field.table_config}
          value={table_value}
          onChange={(rows: DataTableRow[]) => handle_field_change(field.id, rows)}
        />
      );
    }

    return null;
  };
  
  return (
    <div className="cls_collab_form_set_container space-y-4">
      <h2 className="cls_collab_form_set_title text-2xl font-semibold mb-4">
        {fields_set.group_name}
      </h2>
      <div className="cls_collab_form_set_fields space-y-4">
        {fields_set.field_list.map(render_field)}
      </div>
    </div>
  );
});

HazoCollabFormSet.displayName = 'HazoCollabFormSet';

