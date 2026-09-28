import { describe, it, expect } from 'vitest'
import { shuffleCards } from '../../../frontend/src/utils/shuffleCards'

describe('shuffleCards', () => {
  it('returns all cards without changing the original set of card ids', () => {
    const cards = [
      { id: 1, question: 'Capital of France?', answer: 'Paris' },
      { id: 2, question: 'Capital of Italy?', answer: 'Rome' },
      { id: 3, question: 'Capital of Spain?', answer: 'Madrid' },
      { id: 4, question: 'Capital of Germany?', answer: 'Berlin' },
    ]

    const result = shuffleCards(cards)

    expect(result).toHaveLength(cards.length)
    expect(result.map((card) => card.id).sort()).toEqual(cards.map((card) => card.id).sort())
    expect(new Set(result.map((card) => card.id)).size).toBe(cards.length)
  })

  it('does not mutate the original card array', () => {
    const cards = [
      { id: 1, question: '2 + 2?', answer: '4' },
      { id: 2, question: '3 + 3?', answer: '6' },
      { id: 3, question: '5 + 5?', answer: '10' },
    ]

    const original = cards.map((card) => ({ ...card }))

    shuffleCards(cards)

    expect(cards).toEqual(original)
  })
})

