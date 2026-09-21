import { useState } from 'react';

function Home() {
  const [reaction, setReaction] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reaction.trim()) return;
    console.log('Reaction submitted for analysis:', reaction);
  };

  return (
    <div className="home-container">
      <header className="header">
        <h1>ChemMechanism AI</h1>
        <p className="subtitle">AI-powered organic chemistry mechanism tutor</p>
      </header>

      <main className="main-content">
        <form onSubmit={handleSubmit} className="reaction-form">
          <label htmlFor="reaction-input" className="form-label">
            Enter Chemical Reaction:
          </label>
          <div className="input-group">
            <input
              id="reaction-input"
              type="text"
              className="reaction-input"
              value={reaction}
              onChange={(e) => setReaction(e.target.value)}
              placeholder="e.g., 2-methylpropene + HBr -> 2-bromo-2-methylpropane"
            />
            <button type="submit" className="analyze-btn">
              Analyze Reaction
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default Home;
