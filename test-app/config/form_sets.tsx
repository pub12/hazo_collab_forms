/**
 * Form sets configuration
 * Maps form set IDs to JSON file paths and metadata
 * Add new form sets here to automatically add them to navigation
 */

/**
 * Configuration for a form set
 */
export interface FormSetConfig {
  /**
   * Display title for the form set
   */
  title: string;
  
  /**
   * Optional description
   */
  description?: string;
  
  /**
   * Path to the JSON configuration file (relative to public or absolute)
   */
  json_path: string;
}

/**
 * All form sets configuration
 * Key is the form set ID (used in URL: /form-set/{id})
 */
export const FORM_SETS: Record<string, FormSetConfig> = {
  'tax-details': {
    title: 'Tax Details',
    description: 'Tax file number and residency status',
    json_path: '/data/form-sets/tax_details.json',
  },
  'personal-details': {
    title: 'Personal Details',
    description: 'Name, address, contact details, and date of birth',
    json_path: '/data/form-sets/personal_details.json',
  },
  'banking': {
    title: 'Banking',
    description: 'Banking and financial account details',
    json_path: '/data/form-sets/banking.json',
  },
  'income': {
    title: 'Income',
    description: 'Income and earnings information',
    json_path: '/data/form-sets/income.json',
  },
  'deductions': {
    title: 'Deductions',
    description: 'Tax deductions and expenses',
    json_path: '/data/form-sets/deductions.json',
  },
  'health': {
    title: 'Health',
    description: 'Health and medical information',
    json_path: '/data/form-sets/health.json',
  },
};

/**
 * Get form set configuration by ID
 */
export function get_form_set_config(form_set_id: string): FormSetConfig | undefined {
  return FORM_SETS[form_set_id];
}

/**
 * Get all form set IDs
 */
export function get_form_set_ids(): string[] {
  return Object.keys(FORM_SETS);
}

