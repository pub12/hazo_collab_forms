/**
 * File upload component for collaboration forms
 * Provides drag-and-drop file upload, file list display, and file management
 */

'use client';

import React, { useRef, useState, useCallback } from 'react';
import { cn } from '../utils/cn.js';
import { use_logger } from '../logger/context.js';
import type { FileData } from './hazo_collab_form_base.js';
import { HiTrash, HiPaperClip, HiPhotograph, HiDocument, HiDocumentText, HiCheckCircle } from 'react-icons/hi';
import { FaSpinner } from 'react-icons/fa';

/**
 * Props for CollabFormFileUpload component
 */
export interface CollabFormFileUploadProps {
  /**
   * Field identifier for unique file input ID
   */
  field_id_final: string;

  /**
   * Whether file upload is enabled
   */
  accept_files: boolean;

  /**
   * Server directory path where files should be saved
   */
  files_dir?: string;

  /**
   * Maximum file size in bytes
   */
  max_size?: number;

  /**
   * Minimum number of files
   */
  min_files?: number;

  /**
   * Maximum number of files
   */
  max_files?: number;

  /**
   * File type accept attribute
   */
  file_accept?: string;

  /**
   * Callback after file upload
   */
  file_processor?: (file_data: FileData, component_ref: React.RefObject<any>) => Promise<void> | void;

  /**
   * Controlled files state
   */
  files?: FileData[];

  /**
   * Callback when files change
   */
  on_files_change?: (files: FileData[]) => void;

  /**
   * Component reference to pass to file_processor
   */
  component_ref?: React.RefObject<any>;

  /**
   * Upload API endpoint
   * Default: '/api/collab-forms/upload-file'
   */
  upload_endpoint?: string;
}

/**
 * Get file icon based on file type
 */
function get_file_icon(file_type: string, file_name: string): React.ReactNode {
  const extension = file_name.split('.').pop()?.toLowerCase() || '';
  const mime_type = file_type.toLowerCase();

  // Image types
  if (mime_type.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
    return <HiPhotograph className="h-8 w-8 text-blue-500" />;
  }

  // PDF
  if (mime_type === 'application/pdf' || extension === 'pdf') {
    return <HiDocument className="h-8 w-8 text-red-500" />;
  }

  // Document types
  if (
    mime_type.includes('document') ||
    mime_type.includes('text') ||
    ['doc', 'docx', 'txt', 'rtf', 'odt'].includes(extension)
  ) {
    return <HiDocumentText className="h-8 w-8 text-green-500" />;
  }

  // Default
  return <HiPaperClip className="h-8 w-8 text-gray-500" />;
}

/**
 * Format file size for display
 */
function format_file_size(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Collaboration form file upload component
 */
export function CollabFormFileUpload({
  field_id_final,
  accept_files,
  files_dir,
  max_size,
  min_files,
  max_files = 10,
  file_accept,
  file_processor,
  files: controlled_files,
  on_files_change,
  component_ref,
  upload_endpoint = '/api/collab-forms/upload-file',
}: CollabFormFileUploadProps) {
  const file_input_ref = useRef<HTMLInputElement>(null);
  const [internal_files, set_internal_files] = useState<FileData[]>([]);
  const [is_dragging, set_is_dragging] = useState(false);
  const [upload_errors, set_upload_errors] = useState<Record<string, string>>({});
  const [uploading_files, set_uploading_files] = useState<Set<string>>(new Set());
  const [processing_files, set_processing_files] = useState<Set<string>>(new Set());
  const [processed_files, set_processed_files] = useState<Set<string>>(new Set());

  // Use controlled files if provided, otherwise use internal state
  const files = controlled_files !== undefined ? controlled_files : internal_files;
  const is_controlled = controlled_files !== undefined;

  /**
   * Update files state
   */
  const update_files = useCallback(
    (new_files: FileData[]) => {
      if (!is_controlled) {
        set_internal_files(new_files);
      }
      if (on_files_change) {
        on_files_change(new_files);
      }
    },
    [is_controlled, on_files_change]
  );

  /**
   * Validate file before upload
   */
  const validate_file = useCallback(
    (file: File): string | null => {
      // Check file count
      if (files.length >= max_files) {
        return `Maximum ${max_files} files allowed`;
      }

      // Check file size
      if (max_size && file.size > max_size) {
        return `File size exceeds maximum of ${format_file_size(max_size)}`;
      }

      // Check file type (if file_accept is specified)
      if (file_accept) {
        const accept_patterns = file_accept.split(',').map((p) => p.trim());
        const file_extension = '.' + file.name.split('.').pop()?.toLowerCase();
        const file_mime = file.type;

        const matches = accept_patterns.some((pattern) => {
          if (pattern.startsWith('.')) {
            // Extension match
            return file_extension === pattern.toLowerCase();
          } else if (pattern.includes('/*')) {
            // MIME type wildcard (e.g., "image/*")
            const base_type = pattern.split('/')[0];
            return file_mime.startsWith(base_type + '/');
          } else {
            // Exact MIME type match
            return file_mime === pattern;
          }
        });

        if (!matches) {
          return `File type not allowed. Accepted: ${file_accept}`;
        }
      }

      return null;
    },
    [files.length, max_files, max_size, file_accept]
  );

  /**
   * Upload file to server
   */
  const upload_file = useCallback(
    async (file: File): Promise<FileData | null> => {
      const file_id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const uploading_id = `${file_id}-${file.name}`;

      try {
        set_uploading_files((prev) => new Set(prev).add(uploading_id));

        const form_data = new FormData();
        form_data.append('file', file);
        if (files_dir) {
          form_data.append('files_dir', files_dir);
        }

        const response = await fetch(upload_endpoint, {
          method: 'POST',
          body: form_data,
        });

        if (!response.ok) {
          const error_data = await response.json().catch(() => ({ error: 'Upload failed' }));
          throw new Error(error_data.error || `Upload failed: ${response.statusText}`);
        }

        const result = await response.json();

        const file_data: FileData = {
          file_path: result.file_path || result.path || '',
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          file_id,
          uploaded_at: new Date(),
        };

        // Call file processor if provided
        if (file_processor && component_ref) {
          set_processing_files((prev) => new Set(prev).add(file_data.file_id));
          try {
            await file_processor(file_data, component_ref);
            set_processed_files((prev) => new Set(prev).add(file_data.file_id));
          } finally {
            set_processing_files((prev) => {
              const next = new Set(prev);
              next.delete(file_data.file_id);
              return next;
            });
          }
        }

        set_upload_errors((prev) => {
          const next = { ...prev };
          delete next[uploading_id];
          return next;
        });

        return file_data;
      } catch (error) {
        const error_message = error instanceof Error ? error.message : 'Upload failed';
        set_upload_errors((prev) => ({
          ...prev,
          [uploading_id]: error_message,
        }));
        return null;
      } finally {
        set_uploading_files((prev) => {
          const next = new Set(prev);
          next.delete(uploading_id);
          return next;
        });
      }
    },
    [files_dir, upload_endpoint, file_processor, component_ref]
  );

  /**
   * Handle file selection
   */
  const handle_files_selected = useCallback(
    async (selected_files: FileList | null) => {
      if (!selected_files || selected_files.length === 0) return;

      const files_to_upload: File[] = [];
      const errors: Record<string, string> = {};

      // Validate all files first
      Array.from(selected_files).forEach((file) => {
        const error = validate_file(file);
        if (error) {
          errors[file.name] = error;
        } else {
          files_to_upload.push(file);
        }
      });

      // Set validation errors
      if (Object.keys(errors).length > 0) {
        set_upload_errors((prev) => ({ ...prev, ...errors }));
      }

      // Upload valid files
      const upload_promises = files_to_upload.map((file) => upload_file(file));
      const uploaded_files = await Promise.all(upload_promises);
      const successful_uploads = uploaded_files.filter((f): f is FileData => f !== null);

      if (successful_uploads.length > 0) {
        update_files([...files, ...successful_uploads]);
      }
    },
    [files, validate_file, upload_file, update_files]
  );

  /**
   * Handle drag and drop
   */
  const handle_drag_enter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    set_is_dragging(true);
  }, []);

  const handle_drag_leave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    set_is_dragging(false);
  }, []);

  const handle_drag_over = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handle_drop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      set_is_dragging(false);
      handle_files_selected(e.dataTransfer.files);
    },
    [handle_files_selected]
  );

  /**
   * Handle file input change
   */
  const handle_input_change = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handle_files_selected(e.target.files);
      // Reset input to allow selecting the same file again
      if (file_input_ref.current) {
        file_input_ref.current.value = '';
      }
    },
    [handle_files_selected]
  );

  /**
   * Handle file delete
   */
  const handle_delete_file = useCallback(
    (file_id: string) => {
      const new_files = files.filter((f) => f.file_id !== file_id);

      // Check minimum files constraint
      if (min_files !== undefined && new_files.length < min_files) {
        set_upload_errors((prev) => ({
          ...prev,
          delete_error: `Minimum ${min_files} files required`,
        }));
        return;
      }

      update_files(new_files);
      set_upload_errors((prev) => {
        const next = { ...prev };
        delete next.delete_error;
        return next;
      });
    },
    [files, min_files, update_files]
  );

  /**
   * Get file URL
   */
  const get_file_url = useCallback((file_path: string) => {
    return file_path.startsWith('/')
      ? file_path
      : `/api/collab-forms/files/${encodeURIComponent(file_path)}`;
  }, []);

  const accordion_title = files.length > 0 ? `Files (${files.length})` : 'Files';

  // Always render wrapper div to maintain consistent DOM structure
  // This prevents hydration mismatches when accept_files changes between server and client
  return (
    <div className="cls_collab_file_upload space-y-2" suppressHydrationWarning>
      {accept_files ? (
        /* Dynamic import for Accordion - will be loaded by consuming app */
        <FileUploadAccordion
          field_id_final={field_id_final}
          title={accordion_title}
          is_dragging={is_dragging}
          on_drag_enter={handle_drag_enter}
          on_drag_leave={handle_drag_leave}
          on_drag_over={handle_drag_over}
          on_drop={handle_drop}
          file_input_ref={file_input_ref}
          file_accept={file_accept}
          on_input_change={handle_input_change}
          files={files}
          uploading_files={uploading_files}
          processing_files={processing_files}
          processed_files={processed_files}
          upload_errors={upload_errors}
          get_file_url={get_file_url}
          on_file_delete={handle_delete_file}
          get_file_icon={get_file_icon}
          format_file_size={format_file_size}
          max_files={max_files}
        />
      ) : null}
    </div>
  );
}

/**
 * File upload accordion component with dynamic imports
 */
function FileUploadAccordion({
  field_id_final,
  title,
  is_dragging,
  on_drag_enter,
  on_drag_leave,
  on_drag_over,
  on_drop,
  file_input_ref,
  file_accept,
  on_input_change,
  files,
  uploading_files,
  processing_files,
  processed_files,
  upload_errors,
  get_file_url,
  on_file_delete,
  get_file_icon,
  format_file_size,
  max_files,
}: {
  field_id_final: string;
  title: string;
  is_dragging: boolean;
  on_drag_enter: (e: React.DragEvent) => void;
  on_drag_leave: (e: React.DragEvent) => void;
  on_drag_over: (e: React.DragEvent) => void;
  on_drop: (e: React.DragEvent) => void;
  file_input_ref: React.RefObject<HTMLInputElement>;
  file_accept?: string;
  on_input_change: (e: React.ChangeEvent<HTMLInputElement>) => void;
  files: FileData[];
  uploading_files: Set<string>;
  processing_files: Set<string>;
  processed_files: Set<string>;
  upload_errors: Record<string, string>;
  get_file_url: (file_path: string) => string;
  on_file_delete: (file_id: string) => void;
  get_file_icon: (file_type: string, file_name: string) => React.ReactNode;
  format_file_size: (bytes: number) => string;
  max_files: number;
}) {
  const logger = use_logger();
  const [AccordionComponents, set_accordion_components] = React.useState<{
    Accordion: any;
    AccordionItem: any;
    AccordionTrigger: any;
    AccordionContent: any;
  } | null>(null);
  const [is_loading, set_is_loading] = React.useState(true);
  const [is_mounted, set_is_mounted] = React.useState(false);

  // Track client-side mounting to prevent hydration mismatch
  React.useEffect(() => {
    set_is_mounted(true);
  }, []);

  React.useEffect(() => {
    // Only load accordion on client side
    if (!is_mounted) return;

    // Dynamic import - components will be resolved by consuming app's bundler
    const load_accordion = async () => {
      try {
        set_is_loading(true);
        // Try to import from consuming app's components directory
        // This path will be resolved by Next.js/webpack in the consuming app
        // @ts-expect-error - These modules are provided by the consuming application
        const accordion_module = await import('@/components/ui/accordion').catch(() => null);
        
        if (accordion_module) {
          set_accordion_components({
            Accordion: accordion_module.Accordion,
            AccordionItem: accordion_module.AccordionItem,
            AccordionTrigger: accordion_module.AccordionTrigger,
            AccordionContent: accordion_module.AccordionContent,
          });
        } else {
          logger.warn('[CollabFormFileUpload] shadcn Accordion not found', {
            install_command: 'npx shadcn@latest add accordion',
          });
        }
      } catch (error) {
        logger.warn('[CollabFormFileUpload] Error loading accordion components', {
          error: error instanceof Error ? error.message : String(error),
        });
      } finally {
        set_is_loading(false);
      }
    };

    load_accordion();
  }, [is_mounted]);

  // Always render consistent structure to prevent hydration mismatch
  // During SSR and initial client render, show empty placeholder
  // After mount and accordion load, show actual content
  if (!is_mounted || is_loading || !AccordionComponents) {
    return (
      <div className="cls_collab_file_upload_loading text-sm text-muted-foreground" suppressHydrationWarning>
        {/* Empty placeholder - same on server and initial client render */}
      </div>
    );
  }

  const { Accordion, AccordionItem, AccordionTrigger, AccordionContent } = AccordionComponents;

  // Default to open if files exist
  const default_value = files.length > 0 ? 'files' : undefined;

  // Wrap Accordion in div with suppressHydrationWarning to prevent React from checking children
  // The Accordion content may differ between server and client due to dynamic imports
  return (
    <div suppressHydrationWarning>
      <Accordion type="single" collapsible defaultValue={default_value} className="w-full">
        <AccordionItem value="files">
          <AccordionTrigger className="text-sm font-medium">{title}</AccordionTrigger>
          <AccordionContent>
          <div className="space-y-4">
            {/* Drag and drop area */}
            <div
              className={cn(
                'cls_collab_file_drop_zone border-2 border-dashed rounded-md p-6 text-center transition-colors',
                is_dragging
                  ? 'border-primary bg-primary/5'
                  : 'border-input hover:border-primary/50 hover:bg-muted/50',
                files.length >= max_files && 'opacity-50 cursor-not-allowed'
              )}
              onDragEnter={on_drag_enter}
              onDragLeave={on_drag_leave}
              onDragOver={on_drag_over}
              onDrop={on_drop}
            >
              <input
                ref={file_input_ref}
                type="file"
                id={`${field_id_final}-file-input`}
                className="hidden"
                accept={file_accept}
                multiple
                onChange={on_input_change}
                disabled={files.length >= max_files}
              />
              <label
                htmlFor={`${field_id_final}-file-input`}
                className={cn(
                  'cursor-pointer block',
                  files.length >= max_files && 'cursor-not-allowed opacity-50'
                )}
              >
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Drag and drop files here, or click to select
                  </p>
                  {file_accept && (
                    <p className="text-xs text-muted-foreground">Accepted: {file_accept}</p>
                  )}
                </div>
              </label>
            </div>

            {/* Upload errors */}
            {Object.keys(upload_errors).length > 0 && (
              <div className="space-y-1">
                {Object.entries(upload_errors).map(([key, error]) => (
                  <p key={key} className="text-sm text-destructive">
                    {error}
                  </p>
                ))}
              </div>
            )}

            {/* File list */}
            {files.length > 0 && (
              <div className="cls_collab_file_list space-y-2">
                <div className="flex overflow-x-auto gap-2 pb-2">
                  {files.map((file_data) => {
                    const is_uploading = Array.from(uploading_files).some((id) =>
                      id.startsWith(file_data.file_id)
                    );
                    const is_processing = processing_files.has(file_data.file_id);
                    const is_processed = processed_files.has(file_data.file_id);

                    return (
                      <div
                        key={file_data.file_id}
                        className="cls_collab_file_item flex-shrink-0 w-24 flex flex-col items-center gap-1 p-2 border rounded-md hover:bg-muted transition-colors"
                      >
                        <a
                          href={get_file_url(file_data.file_path)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            "flex flex-col items-center gap-1 w-full",
                            is_uploading && "pointer-events-none opacity-50"
                          )}
                          aria-disabled={is_uploading}
                        >
                          <div className="relative">
                            {get_file_icon(file_data.file_type, file_data.file_name)}
                            {is_processing && (
                              <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5 shadow-sm border border-border">
                                <FaSpinner className="h-3 w-3 animate-spin text-primary" />
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-center truncate w-full" title={file_data.file_name}>
                            {file_data.file_name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format_file_size(file_data.file_size)}
                          </span>
                        </a>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => on_file_delete(file_data.file_id)}
                            className="text-destructive hover:text-destructive/80 p-1"
                            disabled={is_uploading}
                            aria-label={`Delete ${file_data.file_name}`}
                          >
                            <HiTrash className="h-4 w-4" />
                          </button>
                          {is_processed && !is_processing && (
                            <HiCheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        {is_uploading && (
                          <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-md">
                            <div className="text-xs text-muted-foreground">Uploading...</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
    </div>
  );
}

