// External Dependencies
import React from 'react'

// Internal Dependencies
import AddressFormDemo from './AddressFormDemo'
// import DomesticDemo from './DomesticDemo'
// import InternationalDemo from './InternationalDemo'

const API_KEY = 'live_pub_16d30adbb46a1c360ebf7d1e6b48361'

const App = () => {

  return (
    <div className="appContainer">
      <img
        className="logo"
        src='https://admin.google.com/u/0/ac/images/logo.gif?uid=115468147059962245207&service=google_gsuite'
        alt='Lob'
      />
      <h1>React Address Autocomplete Demo</h1>
      {/* <DomesticDemo apiKey={API_KEY} />
      <InternationalDemo apiKey={API_KEY} /> */}
      <AddressFormDemo apiKey={API_KEY} />
    </div>
  );
}

export default App
