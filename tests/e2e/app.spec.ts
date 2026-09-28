import { expect, test } from "@playwright/test";

const deck = {
  id: "deck-e2e",
  title: "Spanish basics",
  ownerId: "user-e2e",
  cardCount: 1,
  createdAt: "2026-09-27T00:00:00.000Z",
  updatedAt: "2026-09-27T00:00:00.000Z",
};

const card = {
  id: "card-e2e",
  deckId: deck.id,
  front: "Hola",
  back: "Hello",
  srs: {
    easeFactor: 2.5,
    intervalDays: 0,
    repetitions: 0,
    dueAt: "2026-09-27T00:00:00.000Z",
  },
  createdAt: "2026-09-27T00:00:00.000Z",
  updatedAt: "2026-09-27T00:00:00.000Z",
};

test("create a deck, study a card, and save the session", async ({ page }) => {
  let reviewSaved = false;

  // Fake login
  await page.addInitScript(() => {
    localStorage.setItem("accessToken", "e2e-token");
  });

  // Mock deck creation + deck list
  await page.route("**/api/v1/decks", async (route) => {
    if (route.request().method() === "POST") {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: deck }),
      });
      return;
    }

    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: [] }),
    });
  });

  // Mock card creation + card list
  await page.route("**/api/v1/decks/*/cards", async (route) => {
    if (route.request().method() === "POST") {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: card }),
      });
      return;
    }

    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: [card] }),
    });
  });

  // Mock due cards
  await page.route("**/api/v1/study/due**", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: reviewSaved ? [] : [card] }),
    });
  });

  // Mock review submission
  await page.route("**/api/v1/decks/*/cards/*/review", async (route) => {
    reviewSaved = true;
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: card }),
    });
  });

  // Begin UI flow
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Your Decks" })).toBeVisible();

  await page.getByRole("button", { name: /Create Deck/i }).click();
  await page.getByLabel("Deck title").fill(deck.title);
  await page.getByLabel("Front (card 1)").fill(card.front);
  await page.getByLabel("Back (card 1)").fill(card.back);
  await page.getByRole("button", { name: "Save deck" }).click();

  await page.getByRole("button", { name: new RegExp(`Study ${deck.title}`) }).click();
  await page.getByRole("button", { name: "Show Answer" }).click();
  await page.getByRole("button", { name: /Correct|Incorrect/ }).first().click();

  await expect.poll(() => reviewSaved).toBe(true);
  await expect(page.getByText(/session saved|nothing due|session complete/i)).toBeVisible();
});
