/**
 * Address Form test page
 * Demonstrates the HazoCollabFormGroup component with an address form use case
 */

'use client';

import { useState } from 'react';
import {
  HazoCollabFormGroup,
  HazoCollabFormInputbox,
  HazoCollabFormCombo,
  type ComboboxOption,
} from 'hazo_collab_forms';

/**
 * Australian states options
 */
const australian_states: ComboboxOption[] = [
  { value: 'NSW', label: 'NSW' },
  { value: 'VIC', label: 'VIC' },
  { value: 'QLD', label: 'QLD' },
  { value: 'SA', label: 'SA' },
  { value: 'WA', label: 'WA' },
  { value: 'TAS', label: 'TAS' },
  { value: 'NT', label: 'NT' },
  { value: 'ACT', label: 'ACT' },
];

/**
 * Country options
 */
const countries: ComboboxOption[] = [
  { value: 'Australia', label: 'Australia' },
  { value: 'New Zealand', label: 'New Zealand' },
  { value: 'United States', label: 'United States' },
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'Canada', label: 'Canada' },
  { value: 'Other', label: 'Other' },
];

/**
 * Address Form test page
 */
export default function AddressFormPage() {
  const [street_address, set_street_address] = useState('');
  const [suburb, set_suburb] = useState('');
  const [postcode, set_postcode] = useState('');
  const [state, set_state] = useState('');
  const [country, set_country] = useState('Australia');
  const [postcode_error, set_postcode_error] = useState<string | undefined>(undefined);
  const [data_ok_checked, set_data_ok_checked] = useState(false);

  /**
   * Handle postcode change with validation
   */
  const handle_postcode_change = (value: string) => {
    set_postcode(value);
    
    // Validate postcode: must be exactly 4 digits when country is Australia
    if (country === 'Australia') {
      if (value.length > 0 && value.length < 4) {
        set_postcode_error('Postcode must be 4 digits');
      } else if (value.length === 4 && !/^\d{4}$/.test(value)) {
        set_postcode_error('Postcode must contain only digits');
      } else {
        set_postcode_error(undefined);
      }
    } else {
      set_postcode_error(undefined);
    }
  };

  /**
   * Handle country change - reset state if switching away from Australia
   */
  const handle_country_change = (value: string) => {
    set_country(value);
    if (value !== 'Australia') {
      set_state('');
    }
  };

  return (
    <div className="cls_address_form_page_container p-8 space-y-6">
      <div className="cls_address_form_header">
        <h1 className="text-3xl font-bold">Address Form Example</h1>
        <p className="text-muted-foreground mt-2">
          This example demonstrates the HazoCollabFormGroup component with an address form.
          All fields are grouped together with a single data OK checkbox and chat icon at the group level.
        </p>
      </div>

      <div className="cls_address_form_content max-w-2xl">
        <HazoCollabFormGroup
          label="Address"
          field_id="address-group"
          field_data_id="address-group-data"
          field_name="Address"
          data_ok_checked={data_ok_checked}
          on_data_ok_change={set_data_ok_checked}
        >
          {/* Street Address */}
          <HazoCollabFormInputbox
            label="Street Address"
            value={street_address}
            onChange={set_street_address}
            placeholder="Enter street address"
            field_id="street-address"
            field_data_id="street-address-data"
            field_name="Street Address"
          />

          {/* Suburb */}
          <HazoCollabFormInputbox
            label="Suburb"
            value={suburb}
            onChange={set_suburb}
            placeholder="Enter suburb"
            field_id="suburb"
            field_data_id="suburb-data"
            field_name="Suburb"
          />

          {/* Postcode */}
          <HazoCollabFormInputbox
            label="Postcode"
            value={postcode}
            onChange={handle_postcode_change}
            placeholder="Enter postcode"
            type="number"
            maxLength={4}
            error={postcode_error}
            field_id="postcode"
            field_data_id="postcode-data"
            field_name="Postcode"
          />

          {/* State - conditional rendering based on country */}
          {country === 'Australia' ? (
            <HazoCollabFormCombo
              label="State"
              options={australian_states}
              value={state}
              onChange={set_state}
              placeholder="Select state"
              enable_search={false}
              field_id="state"
              field_data_id="state-data"
              field_name="State"
            />
          ) : (
            <HazoCollabFormInputbox
              label="State/Province"
              value={state}
              onChange={set_state}
              placeholder="Enter state or province"
              field_id="state"
              field_data_id="state-data"
              field_name="State/Province"
            />
          )}

          {/* Country */}
          <HazoCollabFormCombo
            label="Country"
            options={countries}
            value={country}
            onChange={handle_country_change}
            placeholder="Select country"
            enable_search={false}
            field_id="country"
            field_data_id="country-data"
            field_name="Country"
          />
        </HazoCollabFormGroup>

        {/* Form values display */}
        <div className="cls_address_form_values mt-6 p-4 bg-muted rounded-md">
          <h2 className="text-lg font-semibold mb-2">Form Values</h2>
          <div className="space-y-1 text-sm">
            <p><strong>Street Address:</strong> {street_address || '(empty)'}</p>
            <p><strong>Suburb:</strong> {suburb || '(empty)'}</p>
            <p><strong>Postcode:</strong> {postcode || '(empty)'}</p>
            <p><strong>State:</strong> {state || '(empty)'}</p>
            <p><strong>Country:</strong> {country || '(empty)'}</p>
            <p><strong>Data OK:</strong> {data_ok_checked ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

