export default function FunFacts() {
  return (
    <div className="page-container">
      <h1>Fun Facts</h1>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button className="btn primary">Next fact</button>
        <button className="btn">Remove fact</button>
        <button className="btn">Add new fact</button>
      </div>
      <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.1)', borderRadius: '8px' }}>
        <p>Fact label goes here.</p>
      </div>
    </div>
  );
}
