import { useState, useEffect } from 'react';
import MoleculeVisualizer from '../components/MoleculeVisualizer';
import MoleculeVisualizer3D from '../components/MoleculeVisualizer3D';

function Home() {
  const [reaction, setReaction] = useState('');
  const [loading, setLoading] = useState(false);
  const [reactionData, setReactionData] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);

  const steps = reactionData?.steps || [];
  const activeStep = steps[currentStep] || steps[0];
  const totalSteps = steps.length;

  useEffect(() => {
    if (!isPlaying) return;

    if (currentStep >= totalSteps - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStep((prev) => {
        const next = prev + 1;
        if (next >= totalSteps - 1) {
          setIsPlaying(false);
        }
        return next;
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, totalSteps]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reaction.trim()) {
      setError('Please enter a chemical reaction before submitting.');
      return;
    }

    setIsPlaying(false);
    setLoading(true);
    setReactionData(null);
    setCurrentStep(0);
    setError(null);

    try {
      const response = await fetch('http://localhost:5001/api/reactions/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reaction: reaction.trim() }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to analyze reaction.');
      }

      setReactionData(data.data);
      setCurrentStep(0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    setIsPlaying(false);
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentStep((prev) => Math.min(totalSteps - 1, prev + 1));
  };

  const handlePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setCurrentStep(0);
      setIsPlaying(true);
    }
  };

  const handleSelectStep = (idx) => {
    setIsPlaying(false);
    setCurrentStep(idx);
  };

  const formatAction = (action) => {
    if (!action) return 'Nucleophile Attack';
    return action
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
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

        {reactionData && (
          <div id="result-panel" className="result-panel">
            <MoleculeVisualizer
              reactionData={reactionData}
              currentStep={currentStep}
            />

            {}
            <MoleculeVisualizer3D reactionData={reactionData} currentStep={currentStep} onStepChange={setCurrentStep} />

            {totalSteps > 0 && activeStep && (
              <section className="result-section">
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  marginBottom: '0.6rem'
                }}>
                  <h3 style={{
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    margin: 0
                  }}>
                    Step {activeStep.step}: {formatAction(activeStep.action)}
                  </h3>
                  <span style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#475569',
                    backgroundColor: '#e2e8f0',
                    padding: '0.2rem 0.75rem',
                    borderRadius: '999px'
                  }}>
                    Step {currentStep + 1} of {totalSteps}
                  </span>
                </div>

                <p style={{
                  fontSize: '0.95rem',
                  color: '#334155',
                  lineHeight: 1.6,
                  marginBottom: '1rem'
                }}>
                  {activeStep.explanation}
                </p>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  flexWrap: 'wrap'
                }}>
                  <button
                    id="prev-step-btn"
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    style={{
                      padding: '0.55rem 1.25rem',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: currentStep === 0 ? '#94a3b8' : '#1e293b',
                      backgroundColor: currentStep === 0 ? '#f1f5f9' : '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      cursor: currentStep === 0 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Previous
                  </button>

                  <button
                    id="play-mechanism-btn"
                    type="button"
                    onClick={handlePlay}
                    style={{
                      padding: '0.55rem 1.25rem',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: '#ffffff',
                      backgroundColor: isPlaying ? '#ea580c' : currentStep >= totalSteps - 1 ? '#0284c7' : '#16a34a',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    {isPlaying ? (
                      <>
                        <span>⏸</span> Pause
                      </>
                    ) : currentStep >= totalSteps - 1 ? (
                      <>
                        <span>↻</span> Replay Mechanism
                      </>
                    ) : (
                      <>
                        <span>▶</span> Play Mechanism
                      </>
                    )}
                  </button>

                  <button
                    id="next-step-btn"
                    type="button"
                    onClick={handleNext}
                    disabled={currentStep >= totalSteps - 1}
                    style={{
                      padding: '0.55rem 1.25rem',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: '#ffffff',
                      backgroundColor: currentStep >= totalSteps - 1 ? '#94a3b8' : '#2563eb',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: currentStep >= totalSteps - 1 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Next
                  </button>
                </div>
              </section>
            )}

            <section className="result-section">
              <h2 className="section-title">Reaction</h2>
              <p className="section-value">{reactionData.reaction.input}</p>
              <span className="badge">{reactionData.reaction.type}</span>
            </section>

            <section className="result-section">
              <h2 className="section-title">Reactants</h2>
              <div className="card-grid">
                {reactionData.reactants.map((r, i) => (
                  <div key={i} className="chem-card">
                    <p className="chem-name">{r.name}</p>
                    <p className="chem-formula">{r.formula}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="result-section">
              <h2 className="section-title">Products</h2>
              <div className="card-grid">
                {reactionData.products.map((p, i) => (
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
                {reactionData.steps.map((s, idx) => (
                  <div
                    key={s.step}
                    className="step-card"
                    style={{
                      borderLeft: idx === currentStep ? '4px solid #2563eb' : '4px solid #cbd5e1',
                      backgroundColor: idx === currentStep ? '#f8fafc' : '#ffffff',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleSelectStep(idx)}
                  >
                    <div className="step-number" style={{ color: idx === currentStep ? '#2563eb' : '#64748b' }}>
                      Step {s.step}
                    </div>
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
