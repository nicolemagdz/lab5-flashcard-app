// Business logic for Card CRUD, fetching due cards, and recording reviews.

import type { CardDTO, CreateCardInput, ReviewQuality, UpdateCardInput } from "@flashcard/shared";
import { CardModel } from "../models/card.model";
import { StudySessionModel } from "../models/studySession.model";
import { DeckService } from "./deck.service";
import { scheduleNextReview } from "./spacedRepetition.service";
import { ApiError } from "../utils/ApiError";

function toCardDTO(card: any): CardDTO {
  return {
    id: card.id,
    deckId: card.deckId,
    front: card.front,
    back: card.back,
    easeFactor: card.easeFactor,
    interval: card.interval,
    repetitions: card.repetitions,
    nextReviewAt: card.nextReviewAt.toISOString(),
    createdAt: card.createdAt.toISOString(),
    updatedAt: card.updatedAt.toISOString(),
  };
}

export const CardService = {
  async listByDeck(deckId: string, ownerId: string): Promise<CardDTO[]> {
    await DeckService.getOwned(deckId, ownerId); // ownership check, throws 404
    const cards = await CardModel.findManyByDeck(deckId);
    return cards.map(toCardDTO);
  },

  async create(deckId: string, ownerId: string, input: CreateCardInput): Promise<CardDTO> {
    await DeckService.getOwned(deckId, ownerId);
    const card = await CardModel.create({ ...input, deckId });
    return toCardDTO(card);
  },

  async update(cardId: string, ownerId: string, input: UpdateCardInput): Promise<CardDTO> {
    const card = await this.getOwnedOrThrow(cardId, ownerId);
    const updated = await CardModel.update(card.id, input);
    return toCardDTO(updated);
  },

  async remove(cardId: string, ownerId: string): Promise<void> {
    const card = await this.getOwnedOrThrow(cardId, ownerId);
    await CardModel.remove(card.id);
  },

  async getDue(ownerId: string, deckId: string | undefined, limit = 20): Promise<CardDTO[]> {
    const cards = await CardModel.findDue({ ownerId, deckId, limit });
    return cards.map(toCardDTO);
  },

  async review(cardId: string, ownerId: string, quality: ReviewQuality): Promise<CardDTO> {
    const card = await this.getOwnedOrThrow(cardId, ownerId);

    const result = scheduleNextReview(
      { easeFactor: card.easeFactor, interval: card.interval, repetitions: card.repetitions },
      quality
    );

    const updated = await CardModel.updateSchedule(card.id, result);
    await StudySessionModel.create({ cardId: card.id, quality });

    return toCardDTO(updated);
  },

  // Not exposed on the shared DTO type -- internal helper for
  // ownership checks that need the raw Prisma row.
  async getOwnedOrThrow(cardId: string, ownerId: string) {
    const card = await CardModel.findById(cardId);
    if (!card) throw ApiError.notFound("Card not found");
    await DeckService.getOwned(card.deckId, ownerId); // throws 404 if not owned
    return card;
  },
};
