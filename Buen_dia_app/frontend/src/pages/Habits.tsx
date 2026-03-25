import { useState, useEffect } from "react";

export default function Habits() {
  const habitsList = [
    "Get up after the first alarm", "Warm up in the morning", "Brush teeth in the morning", "Take pills", 
    "Grammar video", "Read 15 pages", "Do anything what can bring money in future for 1 hour", 
    "Coding (Github portfolio) 1.5 H min", "Do one thing you would never do", "Push ups x3", "Pull ups x3", 
    "Only ZDFHeute by eating", "Facial yoga", "Eye exercises", "Neck stretches", "Posture exercises", 
    "Remind yourself you did a great job", "Brush teeth in the evening", "Don't eat more than one sweet thing", 
    "Smile", "Go to bed at 23", "Holydays not only at home"
  ];

  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
  const [checkedCells, setCheckedCells] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("http://localhost:8000/api/habits")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success" && data.data) {
          const loadedChecks = new Set<string>();
          const savedState = data.data;
          Object.keys(savedState).forEach((row) => {
            const rowData = savedState[row];
            Object.keys(rowData).forEach((col) => {
              if (rowData[col]) loadedChecks.add(`${row}-${col}`);
            });
          });
          setCheckedCells(loadedChecks);
        }
      })
      .catch((err) => console.error("Failed to load habits:", err));
  }, []);

  const toggleCell = (rowIndex: number, colIndex: number) => {
    const cellId = `${rowIndex}-${colIndex}`;
    const newChecked = new Set(checkedCells);
    if (newChecked.has(cellId)) {
      newChecked.delete(cellId);
    } else {
      newChecked.add(cellId);
    }
    setCheckedCells(newChecked);

    const toSave: Record<string, Record<string, boolean>> = {};
    for (let r = 0; r < 22; r++) {
      toSave[String(r)] = {};
      for (let c = 0; c < 31; c++) {
        toSave[String(r)][String(c)] = newChecked.has(`${r}-${c}`);
      }
    }

    fetch("http://localhost:8000/api/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: toSave }),
    }).catch(err => console.error("Failed to save habit state:", err));
  };

  const calculateStreak = (rowIndex: number) => {
    const todayIndex = new Date().getDate() - 1;
    let streak = 0;
    for (let currentDay = todayIndex; currentDay >= 0; currentDay--) {
      if (checkedCells.has(`${rowIndex}-${currentDay}`)) {
        streak++;
      } else {
        if (currentDay === todayIndex) {
          continue; // Allow today to be unchecked without breaking the streak
        }
        break; // Streak broken
      }
    }
    return streak;
  };

  return (
    <div className="page-container" style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '2.5rem 3rem 1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Habits Tracker</h1>
        <p>Your daily discipline dashboard. Stay consistent to build your streak.</p>
      </div>
      
      <div style={{ flex: 1, overflow: 'auto', padding: '0' }}>
        <table style={{ minWidth: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 20, background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(10px)' }}>
            <tr>
              <th style={{ padding: '1.2rem 2rem', fontWeight: 600, color: 'var(--text-muted)', position: 'sticky', left: 0, background: 'inherit', zIndex: 21, minWidth: '320px', borderBottom: '1px solid var(--glass-border-strong)'}}>
                Habit
              </th>
              {days.map((day) => (
                <th key={day} style={{ textAlign: 'center', padding: '1.2rem 0.5rem', color: 'var(--text-muted)', fontWeight: 600, minWidth: '45px', borderBottom: '1px solid var(--glass-border-strong)' }}>
                  {day}
                </th>
              ))}
              <th style={{ textAlign: 'center', padding: '1.2rem 1.5rem', fontWeight: 600, color: 'var(--text-main)', position: 'sticky', right: 0, background: 'inherit', zIndex: 21, borderBottom: '1px solid var(--glass-border-strong)'}}>
                Streak
              </th>
            </tr>
          </thead>
          <tbody>
            {habitsList.map((habit, rowIndex) => {
              const streak = calculateStreak(rowIndex);
              return (
                <tr key={rowIndex} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', transition: 'background 0.2s' }} className="habit-row">
                  <td style={{ padding: '1.2rem 2rem', color: 'var(--text-main)', fontWeight: 500, position: 'sticky', left: 0, background: 'var(--bg-dark)', zIndex: 10 }}>
                    {habit}
                  </td>
                  {days.map((_, colIndex) => {
                    const isChecked = checkedCells.has(`${rowIndex}-${colIndex}`);
                    const cellDate = new Date();
                    cellDate.setDate(colIndex + 1);
                    const formattedDate = cellDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                    return (
                      <td key={colIndex} style={{ textAlign: 'center', padding: '0.5rem' }}>
                        <div 
                          title={`${formattedDate} - ${habit}`}
                          onClick={() => toggleCell(rowIndex, colIndex)}
                          style={{
                            width: '28px',
                            height: '28px',
                            margin: '0 auto',
                            borderRadius: '8px',
                            background: isChecked ? 'var(--primary)' : 'rgba(0,0,0,0.03)',
                            border: `1px solid ${isChecked ? 'var(--primary)' : 'rgba(0,0,0,0.1)'}`,
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            transform: isChecked ? 'scale(1.1)' : 'scale(1)',
                            boxShadow: isChecked ? 'var(--shadow-glow)' : 'inset 0 2px 4px rgba(0,0,0,0.2)'
                          }}
                        />
                      </td>
                    );
                  })}
                  <td style={{ textAlign: 'center', padding: '1.2rem 1.5rem', fontWeight: 700, position: 'sticky', right: 0, background: 'var(--bg-dark)', zIndex: 10 }}>
                    <span style={{ 
                      display: 'inline-block',
                      padding: '0.3rem 0.8rem', 
                      borderRadius: '20px', 
                      background: streak > 0 ? 'rgba(249, 115, 22, 0.1)' : 'transparent',
                      color: streak > 0 ? 'var(--secondary)' : 'var(--text-muted)'
                    }}>
                      {streak > 0 ? `${streak} 🔥` : '-'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
