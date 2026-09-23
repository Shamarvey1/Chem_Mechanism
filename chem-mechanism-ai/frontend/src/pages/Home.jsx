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
      const data = await analyzeReaction(reaction.trim());
      setResult(data);
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
          <div id="error-message" className="response-box error-box">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div id="result-box" className="response-box result-box">
            <p><strong>Reaction:</strong> {result.reaction}</p>
            <p><strong>Status:</strong> {result.message}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
