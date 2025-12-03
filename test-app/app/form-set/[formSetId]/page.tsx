/**
 * Form Set template page
 * Dynamically loads and renders form sets based on route parameter
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { HazoCollabFormSet, type FieldsSet } from 'hazo_collab_forms';
import { get_form_set_config } from '@/config/form_sets';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Form Set page component
 */
export default function FormSetPage() {
  const params = useParams();
  const form_set_id = params?.formSetId as string;
  
  const [fields_set, set_fields_set] = useState<FieldsSet | null>(null);
  const [form_data, set_form_data] = useState<Record<string, any>>({});
  const [loading, set_loading] = useState(true);
  const [error, set_error] = useState<string | null>(null);
  
  // Get form set configuration
  const config = form_set_id ? get_form_set_config(form_set_id) : undefined;
  
  /**
   * Load JSON configuration file
   */
  useEffect(() => {
    if (!form_set_id || !config) {
      set_error('Invalid form set ID');
      set_loading(false);
      return;
    }
    
    const load_json = async () => {
      try {
        set_loading(true);
        set_error(null);
        
        // Load JSON file from public directory
        const response = await fetch(config.json_path);
        
        if (!response.ok) {
          throw new Error(`Failed to load form set: ${response.statusText}`);
        }
        
        const data: FieldsSet = await response.json();
        set_fields_set(data);
        
        // Initialize form data
        const initial_data: Record<string, any> = {};
        const initialize_data = (field_list: any[]) => {
          field_list.forEach((field) => {
            initial_data[field.id] = field.value;
            if (field.field_type === 'group' && field.sub_fields) {
              initialize_data(field.sub_fields);
            }
          });
        };
        initialize_data(data.field_list);
        set_form_data(initial_data);
      } catch (err) {
        set_error(err instanceof Error ? err.message : 'Failed to load form set');
        console.error('Error loading form set:', err);
      } finally {
        set_loading(false);
      }
    };
    
    load_json();
  }, [form_set_id, config]);
  
  /**
   * Handle form data change
   */
  const handle_form_data_change = (data: Record<string, any>) => {
    set_form_data(data);
  };
  
  if (loading) {
    return (
      <div className="cls_form_set_loading_container flex items-center justify-center min-h-screen">
        <div className="cls_form_set_loading_content text-center">
          <div className="cls_form_set_spinner inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mx-auto mb-4" />
          <p className="text-muted-foreground">Loading form set...</p>
        </div>
      </div>
    );
  }
  
  if (error || !config || !fields_set) {
    return (
      <div className="cls_form_set_error_container flex items-center justify-center min-h-screen">
        <Card className="cls_form_set_error_card w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>
              {error || 'Form set not found'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {form_set_id ? `Form set ID: ${form_set_id}` : 'No form set ID provided'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="cls_form_set_page_container container mx-auto py-8 px-4">
      <div className="cls_form_set_page_content max-w-4xl mx-auto space-y-6">
        {/* Form Set Component */}
        <Card className="cls_form_set_card flex flex-col max-h-[calc(100vh-8rem)]">
          <CardHeader className="flex-shrink-0">
            <CardTitle>{config.title}</CardTitle>
            {config.description && (
              <CardDescription>{config.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto min-h-0">
            <HazoCollabFormSet
              fields_set={fields_set}
              on_form_data_change={handle_form_data_change}
            />
          </CardContent>
        </Card>
        
        {/* Form Data Display */}
        <Card className="cls_form_data_display_card">
          <CardHeader>
            <CardTitle>Form Data</CardTitle>
            <CardDescription>
              Current form data (for debugging)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="cls_form_data_pre text-xs bg-muted p-4 rounded-md overflow-auto max-h-96">
              {JSON.stringify(form_data, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

