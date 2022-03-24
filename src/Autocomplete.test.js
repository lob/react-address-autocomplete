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
    mockPost.mockReturnValueOnce(
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
    expect(screen.getByText('123 Sesame St New York NY')).toBeVisible()
    expect(
      screen.getByText("123 Bowser's Castle Mushroom Kingdom JA")
    ).toBeVisible()
    expect(
      screen.getByText("123 Micky's Clubhouse Disneyland FL")
    ).toBeVisible()

    // Simulate selection
    await act(async () => {
      const suggestion = screen.getByText('123 Sesame St New York NY')
      await fireEvent.click(suggestion)
    })

    // Verify correct suggestion is rendered
    // expect(screen.getByText('123 Sesame St New York NY')).toBeVisible()
    expect(screen.queryByText("123 Bowser's Castle Mushroom Kingdom JA")).toBe(
      null
    )
    expect(screen.queryByText("123 Micky's Clubhouse Disneyland FL")).toBe(null)
  })

  it('fires callback functions as expected', async () => {
    // Mock fetch response
    mockPost.mockReturnValueOnce(
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
      const suggestion = screen.getByText('123 Sesame St New York NY')
      await fireEvent.click(suggestion)
    })

    expect(handleSelection).toHaveBeenCalledTimes(1)
    expect(handleSelection).toHaveBeenCalledWith({
      label: '123 Sesame St New York NY',
      value: {
        city: 'New York',
        primary_line: '123 Sesame St',
        state: 'NY',
        zip_code: '12345'
      }
    })
  })

  it('handles errors as expected', async () => {
    // Mock fetch response
    mockPost.mockReturnValueOnce(
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
