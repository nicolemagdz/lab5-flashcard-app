export interface Card {
  id: number
  question: string
  answer: string
}

export function shuffleCards(cards: Card[]): Card[] {
  return [...cards].sort(() => Math.random() - 0.5)
}
