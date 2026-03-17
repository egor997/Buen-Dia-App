export default function DeepSeek() {
  return (
    <div className="page-container">
      <h1>DeepSeek</h1>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <div style={{ flex: 1 }}>
          <h2>Obligatory</h2>
          <textarea 
            className="input-field" 
            placeholder="Enter your request" 
            style={{ height: '150px', marginBottom: '1rem', resize: 'vertical' }}
          ></textarea>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <select className="input-field">
              <option>deepseek-reasoner</option>
              <option>deepseek-chat</option>
            </select>
            <select className="input-field">
              <option>user</option>
              <option>system</option>
              <option>assistant</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button className="btn primary">Save</button>
            <button className="btn">Clear</button>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <h2>Optional</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="text" className="input-field" placeholder="Enter temperature, default 1.0" />
            <input type="text" className="input-field" placeholder="Tokens, 100 tokens = 75 words, default 500" />
            <input type="text" className="input-field" placeholder="Change only for writing papers, vocabulary of Deepseek" />
          </div>
        </div>
      </div>
    </div>
  );
}
