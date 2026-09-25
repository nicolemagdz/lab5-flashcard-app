// Validation schemas. Field names mirror the Prisma models exactly so
// responses and request bodies match the shared contract.
const { z } = require('zod');

const deckCreateSchema = z.object({
  title: z.string().trim().min(1, 'title is required').max(200),
});

const deckUpdateSchema = z.object({
  title: z.string().trim().min(1, 'title is required').max(200),
});

const cardCreateSchema = z.object({
  front: z.string().trim().min(1, 'front is required'),
  back: z.string().trim().min(1, 'back is required'),
});

const cardUpdateSchema = z.object({
  front: z.string().trim().min(1, 'front is required').optional(),
  back: z.string().trim().min(1, 'back is required').optional(),
}).refine((data) => data.front !== undefined || data.back !== undefined, {
  message: 'At least one of front or back must be provided',
});

const studySessionCreateSchema = z.object({
  correctCount: z.number().int().min(0),
  incorrectCount: z.number().int().min(0),
  timestamp: z.coerce.date().optional(),
});

// Coerces string query params to numbers and guards against negative/absurd
// values before they ever reach a Prisma `skip`/`take`.
const paginationQuerySchema = z.object({
  skip: z.coerce.number().int().min(0).default(0),
  take: z.coerce.number().int().min(1).max(100).default(50),
});

const idParamSchema = z.object({
  id: z.string().min(1),
});

const deckIdParamSchema = z.object({
  deckId: z.string().min(1),
});

module.exports = {
  deckCreateSchema,
  deckUpdateSchema,
  cardCreateSchema,
  cardUpdateSchema,
  studySessionCreateSchema,
  paginationQuerySchema,
  idParamSchema,
  deckIdParamSchema,
};