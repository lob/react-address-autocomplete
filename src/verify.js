// Internal Dependencies
import { postVerifyAddress, postVerifyInternationalAddress } from './api'

// Helper function to convert any API error into a JS Error object. This is needed when
// communication to the API was successful but the payload was bad.
const processApiResponse = (apiResponse) =>
  apiResponse
    .json()
    .then((data) =>
      'error' in data ? Promise.reject(new Error(data.error.message)) : data
    )

/**
 * A subset of the request object required by Lob. Note: Either zip_code is required or both city
 * and state are required. Learn more about Lob's verification endpoint here:
 * https://docs.lob.com/#operation/us_verification
 * @typedef AddressObject
 * @param {string} primary_line
 * @param {string?} secondary_line
 * @param {string} city
 * @param {string} state
 * @param {string} zip_code
 */

const validateArguments = (apiKey, address, countryCode, isInternational) => {
  if (!Object.keys(address || {}).length) {
    return new Error('Empty address was passed to verify function')
  }

  if (!apiKey.length) {
    return new Error('Missing API key')
  }

  if (isInternational) {
    if (typeof countryCode !== 'string') {
      return new Error('Expected countryCode to be of type string')
    }
    if (/[A-Z]{2}/.test(countryCode) === false) {
      return new Error(
        'countryCode must be a 2 letter country short-name code (ISO 3166)'
      )
    }
  }

  return null
}

/**
 * Checks the deliverability of a given address and provides meta data such as geo coordinates,
 * county, building type, etc.
 * @param {string} apiKey - The API key associated with your Lob account
 * @param {string | AddressObject} address - The address to verify
 * @returns {Promise<Object>} - The API response from Lob. For more information visit:
 *  https://docs.lob.com/#operation/us_verification
 */
export const verify = (apiKey, address) => {
  const error = validateArguments(apiKey, address, null, false)
  if (error) {
    return Promise.reject(error)
  }

  let payloadAddress = address
  // Check if the a single line address was passed as an object
  if (typeof address === 'object') {
    const componentsWithValue = Object.keys(address).filter(
      (addressComponent) => address[addressComponent] !== ''
    )
    if (
      componentsWithValue.length === 1 &&
      componentsWithValue.includes('primary_line')
    ) {
      payloadAddress = address.primary_line
    }
  }

  // Send request to Lob and let user decide how to handle the response
  return postVerifyAddress(apiKey, payloadAddress).then(processApiResponse)
}

/**
 * Checks the deliverability of a given address and provides meta data such as geo coordinates,
 * county, building type, etc.
 * @param {string} apiKey - The API key associated with your Lob account
 * @param {string | AddressObject} address - The address to verify
 * @returns {Promise<Object>} - The API response from Lob. For more information visit:
 *  https://docs.lob.com/#operation/us_verification
 */
export const verifyInternational = (apiKey, address, countryCode) => {
  const error = validateArguments(apiKey, address, countryCode, true)

  if (error) {
    return Promise.reject(error)
  }

  // Send request to Lob and let user decide how to handle the response
  return postVerifyInternationalAddress(apiKey, address, countryCode).then(
    processApiResponse
  )
}
