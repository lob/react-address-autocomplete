// External Dependencies
import base64 from 'base-64'

export const postAutocompleteAddress = (
  apiKey,
  addressPrefix,
  additionalAddressData
) => {
  const url = new URL('https://api.lob.com/v1/us_autocompletions')
  url.searchParams.append('av_integration_origin', window.location.href)
  url.searchParams.append('integration', 'react-address-autocomplete')
  url.searchParams.append('valid_addresses', 'true')
  url.searchParams.append('case', 'proper')
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
  const url = new URL('https://api.lob.com/v1/us_verifications')
  url.searchParams.append('av_integration_origin', window.location.href)
  url.searchParams.append('integration', 'react-address-autocomplete')
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
  const payload = typeof address === 'string' ? { address } : address
  const url = new URL('https://api.lob.com/v1/intl_verifications')
  url.searchParams.append('av_integration_origin', window.location.href)
  url.searchParams.append('integration', 'react-address-autocomplete')
  const init = {
    method: 'POST',
    headers: {
      Authorization: `Basic ${base64.encode(apiKey + ':')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ...payload, country: countryCode })
  }

  return fetch(url, init)
}
