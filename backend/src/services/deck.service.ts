// Business logic for Deck CRUD + ownership checks.

import type { CreateDeckInput, DeckDTO, UpdateDeckInput } from "@flashcard/shared";
import { DeckModel } from "../models/deck.model";
import { ApiError } from "../utils/ApiError";

function toDeckDTO(deck: any): DeckDTO {
  return {
    id: deck.id,
    title: deck.title,
    description: deck.description,
    ownerId: deck.ownerId,
    cardCount: deck._count?.cards ?? 0,
    createdAt: deck.createdAt.toISOString(),
    updatedAt: deck.updatedAt.toISOString(),
  };
}

export const DeckService = {
  async list(ownerId: string): Promise<DeckDTO[]> {
    const decks = await DeckModel.findManyByOwner(ownerId);
    return decks.map(toDeckDTO);
  },

  async getOwned(deckId: string, ownerId: string): Promise<DeckDTO> {
    const deck = await DeckModel.findByIdForOwner(deckId, ownerId);
    if (!deck) throw ApiError.notFound("Deck not found");
    return toDeckDTO(deck);
  },

  async create(ownerId: string, input: CreateDeckInput): Promise<DeckDTO> {
    const deck = await DeckModel.create({ ...input, ownerId });
    return toDeckDTO({ ...deck, _count: { cards: 0 } });
  },

  async update(deckId: string, ownerId: string, input: UpdateDeckInput): Promise<DeckDTO> {
    await this.getOwned(deckId, ownerId); // throws 404 if not owned
    const deck = await DeckModel.update(deckId, input);
    return toDeckDTO({ ...deck, _count: { cards: 0 } });
  },

  async remove(deckId: string, ownerId: string): Promise<void> {
    await this.getOwned(deckId, ownerId);
    await DeckModel.remove(deckId);
  },
};
