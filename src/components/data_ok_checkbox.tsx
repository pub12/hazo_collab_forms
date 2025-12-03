/**
 * Data OK Checkbox component
 * A checkbox that displays a green checkmark icon when checked and a red radio button off icon when unchecked
 */

'use client';

import React from 'react';
import { IoCheckmarkCircle, IoRadioButtonOff } from 'react-icons/io5';
import { cn } from '../utils/cn.js';

/**
 * Props for the DataOkCheckbox component
 */
export interface DataOkCheckboxProps {
  /**
   * Whether the checkbox is checked
   */
  checked: boolean;
  
  /**
   * Callback when checkbox state changes
   */
  onChange: (checked: boolean) => void;
  
  /**
   * Optional label for accessibility
   */
  'aria-label'?: string;
  
  /**
   * Optional className for the checkbox container
   */
  className?: string;
  
  /**
   * Whether the checkbox is disabled
   */
  disabled?: boolean;
}

/**
 * Data OK Checkbox component
 * Displays a green checkmark when checked, light red radio button off when unchecked
 */
export const DataOkCheckbox = React.forwardRef<HTMLButtonElement, DataOkCheckboxProps>(
  ({ checked, onChange, 'aria-label': ariaLabel, className, disabled }, ref) => {
    /**
     * Handle click to toggle checkbox state
     */
    const handle_click = () => {
      if (!disabled) {
        onChange(!checked);
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        role="checkbox"
        aria-checked={checked}
        aria-label={ariaLabel || (checked ? 'Data OK' : 'Data not OK')}
        onClick={handle_click}
        disabled={disabled}
        suppressHydrationWarning
        className={cn(
          'cls_data_ok_checkbox flex h-9 w-9 items-center justify-center rounded-md border-0 bg-transparent transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
      >
        {checked ? (
          <IoCheckmarkCircle 
            className="h-6 w-6" 
            style={{ color: '#10b981' }} 
          />
        ) : (
          <IoRadioButtonOff 
            className="h-6 w-6" 
            style={{ color: '#f87171' }} 
          />
        )}
      </button>
    );
  }
);

DataOkCheckbox.displayName = 'DataOkCheckbox';

