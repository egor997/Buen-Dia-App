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
      setResponse("Network error: Could not connect to local backend API.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setPrompt("");
    setResponse("");
  };

  return (
    <div className="page-container">
      <h1>DeepSeek</h1>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <div style={{ flex: 1 }}>
          <h2>Obligatory</h2>
          <textarea 
            className="input-field" 
            placeholder="Enter your request" 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            style={{ height: '150px', marginBottom: '1rem', resize: 'vertical' }}
          ></textarea>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <select className="input-field" value={model} onChange={(e) => setModel(e.target.value)}>
              <option value="deepseek-reasoner">deepseek-reasoner</option>
              <option value="deepseek-chat">deepseek-chat</option>
            </select>
            <select className="input-field" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">user</option>
              <option value="system">system</option>
              <option value="assistant">assistant</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button className="btn primary" onClick={handleSave} disabled={loading}>
              {loading ? "Thinking..." : "Save"}
            </button>
            <button className="btn" onClick={handleClear}>Clear</button>
          </div>
          
          {response && (
            <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid var(--glass-border)', whiteSpace: 'pre-wrap' }}>
              <h3>Response:</h3>
              <p style={{ marginTop: '0.5rem', color: 'var(--text-main)' }}>{response}</p>
            </div>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <h2>Optional</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="text" className="input-field" placeholder="Enter temperature, default 1.0" value={temperature} onChange={(e) => setTemperature(e.target.value)} />
            <input type="text" className="input-field" placeholder="Tokens, 100 tokens = 75 words, default 500" value={tokens} onChange={(e) => setTokens(e.target.value)} />
            <input type="text" className="input-field" placeholder="Change only for writing papers, vocabulary of Deepseek" />
          </div>
        </div>
      </div>
    </div>
  );
}
