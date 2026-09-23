import { useNavigate } from "react-router-dom";
import { useDecks } from "../hooks/useDecks";
import { DeckList } from "../components/DeckList";

export function DashboardPage() {
  const { data: decks, isLoading, createDeck, deleteDeck } = useDecks();
  const navigate = useNavigate();

  if (isLoading) return <p>Loading decks...</p>;

  return (
    <div>
      <h1>Your Decks</h1>
      <button onClick={() => createDeck.mutate({ title: "New deck" })}>+ New deck</button>
      <DeckList
        decks={decks ?? []}
        onSelect={(deckId) => navigate(`/study/${deckId}`)}
        onDelete={(deckId) => deleteDeck.mutate(deckId)}
      />
    </div>
  );
}
