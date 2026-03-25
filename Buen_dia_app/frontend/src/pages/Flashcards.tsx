import { useState, useEffect } from "react";

type QuizletCard = {
  word: string;
  meaning: string;
  language?: string;
};

export default function Flashcards() {
  const [cards, setCards] = useState<QuizletCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [scrapeUrl, setScrapeUrl] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);

  const loadSavedCards = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/quizlet/saved");
      const data = await res.json();
      if (data.status === "success" && data.data) {
        setCards(data.data);
      }
    } catch (err) {
      console.error("Failed to load saved cards");
    }
  };

  useEffect(() => {
    loadSavedCards();
  }, []);

  const handleScrape = async () => {
    if (!scrapeUrl) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/quizlet/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: scrapeUrl })
      });
      const data = await res.json();
      if (data.status === "success") {
        setCards(data.data);
        setCurrentIndex(0);
        setShowMeaning(false);
        setScrapeUrl("");
      } else {
        alert("Scrape failed: " + data.detail);
      }
    } catch (err) {
      alert("Network Error while scraping Quizlet");
    } finally {
      setLoading(false);
    }
  };

  const nextCard = () => {
    setShowMeaning(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setShowMeaning(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
        <h1>Flashcards</h1>
        <p>Scrape Quizlet sets and review your vocabulary directly in the app.</p>
      </div>
      
      {/* Scrape controls */}
      <div className="glass-panel" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <input 
          type="text" 
          className="input-field" 
          placeholder="Paste Quizlet Set URL here (e.g. https://quizlet.com/123/set-name)" 
          value={scrapeUrl}
          onChange={(e) => setScrapeUrl(e.target.value)}
          style={{ flex: 1 }}
        />
        <button className="btn primary" onClick={handleScrape} disabled={loading || !scrapeUrl}>
          {loading ? "Scraping..." : "Scrape Set"}
        </button>
      </div>

      {cards.length === 0 && !loading && (
        <div style={{ textAlign: 'center', margin: '4rem 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '3rem', opacity: 0.2, marginBottom: '1rem' }}>🗂️</div>
          <h2>No flashcards loaded</h2>
          <p>Scrape a Quizlet URL to get started.</p>
        </div>
      )}

      {/* Flashcard viewer */}
      {cards.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', marginTop: '1rem' }}>
          
          <div 
            className="glass-panel" 
            onClick={() => setShowMeaning(!showMeaning)}
            style={{ 
              width: '100%', 
              maxWidth: '600px', 
              aspectRatio: '16/9',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              cursor: 'pointer',
              background: showMeaning ? 'rgba(99, 102, 241, 0.08)' : 'rgba(255, 255, 255, 0.6)',
              border: '1px solid var(--glass-border-strong)',
              transition: 'background 0.3s ease',
              textAlign: 'center',
              padding: '2rem',
              position: 'relative'
            }}
          >
            <div style={{ position: 'absolute', top: '1rem', right: '1.5rem', opacity: 0.5, fontSize: '0.9rem' }}>
              {currentIndex + 1} / {cards.length}
            </div>
            
            <h2 style={{ fontSize: showMeaning ? '1.5rem' : '2.5rem', fontWeight: showMeaning ? 400 : 600, color: 'var(--text-main)' }}>
              {showMeaning ? cards[currentIndex].meaning : cards[currentIndex].word}
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '600px' }}>
            <button className="btn" onClick={prevCard} style={{ flex: 1 }}>← Previous</button>
            <button className="btn primary" onClick={() => setShowMeaning(!showMeaning)} style={{ flex: 2 }}>
              {showMeaning ? "Show Term" : "Show Meaning"}
            </button>
            <button className="btn" onClick={nextCard} style={{ flex: 1 }}>Next →</button>
          </div>
        </div>
      )}
    </div>
  );
}
