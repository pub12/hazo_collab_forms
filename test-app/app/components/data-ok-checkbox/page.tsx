/**
 * Data OK Checkbox Component test page
 * Documents the HazoEltDataOkCheckbox component
 */

'use client';

import { useState } from 'react';
import { ComponentTestTemplate, type PropsTableData } from '@/components/component_test_template';
import { COMPONENT_PAGES } from '@/config/component_pages';
import { DataOkCheckbox } from 'hazo_collab_forms';

/**
 * Data OK Checkbox Component test page
 */
export default function DataOkCheckboxComponentPage() {
  const config = COMPONENT_PAGES.find(c => c.path === '/components/data-ok-checkbox');
  const [example_checked, set_example_checked] = useState(false);

  // DataOkCheckbox props (no inherited props)
  const props_table_data: PropsTableData[] = [
    {
      name: 'checked',
      type: 'boolean',
      required: true,
      category: 'Input Field',
      description: 'Whether the checkbox is checked',
    },
    {
      name: 'onChange',
      type: '(checked: boolean) => void',
      required: true,
      category: 'Output',
      description: 'Callback when checkbox state changes',
    },
    {
      name: 'aria-label',
      type: 'string | undefined',
      required: false,
      category: 'Controllable Element',
      description: 'Optional label for accessibility. Defaults to "Data OK" or "Data not OK" based on checked state',
    },
    {
      name: 'className',
      type: 'string | undefined',
      required: false,
      category: 'Controllable Element',
      description: 'Optional className for the checkbox container',
    },
    {
      name: 'disabled',
      type: 'boolean | undefined',
      required: false,
      category: 'Controllable Element',
      description: 'Whether the checkbox is disabled',
    },
  ];

  // Example component - function that receives prop values from current value column
  const example_component = (prop_values: Record<string, any>) => {
    // Build props object from current value column
    const component_props: Record<string, any> = {};
    
    // Optional fields - only include if value is set
    if (prop_values['aria-label'] !== undefined && prop_values['aria-label'] !== '') {
      component_props['aria-label'] = prop_values['aria-label'];
    }
    if (prop_values.className !== undefined && prop_values.className !== '') {
      component_props.className = prop_values.className;
    }
    if (prop_values.disabled !== undefined) {
      component_props.disabled = prop_values.disabled === true || prop_values.disabled === 'true';
    }

    return (
      <div className="cls_dataok_example_container space-y-4">
        <div className="flex items-center gap-4">
          <DataOkCheckbox
            {...component_props}
            checked={example_checked}
            onChange={set_example_checked}
            aria-label={component_props['aria-label'] || 'Data OK Checkbox'}
          />
          <label className="text-sm font-medium">
            Data OK Checkbox
          </label>
        </div>
        <div className="text-sm text-muted-foreground">
          <p>Checked: {example_checked ? 'Yes' : 'No'}</p>
          <p className="mt-2">
            When checked, displays a green checkmark icon. When unchecked, displays a red radio button off icon.
          </p>
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

