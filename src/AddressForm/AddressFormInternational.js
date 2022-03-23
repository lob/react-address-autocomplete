/* eslint-disable camelcase */

// External Dependencies
import React, { useState } from 'react'

// Internal Dependencies
import CountrySelect from '../CountrySelect'
import useMergedStyles from './useMergedStyles'

const defaultForm = {
  primary_line: '',
  secondary_line: '',
  city: '',
  state: '',
  zip_code: ''
}

/**
 * Renders a group of inputs for each address component including a select input for country code.
 * Does not perform any address autocompletion.
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
const AddressFormInternational = ({
  onFieldChange = () => {},
  styles = {}
}) => {
  const [form, setForm] = useState(defaultForm)
  const { primary_line, secondary_line, city, state, zip_code, country } = form

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value })
    onFieldChange(e)
  }

  const mergedStyles = useMergedStyles(styles, true /* isInternational */)

  return (
    <div data-testid='intl_container' style={mergedStyles.lob_container}>
      <div style={mergedStyles.lob_row}>
        <label style={mergedStyles.lob_label} htmlFor='primary_line'>
          Address Line 1
        </label>
        <input
          style={mergedStyles.lob_input}
          id='primary_line'
          onChange={handleChange}
          value={primary_line}
        />
      </div>
      <div style={mergedStyles.lob_row}>
        <label style={mergedStyles.lob_label} htmlFor='secondary_line'>
          Address Line 2
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
          City / Town
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
          State / Province / Region
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
          Zip / Postal Code
        </label>
        <input
          style={{ ...mergedStyles.lob_input }}
          id='zip_code'
          onChange={handleChange}
          value={zip_code}
        />
      </div>
      <div style={mergedStyles.lob_row}>
        <label style={mergedStyles.lob_label} htmlFor='country'>
          Country
        </label>
        <CountrySelect
          id='country'
          onChange={handleChange}
          style={{ ...mergedStyles.lob_input, marginBottom: 'auto' }}
          value={country}
        />
      </div>
    </div>
  )
}

export default AddressFormInternational
