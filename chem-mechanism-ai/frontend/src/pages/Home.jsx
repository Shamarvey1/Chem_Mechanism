import { useState, useEffect } from 'react';
import MoleculeVisualizer3D from '../components/MoleculeVisualizer3D';

const EXAMPLE_REACTIONS = [
  'NaOH + HCl → NaCl + H2O',
  'CH3Br + OH- → CH3OH + Br-',
  'Combustion of methane',
  'SN2 reaction',
  'Fe + CuSO4 → FeSO4 + Cu',
  'Decomposition of H2O2',
];

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
    if (currentStep >= totalSteps - 1) { setIsPlaying(false); return; }
    const timer = setTimeout(() => {
      setCurrentStep(prev => {
        const next = prev + 1;
        if (next >= totalSteps - 1) setIsPlaying(false);
        return next;
      });
    }, 2500);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, totalSteps]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reaction.trim()) { setError('Please enter a chemical reaction or reaction name.'); return; }
    setIsPlaying(false);
    setLoading(true);
    setReactionData(null);
    setCurrentStep(0);
    setError(null);
    try {
      const response = await fetch('http://localhost:5001/api/reactions/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reaction: reaction.trim() }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || 'Failed to analyze reaction.');
      setReactionData(data.data);
      setCurrentStep(0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => { setIsPlaying(false); setCurrentStep(prev => Math.max(0, prev - 1)); };
  const handleNext = () => { setIsPlaying(false); setCurrentStep(prev => Math.min(totalSteps - 1, prev + 1)); };
  const handlePlay = () => {
    if (isPlaying) { setIsPlaying(false); }
    else { if (currentStep >= totalSteps - 1) setCurrentStep(0); setIsPlaying(true); }
  };

  const formatAction = (action) => {
    if (!action) return '';
    return action.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      fontFamily: "'Inter', system-ui, sans-serif", color: '#e2e8f0', padding: '0'
    }}>
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>

        <header style={{ textAlign: 'center', marginBottom: '2.5rem', paddingTop: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
            <span style={{ fontSize: '2rem' }}>⚗️</span>
            <h1 style={{
              fontSize: '2.2rem', fontWeight: 800,
              background: 'linear-gradient(135deg, #a78bfa, #60a5fa, #34d399)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em'
            }}>
              ChemMechanism AI
            </h1>
          </div>
          <p style={{ fontSize: '1rem', color: '#94a3b8', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
            AI-powered 3D reaction mechanism visualizer for chemistry students.
            Enter any reaction equation or just type a reaction name.
          </p>
        </header>

        <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
          <div style={{
            display: 'flex', gap: '0.75rem', background: 'rgba(255,255,255,0.06)',
            borderRadius: '14px', padding: '0.5rem', border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(12px)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
          }}>
            <input
              id="reaction-input"
              type="text"
              value={reaction}
              onChange={(e) => setReaction(e.target.value)}
              placeholder="e.g. NaOH + HCl → NaCl + H2O  or  SN2 reaction"
              disabled={loading}
              style={{
                flex: 1, padding: '0.85rem 1.1rem', fontSize: '1rem',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px', color: '#f1f5f9', outline: 'none',
                fontFamily: 'inherit', transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'rgba(139,92,246,0.5)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
            <button type="submit" disabled={loading} style={{
              padding: '0.85rem 1.8rem', fontSize: '0.95rem', fontWeight: 700,
              color: '#fff', background: loading ? '#4b5563' : 'linear-gradient(135deg, #7c3aed, #2563eb)',
              border: 'none', borderRadius: '10px',
              cursor: loading ? 'wait' : 'pointer', whiteSpace: 'nowrap',
              fontFamily: 'inherit', transition: 'transform 0.15s, box-shadow 0.2s',
              boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
              transform: loading ? 'none' : undefined
            }}
              onMouseEnter={(e) => { if(!loading) e.target.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.target.style.transform = 'none'; }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{
                    width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid #fff', borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite', display: 'inline-block'
                  }}/>
                  Analyzing...
                </span>
              ) : 'Analyze Reaction'}
            </button>
          </div>
        </form>

        {!reactionData && !loading && !error && (
          <div style={{ marginBottom: '2rem' }}>
            <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.6rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Try these examples:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {EXAMPLE_REACTIONS.map(ex => (
                <button key={ex} onClick={() => setReaction(ex)} style={{
                  padding: '0.4rem 0.85rem', fontSize: '0.8rem', fontWeight: 500,
                  color: '#c4b5fd', background: 'rgba(139,92,246,0.12)',
                  border: '1px solid rgba(139,92,246,0.25)', borderRadius: '999px',
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s'
                }}
                  onMouseEnter={(e) => { e.target.style.background = 'rgba(139,92,246,0.25)'; e.target.style.borderColor = 'rgba(139,92,246,0.5)'; }}
                  onMouseLeave={(e) => { e.target.style.background = 'rgba(139,92,246,0.12)'; e.target.style.borderColor = 'rgba(139,92,246,0.25)'; }}
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div style={{
            padding: '1rem 1.25rem', borderRadius: '10px', marginBottom: '1.5rem',
            background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
            color: '#fca5a5', fontSize: '0.9rem'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {reactionData && (
          <div>
            <MoleculeVisualizer3D
              reactionData={reactionData}
              currentStep={currentStep}
              onStepChange={setCurrentStep}
            />

            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem',
              marginTop: '1.25rem'
            }}>
              <div style={{
                background: 'rgba(255,255,255,0.04)', borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.08)', padding: '1rem 1.25rem'
              }}>
                <h3 style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem' }}>
                  Reactants
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {reactionData.reactants.map((r, i) => (
                    <div key={i} style={{
                      background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                      borderRadius: '8px', padding: '0.5rem 0.85rem'
                    }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#c7d2fe' }}>{r.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#818cf8', fontFamily: 'monospace' }}>{r.formula}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.04)', borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.08)', padding: '1rem 1.25rem'
              }}>
                <h3 style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem' }}>
                  Products
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {reactionData.products.map((p, i) => (
                    <div key={i} style={{
                      background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)',
                      borderRadius: '8px', padding: '0.5rem 0.85rem'
                    }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#a7f3d0' }}>{p.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#34d399', fontFamily: 'monospace' }}>{p.formula}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {reactionData._pubchem && (
              <div style={{
                marginTop: '1rem', padding: '0.65rem 1rem', borderRadius: '10px',
                background: reactionData._pubchem.verified ? 'rgba(52,211,153,0.08)' : 'rgba(251,191,36,0.08)',
                border: `1px solid ${reactionData._pubchem.verified ? 'rgba(52,211,153,0.25)' : 'rgba(251,191,36,0.25)'}`,
                display: 'flex', alignItems: 'flex-start', gap: '0.6rem'
              }}>
                <span style={{ fontSize: '1.1rem' }}>{reactionData._pubchem.verified ? '✓' : '⚠'}</span>
                <div>
                  <div style={{
                    fontSize: '0.82rem', fontWeight: 600,
                    color: reactionData._pubchem.verified ? '#34d399' : '#fbbf24'
                  }}>
                    {reactionData._pubchem.verified
                      ? 'PubChem Verified — All molecules match known chemical data'
                      : 'PubChem Warnings'}
                  </div>
                  {!reactionData._pubchem.verified && reactionData._pubchem.warnings?.length > 0 && (
                    <ul style={{ margin: '0.3rem 0 0', paddingLeft: '1rem', listStyle: 'disc' }}>
                      {reactionData._pubchem.warnings.map((w, i) => (
                        <li key={i} style={{ fontSize: '0.75rem', color: '#fde68a', lineHeight: 1.5 }}>{w}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            <div style={{
              marginTop: '1.25rem', background: 'rgba(255,255,255,0.04)',
              borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)',
              padding: '1.25rem'
            }}>
              <h3 style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.8rem' }}>
                Mechanism Steps
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {steps.map((s, idx) => (
                  <div
                    key={s.step}
                    onClick={() => { setIsPlaying(false); setCurrentStep(idx); }}
                    style={{
                      display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                      padding: '0.75rem 1rem', borderRadius: '8px',
                      cursor: 'pointer', transition: 'all 0.2s',
                      background: idx === currentStep ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.02)',
                      border: idx === currentStep ? '1px solid rgba(99,102,241,0.35)' : '1px solid transparent',
                    }}
                    onMouseEnter={(e) => { if(idx !== currentStep) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                    onMouseLeave={(e) => { if(idx !== currentStep) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                  >
                    <span style={{
                      width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.72rem', fontWeight: 700, flexShrink: 0,
                      background: idx === currentStep ? 'linear-gradient(135deg, #7c3aed, #2563eb)' : 'rgba(255,255,255,0.08)',
                      color: idx === currentStep ? '#fff' : '#94a3b8',
                    }}>
                      {s.step}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '0.82rem', fontWeight: 600,
                        color: idx === currentStep ? '#c4b5fd' : '#94a3b8',
                        marginBottom: '0.15rem'
                      }}>
                        {formatAction(s.action)}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4 }}>
                        {s.explanation}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {totalSteps > 1 && (
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '0.75rem', marginTop: '1rem', paddingTop: '1rem',
                  borderTop: '1px solid rgba(255,255,255,0.06)'
                }}>
                  <button onClick={handlePrevious} disabled={currentStep === 0}
                    style={{
                      padding: '0.5rem 1.1rem', fontSize: '0.82rem', fontWeight: 600,
                      color: currentStep === 0 ? '#475569' : '#c4b5fd',
                      background: currentStep === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(139,92,246,0.12)',
                      border: `1px solid ${currentStep === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(139,92,246,0.25)'}`,
                      borderRadius: '8px', cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                      fontFamily: 'inherit', transition: 'all 0.15s'
                    }}>
                    ← Previous
                  </button>

                  <button onClick={handlePlay}
                    style={{
                      padding: '0.5rem 1.4rem', fontSize: '0.82rem', fontWeight: 700,
                      color: '#fff',
                      background: isPlaying ? 'linear-gradient(135deg, #ea580c, #dc2626)' :
                        currentStep >= totalSteps - 1 ? 'linear-gradient(135deg, #0891b2, #2563eb)' :
                        'linear-gradient(135deg, #059669, #10b981)',
                      border: 'none', borderRadius: '8px', cursor: 'pointer',
                      fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                      display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'all 0.15s'
                    }}>
                    {isPlaying ? '⏸ Pause' : currentStep >= totalSteps - 1 ? '↻ Replay' : '▶ Play'}
                  </button>

                  <button onClick={handleNext} disabled={currentStep >= totalSteps - 1}
                    style={{
                      padding: '0.5rem 1.1rem', fontSize: '0.82rem', fontWeight: 600,
                      color: currentStep >= totalSteps - 1 ? '#475569' : '#93c5fd',
                      background: currentStep >= totalSteps - 1 ? 'rgba(255,255,255,0.03)' : 'rgba(37,99,235,0.12)',
                      border: `1px solid ${currentStep >= totalSteps - 1 ? 'rgba(255,255,255,0.05)' : 'rgba(37,99,235,0.25)'}`,
                      borderRadius: '8px', cursor: currentStep >= totalSteps - 1 ? 'not-allowed' : 'pointer',
                      fontFamily: 'inherit', transition: 'all 0.15s'
                    }}>
                    Next →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 640px) {
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

export default Home;
