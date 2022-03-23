// External Dependencies
import React from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'

// Internal Dependencies
import { AddressFormInternational } from '.'

const mockPost = jest.fn()

global.fetch = mockPost

describe('AddressFormInternational', () => {
  it('renders correctly', async () => {
    render(<AddressFormInternational />)

    // Verify initial rendering
    expect(screen.getByText('Address Line 1')).toBeVisible()
    expect(screen.getByText('Address Line 2')).toBeVisible()
    expect(screen.getByText('City / Town')).toBeVisible()
    expect(screen.getByText('State / Province / Region')).toBeVisible()
    expect(screen.getByText('Zip / Postal Code')).toBeVisible()
    expect(screen.getByText('Country')).toBeVisible()

    // Confirm styles

    // Simulate user input
    await act(async () => {
      const input = screen.getByLabelText('Address Line 1')
      await fireEvent.change(input, {
        target: { value: '123' }
      })
    })

    expect(screen.getByLabelText('Address Line 1').value).toBe('123')
  })
})
