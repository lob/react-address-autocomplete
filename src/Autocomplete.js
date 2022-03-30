// External Dependencies
import React, { useEffect, useState, useRef } from 'react'
import Select, { components } from 'react-select'
import throttle from 'lodash.throttle'

// Internal Dependencies
import { postAutocompleteAddress } from './api'

const getLobLabel = () => (
  <a
    href='https://www.lob.com/address-verification'
    style={{ color: 'hsl(0, 0%, 50%)', textDecoration: 'inherit' }}
  >
    <span style={{ verticalAlign: 'top' }}>Powered by </span>
    <img
      style={{ height: '1.25em', margin: '0px 0px 1px 4px' }}
      // eslint-disable-next-line max-len
      src='lob_logo.jpg'
      alt='Lob'
    />
  </a>
)

/**
 * Part of Lob's response body schema for US autocompletions
 * https://docs.lob.com/#section/Autocompletion-Test-Env
 * @typedef AddressObject
 * @param {string} primary_line
 * @param {string?} secondary_line
 * @param {string} city
 * @param {string} state
 * @param {string} zip_code
 */

/**
 * @typedef SelectionObject
 * @param {string} label - The address formatted as a single line.
 * @param {AddressObject} value - The address in its individual components.
 */

/**
 * The equivalent to react-select's onChange
 * @callback onSelection
 * @param {SelectionObject} option - The selected value from Lob's autocomplete
 */

/**
 * @callback onInputChange
 * @param {string} newValue - The value of the input component
 * @param {Object} actionMeta - Describes the event that occured to the input. See
 *  https://react-select.com/props for more details
 */

// /**
//  * @callback onSuggestion
//  * @param {Array.<SelectionObject>} suggestions - Address that start the same as the user's input
//  */

/**
 * @callback onError
 * @param {string} errorMessage
 */

// We override react-select's default input component in order to let users edit their input value
// and any selected values
const Input = (props) => <components.Input {...props} isHidden={false} />

/**
 * @param {Object?} addressComponentValues - Specifies the search for autocomplete suggestions by
 *  including a city, state, and/or zip_code.
 * @param {string} apiKey - Public API key to your Lob account.
 * @param {boolean?} delaySearch -
 *  Delay calls to the API instead of calling on every keystroke.
 *  Default: true
 * @param {number?} delayValue - The time in milliseconds to wait between each API call.
 *  Default: 800
 * @param {string?} inputValue - Allows you to control the value of the input element
 * @param {onSelection?} onSelection -
 *  Callback function when the select component changes.
 * @param {onInputChange?} onInputChange -
 *  Callback function when the input value changes.
 * @param {onError?} onError - Callback function when we receive an API error.
 * @param {boolean} primaryLineOnly - When true, applying a suggestion updates the value of our
 *  select component with only the primary line of the address instead of the complete address.
 */
const Autocomplete = ({
  addressComponentValues = {},
  apiKey,
  delaySearch = true,
  delayValue = 800,
  onSelection = () => {},
  onError = () => {},
  onInputChange = () => {},
  inputValue: defaultInputValue = '',
  primaryLineOnly = false,
  ...reactSelectProps
}) => {
  const [inputValue, setInputValue] = useState(defaultInputValue)
  const [selectValue, setSelectValue] = useState('AD')
  const [autocompleteResults, setAutocompleteResults] = useState([])

  const fetchData = (inputValue, addressComponentValues) =>
    postAutocompleteAddress(apiKey, inputValue, addressComponentValues)
      .then((result) => result.json())
      .then(({ suggestions, error }) => {
        if (error) {
          onError(error.message)
          return
        }

        const newSuggestions = suggestions.map((x) => ({
          value: x,
          label: `${x.primary_line} ${x.city} ${x.state}`
        }))

        setAutocompleteResults([
          ...newSuggestions,
          {
            value: 'none',
            label: getLobLabel()
          }
        ])
      })
      .catch((err) => {
        console.error(err.message)
        onError(err.message)
      })

  const throttledFetchData = useRef(throttle(fetchData, delayValue)).current

  useEffect(() => {
    if (inputValue) {
      if (delaySearch) {
        // We pass inputValue manually because otherwise throttle would create a snapshot of
        // fetchData with the previous state of inputValue instead of the new updated one.
        throttledFetchData(inputValue, addressComponentValues)
      } else {
        fetchData(inputValue, addressComponentValues)
      }
    }
  }, [inputValue])

  /** Event handlers */

  // Fire when the user types into the input
  const handleInputChange = (newInputValue, { action }) => {
    // `onBlur => setInputValue to last selected value
    if (action === 'input-blur') {
      // First check is user is controlling input value. If so we use it like for AddressForm
      setInputValue(inputValue || (selectValue ? selectValue.label : ''))
    }
    // onInputChange => update inputValue
    else if (action === 'input-change') {
      setInputValue(newInputValue)
      onInputChange(newInputValue, { action })
    }
  }

  // Fires when the select component has changed (as opposed to the input inside the select)
  const handleChange = (option) => {
    // User has pasted an address directly into input, let's call the API
    if (typeof option === 'string') {
      setInputValue(option)
      setSelectValue(option)
      onSelection(option)
      return
    }

    if (primaryLineOnly) {
      setInputValue(option ? option.value.primary_line : '')
    } else {
      setInputValue(option ? option.label : '')
    }

    setSelectValue(option)
    onSelection(option)
  }

  const customFilter = (candidate, input) => {
    return candidate
  }

  return (
    <Select
      components={{ Input }}
      inputValue={inputValue}
      options={autocompleteResults}
      controlShouldRenderValue={false}
      noOptionsMessage={getLobLabel}
      placeholder='Start typing an address...'
      value={selectValue}
      {...reactSelectProps}
      // We don't let user completely override onChange and onInputChange and risk them breaking
      // the behavior of our input component.
      onChange={handleChange}
      onInputChange={handleInputChange}
      filterOption={customFilter}
    />
  )
}
export default Autocomplete
