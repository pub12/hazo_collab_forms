/**
 * Component test template
 * Reusable template for displaying component documentation pages
 * Provides consistent three-row layout: header, example, and props table
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { HiPencil, HiRefresh, HiX } from 'react-icons/hi';
import { cn } from '@/lib/utils';

/**
 * Props table data structure
 */
export interface PropsTableData {
  /**
   * Prop name
   */
  name: string;
  /**
   * TypeScript type
   */
  type: string;
  /**
   * Whether the prop is required
   */
  required: boolean;
  /**
   * Category: Input Field, Controllable Element, or Output
   */
  category: 'Input Field' | 'Controllable Element' | 'Output';
  /**
   * Description of the prop
   */
  description: string;
  /**
   * Whether this prop is inherited from CollabFormFieldBaseProps
   */
  is_inherited?: boolean;
  /**
   * Default value for the prop (used in the input field)
   */
  default_value?: string | number | boolean;
  /**
   * Whether this prop can be edited in the table (default: true for Input Field category)
   */
  editable?: boolean;
  /**
   * Whether this prop is a HazoChat-related prop (for styling)
   */
  is_hazo_chat_prop?: boolean;
}

/**
 * Cookie utility functions for persisting prop values
 * Used for testing purposes only
 */

/**
 * Get cookie value by name
 */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const name_eq = name + '=';
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name_eq) === 0) {
      return decodeURIComponent(cookie.substring(name_eq.length));
    }
  }
  return null;
}

/**
 * Set cookie value
 */
function setCookie(name: string, value: string): void {
  if (typeof document === 'undefined') return;
  // No expiration - persist indefinitely
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/`;
}

/**
 * Delete cookie
 */
function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

/**
 * Sanitize component name for use in cookie name
 */
function sanitizeCookieName(component_name: string): string {
  return component_name.toLowerCase().replace(/[^a-z0-9]/g, '_');
}

/**
 * Props for ComponentTestTemplate
 */
export interface ComponentTestTemplateProps {
  /**
   * Component name (e.g., "HazoCollabFormInputbox")
   */
  component_name: string;
  /**
   * Display name of the component
   */
  element_name: string;
  /**
   * Description of the component's purpose and usage
   */
  description: string;
  /**
   * Live component example to display
   * Can be a ReactNode or a function that receives prop values and returns a ReactNode
   */
  component_example: React.ReactNode | ((propValues: Record<string, any>) => React.ReactNode);
  /**
   * Props table data
   */
  props_table_data: PropsTableData[];
  /**
   * Initial prop values used in the example component (optional)
   * If provided, these will be used to initialize the current value column
   */
  initial_prop_values?: Record<string, any>;
}

/**
 * Component test template
 * Displays component documentation in a consistent three-row layout
 */
export function ComponentTestTemplate({
  component_name,
  element_name,
  description,
  component_example,
  props_table_data,
  initial_prop_values: provided_initial_values,
}: ComponentTestTemplateProps) {
  // Generate cookie name for this component
  const cookie_name = `component_test_props_${sanitizeCookieName(component_name)}`;

  // Initialize prop values: use provided initial values, or set default values for all props with default_value
  const compute_initial_values = () => {
    if (provided_initial_values) {
      return provided_initial_values;
    }
    // Set default values for all props that have default_value defined
    return props_table_data.reduce((acc, prop) => {
      if (prop.default_value !== undefined) {
        acc[prop.name] = prop.default_value;
      }
      return acc;
    }, {} as Record<string, any>);
  };

  // Compute default values
  const default_values = compute_initial_values();

  // Load cookie values on mount
  const load_cookie_values = (): Record<string, any> => {
    // If provided_initial_values is explicitly provided, use it (don't load from cookie)
    if (provided_initial_values) {
      return provided_initial_values;
    }
    
    // Otherwise, try to load from cookie
    try {
      const cookie_value = getCookie(cookie_name);
      if (cookie_value) {
        const parsed = JSON.parse(cookie_value);
        // Only load props that have default_value defined (to avoid storing undefined values)
        const filtered: Record<string, any> = {};
        props_table_data.forEach((prop) => {
          if (prop.default_value !== undefined && parsed[prop.name] !== undefined) {
            filtered[prop.name] = parsed[prop.name];
          }
        });
        return { ...default_values, ...filtered };
      }
    } catch (error) {
      console.warn('[ComponentTestTemplate] Failed to parse cookie:', error);
    }
    return default_values;
  };

  const [prop_values, set_prop_values] = useState<Record<string, any>>(provided_initial_values || default_values);
  const [is_mounted, set_is_mounted] = useState(false);

  // Load cookie values after mount to prevent hydration mismatch
  useEffect(() => {
    set_is_mounted(true);
    const cookie_values = load_cookie_values();
    // Only update if cookie values differ from defaults
    if (JSON.stringify(cookie_values) !== JSON.stringify(prop_values)) {
      set_prop_values(cookie_values);
    }
  }, []);

  const [refresh_key, set_refresh_key] = useState(0);
  const [dialog_open, set_dialog_open] = useState(false);
  const [editing_prop, set_editing_prop] = useState<PropsTableData | null>(null);
  const [dialog_value, set_dialog_value] = useState('');

  // Save prop_values to cookie whenever they change
  useEffect(() => {
    // Skip saving on initial mount or before cookie is loaded
    if (!is_mounted) return;

    try {
      // Only save props that have default_value defined
      const values_to_save: Record<string, any> = {};
      props_table_data.forEach((prop) => {
        if (prop.default_value !== undefined && prop_values[prop.name] !== undefined) {
          values_to_save[prop.name] = prop_values[prop.name];
        }
      });
      const json_string = JSON.stringify(values_to_save);
      setCookie(cookie_name, json_string);
    } catch (error) {
      console.warn('[ComponentTestTemplate] Failed to save cookie:', error);
    }
  }, [prop_values, cookie_name, props_table_data, is_mounted]);

  // Reset function to restore all values to defaults
  const handle_reset = () => {
    // Clear cookie
    deleteCookie(cookie_name);
    // Reset to default values
    set_prop_values(default_values);
  };

  // Open dialog for editing a prop
  const handle_edit_click = (prop: PropsTableData) => {
    const current_value = prop_values[prop.name] ?? prop.default_value ?? '';
    const display_value = typeof current_value === 'boolean' 
      ? current_value.toString() 
      : current_value.toString();
    set_editing_prop(prop);
    set_dialog_value(display_value);
    set_dialog_open(true);
  };

  // Save dialog value and update prop
  const handle_dialog_save = () => {
    if (editing_prop) {
      handle_prop_value_change(editing_prop.name, dialog_value);
      set_dialog_open(false);
      set_editing_prop(null);
      set_dialog_value('');
    }
  };

  // Cancel dialog
  const handle_dialog_cancel = () => {
    set_dialog_open(false);
    set_editing_prop(null);
    set_dialog_value('');
  };

  // Refresh component example
  const handle_refresh = () => {
    set_refresh_key((prev) => prev + 1);
  };

  // Update prop value handler
  const handle_prop_value_change = (prop_name: string, value: string) => {
    set_prop_values((prev) => {
      const new_values = { ...prev };
      // Try to parse the value based on the type
      const prop = props_table_data.find((p) => p.name === prop_name);
      if (prop) {
        if (prop.type.includes('boolean')) {
          new_values[prop_name] = value === 'true' || value === '1';
        } else if (prop.type.includes('number') || prop.type.includes('Number')) {
          const num_value = parseFloat(value);
          new_values[prop_name] = isNaN(num_value) ? value : num_value;
        } else {
          new_values[prop_name] = value;
        }
      } else {
        new_values[prop_name] = value;
      }
      return new_values;
    });
  };

  // Determine if component_example is a function or a ReactNode
  const is_function = typeof component_example === 'function';
  const rendered_example = is_function ? component_example(prop_values) : component_example;

  // Determine if a prop should be editable
  const is_editable = (prop: PropsTableData) => {
    if (prop.editable !== undefined) return prop.editable;
    // Make props editable if they have a default value (regardless of category)
    return prop.default_value !== undefined;
  };

  return (
    <div className="cls_component_test_container p-8 h-full flex flex-col overflow-hidden">
      <div className="cls_component_test_content w-full space-y-6 flex-1 flex flex-col min-h-0 overflow-y-auto">
        {/* Row 1: Header Information */}
        <div className="cls_component_test_header flex-shrink-0">
          <h1 className="text-4xl font-bold tracking-tight">{component_name}</h1>
          <h2 className="text-2xl font-semibold text-muted-foreground mt-2">{element_name}</h2>
          <p className="text-muted-foreground mt-4 text-lg">{description}</p>
        </div>

        {/* Row 2: Live Example Area */}
        <div className="cls_component_test_example flex-shrink-0">
          <Card className="cls_component_test_example_card">
            <CardHeader>
              <div className="cls_component_test_example_header flex items-center justify-between">
                <CardTitle>Live Example</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="cls_component_test_example_refresh_button h-8 w-8 p-0"
                  onClick={handle_refresh}
                  aria-label="Refresh component example"
                >
                  <HiRefresh className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>Interactive example of the component</CardDescription>
            </CardHeader>
            <CardContent className="cls_component_test_example_content">
              <div key={`example-${refresh_key}`} className="cls_component_example_wrapper">
                {rendered_example}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Row 3: Props Documentation Table */}
        <div className="cls_component_test_props flex-1 flex flex-col min-h-0">
          <Card className="cls_component_test_props_card flex-1 flex flex-col">
            <CardHeader>
              <div className="cls_component_test_props_header flex items-center justify-between">
                <CardTitle>Component Properties</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  className="cls_component_test_props_reset_button h-8 px-3"
                  onClick={handle_reset}
                  aria-label="Reset all properties to default values"
                >
                  <HiX className="h-4 w-4 mr-1" />
                  Reset
                </Button>
              </div>
              <CardDescription>
                All available props for this component. Props inherited from CollabFormFieldBaseProps are highlighted in blue.
              </CardDescription>
            </CardHeader>
            <CardContent className="cls_component_test_props_content flex-1 min-h-0 overflow-auto">
              <Table className="cls_component_test_props_table">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Name</TableHead>
                    <TableHead className="w-[200px]">Type</TableHead>
                    <TableHead className="w-[100px]">Required</TableHead>
                    <TableHead className="w-[150px]">Category</TableHead>
                    <TableHead className="w-[200px]">Current Value</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {props_table_data.map((prop, index) => {
                    const editable = is_editable(prop);
                    const current_value = prop_values[prop.name] ?? prop.default_value ?? '';
                    const display_value = typeof current_value === 'boolean' 
                      ? current_value.toString() 
                      : current_value.toString();

                    return (
                      <TableRow key={index} className="cls_component_test_props_row">
                        <TableCell
                          className={cn(
                            'cls_component_test_props_name font-medium',
                            prop.is_inherited && 'text-blue-600',
                            prop.is_hazo_chat_prop && 'text-green-700'
                          )}
                        >
                          {prop.name}
                        </TableCell>
                        <TableCell className="cls_component_test_props_type">
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {prop.type}
                          </code>
                        </TableCell>
                        <TableCell className="cls_component_test_props_required">
                          {prop.required ? (
                            <span className="text-destructive font-medium">Yes</span>
                          ) : (
                            <span className="text-muted-foreground">No</span>
                          )}
                        </TableCell>
                        <TableCell className="cls_component_test_props_category">
                          {prop.category}
                        </TableCell>
                        <TableCell className="cls_component_test_props_current_value">
                          <span className="text-muted-foreground text-xs">
                            {current_value !== '' && current_value !== undefined ? String(current_value) : '-'}
                          </span>
                        </TableCell>
                        <TableCell className="cls_component_test_props_description">
                          {prop.description}
                        </TableCell>
                        <TableCell className="cls_component_test_props_actions">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="cls_component_test_props_edit_button h-8 w-8 p-0"
                            onClick={() => handle_edit_click(prop)}
                            aria-label={`Edit ${prop.name}`}
                          >
                            <HiPencil className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Prop Dialog */}
      <Dialog open={dialog_open} onOpenChange={(open) => {
        if (!open) {
          handle_dialog_cancel();
        }
      }}>
        <DialogContent className="cls_component_test_props_dialog sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="cls_component_test_props_dialog_title">
              Edit Property: {editing_prop?.name}
            </DialogTitle>
            <DialogDescription className="cls_component_test_props_dialog_description">
              Update the value for this property. Changes will be reflected in the component example above.
            </DialogDescription>
          </DialogHeader>
          <div className="cls_component_test_props_dialog_content space-y-4 py-4">
            {/* Property Details */}
            <div className="cls_component_test_props_dialog_details space-y-2">
              <div className="cls_component_test_props_dialog_detail_row grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-sm font-medium">{editing_prop?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Type</label>
                  <p className="text-sm">
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {editing_prop?.type}
                    </code>
                  </p>
                </div>
              </div>
              <div className="cls_component_test_props_dialog_detail_row grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Required</label>
                  <p className="text-sm">
                    {editing_prop?.required ? (
                      <span className="text-destructive font-medium">Yes</span>
                    ) : (
                      <span className="text-muted-foreground">No</span>
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Category</label>
                  <p className="text-sm">{editing_prop?.category}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="text-sm text-muted-foreground">{editing_prop?.description}</p>
              </div>
            </div>

            {/* Value Input */}
            <div className="cls_component_test_props_dialog_input">
              <label className="text-sm font-medium mb-2 block">Current Value</label>
              <Input
                className="cls_component_test_props_dialog_input_field"
                value={dialog_value}
                onChange={(e) => set_dialog_value(e.target.value)}
                placeholder={editing_prop?.default_value !== undefined ? String(editing_prop.default_value) : 'Enter value...'}
              />
            </div>
          </div>
          <DialogFooter className="cls_component_test_props_dialog_footer">
            <Button
              variant="outline"
              onClick={handle_dialog_cancel}
              className="cls_component_test_props_dialog_cancel"
            >
              Cancel
            </Button>
            <Button
              onClick={handle_dialog_save}
              className="cls_component_test_props_dialog_save"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

