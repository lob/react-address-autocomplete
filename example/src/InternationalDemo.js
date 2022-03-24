// External Dependencies
import React, { useState } from 'react'
import { verifyInternational, CountrySelect } from '@lob/react-address-autocomplete'

// Internal Dependencies
import VerificationResult from './VerificationResult'

const InternationalDemo = ({ apiKey }) => {
  const [address, setAddress] = useState('')
  const [countryCode, setCountryCode] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [isFocused, setIsFocused] = useState(false)
  const [verificationResult, setVerificationResult] = useState(null)

  const resetApiResult = () => {
    setVerificationResult(null)
    setErrorMessage(null)
    return Promise.resolve()
  }

  const handleSubmit = () =>
    resetApiResult()
      .then(() => verifyInternational(apiKey, address, countryCode))
      .then(res => setVerificationResult(res))
      .catch(err => setErrorMessage(err.message))

  const hidePlaceholder = Boolean(address) || isFocused;

  return (
    <div className="demoContainer">
      <h2>International (Verification Only) 🌏</h2>
      <div>
        <div>
          <label
            className={`internationalInputPlaceholder ${hidePlaceholder && ' hide'}`}
            htmlFor="intl-input"
          >
            Start typing an international address...
          </label>
          <input
            className="mockReactSelectInput"
            id="intl-input"
            onBlur={() => setIsFocused(false)}
            onFocus={() => setIsFocused(true)}
            onChange={e => {
              resetApiResult()
              setAddress(e.target.value)
            }}
            type="text"
            value={address}
          ></input>
        </div>
        <div className="flexRow" style={{ marginTop: '0.5em' }}>
          <label className="countryLabel" htmlFor="country-select">Country Code</label>
          <CountrySelect
            className="mockReactSelectInput"
            id="country-select"
            onChange={(e) => {
              resetApiResult()
              setCountryCode(e.target.value)
            }}
            style={{ width: 'auto' }}
            value={countryCode}
          />
          <button onClick={handleSubmit}>Verify</button>
        </div>
        <VerificationResult apiResponse={verificationResult} error={errorMessage} />
      </div>
    </div>
  )
}

export default InternationalDemo;
