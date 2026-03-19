import { useState } from "react";

export default function DeepSeek() {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("deepseek-chat");
  const [role, setRole] = useState("user");
  const [temperature, setTemperature] = useState("1.0");
  const [tokens, setTokens] = useState("");
  
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!prompt) return;
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("http://localhost:8000/api/deepseek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: model,
          system_prompt: role === "system" ? prompt : "You are a helpful UI assistant.",
          user_prompt: role === "user" ? prompt : "Please consider the system prompt.",
          temperature: parseFloat(temperature) || 1.0,
          stream: false
        })
      });

      const data = await res.json();
      if (res.ok) {
        setResponse(data.response);
      } else {
        setResponse("Error: " + (data.detail || "Failed to fetch from DeepSeek"));
      }
    } catch (err) {
      console.error(err);
      setResponse("Network error: Could not connect to local backend API. Ensure the Python FastAPI server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setPrompt("");
    setResponse("");
  };

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.2rem' }}>DeepSeek Core</h1>
        <p>Configure model parameters and interface directly with the local AI module.</p>
      </div>

      <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
        
        {/* Main Interface */}
        <div style={{ flex: '2 1 500px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="glass-panel" style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--secondary)' }}>Input Console</h2>
            <textarea 
              className="input-field" 
              placeholder="Enter your prompt or system instruction here..." 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              style={{ height: '180px', resize: 'vertical', fontSize: '1rem', lineHeight: 1.5 }}
            ></textarea>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Model Architecture</label>
                <select className="input-field" value={model} onChange={(e) => setModel(e.target.value)}>
                  <option value="deepseek-chat">deepseek-chat (Fast)</option>
                  <option value="deepseek-reasoner">deepseek-reasoner (Complex)</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Execution Role</label>
                <select className="input-field" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="user">User</option>
                  <option value="system">System</option>
                  <option value="assistant">Assistant</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button className="btn primary" onClick={handleSave} disabled={loading} style={{ flex: 1, padding: '1rem' }}>
                {loading ? "Processing..." : "Execute Request ⚡"}
              </button>
              <button className="btn" onClick={handleClear} style={{ padding: '1rem 2rem' }}>Clear</button>
            </div>
          </div>

          {/* Response Box */}
          <div className="glass-panel" style={{ 
            minHeight: '200px', 
            border: response ? '1px solid var(--primary)' : '1px dashed var(--glass-border-strong)',
            background: response ? 'rgba(124, 58, 237, 0.05)' : 'transparent',
            transition: 'all 0.4s'
          }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--primary)' }}>Output Stream</h2>
            {response ? (
              <p style={{ color: 'var(--text-main)', whiteSpace: 'pre-wrap' }}>{response}</p>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', marginTop: '3rem' }}>
                Awaiting input execution...
              </p>
            )}
          </div>

        </div>

        {/* Side Panel Parameters */}
        <div style={{ flex: '1 1 300px' }}>
          <div className="glass-panel" style={{ position: 'sticky', top: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Hyperparameters</h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                <span>Temperature</span>
                <span style={{ color: 'var(--primary)' }}>{temperature}</span>
              </label>
              <input 
                type="range" 
                min="0" max="2" step="0.1" 
                value={temperature} 
                onChange={(e) => setTemperature(e.target.value)} 
                style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }} 
              />
              <p style={{ fontSize: '0.8rem', marginTop: '0.4rem', opacity: 0.7 }}>0.0 = Math/Logic | 1.0 = Standard | 1.5 = Creative</p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Max Tokens Limit</label>
              <input 
                type="number" 
                className="input-field" 
                placeholder="Default: 500" 
                value={tokens} 
                onChange={(e) => setTokens(e.target.value)} 
              />
              <p style={{ fontSize: '0.8rem', marginTop: '0.4rem', opacity: 0.7 }}>100 tokens ≈ 75 words.</p>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>System Constraints</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Vocabulary overrides..." 
              />
            </div>
          </div>
          
          {/* Quick Learning Links Box */}
          <div className="glass-panel" style={{ marginTop: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Language Flashcards</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <a href="https://quizlet.com/870465361/edit" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <button className="btn" style={{ width: '100%', textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}>
                  <span>🇩🇪 German</span> <span>→</span>
                </button>
              </a>
              <a href="https://quizlet.com/865986006/edit" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <button className="btn" style={{ width: '100%', textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}>
                  <span>🇪🇸 Spanish</span> <span>→</span>
                </button>
              </a>
              <a href="https://quizlet.com/870391525/edit" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <button className="btn" style={{ width: '100%', textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}>
                  <span>🇬🇧 English</span> <span>→</span>
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
