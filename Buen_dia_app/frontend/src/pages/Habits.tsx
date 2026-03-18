import { useState, useEffect } from "react";

export default function Habits() {
  const habitsList = [
    "Get up after the first alarm",
    "Warm up in the morning",
    "Brush teeth in the morning",
    "Take pills",
    "Grammar video",
    "Read 15 pages",
    "Do anything what can bring money in future for 1 hour",
    "Coding (Github portfolio) 1.5 H min",
    "Do one thing you would never do",
    "Push ups x3",
    "Pull ups x3",
    "Only ZDFHeute by eating",
    "Facial yoga",
    "Eye exercises",
    "Neck stretches",
    "Posture exercises",
    "Remind yourself you did a great job",
    "Brush teeth in the evening",
    "Don't eat more than one sweet thing",
    "Smile",
    "Go to bed at 23",
    "Holydays not only at home"
  ];

  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));

  const [checkedCells, setCheckedCells] = useState<Set<string>>(new Set());

  // Load habits from backend on mount
  useEffect(() => {
    fetch("http://localhost:8000/api/habits")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success" && data.data) {
          const loadedChecks = new Set<string>();
          const savedState = data.data;
          // data_storage.json formats like: { "0": { "0": true, "1": false }, "1": ...}
          Object.keys(savedState).forEach((row) => {
            const rowData = savedState[row];
            Object.keys(rowData).forEach((col) => {
              if (rowData[col]) {
                loadedChecks.add(`${row}-${col}`);
              }
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

    // Build the format expected by save_data.py
    const toSave: Record<string, Record<string, boolean>> = {};
    // We need to build the full 22x31 grid map
    for (let r = 0; r < 22; r++) {
      toSave[String(r)] = {};
      for (let c = 0; c < 31; c++) {
        toSave[String(r)][String(c)] = newChecked.has(`${r}-${c}`);
      }
    }

    // Send the updated data to the backend
    fetch("http://localhost:8000/api/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: toSave }),
    }).catch(err => console.error("Failed to save habit state:", err));
  };

  const calculateStreak = (rowIndex: number) => {
    let streak = 0;
    for (let currentDay = 30; currentDay >= 0; currentDay--) {
      if (checkedCells.has(`${rowIndex}-${currentDay}`)) {
        streak++;
      } else {
        break; // stop when we hit an unchecked day
      }
    }
    return streak;
  };

  return (
    <div className="page-container">
      <h1>Habits Tracker</h1>
      
      <div className="glass-table-container">
        <table className="glass-table">
          <thead>
            <tr>
              <th style={{ minWidth: '300px', position: 'sticky', left: 0, backgroundColor: 'rgba(30, 27, 75, 0.95)', zIndex: 10 }}>Habit</th>
              {days.map((day) => (
                <th key={day} style={{ textAlign: 'center', minWidth: '40px' }}>{day}</th>
              ))}
              <th style={{ textAlign: 'center', minWidth: '80px' }}>Streak</th>
            </tr>
          </thead>
          <tbody>
            {habitsList.map((habit, rowIndex) => (
              <tr key={rowIndex}>
                <td style={{ position: 'sticky', left: 0, backgroundColor: 'rgba(30, 27, 75, 0.95)', zIndex: 5, fontWeight: 500 }}>
                  {habit}
                </td>
                {days.map((_, colIndex) => (
                  <td key={colIndex} style={{ textAlign: 'center' }}>
                    <div 
                      onClick={() => toggleCell(rowIndex, colIndex)}
                      style={{
                        width: '24px',
                        height: '24px',
                        margin: '0 auto',
                        borderRadius: '6px',
                        border: '1px solid var(--glass-border)',
                        backgroundColor: checkedCells.has(`${rowIndex}-${colIndex}`) ? 'var(--success)' : 'rgba(0,0,0,0.2)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: checkedCells.has(`${rowIndex}-${colIndex}`) ? '0 0 10px var(--success)' : 'none'
                      }}
                    />
                  </td>
                ))}
                <td style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--primary)' }}>
                  {calculateStreak(rowIndex)} 🔥
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
