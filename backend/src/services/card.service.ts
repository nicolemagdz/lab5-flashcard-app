import type { CardDTO, CreateCardInput, ReviewQuality, UpdateCardInput } from "../../../shared/contracts";
import { CardModel } from "../models/card.model";
import { StudySessionModel } from "../models/studySession.model";
import { DeckService } from "./deck.service";
import { scheduleNextReview } from "./spacedRepetition.service";
import { ApiError } from "../utils/ApiError";

// Convert ReviewQuality → numeric SM-2 quality
const qualityMap: Record<ReviewQuality, number> = {
  again: 0,
  hard: 1,
  good: 2,
  easy: 3,
};

function toCardDTO(card: any): CardDTO {
  return {
    id: card.id,
    deckId: card.deckId,
    front: card.front,
    back: card.back,
    hint: card.hint ?? undefined,
    srs: {
      easeFactor: Number(card.easeFactor),
      intervalDays: Number(card.interval),
      repetitions: Number(card.repetitions),
      dueAt: card.nextReviewAt.toISOString(),
    },
    createdAt: card.createdAt.toISOString(),
    updatedAt: card.updatedAt.toISOString(),
  };
}

export const CardService = {
  async listByDeck(deckId: string, ownerId: string): Promise<CardDTO[]> {
    await DeckService.getOwned(deckId, ownerId);
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
      {
        easeFactor: Number(card.easeFactor),
        intervalDays: Number(card.interval),
        repetitions: Number(card.repetitions),
      },
      qualityMap[quality]
    );

    const updated = await CardModel.updateSchedule(card.id, {
      easeFactor: result.easeFactor,
      interval: result.intervalDays,
      repetitions: result.repetitions,
      nextReviewAt: result.dueAt,
    });

    await StudySessionModel.create({
      cardId: card.id,
      quality: qualityMap[quality], // FIXED
    });

    return toCardDTO(updated);
  },

  async getOwnedOrThrow(cardId: string, ownerId: string) {
    const card = await CardModel.findById(cardId);
    if (!card) throw ApiError.notFound("Card not found");
    await DeckService.getOwned(card.deckId, ownerId);
    return card;
  },
};
