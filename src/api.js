// External Dependencies
import base64 from 'base-64'

export const postAutocompleteAddress = (
  apiKey,
  addressPrefix,
  additionalAddressData
) => {
  const url = 'https://api.lob.com/v1/us_autocompletions?valid_addresses=true&case=proper'
  const init = {
    method: 'POST',
    headers: {
      Authorization: `Basic ${base64.encode(apiKey + ':')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      address_prefix: addressPrefix,
      ...additionalAddressData
    })
  }

  return fetch(url, init)
}

export const postVerifyAddress = (apiKey, address) => {
  const payload = typeof address === 'string' ? { address } : address
  const url = 'https://api.lob.com/v1/us_verifications'
  const init = {
    method: 'POST',
    headers: {
      Authorization: `Basic ${base64.encode(apiKey + ':')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  }

  return fetch(url, init)
}

export const postVerifyInternationalAddress = (
  apiKey,
  address,
  countryCode
) => {
  const url = 'https://api.lob.com/v1/intl_verifications'
  const init = {
    method: 'POST',
    headers: {
      Authorization: `Basic ${base64.encode(apiKey + ':')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ address, country: countryCode })
  }

  return fetch(url, init)
}
