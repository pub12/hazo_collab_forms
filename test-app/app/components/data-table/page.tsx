/**
 * Data Table Component test page
 * Documents the HazoCollabFormDataTable component with multiple example configurations
 * Includes editable JSON configuration for each example
 */

'use client';

import { useState, useCallback } from 'react';
import { COMPONENT_PAGES } from '@/config/component_pages';
import {
  HazoCollabFormDataTable,
  type DataTableConfig,
  type DataTableRow,
} from 'hazo_collab_forms';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

/**
 * Reusable component that renders a data table with editable JSON config
 */
interface EditableTableExampleProps {
  title: string;
  description: string;
  initial_config: DataTableConfig;
  initial_rows: DataTableRow[];
  label: string;
  disable_chat?: boolean;
  disable_data_ok?: boolean;
  data_ok_editable?: boolean;
  enable_notes?: boolean;
  enable_row_chat?: boolean;
}

function EditableTableExample({
  title,
  description,
  initial_config,
  initial_rows,
  label,
  disable_chat = true,
  disable_data_ok = false,
  data_ok_editable = false,
  enable_notes = false,
  enable_row_chat = false,
}: EditableTableExampleProps) {
  const [rows, set_rows] = useState<DataTableRow[]>(initial_rows);
  const [table_config, set_table_config] = useState<DataTableConfig>(initial_config);
  const [config_json, set_config_json] = useState<string>(JSON.stringify(initial_config, null, 2));
  const [json_error, set_json_error] = useState<string | null>(null);
  const [chat_log, set_chat_log] = useState<string[]>([]);

  const handle_json_change = useCallback((value: string) => {
    set_config_json(value);
    set_json_error(null);
  }, []);

  const apply_config = useCallback(() => {
    try {
      const parsed = JSON.parse(config_json);
      set_table_config(parsed);
      set_json_error(null);
    } catch (e) {
      set_json_error(e instanceof Error ? e.message : 'Invalid JSON');
    }
  }, [config_json]);

  const reset_config = useCallback(() => {
    set_table_config(initial_config);
    set_config_json(JSON.stringify(initial_config, null, 2));
    set_json_error(null);
    set_rows(initial_rows);
  }, [initial_config, initial_rows]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Editable JSON Configuration */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="config" className="border rounded-lg">
            <AccordionTrigger className="px-4 text-sm font-medium">
              Edit Configuration JSON
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-3">
                <textarea
                  value={config_json}
                  onChange={(e) => handle_json_change(e.target.value)}
                  className="w-full h-64 p-3 font-mono text-xs bg-muted border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  spellCheck={false}
                />
                {json_error && (
                  <p className="text-sm text-destructive">Error: {json_error}</p>
                )}
                <div className="flex gap-2">
                  <Button size="sm" onClick={apply_config}>
                    Apply Changes
                  </Button>
                  <Button size="sm" variant="outline" onClick={reset_config}>
                    Reset
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Data Table */}
        {/* Note: enable_row_collab in table_config enables row-level features,
            but component-level props (disable_chat, disable_data_ok, enable_notes)
            further control which specific features are shown.
            For testing, we check if enable_row_collab is set in config to override defaults. */}
        <HazoCollabFormDataTable
          label={label}
          table_config={table_config}
          value={rows}
          onChange={set_rows}
          disable_chat={table_config.enable_row_collab ? false : disable_chat}
          disable_data_ok={table_config.enable_row_collab ? false : disable_data_ok}
          data_ok_editable={table_config.enable_row_collab ? true : data_ok_editable}
          enable_notes={table_config.enable_row_collab ? true : enable_notes}
          on_row_chat_click={(row_id, row_index) => {
            const log_entry = `Chat clicked for row ${row_index + 1} (${row_id})`;
            set_chat_log((prev) => [...prev, log_entry]);
            // Toggle _has_chat_messages for demo purposes
            set_rows((prev) =>
              prev.map((r) =>
                r._row_id === row_id
                  ? { ...r, _has_chat_messages: !r._has_chat_messages }
                  : r
              )
            );
          }}
        />

        {/* Chat Log (shown when row collab is enabled and there are logs) */}
        {(enable_row_chat || table_config.enable_row_collab) && chat_log.length > 0 && (
          <div className="p-3 bg-muted rounded-md">
            <p className="text-xs font-medium mb-2">Chat Click Log:</p>
            <ul className="text-xs space-y-1">
              {chat_log.slice(-5).map((log, idx) => (
                <li key={idx} className="text-muted-foreground">{log}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Current Data Output */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="data" className="border rounded-lg">
            <AccordionTrigger className="px-4 text-sm font-medium">
              Current Row Data ({rows.length} rows)
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <pre className="p-3 bg-muted rounded text-xs overflow-auto max-h-48">
                {JSON.stringify(rows, null, 2)}
              </pre>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

// ============================================
// Example Configurations
// ============================================

const SIMPLE_EXPENSES_CONFIG: DataTableConfig = {
  columns: [
    {
      id: 'description',
      label: 'Description',
      field_type: 'text',
      editable: true,
      width: 'w-48',
      constraints: {
        required: true,
        length: 100,
      },
    },
    {
      id: 'category',
      label: 'Category',
      field_type: 'dropdown',
      editable: true,
      width: 'w-32',
      options: [
        { label: 'Supplies', value: 'supplies' },
        { label: 'Travel', value: 'travel' },
        { label: 'Equipment', value: 'equipment' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      id: 'amount',
      label: 'Amount ($)',
      field_type: 'numeric',
      editable: true,
      width: 'w-28',
      constraints: {
        min: 0,
        num_decimals: 2,
      },
      aggregation: {
        type: 'sum',
        label: 'Total',
      },
    },
  ],
  allow_add_row: true,
  allow_delete_row: true,
  show_row_numbers: true,
  show_subtotal_row: true,
  empty_message: 'No expenses added. Click "Add Row" to begin.',
};

const SIMPLE_EXPENSES_ROWS: DataTableRow[] = [
  { _row_id: 'row_expenses_1', description: 'Office Supplies', amount: 150.00, category: 'supplies' },
  { _row_id: 'row_expenses_2', description: 'Travel Expense', amount: 320.50, category: 'travel' },
];

const TAX_DEDUCTIONS_CONFIG: DataTableConfig = {
  columns: [
    {
      id: 'deduction_code',
      label: 'Code',
      field_type: 'dropdown',
      editable: true,
      width: 'w-36',
      options: [
        { label: 'D1 - Car', value: 'D1' },
        { label: 'D2 - Travel', value: 'D2' },
        { label: 'D3 - Uniform', value: 'D3' },
        { label: 'D4 - Self-Ed', value: 'D4' },
        { label: 'D5 - Other Work', value: 'D5' },
        { label: 'D9 - Gifts', value: 'D9' },
        { label: 'D10 - Tax Agent', value: 'D10' },
      ],
      tooltip: {
        enabled: true,
        title: 'Deduction Code',
        content: 'Select the ATO deduction category code that best matches your expense.',
      },
    },
    {
      id: 'description',
      label: 'Description',
      field_type: 'text',
      editable: true,
      width: 'w-48',
      constraints: {
        required: true,
        length: 200,
      },
      tooltip: {
        enabled: true,
        title: 'Description',
        content: 'Provide a brief description of the deduction item.',
      },
    },
    {
      id: 'amount',
      label: 'Amount ($)',
      field_type: 'numeric',
      editable: true,
      width: 'w-28',
      constraints: {
        min: 0,
        max: 999999.99,
        num_decimals: 2,
        required: true,
      },
      aggregation: {
        type: 'sum',
        label: 'Total Deductions',
      },
      tooltip: {
        enabled: true,
        title: 'Amount',
        content: 'Enter the deduction amount in whole dollars. Must be a positive number.',
      },
    },
    {
      id: 'verified',
      label: 'Verified',
      field_type: 'checkbox',
      editable: true,
      width: 'w-20',
      tooltip: {
        enabled: true,
        content: 'Check this box once you have verified this deduction with supporting documentation.',
      },
    },
  ],
  allow_add_row: true,
  allow_delete_row: true,
  show_row_numbers: true,
  show_subtotal_row: true,
  max_rows: 50,
  empty_message: 'No deductions added. Click "Add Row" to add your first deduction.',
  enable_row_collab: true,
};

const TAX_DEDUCTIONS_ROWS: DataTableRow[] = [];

const INVENTORY_CONFIG: DataTableConfig = {
  columns: [
    {
      id: 'sku',
      label: 'SKU',
      field_type: 'text',
      editable: false,
      width: 'w-24',
      background_color: 'bg-muted',
      header_styling: {
        bold: true,
        color: 'text-primary',
      },
      constraints: {
        regex: '^PRD-\\d{3}$',
      },
    },
    {
      id: 'name',
      label: 'Product Name',
      field_type: 'text',
      editable: true,
      width: 'w-40',
      header_styling: {
        bold: true,
      },
      constraints: {
        required: true,
        length: 50,
      },
    },
    {
      id: 'quantity',
      label: 'Qty',
      field_type: 'numeric',
      editable: true,
      width: 'w-20',
      header_styling: {
        bold: true,
      },
      constraints: {
        min: 0,
        max: 9999,
      },
      aggregation: {
        type: 'sum',
        label: 'Total',
      },
    },
    {
      id: 'in_stock',
      label: 'In Stock',
      field_type: 'checkbox',
      editable: true,
      width: 'w-20',
      header_styling: {
        bold: true,
      },
    },
  ],
  allow_add_row: true,
  allow_delete_row: true,
  show_row_numbers: false,
  show_subtotal_row: true,
  enable_row_collab: false,
};

const INVENTORY_ROWS: DataTableRow[] = [
  { _row_id: 'row_inventory_1', sku: 'PRD-001', name: 'Widget A', quantity: 100, in_stock: true },
  { _row_id: 'row_inventory_2', sku: 'PRD-002', name: 'Widget B', quantity: 50, in_stock: true },
  { _row_id: 'row_inventory_3', sku: 'PRD-003', name: 'Gadget X', quantity: 0, in_stock: false },
];

const SURVEY_CONFIG: DataTableConfig = {
  columns: [
    {
      id: 'question',
      label: 'Question',
      field_type: 'text',
      editable: true,
      width: 'w-56',
      constraints: {
        required: true,
      },
    },
    {
      id: 'response',
      label: 'Response',
      field_type: 'radiobutton',
      editable: true,
      width: 'w-64',
      options: [
        { label: 'Very Satisfied', value: 'very_satisfied' },
        { label: 'Satisfied', value: 'satisfied' },
        { label: 'Neutral', value: 'neutral' },
        { label: 'Unsatisfied', value: 'unsatisfied' },
      ],
    },
  ],
  allow_add_row: true,
  allow_delete_row: true,
  show_row_numbers: true,
  show_subtotal_row: false,
  enable_row_collab: false,
};

const SURVEY_ROWS: DataTableRow[] = [
  { _row_id: 'row_survey_1', question: 'Overall satisfaction?', response: 'satisfied' },
  { _row_id: 'row_survey_2', question: 'Would recommend?', response: 'yes' },
];

const DOCUMENTS_CONFIG: DataTableConfig = {
  columns: [
    {
      id: 'doc_name',
      label: 'Document Name',
      field_type: 'text',
      editable: true,
      width: 'w-40',
      constraints: {
        required: true,
      },
    },
    {
      id: 'doc_type',
      label: 'Type',
      field_type: 'dropdown',
      editable: true,
      width: 'w-28',
      options: [
        { label: 'Report', value: 'report' },
        { label: 'Invoice', value: 'invoice' },
        { label: 'Contract', value: 'contract' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      id: 'attachments',
      label: 'Files',
      field_type: 'files',
      editable: true,
      width: 'w-24',
      files_config: {
        target_path: '/uploads/documents',
        max_files: 5,
        file_accept: '.pdf,.doc,.docx,.xls,.xlsx',
      },
    },
  ],
  allow_add_row: true,
  allow_delete_row: true,
  show_row_numbers: true,
  show_subtotal_row: false,
};

const DOCUMENTS_ROWS: DataTableRow[] = [
  { _row_id: 'row_docs_1', doc_name: 'Annual Report', doc_type: 'report', _files: {} },
];

// Example 6: Row-Level Collaboration Features
const ROW_COLLAB_CONFIG: DataTableConfig = {
  columns: [
    {
      id: 'task_name',
      label: 'Task',
      field_type: 'text',
      editable: true,
      width: 'w-48',
      constraints: {
        required: true,
      },
    },
    {
      id: 'assignee',
      label: 'Assignee',
      field_type: 'dropdown',
      editable: true,
      width: 'w-32',
      options: [
        { label: 'Alice', value: 'alice' },
        { label: 'Bob', value: 'bob' },
        { label: 'Charlie', value: 'charlie' },
      ],
    },
    {
      id: 'status',
      label: 'Status',
      field_type: 'dropdown',
      editable: true,
      width: 'w-28',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Done', value: 'done' },
      ],
    },
    {
      id: 'priority',
      label: 'Priority',
      field_type: 'radiobutton',
      editable: true,
      width: 'w-28',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Med', value: 'medium' },
        { label: 'High', value: 'high' },
      ],
    },
  ],
  allow_add_row: true,
  allow_delete_row: true,
  show_row_numbers: true,
  show_subtotal_row: false,
  enable_row_collab: true,
};

const ROW_COLLAB_ROWS: DataTableRow[] = [
  {
    _row_id: 'row_collab_1',
    task_name: 'Review proposal',
    assignee: 'alice',
    status: 'pending',
    priority: 'high',
    _has_chat_messages: true, // This row has chat messages - will be highlighted
    _has_notes: true,
    _notes: [{ user: 'Alice <alice@example.com>', timestamp: new Date().toISOString(), notes: 'Needs urgent review' }],
  },
  {
    _row_id: 'row_collab_2',
    task_name: 'Update documentation',
    assignee: 'bob',
    status: 'in_progress',
    priority: 'medium',
  },
  {
    _row_id: 'row_collab_3',
    task_name: 'Deploy to staging',
    assignee: 'charlie',
    status: 'done',
    priority: 'low',
    _data_ok: true, // This row is marked as verified
  },
];

// Example 7: Files with clickable links
const FILES_DEMO_CONFIG: DataTableConfig = {
  columns: [
    {
      id: 'project_name',
      label: 'Project',
      field_type: 'text',
      editable: true,
      width: 'w-40',
    },
    {
      id: 'documents',
      label: 'Documents',
      field_type: 'files',
      editable: true,
      width: 'w-64',
      files_config: {
        target_path: '/uploads/projects',
        max_files: 10,
        file_accept: '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.png',
      },
    },
  ],
  allow_add_row: true,
  allow_delete_row: true,
  show_row_numbers: true,
  enable_row_collab: false,
};

const FILES_DEMO_ROWS: DataTableRow[] = [
  {
    _row_id: 'row_files_1',
    project_name: 'Website Redesign',
    _files: {
      documents: [
        { file_id: 'file_1', file_name: 'requirements.pdf', file_path: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', file_size: 1024, file_type: 'application/pdf', uploaded_at: new Date('2024-01-15') },
        { file_id: 'file_2', file_name: 'wireframes.pdf', file_path: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', file_size: 2048, file_type: 'application/pdf', uploaded_at: new Date('2024-01-16') },
      ]
    }
  },
  {
    _row_id: 'row_files_2',
    project_name: 'Mobile App',
    _files: {
      documents: [
        { file_id: 'file_3', file_name: 'app_spec_document_v2_final.docx', file_path: 'https://www.example.com/doc.docx', file_size: 512, file_type: 'application/docx', uploaded_at: new Date('2024-02-01') },
      ]
    }
  },
];

/**
 * Data Table Component test page
 */
export default function DataTableComponentPage() {
  const config = COMPONENT_PAGES.find((c) => c.path === '/components/data-table');

  if (!config) {
    return <div>Component configuration not found</div>;
  }

  return (
    <div className="cls_data_table_test_page h-full overflow-y-auto">
      <div className="container mx-auto py-6 space-y-8 pb-16">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{config.element_name}</h1>
          <p className="text-lg text-muted-foreground">{config.description}</p>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-mono bg-muted px-2 py-1 rounded">{config.component_name}</span>
          </div>
        </div>

        {/* JSON Schema Reference - Accordion */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="json-schema" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-semibold">
              JSON Configuration Schema Reference
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground mb-4">
                The data table is configured via JSON. Here is the structure for FormSet integration:
              </p>
              <pre className="p-4 bg-muted rounded text-xs overflow-auto max-h-96">
{`{
  "id": "my_table",
  "label": "My Data Table",
  "field_type": "field",
  "component_type": "HazoCollabFormDataTable",
  "value": [],
  "table_config": {
    "columns": [
      {
        "id": "column_id",
        "label": "Column Label",
        "field_type": "text | numeric | dropdown | checkbox | radiobutton | files",
        "editable": true,
        "width": "w-32",
        "background_color": "bg-muted",
        "header_styling": { "bold": true, "italic": false, "size": "text-sm", "color": "text-primary" },
        "constraints": { "min": 0, "max": 100, "length": 50, "regex": "^[A-Z]+$", "required": true, "num_decimals": 2 },
        "options": [{ "label": "Option 1", "value": "opt1" }],
        "files_config": { "target_path": "/uploads", "max_files": 5, "file_accept": ".pdf" },
        "aggregation": { "type": "sum | average | count | none", "label": "Total" },
        "tooltip": { "enabled": true, "title": "Help", "content": "Tooltip text..." }
      }
    ],
    "allow_add_row": true,
    "allow_delete_row": true,
    "show_row_numbers": true,
    "show_subtotal_row": true,
    "empty_message": "No data. Click Add Row.",
    "max_rows": 50,
    "enable_row_collab": true
  }
}`}
              </pre>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Examples */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Interactive Examples</h2>
          <p className="text-muted-foreground">
            Expand &quot;Edit Configuration JSON&quot; above each table to modify the configuration and click &quot;Apply Changes&quot; to see the result.
          </p>

          <EditableTableExample
            title="1. Simple Expenses Table"
            description="Basic table with text, dropdown, and numeric columns. Shows aggregation (sum) at the bottom."
            initial_config={SIMPLE_EXPENSES_CONFIG}
            initial_rows={SIMPLE_EXPENSES_ROWS}
            label="Monthly Expenses"
            disable_chat
            disable_data_ok
          />

          <EditableTableExample
            title="2. Tax Deductions Table"
            description="Table with column tooltips (hover over ? icon), checkbox column, and row-level data-ok. Demonstrates validation constraints and max rows limit."
            initial_config={TAX_DEDUCTIONS_CONFIG}
            initial_rows={TAX_DEDUCTIONS_ROWS}
            label="Tax Deductions"
            disable_chat
            data_ok_editable
          />

          <EditableTableExample
            title="3. Product Inventory"
            description="Table with styled headers, non-editable SKU column (read-only with muted background), and checkbox for in-stock status. Row collaboration features disabled."
            initial_config={INVENTORY_CONFIG}
            initial_rows={INVENTORY_ROWS}
            label="Inventory"
            disable_chat
            disable_data_ok
          />

          <EditableTableExample
            title="4. Survey Responses"
            description="Table demonstrating radio button column type for single-selection responses."
            initial_config={SURVEY_CONFIG}
            initial_rows={SURVEY_ROWS}
            label="Survey"
            disable_chat
            disable_data_ok
          />

          <EditableTableExample
            title="5. Documents with File Attachments"
            description="Table with file upload column. Click the paperclip icon to add files."
            initial_config={DOCUMENTS_CONFIG}
            initial_rows={DOCUMENTS_ROWS}
            label="Documents"
            disable_chat
            disable_data_ok
          />

          <EditableTableExample
            title="6. Row-Level Collaboration"
            description="Table with row-level collaboration features: data-ok checkbox, notes, and chat icons per row. Row 1 has chat messages (highlighted in red) and notes. Row 3 is marked as verified (data-ok). Click the chat icon to toggle chat message state."
            initial_config={ROW_COLLAB_CONFIG}
            initial_rows={ROW_COLLAB_ROWS}
            label="Task List"
            disable_chat={false}
            disable_data_ok={false}
            data_ok_editable
            enable_notes
            enable_row_chat
          />

          <EditableTableExample
            title="7. Clickable File Links"
            description="Table demonstrating clickable file tags. Click on a filename to open it in a new tab. Files have real URLs that will open. The first row has sample PDF files."
            initial_config={FILES_DEMO_CONFIG}
            initial_rows={FILES_DEMO_ROWS}
            label="Project Files"
            disable_chat
            disable_data_ok
          />
        </div>

        {/* Props Reference */}
        <Card>
          <CardHeader>
            <CardTitle>Component Props</CardTitle>
            <CardDescription>Key props for the HazoCollabFormDataTable component</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium">Prop</th>
                    <th className="text-left p-2 font-medium">Type</th>
                    <th className="text-left p-2 font-medium">Required</th>
                    <th className="text-left p-2 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2 font-mono text-xs">label</td>
                    <td className="p-2 font-mono text-xs">string</td>
                    <td className="p-2">Yes</td>
                    <td className="p-2">Label text for the table field</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-mono text-xs">table_config</td>
                    <td className="p-2 font-mono text-xs">DataTableConfig</td>
                    <td className="p-2">Yes</td>
                    <td className="p-2">Configuration object with columns and settings</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-mono text-xs">value</td>
                    <td className="p-2 font-mono text-xs">DataTableRow[]</td>
                    <td className="p-2">Yes</td>
                    <td className="p-2">Array of row data objects</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-mono text-xs">onChange</td>
                    <td className="p-2 font-mono text-xs">(rows) =&gt; void</td>
                    <td className="p-2">Yes</td>
                    <td className="p-2">Callback when table data changes</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-mono text-xs">disabled</td>
                    <td className="p-2 font-mono text-xs">boolean</td>
                    <td className="p-2">No</td>
                    <td className="p-2">Disable all editing in the table</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-mono text-xs">disable_chat</td>
                    <td className="p-2 font-mono text-xs">boolean</td>
                    <td className="p-2">No</td>
                    <td className="p-2">Hide table-level chat icon</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-mono text-xs">disable_data_ok</td>
                    <td className="p-2 font-mono text-xs">boolean</td>
                    <td className="p-2">No</td>
                    <td className="p-2">Hide data-ok checkboxes</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-mono text-xs">data_ok_editable</td>
                    <td className="p-2 font-mono text-xs">boolean</td>
                    <td className="p-2">No</td>
                    <td className="p-2">Allow data-ok checkboxes to be toggled</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Column Field Types */}
        <Card>
          <CardHeader>
            <CardTitle>Column Field Types</CardTitle>
            <CardDescription>Supported field types for table columns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium">Field Type</th>
                    <th className="text-left p-2 font-medium">Description</th>
                    <th className="text-left p-2 font-medium">Value Type</th>
                    <th className="text-left p-2 font-medium">Supports Aggregation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2 font-mono text-xs">text</td>
                    <td className="p-2">Single-line text input</td>
                    <td className="p-2 font-mono text-xs">string</td>
                    <td className="p-2">No</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-mono text-xs">numeric</td>
                    <td className="p-2">Numeric input with validation</td>
                    <td className="p-2 font-mono text-xs">string | number</td>
                    <td className="p-2">Yes (sum, average, count)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-mono text-xs">dropdown</td>
                    <td className="p-2">Select dropdown with options</td>
                    <td className="p-2 font-mono text-xs">string</td>
                    <td className="p-2">No</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-mono text-xs">checkbox</td>
                    <td className="p-2">Boolean checkbox</td>
                    <td className="p-2 font-mono text-xs">boolean</td>
                    <td className="p-2">No</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-mono text-xs">radiobutton</td>
                    <td className="p-2">Radio button group</td>
                    <td className="p-2 font-mono text-xs">string</td>
                    <td className="p-2">No</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-mono text-xs">files</td>
                    <td className="p-2">File upload with modal</td>
                    <td className="p-2 font-mono text-xs">FileData[]</td>
                    <td className="p-2">No</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
