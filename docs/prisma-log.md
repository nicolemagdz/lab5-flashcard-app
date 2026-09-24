## Schema from Phase 3
`// Flashcard Study App: Prisma schema
// Swap the provider if you're not on PostgreSQL (drop @db.Text for SQLite/MySQL as needed).

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Deck {
  id       String         @id @default(cuid())
  title    String
  cards    Card[]
  sessions StudySession[]

  @@map("decks")
}

model Card {
  id     String @id @default(cuid())
  deckId String
  front  String @db.Text
  back   String @db.Text

  // Deleting a deck deletes its cards
  deck Deck @relation(fields: [deckId], references: [id], onDelete: Cascade)

  // Fast lookup of all cards in a deck
  @@index([deckId])
  @@map("cards")
}

model StudySession {
  id             String   @id @default(cuid())
  deckId         String
  correctCount   Int      @default(0)
  incorrectCount Int      @default(0)
  timestamp      DateTime @default(now())

  // Deleting a deck deletes its study history
  deck Deck @relation(fields: [deckId], references: [id], onDelete: Cascade)

  // Supports "recent sessions for this deck" and progress-over-time queries
  @@index([deckId, timestamp])
  @@map("study_sessions")
}`


I decided to keep the original file that was given from phase 1 because it was pretty much the same as this file from this phase, but it included the User data which is utilized in this application, so it seemed important. 
