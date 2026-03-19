import { useState, useEffect } from "react";

type FactData = {
  fact?: string;
  english?: string;
  spanish?: string;
};

export default function FunFacts() {
  const [factData, setFactData] = useState<FactData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRandomFact = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/fun_facts/random");
      const data = await res.json();
      if (data.status === "success" && data.fact) {
        setFactData(data.fact);
      } else {
        setFactData({ fact: "Could not load a fun fact. Make sure the backend is running." });
      }
    } catch (err) {
      setFactData({ fact: "Network Error: Could not reach the API." });
    } finally {
      setLoading(false);
    }
  };

  const addRandomFactExample = async () => {
    const newFact = prompt("Enter a new fun fact to add to the database:");
    if (!newFact) return;
    
    try {
      const res = await fetch("http://localhost:8000/api/fun_facts/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fact: newFact })
      });
      if (res.ok) {
        alert("Fact added successfully!");
      } else {
        alert("Failed to add fact. It might already exist.");
      }
    } catch (err) {
      alert("Network Error");
    }
  };

  const removeCurrentFact = async () => {
    if (!factData || !factData.fact) return;
    if (!confirm("Are you sure you want to delete this fact from the database?")) return;
    try {
      const res = await fetch("http://localhost:8000/api/fun_facts/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fact: factData.fact })
      });
      if (res.ok) {
        fetchRandomFact();
      } else {
        alert("Failed to remove fact.");
      }
    } catch (err) {
      alert("Network Error");
    }
  };

  useEffect(() => {
    fetchRandomFact();
  }, []);

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
        <h1>Fun Facts</h1>
        <p>Daily nuggets of wisdom and interesting trivia in multiple languages.</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', opacity: loading ? 0.5 : 1 }}>
        {/* German (Base) Frame */}
        <div className="glass-panel" style={{
          display: 'flex', flexDirection: 'column', padding: '2rem',
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05), rgba(124, 58, 237, 0.05))',
          border: '1px solid var(--glass-border-strong)'
        }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>🇩🇪 German</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 500, color: 'var(--text-main)', lineHeight: 1.4, margin: 0 }}>
            {factData?.fact || "..."}
          </p>
        </div>

        {/* English Frame */}
        {(factData?.english) && (
          <div className="glass-panel" style={{
            display: 'flex', flexDirection: 'column', padding: '2rem',
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.05), rgba(59, 130, 246, 0.05))',
            border: '1px solid var(--glass-border-strong)'
          }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>🇬🇧 English</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 500, color: 'var(--text-main)', lineHeight: 1.4, margin: 0 }}>
              {factData.english}
            </p>
          </div>
        )}

        {/* Spanish Frame */}
        {(factData?.spanish) && (
          <div className="glass-panel" style={{
            display: 'flex', flexDirection: 'column', padding: '2rem',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(245, 158, 11, 0.05))',
            border: '1px solid var(--glass-border-strong)'
          }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>🇪🇸 Spanish</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 500, color: 'var(--text-main)', lineHeight: 1.4, margin: 0 }}>
              {factData.spanish}
            </p>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
        <button className="btn primary" onClick={fetchRandomFact} disabled={loading} style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
          {loading ? "Loading..." : "Next Fact ✨"}
        </button>
        <button className="btn" onClick={addRandomFactExample} style={{ padding: '1rem 2rem' }}>Add New Fact</button>
        <button className="btn" onClick={removeCurrentFact} style={{ padding: '1rem 2rem', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>Remove Current</button>
      </div>
    </div>
  );
}
