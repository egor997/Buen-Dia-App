export default function Plots() {
  return (
    <div className="page-container">
      <h1>Plots</h1>
      <div style={{ marginBottom: '1rem' }}>
        <select className="input-field" style={{ width: '200px' }}>
          <option>Screen time</option>
          <option>Learning activity</option>
        </select>
      </div>
      <p>Plots will go here.</p>
    </div>
  );
}
