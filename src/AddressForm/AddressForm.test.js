// External Dependencies
import React from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'

// Internal Dependencies
import { mockAutocompleteSuccessResponse } from '../mockApi'
import { AddressForm } from '.'

const mockPost = jest.fn()

global.fetch = mockPost

describe('AddressForm', () => {
  it('renders correctly', async () => {
    // Mock fetch response
    mockPost.mockReturnValue(
      Promise.resolve({
        json: () => mockAutocompleteSuccessResponse
      })
    )

    const { container } = render(<AddressForm apiKey='abc123' />)

    // Verify initial rendering
    expect(screen.getByText('Start typing an address...')).toBeVisible()

    // Simulate user input
    await act(async () => {
      const input = container.querySelector('input')
      await fireEvent.change(input, {
        target: { value: '123' }
      })
    })

    // Verify suggestion renderings
    expect(screen.getAllByText('123')).toHaveLength(3)
    expect(screen.getByText('Sesame St,')).toBeVisible()
    expect(screen.getByText('New York, NY, 12345')).toBeVisible()

    expect(screen.getByText("Bowser's Castle,")).toBeVisible()
    expect(screen.getByText('Mushroom Kingdom, JA, 12345')).toBeVisible()
    expect(screen.getByText("Micky's Clubhouse,")).toBeVisible()
    expect(screen.getByText('Disneyland, FL, 12345')).toBeVisible()

    // Simulate selection
    await act(async () => {
      const suggestion = screen.getByText('Sesame St,')
      await fireEvent.click(suggestion)
    })

    // Verify applied suggestion was broken up into parts
    expect(screen.getByLabelText('Address')).toHaveValue('123 Sesame St')
    expect(screen.getByLabelText('Apt, Suite')).toHaveValue('')
    expect(screen.getByLabelText('City')).toHaveValue('New York')
    expect(screen.getByLabelText('State')).toHaveValue('NY')
    expect(screen.getByLabelText('Zip')).toHaveValue('12345')
  })
})
