export default function Home() {
  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Hero Welcome Unit */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(6, 182, 212, 0.1))',
        border: '1px solid var(--primary-glow)',
        borderRadius: 'var(--radius-xl)',
        padding: '3rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative background glow */}
        <div style={{
          position: 'absolute', top: '-50%', right: '-10%', width: '300px', height: '300px',
          background: 'var(--secondary)', filter: 'blur(80px)', opacity: '0.4', zIndex: 0
        }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>Buenos Días!</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-main)', opacity: 0.8, maxWidth: '600px' }}>
            Welcome to your premium command center. Track your streaks, review deep AI insights, and cultivate better habits.
          </p>
        </div>
      </div>

      {/* Bento Grid layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div className="glass-panel">
          <h2>🔥 Current Focus</h2>
          <p>Today is a great day to keep your streaks alive. Head over to the Habits tab to check off your morning routing.</p>
          <button className="btn primary" style={{ marginTop: '1.5rem', width: '100%' }}>View Habits</button>
        </div>
        
        <div className="glass-panel" style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(0,0,0,0.2))'}}>
          <h2 style={{color: '#FDA4AF'}}>📅 Daily Activity</h2>
          <p>You have 22 habits mapped out for the month. Don't let your graph drop!</p>
        </div>
        
        <div className="glass-panel" style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(0,0,0,0.2))'}}>
          <h2 style={{color: '#67E8F9'}}>🧠 AI Assistant</h2>
          <p>DeepSeek module is active. Ready to provide coding assistance and logical insights.</p>
        </div>
      </div>

    </div>
  );
}
