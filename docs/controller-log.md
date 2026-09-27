## First code for contracts.ts
// /shared/contracts.ts           
//
// Shared TypeScript contracts for the Flashcard Study App.        
// These types are the single source of truth between frontend and backend.      
// All timestamps are ISO 8601 strings (e.g. "2026-09-25T14:30:00.000Z").     

/** Branded type alias for ISO 8601 date-time strings, for clarity at call sites. */          
export type ISODateString = string;         

/** Supported spaced-repetition difficulty ratings for a card review. */       
export type ReviewRating = "again" | "hard" | "good" | "easy";        
 
/** Lifecycle status of a study session. */         
export type SessionStatus = "in_progress" | "completed" | "abandoned";      

/** A Deck is a named collection of Cards owned by a user.        
 */       
export interface DeckContract {         
  readonly id: string;          
  readonly ownerId: string;         
  name: string;           
  description?: string;          
  tags: string[];         
  cardCount: number;        
  isArchived: boolean;       
  readonly createdAt: ISODateString;        
  updatedAt: ISODateString;        
}         

/** A Card is a single front/back flashcard belonging to a Deck.        
 */          
export interface CardContract {        
  readonly id: string;       
  readonly deckId: string;         
  front: string;           
  back: string;               
  hint?: string;         
  /** Spaced-repetition scheduling metadata (e.g. SM-2 style). */         
  srs: {            
    easeFactor: number;             
    intervalDays: number;            
    repetitions: number;             
    dueAt: ISODateString;           
  };           
  readonly createdAt: ISODateString;          
  updatedAt: ISODateString;          
}           

/** A single reviewed card event within a StudySession.         
 */         
export interface CardReviewContract {          
  readonly cardId: string;            
  rating: ReviewRating;           
  timeSpentMs: number;          
  reviewedAt: ISODateString;            
}          

/** A StudySession represents one continuous study run through a Deck.        
 */            
export interface StudySessionContract {          
  readonly id: string;        
  readonly userId: string;          
  readonly deckId: string;          
  status: SessionStatus;          
  reviews: CardReviewContract[];            
  cardsStudied: number;            
  cardsCorrect: number;          
  readonly startedAt: ISODateString;                    
  completedAt?: ISODateString;            
}            

## First code for deck.controller.ts
import { Request, Response } from "express";          
import type { ApiResponse, DeckDTO } from "@flashcard/shared";          
import { DeckService } from "../services/deck.service";             
import { asyncHandler } from "../utils/asyncHandler";         

export const listDecks = asyncHandler(async (req: Request, res: Response) => {          
  const decks = await DeckService.list(req.userId!);        
  const response: ApiResponse<DeckDTO[]> = { success: true, data: decks };       
  res.json(response);          
});           

export const getDeck = asyncHandler(async (req: Request, res: Response) => {         
  const deck = await DeckService.getOwned(req.params.deckId, req.userId!);       
  const response: ApiResponse<DeckDTO> = { success: true, data: deck };       
  res.json(response);         
});          

export const createDeck = asyncHandler(async (req: Request, res: Response) => {           
  const deck = await DeckService.create(req.userId!, req.body);         
  const response: ApiResponse<DeckDTO> = { success: true, data: deck };        
  res.status(201).json(response);          
});            

export const updateDeck = asyncHandler(async (req: Request, res: Response) => {             
  const deck = await DeckService.update(req.params.deckId, req.userId!, req.body);          
  const response: ApiResponse<DeckDTO> = { success: true, data: deck };        
  res.json(response);           
});              

export const deleteDeck = asyncHandler(async (req: Request, res: Response) => {            
  await DeckService.remove(req.params.deckId, req.userId!);          
  res.status(204).send();           
});           

## First code for card.controller.ts
import { Request, Response } from "express";           
import type { ApiResponse, CardDTO } from "@flashcard/shared";           
import { CardService } from "../services/card.service";            
import { asyncHandler } from "../utils/asyncHandler";           

export const listCardsInDeck = asyncHandler(async (req: Request, res: Response) => {         
  const cards = await CardService.listByDeck(req.params.deckId, req.userId!);          
  const response: ApiResponse<CardDTO[]> = { success: true, data: cards };       
  res.json(response);         
});           

export const createCard = asyncHandler(async (req: Request, res: Response) => {            
  const card = await CardService.create(req.params.deckId, req.userId!, req.body);         
  const response: ApiResponse<CardDTO> = { success: true, data: card };         
  res.status(201).json(response);          
});          

export const updateCard = asyncHandler(async (req: Request, res: Response) => {           
  const card = await CardService.update(req.params.cardId, req.userId!, req.body);           
  const response: ApiResponse<CardDTO> = { success: true, data: card };      
  res.json(response);        
});          

export const deleteCard = asyncHandler(async (req: Request, res: Response) => {           
  await CardService.remove(req.params.cardId, req.userId!);         
  res.status(204).send();            
});            

export const getDueCards = asyncHandler(async (req: Request, res: Response) => {             
  const { deckId, limit } = req.query as { deckId?: string; limit?: string };           
  const cards = await CardService.getDue(req.userId!, deckId, limit ? Number(limit) : undefined);          
  const response: ApiResponse<CardDTO[]> = { success: true, data: cards };       
  res.json(response);        
});        

## First code for studysession.controller.ts
import { Request, Response } from "express";       
import type { ApiResponse, CardDTO } from "@flashcard/shared";           
import { CardService } from "../services/card.service";         
import { asyncHandler } from "../utils/asyncHandler";         

// A "review" both records the StudySession log entry AND advances the         
// card's SM-2 schedule -- see CardService.review / spacedRepetition.service.           
export const reviewCard = asyncHandler(async (req: Request, res: Response) => {          
  const { quality } = req.body;         
  const card = await CardService.review(req.params.cardId, req.userId!, quality);          
  const response: ApiResponse<CardDTO> = { success: true, data: card };        
  res.json(response);         
});           
