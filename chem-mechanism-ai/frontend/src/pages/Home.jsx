import { useState } from 'react';
import { analyzeReaction } from '../services/reactionService';

function Home() {
  const [reaction, setReaction] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reaction.trim()) {
      setError('Please enter a chemical reaction before submitting.');
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await analyzeReaction(reaction.trim());
      setResult(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
              placeholder="e.g., CH3Br + OH- -> CH3OH + Br-"
              disabled={loading}
            />
            <button type="submit" className="analyze-btn" disabled={loading}>
              {loading ? 'Analyzing...' : 'Analyze Reaction'}
            </button>
          </div>
        </form>

        {error && (
          <div id="error-message" className="error-box">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div id="result-panel" className="result-panel">

            <section className="result-section">
              <h2 className="section-title">Reaction</h2>
              <p className="section-value">{result.reaction.input}</p>
              <span className="badge">{result.reaction.type}</span>
            </section>

            <section className="result-section">
              <h2 className="section-title">Reactants</h2>
              <div className="card-grid">
                {result.reactants.map((r, i) => (
                  <div key={i} className="chem-card">
                    <p className="chem-name">{r.name}</p>
                    <p className="chem-formula">{r.formula}</p>
                    <span className="role-tag">{r.role}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="result-section">
              <h2 className="section-title">Products</h2>
              <div className="card-grid">
                {result.products.map((p, i) => (
                  <div key={i} className="chem-card">
                    <p className="chem-name">{p.name}</p>
                    <p className="chem-formula">{p.formula}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="result-section">
              <h2 className="section-title">Mechanism Steps</h2>
              <div className="steps-list">
                {result.steps.map((s) => (
                  <div key={s.step} className="step-card">
                    <div className="step-number">Step {s.step}</div>
                    <p className="step-action">{s.action}</p>
                    <p className="step-explanation">{s.explanation}</p>
                  </div>
                ))}
              </div>
            </section>

          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
