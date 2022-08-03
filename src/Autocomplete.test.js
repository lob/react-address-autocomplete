// External Dependencies
import React from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'

// Internal Dependencies
import {
  mockAutocompleteSuccessResponse,
  mockAutocompleteFailureResponse
} from './mockApi'
import { Autocomplete } from '.'

const mockPost = jest.fn()

global.fetch = mockPost

describe('Autocomplete', () => {
  it('renders correctly', async () => {
    // Mock fetch response
    mockPost.mockReturnValue(
      Promise.resolve({
        json: () => mockAutocompleteSuccessResponse
      })
    )

    const { container } = render(<Autocomplete apiKey='abc123' />)

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

    // Verify correct suggestion is rendered
    expect(screen.getByRole('combobox')).toHaveValue(
      '123 Sesame St, New York, NY, 12345'
    )
    expect(screen.queryByText("Bowser's Castle")).toBe(null)
    expect(screen.queryByText("Micky's Clubhouse")).toBe(null)
  })

  it('fires callback functions as expected', async () => {
    // Mock fetch response
    mockPost.mockReturnValue(
      Promise.resolve({
        json: () => mockAutocompleteSuccessResponse
      })
    )

    const handleSelection = jest.fn()
    const handleError = jest.fn()
    const { container } = render(
      <Autocomplete
        apiKey='abc123'
        onSelection={handleSelection}
        onError={handleError}
      />
    )

    // Trigger suggestion options
    await act(async () => {
      const input = container.querySelector('input')
      await fireEvent.change(input, {
        target: { value: '123' }
      })
    })

    // Trigger selection
    await act(async () => {
      const suggestion = screen.getByText('Sesame St,')
      await fireEvent.click(suggestion)
    })

    expect(handleSelection).toHaveBeenCalledTimes(1)
    expect(handleSelection).toHaveBeenCalledWith(
      expect.objectContaining({
        value: {
          city: 'New York',
          primary_line: '123 Sesame St',
          state: 'NY',
          zip_code: '12345'
        }
      })
    )
  })

  it('handles errors as expected', async () => {
    // Mock fetch response
    mockPost.mockReturnValue(
      Promise.resolve({
        json: () => mockAutocompleteFailureResponse
      })
    )

    const handleError = jest.fn()
    const { container } = render(
      <Autocomplete apiKey='abc123' onError={handleError} />
    )

    await act(async () => {
      const input = container.querySelector('input')
      await fireEvent.change(input, {
        target: { value: '123' }
      })
    })

    const expectedErrorMessage =
      'Your API key is not valid. Please sign up on lob.com to get a valid api key.'
    expect(handleError).toHaveBeenCalled()
    expect(handleError).toHaveBeenCalledWith(expectedErrorMessage)
  })
})
