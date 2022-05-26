/* eslint-disable camelcase */

// External Dependencies
import React, { useState } from 'react'

// Internal Dependencies
import { verifyInternational } from '../verify'
import CountrySelect from '../CountrySelect'
import useMergedStyles from './useMergedStyles'

const defaultForm = {
  primary_line: '',
  secondary_line: '',
  city: '',
  state: '',
  postal_code: ''
}

/**
 * Renders a group of inputs for each address component including a select input for country code.
 * Does not perform any address autocompletion.
 * @param {String?} apiKey - Public API key to your Lob account.
 * @param {Array?} children - These elements get rendered between the address form inputs and
 *  submit button
 * @param {Boolean} hideSubmitButton - Hides the submit button and its behavior
 * @param {Function?} onFieldChange - Callback when any input value changes. Use e.target.id
 *  to determine which component is being updated.
 * @param {Function?} onSubmit - Callback after the submit button is clicked and the form inputs
 *  are updated. Passes the verification result from the API.
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
 * @param {String} submitButtonLabel
 */
const AddressFormInternational = ({
  apiKey = null,
  children,
  hideSubmitButton = false,
  onFieldChange = () => {},
  onSubmit = () => {},
  styles = {},
  submitButtonLabel = 'Submit'
}) => {
  const [form, setForm] = useState(defaultForm)
  const { primary_line, secondary_line, city, state, postal_code, country } =
    form

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value })
    onFieldChange(e)
  }

  const handleSubmit = () => {
    // apiKey wasn't used is previous versions of AddressFormInternational so we made the prop
    // optional to not introduce a breaking change.
    if (!apiKey) {
      console.error(
        '[@lob/react-address-autocomplete] ' +
          'AddressFormInternational requires props apiKey for verifications'
      )
      return
    }

    verifyInternational(apiKey, form, form.country).then(
      (verificationResult) => {
        const {
          primary_line,
          secondary_line,
          components: { city, state, postal_code }
        } = verificationResult
        setForm({
          primary_line,
          secondary_line,
          city,
          state,
          postal_code
        })
        onSubmit(verificationResult)
      }
    )
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
        <label style={mergedStyles.lob_label} htmlFor='postal_code'>
          Zip / Postal Code
        </label>
        <input
          style={{ ...mergedStyles.lob_input }}
          id='postal_code'
          onChange={handleChange}
          value={postal_code}
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
      {children}
      {!hideSubmitButton && (
        <button onClick={handleSubmit} style={mergedStyles.lob_submit}>
          {submitButtonLabel}
        </button>
      )}
    </div>
  )
}

export default AddressFormInternational
