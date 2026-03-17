import { useState } from "react";
import "./App.css";
import Home from "./pages/Home";
import Habtis from "./pages/Habits";
import Plots from "./pages/Plots";
import FunFacts from "./pages/FunFacts";
import DeepSeek from "./pages/DeepSeek";

function App() {
  const [activeTab, setActiveTab] = useState("Home");

  const renderContent = () => {
    switch (activeTab) {
      case "Home":
        return <Home />;
      case "Habits":
        return <Habtis />;
      case "Plots":
        return <Plots />;
      case "Fun Facts":
        return <FunFacts />;
      case "DeepSeek":
        return <DeepSeek />;
      default:
        return <Home />;
    }
  };

  const navItems = ["Home", "Habits", "Plots", "Fun Facts", "DeepSeek"];

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="sidebar-header">
          Buen Dia
        </div>
        <nav>
          {navItems.map((item) => (
            <div
              key={item}
              className={`nav-item ${activeTab === item ? "active" : ""}`}
              onClick={() => setActiveTab(item)}
            >
              {item}
            </div>
          ))}
        </nav>
      </div>
      <div className="main-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
