// External Dependencies
import React, { useEffect, useState, useRef } from 'react'
import Select, { components } from 'react-select'
import throttle from 'lodash.throttle'
import './Autocomplete.css'

// Internal Dependencies
import { postAutocompleteAddress } from './api'

const LOB_LABEL = 'lob-label'
const LOB_URL =
  'https://www.lob.com/address-verification?utm_source=autocomplete&utm_medium=react'

const LobLogo = ({ className }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 1259 602'
      className={className}
    >
      <path
        fill='#0099d7'
        /* eslint-ignore-next-line */
        d='M1063,141c-47.06,0-89,18.33-121,50.78V0H780V338.74C765,222.53,666.88,138,540,138c-137,0-242,101-242,232a235,235,0,0,0,7.7,60H164V0H0V585H307l14.54-112.68C359.94,550,441.74,602,540,602c127.75,0,225.08-83.62,240-200.41V585H930V540.27c31.8,37,77.27,56.73,133,56.73,103,0,196-109,196-228C1259,239,1175,141,1063,141ZM540,450c-45,0-81-36-81-80s36-80,81-80c46,0,81,35,81,80S585,450,540,450Zm475-1c-46,0-83-36-83-80a82.8,82.8,0,0,1,82.6-83h.4c47,0,85,37,85,83C1100,413,1062,449,1015,449Z'
      />
    </svg>
  )
}

const poweredByLob = () => (
  <a href={LOB_URL} className='lob-gray-text'>
    <span style={{ verticalAlign: 'top' }}>Powered by </span>
    <LobLogo className='lob-logo' />
  </a>
)

const getLobLabel = () => (
  <div className={LOB_LABEL}>
    <LobLogo className='logo-large' />
    <span className='lob-gray-text'>Deliverable addresses</span>
    <a href={LOB_URL}>Learn more</a>
  </div>
)

// Highlight the users input in the primary line by comparing char by char. We only check the
// primary line for simplicity sake
const getOptionElement = (suggestion, inputValue) => {
  /* eslint-disable camelcase */
  const { primary_line, city, state, zip_code } = suggestion

  let boldStopIndex = 0

  inputValue.split('').forEach((inputChar) => {
    if (
      inputChar.toLowerCase() ===
      primary_line.charAt(boldStopIndex).toLowerCase()
    ) {
      boldStopIndex += 1
    }
  })

  const primaryLineElement =
    boldStopIndex === 0 ? (
      <span>{primary_line}, </span>
    ) : boldStopIndex === primary_line.length ? (
      <span>
        <strong>{primary_line}, </strong>
      </span>
    ) : (
      <span>
        <strong>{primary_line.substring(0, boldStopIndex)}</strong>
        {primary_line.substring(boldStopIndex)},{' '}
      </span>
    )

  return (
    <span>
      {primaryLineElement}
      <span className='lob-gray-text'>
        {city}, {state.toUpperCase()}, {zip_code}
      </span>
    </span>
  )
  /* eslint-enable camelcase */
}

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
          label: getOptionElement(x, inputValue)
        }))

        setAutocompleteResults([
          {
            value: LOB_LABEL,
            label: getLobLabel()
          },
          ...newSuggestions
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
  }, [inputValue, delaySearch])

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
    if (option.value === LOB_LABEL) {
      window.location.href = LOB_URL
      return
    }

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

  const handleSelect = (option) => {
    if (option.value !== LOB_LABEL) {
      reactSelectProps.onSelect(option)
    }
  }

  const customFilter = (candidate, input) => {
    return candidate
  }

  // Remove padding from first option which is our Lob label
  const customStyles = {
    option: (styles, { data }) => {
      if (data.value === LOB_LABEL) {
        return {
          ...styles,
          background: 'none',
          cursor: 'pointer',
          padding: '0'
        }
      }
      return styles
    },
    ...reactSelectProps.styles
  }

  return (
    <Select
      components={{ Input }}
      inputValue={inputValue}
      options={autocompleteResults}
      controlShouldRenderValue={false}
      noOptionsMessage={poweredByLob}
      placeholder='Start typing an address...'
      value={selectValue}
      {...reactSelectProps}
      // We don't let user completely override onChange and onInputChange and risk them breaking
      // the behavior of our input component.
      filterOption={customFilter}
      onChange={handleChange}
      onInputChange={handleInputChange}
      onSelect={handleSelect}
      styles={customStyles}
    />
  )
}
export default Autocomplete
