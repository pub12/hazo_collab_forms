/**
 * Tax Checklist page
 * Test page for the HazoCollabFormInputbox component
 */

'use client';

import { useState, useEffect } from 'react';
import { HazoCollabFormInputbox, HazoCollabFormTextArea, HazoCollabFormCheckbox, HazoCollabFormCombo, HazoCollabFormRadio, use_chat_messages_check } from 'hazo_collab_forms';
import { HazoChat } from 'hazo_chat';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { get_config_client } from '@/lib/config_client';
import { cn } from '@/lib/utils';

/**
 * Tax Checklist page component
 * Demonstrates usage of the HazoCollabFormInputbox component
 */
export default function TaxChecklistPage() {
  const [full_legal_name, set_full_legal_name] = useState('');
  const [full_legal_name_error, set_full_legal_name_error] = useState<string | undefined>(undefined);

  const [date_of_birth, set_date_of_birth] = useState('');
  const [date_of_birth_error, set_date_of_birth_error] = useState<string | undefined>(undefined);

  const [tax_file_number, set_tax_file_number] = useState('');
  const [tax_file_number_error, set_tax_file_number_error] = useState<string | undefined>(undefined);

  const [tax_status, set_tax_status] = useState(false);
  const [tax_status_error, set_tax_status_error] = useState<string | undefined>(undefined);

  // Postal Address Change state
  const [postal_address_change, set_postal_address_change] = useState('');
  const [postal_address_change_error, set_postal_address_change_error] = useState<string | undefined>(undefined);

  // Bank Details state
  const [account_name, set_account_name] = useState('');
  const [account_name_error, set_account_name_error] = useState<string | undefined>(undefined);

  const [bsb_number, set_bsb_number] = useState('');
  const [bsb_number_error, set_bsb_number_error] = useState<string | undefined>(undefined);

  const [account_number, set_account_number] = useState('');
  const [account_number_error, set_account_number_error] = useState<string | undefined>(undefined);

  // Notes/Additional Information state (for textarea example)
  const [notes, set_notes] = useState('');
  const [notes_error, set_notes_error] = useState<string | undefined>(undefined);

  // Australian State selection state
  const [australian_state, set_australian_state] = useState('');
  const [australian_state_error, set_australian_state_error] = useState<string | undefined>(undefined);

  // Multi-state radio state for Tax File Number field
  const [tax_file_number_radio_state, set_tax_file_number_radio_state] = useState<string>('');

  // Data OK checkbox states
  const [full_legal_name_data_ok, set_full_legal_name_data_ok] = useState(false);
  const [date_of_birth_data_ok, set_date_of_birth_data_ok] = useState(false);
  const [tax_file_number_data_ok, set_tax_file_number_data_ok] = useState(false);

  // State for active chat
  const [active_chat_field_data_id, set_active_chat_field_data_id] = useState<string | null>(null);
  const [active_chat_field_name, set_active_chat_field_name] = useState<string | null>(null);

  // State for chat background color from config
  const [chat_background_color, set_chat_background_color] = useState<string>('bg-muted');
  // State for field background color from config
  const [field_background_color, set_field_background_color] = useState<string>('bg-muted');

  const recipient_user_id = '2775a808-88d9-4e43-aae9-47420ae003dc';

  /**
   * Load chat and field background colors from config
   */
  useEffect(() => {
    const load_background_colors = async () => {
      const chat_color = await get_config_client('chat', 'background_color');
      const field_color = await get_config_client('chat', 'field_background_color');
      if (chat_color) {
        set_chat_background_color(chat_color);
      }
      if (field_color) {
        set_field_background_color(field_color);
      }
    };
    load_background_colors();
  }, []);

  // Check for chat messages for each field
  const full_legal_name_has_messages = use_chat_messages_check({
    reference_id: 'full-legal-name-data-001',
    reference_type: '',
    enabled: true,
    poll_interval: 5000,
  });

  const date_of_birth_has_messages = use_chat_messages_check({
    reference_id: 'date-of-birth-data-002',
    reference_type: '',
    enabled: true,
    poll_interval: 5000,
  });

  const tax_file_number_has_messages = use_chat_messages_check({
    reference_id: 'tax-file-number-data-003',
    reference_type: '',
    enabled: true,
    poll_interval: 5000,
  });

  const tax_status_has_messages = use_chat_messages_check({
    reference_id: 'tax-status-data-004',
    reference_type: '',
    enabled: true,
    poll_interval: 5000,
  });

  const postal_address_change_has_messages = use_chat_messages_check({
    reference_id: 'postal-address-change-data-010',
    reference_type: '',
    enabled: true,
    poll_interval: 5000,
  });

  // Check for chat messages for bank details fields
  const account_name_has_messages = use_chat_messages_check({
    reference_id: 'account-name-data-005',
    reference_type: '',
    enabled: true,
    poll_interval: 5000,
  });

  const bsb_number_has_messages = use_chat_messages_check({
    reference_id: 'bsb-number-data-006',
    reference_type: '',
    enabled: true,
    poll_interval: 5000,
  });

  const account_number_has_messages = use_chat_messages_check({
    reference_id: 'account-number-data-007',
    reference_type: '',
    enabled: true,
    poll_interval: 5000,
  });

  // Check for chat messages for notes field
  const notes_has_messages = use_chat_messages_check({
    reference_id: 'notes-data-008',
    reference_type: '',
    enabled: true,
    poll_interval: 5000,
  });

  const australian_state_has_messages = use_chat_messages_check({
    reference_id: 'australian-state-data-009',
    reference_type: '',
    enabled: true,
    poll_interval: 5000,
  });

  /**
   * Handle full legal name validation
   */
  const handle_full_legal_name_change = (value: string) => {
    set_full_legal_name(value);
    // Simple validation example
    if (value && value.length < 2) {
      set_full_legal_name_error('Full legal name must be at least 2 characters');
    } else {
      set_full_legal_name_error(undefined);
    }
  };

  /**
   * Handle date of birth validation
   */
  const handle_date_of_birth_change = (value: string) => {
    set_date_of_birth(value);
    // Simple validation example - can be enhanced with date format validation
    if (value && value.length < 8) {
      set_date_of_birth_error('Please enter a valid date of birth');
    } else {
      set_date_of_birth_error(undefined);
    }
  };

  /**
   * Handle tax file number validation
   */
  const handle_tax_file_number_change = (value: string) => {
    set_tax_file_number(value);
    // Simple validation example
    if (value && value.length < 8) {
      set_tax_file_number_error('Tax file number must be at least 8 characters');
    } else {
      set_tax_file_number_error(undefined);
    }
  };

  /**
   * Handle tax status change
   */
  const handle_tax_status_change = (checked: boolean) => {
    set_tax_status(checked);
    // Clear any errors when checkbox is toggled
    set_tax_status_error(undefined);
  };

  /**
   * Handle postal address change validation
   */
  const handle_postal_address_change = (value: string) => {
    set_postal_address_change(value);
    // Clear any errors when selection changes
    set_postal_address_change_error(undefined);
  };

  /**
   * Handle account name validation
   */
  const handle_account_name_change = (value: string) => {
    set_account_name(value);
    // Simple validation example
    if (value && value.length < 2) {
      set_account_name_error('Account name must be at least 2 characters');
    } else {
      set_account_name_error(undefined);
    }
  };

  /**
   * Handle BSB number validation
   */
  const handle_bsb_number_change = (value: string) => {
    set_bsb_number(value);
    // Simple validation example - BSB is typically 6 digits
    if (value && value.length < 6) {
      set_bsb_number_error('BSB number must be at least 6 characters');
    } else {
      set_bsb_number_error(undefined);
    }
  };

  /**
   * Handle account number validation
   */
  const handle_account_number_change = (value: string) => {
    set_account_number(value);
    // Simple validation example
    if (value && value.length < 6) {
      set_account_number_error('Account number must be at least 6 characters');
    } else {
      set_account_number_error(undefined);
    }
  };

  /**
   * Handle notes validation
   */
  const handle_notes_change = (value: string) => {
    set_notes(value);
    // Simple validation example
    if (value && value.length > 0 && value.length < 10) {
      set_notes_error('Notes must be at least 10 characters if provided');
    } else {
      set_notes_error(undefined);
    }
  };

  /**
   * Handle chat icon click
   */
  const handle_chat_click = (field_data_id: string, field_name?: string) => {
    set_active_chat_field_data_id(field_data_id);
    set_active_chat_field_name(field_name || null);
  };

  /**
   * Handle chat close button click
   */
  const handle_chat_close = () => {
    set_active_chat_field_data_id(null);
    set_active_chat_field_name(null);
  };

  return (
    <div className="cls_tax_checklist_container p-8 h-full flex flex-col overflow-hidden">
      <div className="cls_tax_checklist_content w-full space-y-6 flex-1 flex flex-col min-h-0">
        <div className="cls_tax_checklist_header flex-shrink-0">
          <h1 className="text-4xl font-bold tracking-tight">
            Tax Checklist
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Test page for collaboration form input components
          </p>
        </div>

        {/* Single column layout with grey background - stretches to bottom with scrolling */}
        <div className="cls_tax_checklist_main bg-muted rounded-lg p-6 flex-1 flex flex-col min-h-0 overflow-y-auto">
          <div className="cls_tax_checklist_columns flex flex-col gap-6 flex-1 min-h-0">
            {/* Individual Information Section */}
            <div className="cls_tax_checklist_column_1 flex flex-col min-h-0">
              <Card className="cls_tax_checklist_card flex-1 flex flex-col">
                <CardHeader>
                  <CardTitle>Individual Information</CardTitle>
                  <CardDescription>
                    Enter your individual information. Click the chat icon next to any field to see collaboration features.
                  </CardDescription>
                </CardHeader>
                <CardContent className="cls_tax_checklist_form space-y-6 flex-1">
                  {/* Full Legal Name Field */}
                  <div className={cn(
                    'cls_field_with_chat flex gap-4 items-start',
                    active_chat_field_data_id === 'full-legal-name-data-001' && 'flex-row'
                  )}>
                    <div className="flex-1">
                      <HazoCollabFormInputbox
                    label="Your full legal name"
                    value={full_legal_name}
                    onChange={handle_full_legal_name_change}
                    error={full_legal_name_error}
                    field_id="full_legal_name"
                    field_data_id="full-legal-name-data-001"
                    field_name="Your full legal name"
                                        on_chat_click={handle_chat_click}
                    has_chat_messages={full_legal_name_has_messages.has_messages}
                    is_chat_active={active_chat_field_data_id === 'full-legal-name-data-001'}
                    placeholder="Enter your full legal name"
                                        data_ok_checked={full_legal_name_data_ok}
                    on_data_ok_change={set_full_legal_name_data_ok}
                    additional_context={{
                      section: 'Individual Information',
                      required: true,
                    }}
                      />
                    </div>
                    {active_chat_field_data_id === 'full-legal-name-data-001' && (
                      <div className="cls_field_chat_wrapper w-96 flex-shrink-0">
                        <Card className={`cls_tax_checklist_chat_card flex flex-col min-h-0 ${chat_background_color}`} style={{ height: '400px' }}>
                          <CardContent className="cls_tax_checklist_chat_content p-0 flex-1 flex flex-col min-h-0">
                            <div className="cls_tax_checklist_chat_wrapper flex-1 min-h-0 w-full">
                              <HazoChat
                                chat_group_id="test-chat-group"
                                reference_id={active_chat_field_data_id}
                                reference_type=""
                                title={active_chat_field_name || 'Chat'}
                                subtitle={`Discussing ${active_chat_field_name || 'this field'}`}
                                on_close={handle_chat_close}
                                className="h-full w-full"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>

                  {/* Date of Birth Field */}
                  <div className={cn(
                    'cls_field_with_chat flex gap-4 items-start',
                    active_chat_field_data_id === 'date-of-birth-data-002' && 'flex-row'
                  )}>
                    <div className="flex-1">
                      <HazoCollabFormInputbox
                    label="Date of Birth"
                    value={date_of_birth}
                    onChange={handle_date_of_birth_change}
                    error={date_of_birth_error}
                    field_id="date_of_birth"
                    field_data_id="date-of-birth-data-002"
                    field_name="Date of Birth"
                                        on_chat_click={handle_chat_click}
                    has_chat_messages={date_of_birth_has_messages.has_messages}
                    is_chat_active={active_chat_field_data_id === 'date-of-birth-data-002'}
                    chat_background_color={field_background_color}
                    placeholder="Enter your date of birth (DD/MM/YYYY)"
                                        additional_context={{
                      section: 'Individual Information',
                      required: true,
                    }}
                      />
                    </div>
                    {active_chat_field_data_id === 'date-of-birth-data-002' && (
                      <div className="cls_field_chat_wrapper w-96 flex-shrink-0">
                        <Card className={`cls_tax_checklist_chat_card flex flex-col min-h-0 ${chat_background_color}`} style={{ height: '400px' }}>
                          <CardContent className="cls_tax_checklist_chat_content p-0 flex-1 flex flex-col min-h-0">
                            <div className="cls_tax_checklist_chat_wrapper flex-1 min-h-0 w-full">
                              <HazoChat
                                chat_group_id="test-chat-group"
                                reference_id={active_chat_field_data_id}
                                reference_type=""
                                title={active_chat_field_name || 'Chat'}
                                subtitle={`Discussing ${active_chat_field_name || 'this field'}`}
                                on_close={handle_chat_close}
                                className="h-full w-full"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>

                  {/* Tax File Number Field */}
                  <div className={cn(
                    'cls_field_with_chat flex gap-4 items-start',
                    active_chat_field_data_id === 'tax-file-number-data-003' && 'flex-row'
                  )}>
                    <div className="flex-1">
                      <HazoCollabFormInputbox
                    label="Tax File Number"
                    value={tax_file_number}
                    onChange={handle_tax_file_number_change}
                    error={tax_file_number_error}
                    field_id="tax_file_number"
                    field_data_id="tax-file-number-data-003"
                    field_name="Tax File Number"
                                        on_chat_click={handle_chat_click}
                    has_chat_messages={tax_file_number_has_messages.has_messages}
                    is_chat_active={active_chat_field_data_id === 'tax-file-number-data-003'}
                    chat_background_color={field_background_color}
                    placeholder="Enter your tax file number"
                                        multi_state_radio={{
                      data: [
                        {
                          label: 'Low Priority',
                          value: 'low',
                          icon_selected: 'IoRemoveCircle',
                          icon_unselected: 'IoRemoveCircleOutline',
                        },
                        {
                          label: 'Medium Priority',
                          value: 'medium',
                          icon_selected: 'IoRemoveCircle',
                          icon_unselected: 'IoRemoveCircleOutline',
                        },
                        {
                          label: 'High Priority',
                          value: 'high',
                          icon_selected: 'IoCheckmarkCircle',
                          icon_unselected: 'IoCheckmarkCircleOutline',
                        },
                      ],
                      value: tax_file_number_radio_state,
                      onChange: set_tax_file_number_radio_state,
                      icon_set: 'io5',
                      selection: 'single',
                    }}
                    additional_context={{
                      section: 'Individual Information',
                      required: true,
                    }}
                      />
                    </div>
                    {active_chat_field_data_id === 'tax-file-number-data-003' && (
                      <div className="cls_field_chat_wrapper w-96 flex-shrink-0">
                        <Card className={`cls_tax_checklist_chat_card flex flex-col min-h-0 ${chat_background_color}`} style={{ height: '400px' }}>
                          <CardContent className="cls_tax_checklist_chat_content p-0 flex-1 flex flex-col min-h-0">
                            <div className="cls_tax_checklist_chat_wrapper flex-1 min-h-0 w-full">
                              <HazoChat
                                chat_group_id="test-chat-group"
                                reference_id={active_chat_field_data_id}
                                reference_type=""
                                title={active_chat_field_name || 'Chat'}
                                subtitle={`Discussing ${active_chat_field_name || 'this field'}`}
                                on_close={handle_chat_close}
                                className="h-full w-full"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>

                  {/* Tax Status Field */}
                  <div className={cn(
                    'cls_field_with_chat flex gap-4 items-start',
                    active_chat_field_data_id === 'tax-status-data-004' && 'flex-row'
                  )}>
                    <div className="flex-1">
                      <HazoCollabFormCheckbox
                    label="Tax Status"
                    checked={tax_status}
                    onChange={handle_tax_status_change}
                    error={tax_status_error}
                    field_id="tax_status"
                    field_data_id="tax-status-data-004"
                    field_name="Tax Status"
                                        on_chat_click={handle_chat_click}
                    has_chat_messages={tax_status_has_messages.has_messages}
                    is_chat_active={active_chat_field_data_id === 'tax-status-data-004'}
                    chat_background_color={field_background_color}
                    additional_context={{
                      section: 'Individual Information',
                      required: true,
                    }}
                      />
                    </div>
                    {active_chat_field_data_id === 'tax-status-data-004' && (
                      <div className="cls_field_chat_wrapper w-96 flex-shrink-0">
                        <Card className={`cls_tax_checklist_chat_card flex flex-col min-h-0 ${chat_background_color}`} style={{ height: '400px' }}>
                          <CardContent className="cls_tax_checklist_chat_content p-0 flex-1 flex flex-col min-h-0">
                            <div className="cls_tax_checklist_chat_wrapper flex-1 min-h-0 w-full">
                              <HazoChat
                                chat_group_id="test-chat-group"
                                reference_id={active_chat_field_data_id}
                                reference_type=""
                                title={active_chat_field_name || 'Chat'}
                                subtitle={`Discussing ${active_chat_field_name || 'this field'}`}
                                on_close={handle_chat_close}
                                className="h-full w-full"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>

                  {/* Postal Address Change Field */}
                  <div className={cn(
                    'cls_field_with_chat flex gap-4 items-start',
                    active_chat_field_data_id === 'postal-address-change-data-010' && 'flex-row'
                  )}>
                    <div className="flex-1">
                      <HazoCollabFormRadio
                        label="Postal Address Change"
                        options={[
                          { value: 'yes', label: 'Yes' },
                          { value: 'no', label: 'No' },
                        ]}
                        value={postal_address_change}
                        onChange={handle_postal_address_change}
                        error={postal_address_change_error}
                        field_id="postal_address_change"
                        field_data_id="postal-address-change-data-010"
                        field_name="Postal Address Change"
                                                on_chat_click={handle_chat_click}
                        has_chat_messages={postal_address_change_has_messages.has_messages}
                        is_chat_active={active_chat_field_data_id === 'postal-address-change-data-010'}
                        chat_background_color={field_background_color}
                        layout="horizontal"
                        additional_context={{
                          section: 'Individual Information',
                          required: false,
                        }}
                      />
                    </div>
                    {active_chat_field_data_id === 'postal-address-change-data-010' && (
                      <div className="cls_field_chat_wrapper w-96 flex-shrink-0">
                        <Card className={`cls_tax_checklist_chat_card flex flex-col min-h-0 ${chat_background_color}`} style={{ height: '400px' }}>
                          <CardContent className="cls_tax_checklist_chat_content p-0 flex-1 flex flex-col min-h-0">
                            <div className="cls_tax_checklist_chat_wrapper flex-1 min-h-0 w-full">
                              <HazoChat
                                chat_group_id="test-chat-group"
                                reference_id={active_chat_field_data_id}
                                reference_type=""
                                title={active_chat_field_name || 'Chat'}
                                subtitle={`Discussing ${active_chat_field_name || 'this field'}`}
                                on_close={handle_chat_close}
                                className="h-full w-full"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Bank Details Card */}
              <Card className="cls_tax_checklist_card flex-1 flex flex-col mt-6">
                <CardHeader>
                  <CardTitle>Bank Details</CardTitle>
                  <CardDescription>
                    Enter your bank account details. Click the chat icon next to any field to see collaboration features.
                  </CardDescription>
                </CardHeader>
                <CardContent className="cls_tax_checklist_form space-y-6 flex-1">
                       {/* Account Name Field */}
                       <div className={cn(
                         'cls_field_with_chat flex gap-4 items-start',
                         active_chat_field_data_id === 'account-name-data-005' && 'flex-row'
                       )}>
                         <div className="flex-1">
                           <HazoCollabFormInputbox
                         label="Account Name"
                         value={account_name}
                         onChange={handle_account_name_change}
                         error={account_name_error}
                         field_id="account_name"
                         field_data_id="account-name-data-005"
                         field_name="Account Name"
                                                  on_chat_click={handle_chat_click}
                         has_chat_messages={account_name_has_messages.has_messages}
                         is_chat_active={active_chat_field_data_id === 'account-name-data-005'}
                    chat_background_color={field_background_color}
                         placeholder="Enter account name"
                                                  additional_context={{
                           section: 'Bank Details',
                           required: true,
                         }}
                           />
                         </div>
                         {active_chat_field_data_id === 'account-name-data-005' && (
                           <div className="cls_field_chat_wrapper w-96 flex-shrink-0">
                             <Card className={`cls_tax_checklist_chat_card flex flex-col min-h-0 ${chat_background_color}`} style={{ height: '400px' }}>
                               <CardContent className="cls_tax_checklist_chat_content p-0 flex-1 flex flex-col min-h-0">
                                 <div className="cls_tax_checklist_chat_wrapper flex-1 min-h-0 w-full">
                                   <HazoChat
                                     chat_group_id="test-chat-group"
                                     reference_id={active_chat_field_data_id}
                                     reference_type=""
                                     title={active_chat_field_name || 'Chat'}
                                     subtitle={`Discussing ${active_chat_field_name || 'this field'}`}
                                     className="h-full w-full"
                                   />
                                 </div>
                               </CardContent>
                             </Card>
                           </div>
                         )}
                       </div>

                       {/* BSB Number Field */}
                       <div className={cn(
                         'cls_field_with_chat flex gap-4 items-start',
                         active_chat_field_data_id === 'bsb-number-data-006' && 'flex-row'
                       )}>
                         <div className="flex-1">
                           <HazoCollabFormInputbox
                         label="BSB Number"
                         value={bsb_number}
                         onChange={handle_bsb_number_change}
                         error={bsb_number_error}
                         field_id="bsb_number"
                         field_data_id="bsb-number-data-006"
                         field_name="BSB Number"
                                                  on_chat_click={handle_chat_click}
                         has_chat_messages={bsb_number_has_messages.has_messages}
                         is_chat_active={active_chat_field_data_id === 'bsb-number-data-006'}
                    chat_background_color={field_background_color}
                         placeholder="Enter BSB number"
                                                  additional_context={{
                           section: 'Bank Details',
                           required: true,
                         }}
                           />
                         </div>
                         {active_chat_field_data_id === 'bsb-number-data-006' && (
                           <div className="cls_field_chat_wrapper w-96 flex-shrink-0">
                             <Card className={`cls_tax_checklist_chat_card flex flex-col min-h-0 ${chat_background_color}`} style={{ height: '400px' }}>
                               <CardContent className="cls_tax_checklist_chat_content p-0 flex-1 flex flex-col min-h-0">
                                 <div className="cls_tax_checklist_chat_wrapper flex-1 min-h-0 w-full">
                                   <HazoChat
                                     chat_group_id="test-chat-group"
                                     reference_id={active_chat_field_data_id}
                                     reference_type=""
                                     title={active_chat_field_name || 'Chat'}
                                     subtitle={`Discussing ${active_chat_field_name || 'this field'}`}
                                     className="h-full w-full"
                                   />
                                 </div>
                               </CardContent>
                             </Card>
                           </div>
                         )}
                       </div>

                       {/* Account Number Field */}
                       <div className={cn(
                         'cls_field_with_chat flex gap-4 items-start',
                         active_chat_field_data_id === 'account-number-data-007' && 'flex-row'
                       )}>
                         <div className="flex-1">
                           <HazoCollabFormInputbox
                         label="Account Number"
                         value={account_number}
                         onChange={handle_account_number_change}
                         error={account_number_error}
                         field_id="account_number"
                         field_data_id="account-number-data-007"
                         field_name="Account Number"
                                                  on_chat_click={handle_chat_click}
                         has_chat_messages={true}
                         is_chat_active={active_chat_field_data_id === 'account-number-data-007'}
                    chat_background_color={field_background_color}
                         placeholder="Enter account number"
                                                  additional_context={{
                           section: 'Bank Details',
                           required: true,
                         }}
                           />
                         </div>
                         {active_chat_field_data_id === 'account-number-data-007' && (
                           <div className="cls_field_chat_wrapper w-96 flex-shrink-0">
                             <Card className={`cls_tax_checklist_chat_card flex flex-col min-h-0 ${chat_background_color}`} style={{ height: '400px' }}>
                               <CardContent className="cls_tax_checklist_chat_content p-0 flex-1 flex flex-col min-h-0">
                                 <div className="cls_tax_checklist_chat_wrapper flex-1 min-h-0 w-full">
                                   <HazoChat
                                     chat_group_id="test-chat-group"
                                     reference_id={active_chat_field_data_id}
                                     reference_type=""
                                     title={active_chat_field_name || 'Chat'}
                                     subtitle={`Discussing ${active_chat_field_name || 'this field'}`}
                                     className="h-full w-full"
                                   />
                                 </div>
                               </CardContent>
                             </Card>
                           </div>
                         )}
                       </div>
                </CardContent>
              </Card>

              {/* Additional Information Card - TextArea Example */}
              <Card className="cls_tax_checklist_card flex-1 flex flex-col mt-6">
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                  <CardDescription>
                    Enter any additional notes or information. This demonstrates the HazoCollabFormTextArea component.
                  </CardDescription>
                </CardHeader>
                <CardContent className="cls_tax_checklist_form space-y-6 flex-1">
                  {/* Australian State Field - Using Combobox Component */}
                  <div className={cn(
                    'cls_field_with_chat flex gap-4 items-start',
                    active_chat_field_data_id === 'australian-state-data-009' && 'flex-row'
                  )}>
                    <div className="flex-1">
                      <HazoCollabFormCombo
                    label="Australian State"
                    options={[
                      { value: 'NSW', label: 'New South Wales' },
                      { value: 'VIC', label: 'Victoria' },
                      { value: 'QLD', label: 'Queensland' },
                      { value: 'WA', label: 'Western Australia' },
                      { value: 'SA', label: 'South Australia' },
                      { value: 'TAS', label: 'Tasmania' },
                      { value: 'ACT', label: 'Australian Capital Territory' },
                      { value: 'NT', label: 'Northern Territory' },
                    ]}
                    value={australian_state}
                    onChange={set_australian_state}
                    error={australian_state_error}
                    field_id="australian_state"
                    field_data_id="australian-state-data-009"
                    field_name="Australian State"
                                        on_chat_click={handle_chat_click}
                    has_chat_messages={australian_state_has_messages.has_messages}
                    is_chat_active={active_chat_field_data_id === 'australian-state-data-009'}
                    chat_background_color={field_background_color}
                    placeholder="Select a state..."
                    search_placeholder="Search states..."
                    empty_message="No state found."
                    additional_context={{
                      section: 'Additional Information',
                      required: false,
                    }}
                      />
                    </div>
                    {active_chat_field_data_id === 'australian-state-data-009' && (
                      <div className="cls_field_chat_wrapper w-96 flex-shrink-0">
                        <Card className={`cls_tax_checklist_chat_card flex flex-col min-h-0 ${chat_background_color}`} style={{ height: '400px' }}>
                          <CardContent className="cls_tax_checklist_chat_content p-0 flex-1 flex flex-col min-h-0">
                            <div className="cls_tax_checklist_chat_wrapper flex-1 min-h-0 w-full">
                              <HazoChat
                                chat_group_id="test-chat-group"
                                reference_id={active_chat_field_data_id}
                                reference_type=""
                                title={active_chat_field_name || 'Chat'}
                                subtitle={`Discussing ${active_chat_field_name || 'this field'}`}
                                on_close={handle_chat_close}
                                className="h-full w-full"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>

                  {/* Notes Field - Using TextArea Component */}
                  <div className={cn(
                    'cls_field_with_chat flex gap-4 items-start',
                    active_chat_field_data_id === 'notes-data-008' && 'flex-row'
                  )}>
                    <div className="flex-1">
                      <HazoCollabFormTextArea
                    label="Notes"
                    value={notes}
                    onChange={handle_notes_change}
                    error={notes_error}
                    field_id="notes"
                    field_data_id="notes-data-008"
                    field_name="Notes"
                                        on_chat_click={handle_chat_click}
                    has_chat_messages={notes_has_messages.has_messages}
                    is_chat_active={active_chat_field_data_id === 'notes-data-008'}
                    chat_background_color={field_background_color}
                    placeholder="Enter any additional notes or information..."
                    rows={4}
                    additional_context={{
                      section: 'Additional Information',
                      required: false,
                    }}
                      />
                    </div>
                    {active_chat_field_data_id === 'notes-data-008' && (
                      <div className="cls_field_chat_wrapper w-96 flex-shrink-0">
                        <Card className={`cls_tax_checklist_chat_card flex flex-col min-h-0 ${chat_background_color}`} style={{ height: '400px' }}>
                          <CardContent className="cls_tax_checklist_chat_content p-0 flex-1 flex flex-col min-h-0">
                            <div className="cls_tax_checklist_chat_wrapper flex-1 min-h-0 w-full">
                              <HazoChat
                                chat_group_id="test-chat-group"
                                reference_id={active_chat_field_data_id}
                                reference_type=""
                                title={active_chat_field_name || 'Chat'}
                                subtitle={`Discussing ${active_chat_field_name || 'this field'}`}
                                on_close={handle_chat_close}
                                className="h-full w-full"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

