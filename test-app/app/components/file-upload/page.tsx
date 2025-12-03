/**
 * File Upload Component test page
 * Demonstrates file upload functionality with various configurations
 */

'use client';

import { useState, useRef } from 'react';
import { ComponentTestTemplate, type PropsTableData } from '@/components/component_test_template';
import { COMPONENT_PAGES } from '@/config/component_pages';
import { HazoCollabFormInputbox, HazoCollabFormTextArea, type FileData } from 'hazo_collab_forms';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * File Upload Component test page
 */
export default function FileUploadComponentPage() {
  const config = COMPONENT_PAGES.find(c => c.path === '/components/file-upload');
  const [example_value, set_example_value] = useState('');
  const [example_files, set_example_files] = useState<FileData[]>([]);
  const [textarea_value, set_textarea_value] = useState('');
  const [textarea_files, set_textarea_files] = useState<FileData[]>([]);
  const input_ref = useRef<HTMLInputElement & { get_file_data?: () => FileData[] }>(null);
  const textarea_ref = useRef<HTMLTextAreaElement & { get_file_data?: () => FileData[] }>(null);

  // Example: File processor callback
  const handle_file_processor = async (file_data: FileData, component_ref: React.RefObject<any>) => {
    console.log('[File Upload] File processed:', file_data);
    console.log('[File Upload] Component ref:', component_ref);
    
    // Example: Access file data via ref
    if (component_ref.current && typeof component_ref.current.get_file_data === 'function') {
      const all_files = component_ref.current.get_file_data();
      console.log('[File Upload] All files via get_file_data():', all_files);
    }
  };

  // Example: Get file data via ref
  const handle_get_file_data = () => {
    if (input_ref.current && typeof input_ref.current.get_file_data === 'function') {
      const files = input_ref.current.get_file_data();
      console.log('[File Upload] Files from input:', files);
      alert(`Found ${files.length} file(s) in input field:\n${files.map(f => f.file_name).join('\n')}`);
    } else {
      alert('get_file_data() not available. Make sure to use a ref.');
    }
  };

  const handle_get_textarea_file_data = () => {
    if (textarea_ref.current && typeof textarea_ref.current.get_file_data === 'function') {
      const files = textarea_ref.current.get_file_data();
      console.log('[File Upload] Files from textarea:', files);
      alert(`Found ${files.length} file(s) in textarea field:\n${files.map(f => f.file_name).join('\n')}`);
    } else {
      alert('get_file_data() not available. Make sure to use a ref.');
    }
  };

  if (!config) {
    return <div>Component configuration not found</div>;
  }

  return (
    <div className="cls_file_upload_page space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{config.element_name}</h1>
        <p className="text-muted-foreground">{config.description}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Inputbox with file upload */}
        <Card>
          <CardHeader>
            <CardTitle>Input Field with File Upload</CardTitle>
            <CardDescription>
              Example of file upload in an input field. Supports drag-and-drop, file validation, and file management.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <HazoCollabFormInputbox
              ref={input_ref}
              label="Document Name"
              value={example_value}
              onChange={set_example_value}
              placeholder="Enter document name..."
              accept_files={true}
              files_dir="public/uploads/collab-forms"
              max_size={5 * 1024 * 1024} // 5MB
              max_files={5}
              file_accept=".pdf,.doc,.docx,.txt"
              file_processor={handle_file_processor}
              files={example_files}
              on_files_change={set_example_files}
            />
            <div className="flex gap-2">
              <Button onClick={handle_get_file_data} variant="outline" size="sm">
                Get File Data (via ref)
              </Button>
              <div className="text-sm text-muted-foreground flex items-center">
                Files: {example_files.length}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Textarea with file upload */}
        <Card>
          <CardHeader>
            <CardTitle>TextArea with File Upload</CardTitle>
            <CardDescription>
              Example of file upload in a textarea field. Supports images and documents.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <HazoCollabFormTextArea
              ref={textarea_ref}
              label="Notes with Attachments"
              value={textarea_value}
              onChange={set_textarea_value}
              placeholder="Enter notes..."
              rows={4}
              accept_files={true}
              files_dir="public/uploads/collab-forms"
              max_size={10 * 1024 * 1024} // 10MB
              max_files={10}
              file_accept="image/*,.pdf,.doc,.docx"
              file_processor={handle_file_processor}
              files={textarea_files}
              on_files_change={set_textarea_files}
            />
            <div className="flex gap-2">
              <Button onClick={handle_get_textarea_file_data} variant="outline" size="sm">
                Get File Data (via ref)
              </Button>
              <div className="text-sm text-muted-foreground flex items-center">
                Files: {textarea_files.length}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* File constraints examples */}
      <Card>
        <CardHeader>
          <CardTitle>File Upload Constraints Examples</CardTitle>
          <CardDescription>
            Different configurations for file upload constraints and validation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Minimum Files Example</h3>
            <HazoCollabFormInputbox
              label="Required Documents (min 2 files)"
              value=""
              onChange={() => {}}
              accept_files={true}
              files_dir="public/uploads/collab-forms"
              min_files={2}
              max_files={5}
              file_accept=".pdf"
            />
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Image Only Example</h3>
            <HazoCollabFormInputbox
              label="Profile Pictures (images only)"
              value=""
              onChange={() => {}}
              accept_files={true}
              files_dir="public/uploads/collab-forms"
              max_size={2 * 1024 * 1024} // 2MB
              max_files={3}
              file_accept="image/*"
            />
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Single File Example</h3>
            <HazoCollabFormInputbox
              label="Single Document Upload"
              value=""
              onChange={() => {}}
              accept_files={true}
              files_dir="public/uploads/collab-forms"
              max_files={1}
              file_accept=".pdf,.doc,.docx"
            />
          </div>
        </CardContent>
      </Card>

      {/* Usage instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Basic Setup</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Set <code className="bg-muted px-1 rounded">accept_files={true}</code> to enable file upload</li>
              <li>Configure <code className="bg-muted px-1 rounded">files_dir</code> for server storage path</li>
              <li>Set <code className="bg-muted px-1 rounded">file_accept</code> to restrict file types (e.g., "image/*", ".pdf,.doc")</li>
              <li>Configure <code className="bg-muted px-1 rounded">max_size</code>, <code className="bg-muted px-1 rounded">min_files</code>, and <code className="bg-muted px-1 rounded">max_files</code> as needed</li>
            </ol>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Accessing File Data</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Controlled mode:</strong> Use <code className="bg-muted px-1 rounded">files</code> and <code className="bg-muted px-1 rounded">on_files_change</code> props</li>
              <li><strong>Uncontrolled mode:</strong> Use a ref and call <code className="bg-muted px-1 rounded">get_file_data()</code> method</li>
              <li><strong>File processor:</strong> Use <code className="bg-muted px-1 rounded">file_processor</code> callback to handle files after upload</li>
            </ol>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">File Operations</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><strong>Upload:</strong> Drag and drop files or click to select</li>
              <li><strong>View:</strong> Click on a file icon to open it in the browser</li>
              <li><strong>Delete:</strong> Click the X button on a file to remove it</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

