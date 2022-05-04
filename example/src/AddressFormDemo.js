// External Dependencies
import React, { useState } from 'react';
import { AddressForm, verify } from '@lob/react-address-autocomplete'

// Internal Dependencies
import VerificationResult from './VerificationResult'

const AddressFormDemo = ({ apiKey }) => {
  const [selectedResult, setSelectedResult] = useState({})
  const [verificationResult, setVerificationResult] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const resetApiResult = () => {
    setVerificationResult(null)
    setErrorMessage(null)
    return Promise.resolve()
  }

  const handleSelect = (selected) => {
    setSelectedResult(selected)
  }

  const handleChange = ({ address }) => {
    setSelectedResult({ ...selectedResult, value: address })
    resetApiResult()
  }

  const handleSubmit = () =>
    resetApiResult()
      .then(() => verify(apiKey, selectedResult.value))
      .then(res => setVerificationResult(res))
      .catch(err => setErrorMessage(err.message))

  return (
    <div className="demoContainer">
      <h2>Address Form</h2>
      <AddressForm
        apiKey={apiKey}
        onFieldChange={handleChange}
        onSelection={handleSelect}
      />
      <button
        onClick={handleSubmit}
        style={{ width: '100%' }}
      >
        Verify
      </button>
      <VerificationResult apiResponse={verificationResult} error={errorMessage} />
    </div>
  );
};

export default AddressFormDemo;
