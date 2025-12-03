/**
 * Group Component test page
 * Documents the HazoCollabFormGroup component
 */

'use client';

import { useState } from 'react';
import { ComponentTestTemplate, type PropsTableData } from '@/components/component_test_template';
import { COMPONENT_PAGES } from '@/config/component_pages';
import {
  HazoCollabFormGroup,
  HazoCollabFormInputbox,
  HazoCollabFormCombo,
  type ComboboxOption,
} from 'hazo_collab_forms';

/**
 * Group Component test page
 */
export default function GroupComponentPage() {
  const config = COMPONENT_PAGES.find(c => c.path === '/components/group');
  const [example_field1, set_example_field1] = useState('');
  const [example_field2, set_example_field2] = useState('');
  const [example_field3, set_example_field3] = useState('');
  const [data_ok_checked, set_data_ok_checked] = useState(false);

  const example_options: ComboboxOption[] = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  // Base props (inherited)
  const base_props: PropsTableData[] = [
    { name: 'label', type: 'string', required: true, category: 'Input Field', description: 'Label text for the group', is_inherited: true, default_value: 'Sample Group' },
    { name: 'error', type: 'string | undefined', required: false, category: 'Input Field', description: 'Error message to display below the group', is_inherited: true },
    { name: 'field_id', type: 'string | undefined', required: false, category: 'Controllable Element', description: 'Field identifier for chat context', is_inherited: true },
    { name: 'field_data_id', type: 'string | undefined', required: false, category: 'Input Field', description: 'Field data ID - separate identifier for data storage/retrieval', is_inherited: true },
    { name: 'field_name', type: 'string | undefined', required: false, category: 'Input Field', description: 'Field name for chat context', is_inherited: true },
    { name: 'on_chat_click', type: '(field_data_id: string, field_name?: string) => void | undefined', required: false, category: 'Output', description: 'Callback when chat icon is clicked', is_inherited: true },
    { name: 'has_chat_messages', type: 'boolean | undefined', required: false, category: 'Controllable Element', description: 'Whether this group has chat messages', is_inherited: true },
    { name: 'is_chat_active', type: 'boolean | undefined', required: false, category: 'Controllable Element', description: 'Whether this group\'s chat is currently active/open', is_inherited: true },
    { name: 'chat_background_color', type: 'string | undefined', required: false, category: 'Controllable Element', description: 'Background color class to apply when chat is active', is_inherited: true },
    { name: 'is_data_ok_default', type: 'boolean | undefined', required: false, category: 'Controllable Element', description: 'Whether this group has the default value for the data_ok checkbox', is_inherited: true },
    { name: 'data_ok_checked', type: 'boolean | undefined', required: false, category: 'Input Field', description: 'Data OK checkbox state', is_inherited: true },
    { name: 'on_data_ok_change', type: '(checked: boolean) => void | undefined', required: false, category: 'Output', description: 'Callback when data OK checkbox state changes', is_inherited: true },
    { name: 'container_class_name', type: 'string | undefined', required: false, category: 'Controllable Element', description: 'Custom className for the container', is_inherited: true },
    { name: 'label_class_name', type: 'string | undefined', required: false, category: 'Controllable Element', description: 'Custom className for the label', is_inherited: true },
    { name: 'field_wrapper_class_name', type: 'string | undefined', required: false, category: 'Controllable Element', description: 'Custom className for the field wrapper', is_inherited: true },
    { name: 'error_class_name', type: 'string | undefined', required: false, category: 'Controllable Element', description: 'Custom className for the error message', is_inherited: true },
    { name: 'field_width_class_name', type: 'string | undefined', required: false, category: 'Controllable Element', description: 'Custom className for controlling the width of the input/button/textarea field itself. This applies directly to the field element (not the wrapper) and can override the default flex-1 behavior. Examples: "w-auto", "max-w-xs", "w-48", "max-w-md". If not provided, defaults to "flex-1" for full width', is_inherited: true },
    { name: 'id', type: 'string | undefined', required: false, category: 'Controllable Element', description: 'HTML id attribute', is_inherited: true },
    { name: 'recipient_user_id', type: 'string | undefined', required: false, category: 'Input Field', description: 'Recipient user ID for chat functionality. Required for chat features to work properly', is_inherited: true },
    { name: 'disable_data_ok', type: 'boolean | undefined', required: false, category: 'Controllable Element', description: 'Whether to disable the data OK checkbox. When true, the data OK checkbox will not be rendered. Useful when data OK is handled at a group level', is_inherited: true },
    { name: 'data_ok_editable', type: 'boolean | undefined', required: false, category: 'Controllable Element', description: 'Whether the data OK checkbox field is editable. When false (default), the checkbox is disabled and cannot be toggled. When true, the checkbox can be clicked and toggled. Default: false', is_inherited: true, default_value: false },
    { name: 'disable_chat', type: 'boolean | undefined', required: false, category: 'Controllable Element', description: 'Whether to disable the chat icon. When true, the chat icon will not be rendered. Useful when chat is handled at a group level', is_inherited: true },
    { name: 'multi_state_radio', type: 'object | undefined', required: false, category: 'Input Field', description: 'Multi-state radio configuration. If provided, displays a MultiStateRadio component next to the chat icon. Contains data array, value, onChange, icon_set, selection, bgcolor, and fgcolor properties', is_inherited: true },
    { name: 'accept_files', type: 'boolean | undefined', required: false, category: 'Input Field', description: 'Whether to enable file upload functionality. When true, displays a Files accordion with upload capabilities. Default: false', is_inherited: true, default_value: false },
    { name: 'files_dir', type: 'string | undefined', required: false, category: 'Input Field', description: 'Server directory path where files should be saved. Required if accept_files is true', is_inherited: true },
    { name: 'max_size', type: 'number | undefined', required: false, category: 'Input Field', description: 'Maximum file size in bytes per file. If not specified, no size limit is enforced', is_inherited: true },
    { name: 'min_files', type: 'number | undefined', required: false, category: 'Input Field', description: 'Minimum number of files required. If not specified, no minimum is enforced', is_inherited: true },
    { name: 'max_files', type: 'number | undefined', required: false, category: 'Input Field', description: 'Maximum number of files allowed. Default: 10', is_inherited: true, default_value: 10 },
    { name: 'file_accept', type: 'string | undefined', required: false, category: 'Input Field', description: 'File type accept attribute (e.g., "image/*", ".pdf,.doc"). Follows HTML input accept attribute format', is_inherited: true },
    { name: 'file_processor', type: '(file_data: FileData, component_ref: React.RefObject<any>) => Promise<void> | void | undefined', required: false, category: 'Output', description: 'Callback function called after a file is successfully uploaded. Receives file data and component reference', is_inherited: true },
    { name: 'files', type: 'FileData[] | undefined', required: false, category: 'Input Field', description: 'Controlled files state. When provided, component is controlled and uses this array. When not provided, component manages files internally', is_inherited: true },
    { name: 'on_files_change', type: '(files: FileData[]) => void | undefined', required: false, category: 'Output', description: 'Callback when files change. Called with the updated files array', is_inherited: true },
    // HazoChat props
    { name: 'hazo_chat_receiver_user_id', type: 'string | undefined', required: false, category: 'Input Field', description: 'HazoChat receiver user ID. Required for chat to work, maps to HazoChat receiver_user_id. If recipient_user_id is provided, it will be used as fallback', is_inherited: true, is_hazo_chat_prop: true },
    { name: 'hazo_chat_reference_id', type: 'string | undefined', required: false, category: 'Input Field', description: 'HazoChat reference ID. Maps to HazoChat reference_id, defaults to field_data_id', is_inherited: true, is_hazo_chat_prop: true },
    { name: 'hazo_chat_reference_type', type: 'string | undefined', required: false, category: 'Input Field', description: 'HazoChat reference type. Maps to HazoChat reference_type, default: "field"', is_inherited: true, is_hazo_chat_prop: true },
    { name: 'hazo_chat_api_base_url', type: 'string | undefined', required: false, category: 'Input Field', description: 'HazoChat API base URL. Maps to HazoChat api_base_url', is_inherited: true, is_hazo_chat_prop: true },
    { name: 'hazo_chat_timezone', type: 'string | undefined', required: false, category: 'Input Field', description: 'HazoChat timezone. Maps to HazoChat timezone', is_inherited: true, is_hazo_chat_prop: true },
    { name: 'hazo_chat_title', type: 'string | undefined', required: false, category: 'Input Field', description: 'HazoChat title. Maps to HazoChat title, defaults to field_name or label', is_inherited: true, is_hazo_chat_prop: true },
    { name: 'hazo_chat_subtitle', type: 'string | undefined', required: false, category: 'Input Field', description: 'HazoChat subtitle. Maps to HazoChat subtitle', is_inherited: true, is_hazo_chat_prop: true },
    { name: 'hazo_chat_realtime_mode', type: "'polling' | 'manual' | undefined", required: false, category: 'Input Field', description: 'HazoChat realtime mode. Maps to HazoChat realtime_mode: "polling" (automatic) or "manual" (refresh only)', is_inherited: true, is_hazo_chat_prop: true },
    { name: 'hazo_chat_polling_interval', type: 'number | undefined', required: false, category: 'Input Field', description: 'HazoChat polling interval. Maps to HazoChat polling_interval (milliseconds, only used when realtime_mode = "polling")', is_inherited: true, is_hazo_chat_prop: true },
    { name: 'hazo_chat_messages_per_page', type: 'number | undefined', required: false, category: 'Input Field', description: 'HazoChat messages per page. Maps to HazoChat messages_per_page', is_inherited: true, is_hazo_chat_prop: true },
    { name: 'hazo_chat_class_name', type: 'string | undefined', required: false, category: 'Controllable Element', description: 'HazoChat className. Maps to HazoChat className', is_inherited: true, is_hazo_chat_prop: true },
    { name: 'hazo_chat_on_close', type: '(() => void) | undefined', required: false, category: 'Output', description: 'HazoChat on close callback. Maps to HazoChat on_close', is_inherited: true, is_hazo_chat_prop: true },
    { name: 'hazo_chat_is_open', type: 'boolean | undefined', required: false, category: 'Controllable Element', description: 'Whether HazoChat is open. Controls chat visibility externally', is_inherited: true, is_hazo_chat_prop: true },
    { name: 'hazo_chat_on_open_change', type: '((is_open: boolean) => void) | undefined', required: false, category: 'Output', description: 'HazoChat on open change callback. Called when chat open state changes', is_inherited: true, is_hazo_chat_prop: true },
  ];

  // Group-specific props
  const group_props: PropsTableData[] = [
    {
      name: 'children',
      type: 'React.ReactNode',
      required: true,
      category: 'Input Field',
      description: 'Child form fields to group together. Collab form components will automatically have their data ok and chat disabled.',
    },
    {
      name: 'group_wrapper_class_name',
      type: 'string | undefined',
      required: false,
      category: 'Controllable Element',
      description: 'Custom className for the group wrapper',
    },
    {
      name: 'disable_border',
      type: 'boolean | undefined',
      required: false,
      category: 'Controllable Element',
      description: 'Whether to disable the border/frame around the group. Default: false (border is shown by default)',
      default_value: 'false',
    },
  ];

  const props_table_data = [...base_props, ...group_props];

  // Example component - function that receives prop values from current value column
  const example_component = (prop_values: Record<string, any>) => {
    // Build props object from current value column
    const component_props: Record<string, any> = {
      // Required field - always include, use prop_values or fallback to default
      label: prop_values.label || 'Sample Group',
    };
    
    // Optional fields - only include if value is set
    if (prop_values.error !== undefined && prop_values.error !== '') {
      component_props.error = prop_values.error;
    }
    if (prop_values.field_id !== undefined && prop_values.field_id !== '') {
      component_props.field_id = prop_values.field_id;
    }
    if (prop_values.field_data_id !== undefined && prop_values.field_data_id !== '') {
      component_props.field_data_id = prop_values.field_data_id;
    }
    if (prop_values.field_name !== undefined && prop_values.field_name !== '') {
      component_props.field_name = prop_values.field_name;
    }
    if (prop_values.has_chat_messages !== undefined) {
      component_props.has_chat_messages = prop_values.has_chat_messages === true || prop_values.has_chat_messages === 'true';
    }
    if (prop_values.is_chat_active !== undefined) {
      component_props.is_chat_active = prop_values.is_chat_active === true || prop_values.is_chat_active === 'true';
    }
    if (prop_values.data_ok_checked !== undefined) {
      component_props.data_ok_checked = prop_values.data_ok_checked === true || prop_values.data_ok_checked === 'true';
    }
    if (prop_values.on_data_ok_change !== undefined) {
      component_props.on_data_ok_change = prop_values.on_data_ok_change;
    }
    if (prop_values.disable_data_ok !== undefined) {
      component_props.disable_data_ok = prop_values.disable_data_ok === true || prop_values.disable_data_ok === 'true';
    }
    if (prop_values.data_ok_editable !== undefined) {
      component_props.data_ok_editable = prop_values.data_ok_editable === true || prop_values.data_ok_editable === 'true';
    }
    if (prop_values.disable_chat !== undefined) {
      component_props.disable_chat = prop_values.disable_chat === true || prop_values.disable_chat === 'true';
    }
    if (prop_values.accept_files !== undefined) {
      component_props.accept_files = prop_values.accept_files === true || prop_values.accept_files === 'true';
    }
    if (prop_values.files_dir !== undefined && prop_values.files_dir !== '') {
      component_props.files_dir = prop_values.files_dir;
    }
    if (prop_values.max_size !== undefined && prop_values.max_size !== '') {
      const max_size_value = parseInt(String(prop_values.max_size));
      if (!isNaN(max_size_value)) {
        component_props.max_size = max_size_value;
      }
    }
    if (prop_values.min_files !== undefined && prop_values.min_files !== '') {
      const min_files_value = parseInt(String(prop_values.min_files));
      if (!isNaN(min_files_value)) {
        component_props.min_files = min_files_value;
      }
    }
    if (prop_values.max_files !== undefined && prop_values.max_files !== '') {
      const max_files_value = parseInt(String(prop_values.max_files));
      if (!isNaN(max_files_value)) {
        component_props.max_files = max_files_value;
      }
    }
    if (prop_values.file_accept !== undefined && prop_values.file_accept !== '') {
      component_props.file_accept = prop_values.file_accept;
    }
    if (prop_values.disable_border !== undefined) {
      component_props.disable_border = prop_values.disable_border === true || prop_values.disable_border === 'true';
    }

    return (
      <div className="cls_group_example_container space-y-4">
        <HazoCollabFormGroup
          label={component_props.label}
          error={component_props.error}
          field_id={component_props.field_id}
          field_data_id={component_props.field_data_id}
          field_name={component_props.field_name}
          has_chat_messages={component_props.has_chat_messages}
          is_chat_active={component_props.is_chat_active}
          data_ok_checked={component_props.data_ok_checked}
          on_data_ok_change={component_props.on_data_ok_change}
          data_ok_editable={component_props.data_ok_editable}
          disable_data_ok={component_props.disable_data_ok}
          disable_chat={component_props.disable_chat}
          accept_files={component_props.accept_files}
          files_dir={component_props.files_dir}
          max_size={component_props.max_size}
          min_files={component_props.min_files}
          max_files={component_props.max_files}
          file_accept={component_props.file_accept}
          disable_border={component_props.disable_border}
        >
          <HazoCollabFormInputbox
            label="Field 1"
            value={example_field1}
            onChange={set_example_field1}
            placeholder="Enter value for field 1"
            field_id="group-field-1"
            field_data_id="group-field-1-data"
            field_name="Field 1"
          />
          <HazoCollabFormInputbox
            label="Field 2"
            value={example_field2}
            onChange={set_example_field2}
            placeholder="Enter value for field 2"
            field_id="group-field-2"
            field_data_id="group-field-2-data"
            field_name="Field 2"
          />
          <HazoCollabFormCombo
            label="Field 3"
            options={example_options}
            value={example_field3}
            onChange={set_example_field3}
            placeholder="Select an option"
            enable_search={false}
            field_id="group-field-3"
            field_data_id="group-field-3-data"
            field_name="Field 3"
          />
        </HazoCollabFormGroup>
        <div className="text-sm text-muted-foreground">
          <p>Field 1: {example_field1 || '(empty)'}</p>
          <p>Field 2: {example_field2 || '(empty)'}</p>
          <p>Field 3: {example_field3 || '(empty)'}</p>
          <p>Data OK: {data_ok_checked ? 'Yes' : 'No'}</p>
        </div>
      </div>
    );
  };

  if (!config) {
    return <div>Component configuration not found</div>;
  }

  return (
    <ComponentTestTemplate
      component_name={config.component_name}
      element_name={config.element_name}
      description={config.description}
      component_example={example_component}
      props_table_data={props_table_data}
    />
  );
}

