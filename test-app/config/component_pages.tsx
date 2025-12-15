/**
 * Component pages configuration
 * Centralized configuration for component test pages
 * To add a new component, add an entry to the COMPONENT_PAGES array
 */

import React from 'react';
import { HiDocumentText, HiPencil, HiChat, HiCheck, HiSelector, HiDotsCircleHorizontal, HiCheckCircle, HiCollection, HiLocationMarker, HiPaperClip, HiCalendar, HiTable } from 'react-icons/hi';

/**
 * Component page configuration
 */
export interface ComponentPageConfig {
  /**
   * Route path (e.g., '/components/inputbox')
   */
  path: string;
  /**
   * Display title for navigation
   */
  title: string;
  /**
   * React icon component factory function
   */
  icon: () => React.ReactNode;
  /**
   * Component name (e.g., "HazoCollabFormInputbox")
   */
  component_name: string;
  /**
   * Element display name
   */
  element_name: string;
  /**
   * Component description
   */
  description: string;
}

/**
 * All component pages configuration
 * Add new components here to automatically add them to navigation
 */
export const COMPONENT_PAGES: ComponentPageConfig[] = [
  {
    path: '/components/base',
    title: 'Base Component',
    icon: () => <HiDocumentText className="h-5 w-5" />,
    component_name: 'CollabFormFieldBase',
    element_name: 'Base Form Field Component',
    description: 'Base component that provides common functionality for all collaboration form field components. Includes label, error handling, chat integration, and data OK checkbox support.',
  },
  {
    path: '/components/inputbox',
    title: 'Inputbox',
    icon: () => <HiPencil className="h-5 w-5" />,
    component_name: 'HazoCollabFormInputbox',
    element_name: 'Collaboration Form Input Box',
    description: 'A reusable input field component with label, error message, chat icon functionality, and data validation support. Extends standard HTML input attributes.',
  },
  {
    path: '/components/textarea',
    title: 'TextArea',
    icon: () => <HiChat className="h-5 w-5" />,
    component_name: 'HazoCollabFormTextArea',
    element_name: 'Collaboration Form TextArea',
    description: 'A textarea component for multi-line text input with collaboration features. Includes label, error handling, chat integration, and data validation support.',
  },
  {
    path: '/components/checkbox',
    title: 'Checkbox',
    icon: () => <HiCheck className="h-5 w-5" />,
    component_name: 'HazoCollabFormCheckbox',
    element_name: 'Collaboration Form Checkbox',
    description: 'A checkbox component with collaboration features. Includes label, error handling, chat integration, and data validation support.',
  },
  {
    path: '/components/combo',
    title: 'Combo',
    icon: () => <HiSelector className="h-5 w-5" />,
    component_name: 'HazoCollabFormCombo',
    element_name: 'Collaboration Form Combobox',
    description: 'A combobox component with search functionality and collaboration features. Uses shadcn Popover and Command components. Includes label, error handling, chat integration, and data validation support.',
  },
  {
    path: '/components/radio',
    title: 'Radio',
    icon: () => <HiDotsCircleHorizontal className="h-5 w-5" />,
    component_name: 'HazoCollabFormRadio',
    element_name: 'Collaboration Form Radio',
    description: 'A radio button group component with collaboration features. Supports both vertical and horizontal layouts. Includes label, error handling, chat integration, and data validation support.',
  },
  {
    path: '/components/data-ok-checkbox',
    title: 'Data OK Checkbox',
    icon: () => <HiCheckCircle className="h-5 w-5" />,
    component_name: 'HazoEltDataOkCheckbox',
    element_name: 'Data OK Checkbox Element',
    description: 'A standalone checkbox component that displays a green checkmark icon when checked and a red radio button off icon when unchecked. Used for data validation confirmation.',
  },
  {
    path: '/components/group',
    title: 'Group',
    icon: () => <HiCollection className="h-5 w-5" />,
    component_name: 'HazoCollabFormGroup',
    element_name: 'Collaboration Form Group',
    description: 'A group component that wraps multiple collab form fields together, providing a single data OK checkbox and chat icon at the group level. Child fields automatically have their data OK and chat disabled.',
  },
  {
    path: '/components/file-upload',
    title: 'File Upload',
    icon: () => <HiPaperClip className="h-5 w-5" />,
    component_name: 'FileUpload',
    element_name: 'File Upload Examples',
    description: 'Demonstrates file upload functionality with drag-and-drop, file validation, constraints, and file management. Shows how to access file data via refs and controlled props.',
  },
  {
    path: '/components/address',
    title: 'Address Form',
    icon: () => <HiLocationMarker className="h-5 w-5" />,
    component_name: 'AddressFormExample',
    element_name: 'Address Form Example',
    description: 'An example address form demonstrating the HazoCollabFormGroup component. Includes street address, suburb, postcode, state (conditional based on country), and country fields.',
  },
  {
    path: '/components/date',
    title: 'Date',
    icon: () => <HiCalendar className="h-5 w-5" />,
    component_name: 'HazoCollabFormDate',
    element_name: 'Collaboration Form Date Picker',
    description: 'A date picker component with collaboration features. Supports both single date and date range selection modes using shadcn Calendar component. Includes label, error handling, chat integration, and data validation support.',
  },
  {
    path: '/components/data-table',
    title: 'Data Table',
    icon: () => <HiTable className="h-5 w-5" />,
    component_name: 'HazoCollabFormDataTable',
    element_name: 'Collaboration Form Data Table',
    description: 'A dynamic data table component with inline editing, configurable columns, validation, file uploads, and aggregation support. Supports text, numeric, dropdown, checkbox, radiobutton, and file field types. Includes row-level collaboration features (chat, notes, data-ok).',
  },
];

