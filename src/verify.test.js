// Internal Dependencies
import {
  mockVerifyFailureResponse,
  mockVerifyInternationalFailureResponse,
  mockVerifyInternationalSuccessResponse,
  mockVerifySuccessResponse
} from './mockApi'
import { verify, verifyInternational } from '.'

const mockPost = jest.fn()

global.fetch = mockPost

describe('verify', () => {
  it('returns API response successfully', async () => {
    // Mock fetch response
    mockPost.mockReturnValue(
      Promise.resolve({
        json: () => Promise.resolve(mockVerifySuccessResponse)
      })
    )

    let result = await verify(
      'fakeApiKey',
      '1600 Pennsylvania Avenue, Washington, DC'
    )

    // Confirm API response
    expect(result.primary_line).toEqual('1600 PENNSYLVANIA AVE NW')
    expect(result.deliverability).toEqual('deliverable')

    // Repeat with address as object
    result = await verify('fakeApiKey', {
      primary_line: '1600 Pennsylvania Avenue',
      city: 'Washington, DC'
    })

    expect(result.primary_line).toEqual('1600 PENNSYLVANIA AVE NW')
    expect(result.deliverability).toEqual('deliverable')
  })

  it('propagates error from API response', async () => {
    // Mock fetch response
    mockPost.mockReturnValueOnce(
      Promise.resolve({
        json: () => Promise.resolve(mockVerifyFailureResponse)
      })
    )

    const address = '1600 Pennsylvania Avenue, Washington, DC'
    try {
      await verify('fakeApiKey', address)
    } catch (e) {
      expect(e.message).toEqual(
        'primary_line is required or address is required'
      )
    }
  })

  it('throws error when missing address', async () => {
    const expectedErrorMessage = 'Empty address was passed to verify function'
    try {
      await verify('fakeApiKey', '')
    } catch (e) {
      expect(e.message).toEqual(expectedErrorMessage)
    }
  })

  it('throws error when API key is missing', async () => {
    const expectedErrorMessage = 'Missing API key'
    try {
      await verify('', '456 River Styx')
    } catch (e) {
      expect(e.message).toEqual(expectedErrorMessage)
    }
  })

  it('throws error when address is empty object', async () => {
    const expectedErrorMessage = 'Empty address was passed to verify function'
    try {
      await verify('fakekey', {})
    } catch (e) {
      expect(e.message).toEqual(expectedErrorMessage)
    }
  })
})

describe('verify international', () => {
  it('returns API response successfully', async () => {
    // Mock fetch response
    mockPost.mockReturnValueOnce(
      Promise.resolve({
        json: () => Promise.resolve(mockVerifyInternationalSuccessResponse)
      })
    )

    const result = await verifyInternational(
      'fakeApiKey',
      '42 Wallaby Way, Sydney, NSW 2031',
      'AU'
    )

    // Confirm API response
    expect(result.primary_line).toEqual('42 WALLABY WAY')
    expect(result.deliverability).toEqual('deliverable')
  })

  it('propagates error from API response', async () => {
    // Mock fetch response
    mockPost.mockReturnValueOnce(
      Promise.resolve({
        json: () => Promise.resolve(mockVerifyInternationalFailureResponse)
      })
    )

    const intlAddress = '42 Wallaby Way, Sydney, NSW 2031'
    try {
      await verifyInternational('fakeApiKey', intlAddress, 'CA')
    } catch (e) {
      expect(e.message).toEqual('country is required')
    }
  })

  it('throws error when missing country code', async () => {
    const expectedErrorMessage =
      'countryCode must be a 2 letter country short-name code (ISO 3166)'
    const intlAddress = '42 Wallaby Way, Sydney, NSW 2031'
    try {
      await verifyInternational('fakeApiKey', intlAddress, '')
    } catch (e) {
      expect(e.message).toEqual(expectedErrorMessage)
    }
  })

  it('throws error when country code is not string', async () => {
    const expectedErrorMessage = 'Expected countryCode to be of type string'
    const intlAddress = '42 Wallaby Way, Sydney, NSW 2031'
    try {
      await verifyInternational('fakeApiKey', intlAddress, { code: 'AU' })
    } catch (e) {
      expect(e.message).toEqual(expectedErrorMessage)
    }
  })

  it('throws error when API key is missing', async () => {
    const expectedErrorMessage = 'Missing API key'
    try {
      await verifyInternational('', '456 River Styx', 'GR')
    } catch (e) {
      expect(e.message).toEqual(expectedErrorMessage)
    }
  })

  it('throws error when address is empty object', async () => {
    const expectedErrorMessage = 'Empty address was passed to verify function'
    try {
      await verifyInternational('fakekey', {}, 'GR')
    } catch (e) {
      expect(e.message).toEqual(expectedErrorMessage)
    }
    // Repeat with null
    try {
      await verifyInternational('fakekey', null, 'GR')
    } catch (e) {
      expect(e.message).toEqual(expectedErrorMessage)
    }
  })
})
