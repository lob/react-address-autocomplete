// External Dependencies
import React from 'react';

const VerificationResult = ({error, apiResponse}) => (
  <div>
    {error && (
      <div className="apiErrorText">
        {error}
      </div>
    )}
    {apiResponse && (
      <div className={`apiResultContainer ${apiResponse.deliverability === 'deliverable' ? ' green' : ' red'}`}>
        <h3>Results</h3>
        <p>Address: {apiResponse.primary_line} {apiResponse.secondary_line} {apiResponse.last_line}</p>
        <p>Deliverability: {apiResponse.deliverability}</p>
      </div>
    )}
  </div>
);

export default VerificationResult;
