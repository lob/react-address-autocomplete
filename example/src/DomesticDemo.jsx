// External Dependencies
import React, { useState } from 'react';
import { Autocomplete , verify } from '@lob/react-address-autocomplete'

// Internal Dependencies
import VerificationResult from './VerificationResult'

const customSelectStyles = {
  container: (provided, state) => ({
    ...provided,
    flexGrow: '1'
  })
}

const DomesticDemo = ({ apiKey }) => {
  const [selectedResult, setSelectedResult] = useState({})
  const [verificationResult, setVerificationResult] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const resetApiResult = () => {
    setVerificationResult(null)
    setErrorMessage(null)
    return Promise.resolve()
  }

  const handleChange = (value) => {
    resetApiResult()
    handleSelect({ value })
  }

  const handleSelect = (selected) => {
    setSelectedResult(selected)
  }

  const handleSubmit = () =>
    resetApiResult()
      .then(() => verify(apiKey, selectedResult.value))
      .then(res => setVerificationResult(res))
      .catch(err => setErrorMessage(err.message))

  return (
    <div className="demoContainer">
      <h2>Domestic 🇺🇸</h2>
      <div className="flexRow">
        <Autocomplete
          apiKey={apiKey}
          delaySearch={true}
          styles={customSelectStyles}
          onInputChange={handleChange}
          onSelection={handleSelect}
          onError={err => setErrorMessage(err)}
        />
        <button onClick={handleSubmit}>Verify</button>
      </div>
      <VerificationResult apiResponse={verificationResult} error={errorMessage} />
    </div>
  );
};

export default DomesticDemo;
