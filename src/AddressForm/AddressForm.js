/* eslint-disable camelcase */

// External Dependencies
import React, { useState } from 'react'

// Internal Dependencies
import Autocomplete from '../Autocomplete'
import useMergedStyles from './useMergedStyles'

const defaultForm = {
  primary_line: '',
  secondary_line: '',
  city: '',
  state: '',
  zip_code: ''
}

const customStyles = {
  container: (provided) => ({ ...provided, width: '100%' })
}

/**
 * Similar to Autocomplete except each address component is given its own input. Autocomplete
 * occurs on the primary line but the results are inserted into each component.
 * @param {string} apiKey - Public API key to your Lob account.
 * @param {onSelection?} onSelection -
 *  Callback function when the select component changes.
 * @param {onInputChange?} onInputChange -
 *  Callback function when any input value changes. Use e.target.id to determine which component
 *  is being updated.
 * @param {Object} styles - Override the default styles by providing an object similar to the
 *  styling framework used by react-select. Each key corresponds to a component and maps to a
 *  function that returns the new styles.lob_ Here is an example:
 *    const customStyles = {
 *      container: (baseStyles) => ({
 *        ...baseStyles,
 *        // custom styles go here
 *      })
 *    }
 *  Here are the following style keys used. Note that they are all prefixed with 'lob' to avoid
 *  colliding with the keys used by react-select.
 *  - lob_container
 *  - lob_input
 *  - lob_label
 *  - lob_row
 *
 *  For more details visit https://react-select.com/styles
 */
const AddressForm = ({
  apiKey,
  onFieldChange = () => {},
  onSelection = () => {},
  styles = {},
  ...additionalProps
}) => {
  const [form, setForm] = useState(defaultForm)
  const { primary_line, secondary_line, city, state, zip_code } = form

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value })
    onFieldChange(e)
  }

  const handleSelect = (option) => {
    // Overwrite the contents of our form based on the user's selection. If the selection does not
    // have a secondary_line we clear it in the form.
    setForm({
      ...option.value,
      secondary_line: option.value.secondary_line || ''
    })

    onSelection(option)
  }

  const mergedStyles = useMergedStyles(styles, false /* isInternational */)
  console.log('mergedStyles', mergedStyles)

  return (
    <div style={mergedStyles.lob_container}>
      <div style={mergedStyles.lob_row}>
        <label style={mergedStyles.lob_label} htmlFor='primary_line'>
          Address
        </label>
        <Autocomplete
          apiKey={apiKey}
          inputId='primary_line'
          inputValue={primary_line}
          {...additionalProps}
          // Below are properties that we don't let the user overwrite
          _addressComponentValues={{ city, state, zip_code }}
          onSelection={handleSelect}
          primaryLineOnly
          styles={customStyles}
        />
      </div>
      <div style={mergedStyles.lob_row}>
        <label style={mergedStyles.lob_label} htmlFor='secondary_line'>
          Apt, Suite
        </label>
        <input
          style={mergedStyles.lob_input}
          id='secondary_line'
          onChange={handleChange}
          value={secondary_line}
        />
      </div>
      <div style={mergedStyles.lob_row}>
        <label style={mergedStyles.lob_label} htmlFor='city'>
          City
        </label>
        <input
          style={mergedStyles.lob_input}
          id='city'
          onChange={handleChange}
          value={city}
        />
      </div>
      <div style={mergedStyles.lob_row}>
        <label style={mergedStyles.lob_label} htmlFor='state'>
          State
        </label>
        <input
          style={mergedStyles.lob_input}
          id='state'
          onChange={handleChange}
          value={state}
        />
      </div>
      <div style={mergedStyles.lob_row}>
        <label style={mergedStyles.lob_label} htmlFor='zip_code'>
          Zip
        </label>
        <input
          style={{ ...mergedStyles.lob_input, marginBottom: 'auto' }}
          id='zip_code'
          onChange={handleChange}
          value={zip_code}
        />
      </div>
    </div>
  )
}

export default AddressForm
