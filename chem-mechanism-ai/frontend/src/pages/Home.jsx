import { useState, useEffect, useMemo } from 'react';
import MoleculeVisualizer3D from '../components/MoleculeVisualizer3D';
import AgentTraceDrawer from '../components/AgentTraceDrawer';
import ErrorBoundary from '../components/ErrorBoundary';
import { buildInitialGraph } from '../utils/moleculeGraph';
const EXAMPLE_REACTIONS = [
  { label: 'Bromomethane', formula: 'CH3Br', query: 'CH3Br + OH- -> CH3OH + Br-' },
  { label: 'Chloromethane', formula: 'CH3Cl', query: 'CH3Cl + OH- -> CH3OH + Cl-' },
  { label: 'Bromoethane', formula: 'C2H5Br', query: 'C2H5Br + OH- -> C2H5OH + Br-' },
  { label: 'Neutralization', formula: 'NaOH + HCl', query: 'NaOH + HCl -> NaCl + H2O' },
  { label: 'Combustion', formula: 'CH4 + 2O2', query: 'Combustion of methane' },
  { label: 'Redox', formula: 'Fe + CuSO4', query: 'Fe + CuSO4 -> FeSO4 + Cu' },
];
function Home() {
  const [reaction, setReaction] = useState('CH3Br + OH- -> CH3OH + Br-');
  const [loading, setLoading] = useState(false);
  const [reactionData, setReactionData] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [error, setError] = useState(null);
  const [quizIdx, setQuizIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const steps = reactionData?.steps || [];
  const totalSteps = steps.length;
  const quizQuestions = reactionData?.jeeQuestions || [];
  const activeQuiz = quizQuestions[quizIdx] || quizQuestions[0];
  const currentStep = useMemo(() => {
    if (!totalSteps) return 0;
    return Math.min(totalSteps - 1, Math.floor(progress * totalSteps));
  }, [progress, totalSteps]);
  useEffect(() => {
    if (!isPlaying) return;
    let animId;
    let lastTime = performance.now();
    const BASE_DURATION = 6000; 
    const frame = (now) => {
      const delta = now - lastTime;
      lastTime = now;
      setProgress((prev) => {
        const next = prev + (delta * playbackSpeed) / BASE_DURATION;
        if (next >= 1) {
          setIsPlaying(false);
          return 1;
        }
        return next;
      });
      animId = requestAnimationFrame(frame);
    };
    animId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);
  useEffect(() => {
    triggerAnalyze('CH3Br + OH- -> CH3OH + Br-');
  }, []);
  const triggerAnalyze = async (queryToAnalyze) => {
    const q = (queryToAnalyze || reaction).trim();
    if (!q) {
      setError('Please enter a chemical reaction or name.');
      return;
    }
    setIsPlaying(false);
    setLoading(true);
    setError(null);
    setProgress(0);
    setQuizIdx(0);
    setUserAnswers({});
    try {
      const response = await fetch('http://localhost:5001/api/reactions/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reaction: q }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to analyze reaction.');
      }
      setReactionData(data.data);
      setProgress(0);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred while analyzing.');
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    triggerAnalyze(reaction);
  };
  const handlePlayToggle = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (progress >= 0.99) setProgress(0);
      setIsPlaying(true);
    }
  };
  const handleProgressChange = (newP) => {
    setIsPlaying(false);
    setProgress(Math.max(0, Math.min(1, newP)));
  };
  const handleStepChange = (idx) => {
    setIsPlaying(false);
    if (totalSteps > 1) {
      setProgress(idx / (totalSteps - 1));
    } else {
      setProgress(0);
    }
  };
  const handleSelectQuizOption = (questionId, optionKey) => {
    if (userAnswers[questionId]) return;
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionKey,
    }));
  };
  const formatAction = (action) => {
    if (!action) return '';
    return action.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  };
  const bondSummary = useMemo(() => {
    if (!reactionData) return { broken: 'C–Br', formed: 'C–O', pathway: 'Walden Inversion / SN2' };
    let broken = null;
    let formed = null;
    const initialGraph = buildInitialGraph(reactionData);
    const atomEl = (id) => initialGraph.atoms.find(a => a.id === id)?.element || id;
    (reactionData.steps || []).forEach(s => {
      if (s.action === 'BOND_BREAK' && s.targets?.bond) {
        const parts = s.targets.bond.split('-');
        if (parts.length === 2) broken = `${atomEl(parts[0])}–${atomEl(parts[1])}`;
      }
      if (s.action === 'BOND_FORM' && s.targets) {
        if (s.targets.bond) {
          const parts = s.targets.bond.split('-');
          if (parts.length === 2) formed = `${atomEl(parts[0])}–${atomEl(parts[1])}`;
        } else if (s.targets.atom1 && s.targets.atom2) {
          formed = `${atomEl(s.targets.atom1)}–${atomEl(s.targets.atom2)}`;
        }
      }
      if (s.action === 'NUCLEOPHILE_ATTACK' && s.targets) {
        if (!formed && s.targets.nucleophile_atom && s.targets.electrophile_atom) {
          formed = `${atomEl(s.targets.nucleophile_atom)}–${atomEl(s.targets.electrophile_atom)}`;
        }
      }
    });
    if (!broken) {
      if (reactionData._category === 'ORGANIC') broken = 'Polar C–X';
      else if (reactionData._category === 'NEUTRALIZATION') broken = 'H–O (Acid-Base)';
      else broken = 'Reactant Bonds';
    }
    if (!formed) {
      if (reactionData._category === 'ORGANIC') formed = 'C–Nu';
      else if (reactionData._category === 'NEUTRALIZATION') formed = 'H–OH (H2O)';
      else formed = 'Product Bonds';
    }
    const pathway = reactionData.reaction?.type || reactionData._category || 'Concerted Mechanism';
    return { broken, formed, pathway };
  }, [reactionData]);
  const quizScore = Object.entries(userAnswers).filter(
    ([qId, ans]) => quizQuestions.find(q => q.id === qId)?.correctAnswer === ans
  ).length;
  return (
    <div>
      {}
      <header className="site-header">
        <div className="header-inner">
          <div className="brand">
            <div className="brand-mark">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(30 12 12)" />
                <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(-30 12 12)" />
                <circle cx="12" cy="12" r="2.5" fill="currentColor" />
              </svg>
            </div>
            <div>ChemMechanism <span className="brand-ai">AI</span></div>
          </div>
          <div className="header-tagline">
            Interactive 3D Chemical Reaction &amp; IIT-JEE Intelligence Engine
          </div>
          <div className="student-badge">
            <span /> Built for Curious Minds &amp; JEE Aspirants
          </div>
        </div>
      </header>
      {}
      <main>
        {}
        <div className="page-intro">
          <div>
            <div className="eyebrow">
              <span /> Chemistry, In Motion
            </div>
            <h1>Go beyond the equation.</h1>
            <p>Watch chemical bonds break and form in real-time 3D, and master IIT-JEE concepts.</p>
          </div>
          <div className="journey">
            <span className={!reactionData || loading ? 'journey-active' : ''}>
              <b>01</b> Explore
            </span>
            <span>&rsaquo;</span>
            <span className={reactionData && !loading ? 'journey-active' : ''}>
              <b>02</b> Understand
            </span>
            <span>&rsaquo;</span>
            <span className={quizQuestions.length > 0 ? 'journey-active' : ''}>
              <b>03</b> Test yourself
            </span>
          </div>
        </div>
        {/* Reaction Input Card */}
        <section className="reaction-card">
          <div className="section-label">
            <span className="number">01</span> Reaction Input
            <span className="input-hint">Type any chemical formula, IUPAC name, or reaction mechanism</span>
          </div>
          <form className="reaction-form" onSubmit={handleSubmit}>
            <div className="input-wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                id="reaction-input"
                type="text"
                value={reaction}
                onChange={(e) => setReaction(e.target.value)}
                placeholder="e.g. CH3Br + OH- -> CH3OH + Br-  or  NaOH + HCl -> NaCl + H2O"
                disabled={loading}
              />
            </div>
            <button type="submit" className="analyze-button" disabled={loading}>
              {loading ? (
                <>
                  <span style={{
                    width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)',
                    borderTop: '2px solid #ffffff', borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite', display: 'inline-block'
                  }} />
                  Analyzing...
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
                  </svg>
                  Simulate
                </>
              )}
            </button>
          </form>
          <div className="examples">
            <span>Quick Try:</span>
            {EXAMPLE_REACTIONS.map((ex) => (
              <button
                key={ex.label}
                type="button"
                className={`example ${reaction === ex.query ? 'active' : ''}`}
                onClick={() => {
                  setReaction(ex.query);
                  triggerAnalyze(ex.query);
                }}
              >
                {ex.label} <span>{ex.formula}</span>
              </button>
            ))}
          </div>
          {error && <div className="input-error">{error}</div>}
        </section>
        {}
        {reactionData && (
          <ErrorBoundary>
            <MoleculeVisualizer3D
              reactionData={reactionData}
              progress={progress}
              onProgressChange={handleProgressChange}
              currentStep={currentStep}
              onStepChange={handleStepChange}
              isPlaying={isPlaying}
              onPlayToggle={handlePlayToggle}
              playbackSpeed={playbackSpeed}
              onSpeedChange={setPlaybackSpeed}
              onRestart={() => {
                setIsPlaying(false);
                setProgress(0);
              }}
            />
          </ErrorBoundary>
        )}
        {}
        {reactionData && (
          <div className="learning-grid">
            {}
            <section className="explanation-card">
              <div className="section-label">
                <span className="number">02</span> AI Explanation
                <span className="label-pill">MECHANISM INSIGHTS</span>
              </div>
              <h2>{reactionData.reaction?.name || reactionData.reaction?.input || 'Mechanism Overview'}</h2>
              <p className="explanation-intro">
                {reactionData.reaction?.description ||
                  `In this ${reactionData.reaction?.type || 'concerted'} pathway, reactants overcome activation barrier with simultaneous electron pair transfer and continuous orbital overlap.`}
              </p>
              <div className="explanation-steps">
                {steps.map((s, idx) => {
                  const dotColors = ['cyan', 'purple', 'orange'];
                  const dot = dotColors[idx % 3];
                  return (
                    <div key={s.step || idx}>
                      <span className={`step-dot ${dot}`} />
                      <p>
                        <strong>Step {s.step}: {s.name || formatAction(s.action)}</strong> &mdash; {s.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>
              {}
              <div className="bond-summary">
                <span>
                  <i className="break-icon">&minus;</i>
                  <div>
                    <small>BOND BROKEN</small>
                    {bondSummary.broken}
                  </div>
                </span>
                <span>
                  <i className="form-icon">+</i>
                  <div>
                    <small>BOND FORMED</small>
                    {bondSummary.formed}
                  </div>
                </span>
                <span className="concerted">{bondSummary.pathway}</span>
              </div>
              <div className="explanation-note">
                <span>💡</span> Real-time molecular orbital interaction verified against NIH PubChem
              </div>
            </section>
            {}
            <section className="quiz-card">
              <div className="section-label">
                <span className="number">03</span> JEE Quiz
                <span className="label-pill">EXAM PREP</span>
              </div>
              {quizQuestions.length > 0 && activeQuiz ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#7560d8' }}>
                      QUESTION 0{quizIdx + 1} / 0{quizQuestions.length}
                    </span>
                    {activeQuiz.examCitation && (
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        color: '#7560d8',
                        background: '#f4effd',
                        border: '1px solid #e7ddf9',
                        padding: '2px 8px',
                        borderRadius: '4px'
                      }}>
                        🏛️ {activeQuiz.examCitation}
                      </span>
                    )}
                  </div>
                  <div className="quiz-question">{activeQuiz.question}</div>
                  <fieldset className="quiz-options">
                    {(activeQuiz.options || []).map((opt) => {
                      const isSelected = userAnswers[activeQuiz.id] === opt.key;
                      const isAnswered = !!userAnswers[activeQuiz.id];
                      const isCorrect = opt.key === activeQuiz.correctAnswer;
                      let optClass = 'quiz-option';
                      if (isAnswered) {
                        if (isCorrect) optClass += ' correct';
                        else if (isSelected) optClass += ' incorrect';
                      } else if (isSelected) {
                        optClass += ' selected';
                      }
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          className={optClass}
                          onClick={() => handleSelectQuizOption(activeQuiz.id, opt.key)}
                          disabled={isAnswered}
                        >
                          <span className="option-letter">{opt.key}</span>
                          <span>{opt.text}</span>
                        </button>
                      );
                    })}
                  </fieldset>
                  {}
                  {userAnswers[activeQuiz.id] && (
                    <div className={`quiz-result ${userAnswers[activeQuiz.id] === activeQuiz.correctAnswer ? 'success' : ''}`}>
                      <strong>
                        {userAnswers[activeQuiz.id] === activeQuiz.correctAnswer
                          ? '🎉 Correct Answer!'
                          : `✕ Incorrect — Option (${activeQuiz.correctAnswer}) is correct.`}
                      </strong>
                      {activeQuiz.conceptTested && (
                        <div style={{ marginTop: '5px', fontWeight: 600 }}>
                          Key Concept: {activeQuiz.conceptTested}
                        </div>
                      )}
                      <div style={{ marginTop: '5px' }}>{activeQuiz.explanation}</div>
                    </div>
                  )}
                  {}
                  {quizQuestions.length > 1 && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '16px',
                      paddingTop: '12px',
                      borderTop: '1px solid #f0ecfa'
                    }}>
                      <button
                        type="button"
                        className="example"
                        disabled={quizIdx === 0}
                        onClick={() => setQuizIdx(prev => Math.max(0, prev - 1))}
                        style={{ opacity: quizIdx === 0 ? 0.4 : 1, cursor: quizIdx === 0 ? 'not-allowed' : 'pointer' }}
                      >
                        &larr; Prev Question
                      </button>
                      <span style={{ fontSize: '11px', color: '#8a899c', fontWeight: 600 }}>
                        Score: {quizScore} / {quizQuestions.length}
                      </span>
                      <button
                        type="button"
                        className="example"
                        disabled={quizIdx === quizQuestions.length - 1}
                        onClick={() => setQuizIdx(prev => Math.min(quizQuestions.length - 1, prev + 1))}
                        style={{ opacity: quizIdx === quizQuestions.length - 1 ? 0.4 : 1, cursor: quizIdx === quizQuestions.length - 1 ? 'not-allowed' : 'pointer' }}
                      >
                        Next Question &rarr;
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ padding: '24px 0', textAlign: 'center', color: '#8a899c', fontSize: '13px' }}>
                  Analyze a reaction to view curated IIT-JEE questions.
                </div>
              )}
            </section>
          </div>
        )}
        {}
        {reactionData && (
          <AgentTraceDrawer
            agentTrace={reactionData._agentTrace}
            pubchemData={reactionData._pubchem}
            category={reactionData._category || reactionData.reaction?.type}
          />
        )}
        {}
        <footer>
          <div>ChemMechanism AI &bull; Autonomous Multi-Agent Chemistry Intelligence &amp; 3D Visualizer</div>
          <div>Powered by Groq LLM &amp; NIH PubChem REST API &bull; Built for IIT-JEE</div>
        </footer>
      </main>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
export default Home;
