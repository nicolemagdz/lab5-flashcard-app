// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DeckList } from '../../src/components/DeckList'

describe('DeckList', () => {
  it('shows an empty state when there are no decks', () => {
    render(<DeckList decks={[]} onSelect={vi.fn()} onDelete={vi.fn()} />)

    expect(screen.getByRole('heading', { name: 'Your Decks' })).toBeTruthy()
    expect(
      screen.getByText("You don't have any decks yet. Create your first deck to get started."),
    ).toBeTruthy()
  })

  it('renders each deck and calls the select and delete handlers', () => {
    const onSelect = vi.fn()
    const onDelete = vi.fn()

    const decks = [
      {
        id: 'deck-1',
        title: 'Spanish Basics',
        description: 'Common travel phrases',
        ownerId: 'user-1',
        cardCount: 3,
        createdAt: '2026-09-27T00:00:00.000Z',
        updatedAt: '2026-09-27T00:00:00.000Z',
      },
    ]

    render(<DeckList decks={decks} onSelect={onSelect} onDelete={onDelete} />)

    expect(screen.getByText('Spanish Basics')).toBeTruthy()
    expect(screen.getByText('3 cards')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Study Spanish Basics, 3 cards' }))
    expect(onSelect).toHaveBeenCalledWith('deck-1')

    fireEvent.click(screen.getByRole('button', { name: 'Delete Spanish Basics' }))
    expect(onDelete).toHaveBeenCalledWith('deck-1')
  })
})
