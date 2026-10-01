import { useState } from 'react';

export default function JeeQuestionsSection({ questions, reactionInput }) {
  const [userAnswers, setUserAnswers] = useState({});
  const [showExplanations, setShowExplanations] = useState({});

  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    return null;
  }

  const handleSelectOption = (questionId, optionKey) => {
    // Once answered, don't allow changing to preserve exam practice
    if (userAnswers[questionId]) return;

    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionKey,
    }));

    // Auto show explanation once answered
    setShowExplanations(prev => ({
      ...prev,
      [questionId]: true,
    }));
  };

  const toggleExplanation = (questionId) => {
    setShowExplanations(prev => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleReset = () => {
    setUserAnswers({});
    setShowExplanations({});
  };

  // Calculate score
  const totalAnswered = Object.keys(userAnswers).length;
  const correctCount = questions.filter(q => userAnswers[q.id] === q.correctAnswer).length;

  return (
    <div style={{
      marginTop: '2rem',
      background: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '1.5rem',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(10px)',
    }}>
      {/* Section Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.8rem',
        paddingBottom: '1.2rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        marginBottom: '1.5rem',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.4rem' }}>🎯</span>
            <h2 style={{
              margin: 0,
              fontSize: '1.25rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #f59e0b, #ec4899, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.01em',
            }}>
              JEE (Main & Advanced) Practice Questions
            </h2>
          </div>
          <p style={{ margin: '0.3rem 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
            Curated IIT-JEE questions directly derived from this reaction mechanism. Test your conceptual clarity!
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {totalAnswered > 0 && (
            <div style={{
              padding: '0.35rem 0.85rem',
              borderRadius: '999px',
              fontSize: '0.78rem',
              fontWeight: 700,
              background: correctCount === questions.length ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.2)',
              border: `1px solid ${correctCount === questions.length ? 'rgba(16, 185, 129, 0.4)' : 'rgba(99, 102, 241, 0.4)'}`,
              color: correctCount === questions.length ? '#34d399' : '#a5b4fc',
            }}>
              Score: {correctCount}/{questions.length} ({Math.round((correctCount / questions.length) * 100)}%)
            </div>
          )}

          {totalAnswered > 0 && (
            <button
              onClick={handleReset}
              style={{
                padding: '0.35rem 0.8rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#cbd5e1',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.12)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.05)'}
            >
              ↻ Reset
            </button>
          )}
        </div>
      </div>

      {/* Question Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {questions.map((q, qIndex) => {
          const userAnswer = userAnswers[q.id];
          const hasAnswered = !!userAnswer;
          const isCorrect = userAnswer === q.correctAnswer;
          const isExplanationOpen = showExplanations[q.id];

          return (
            <div
              key={q.id || qIndex}
              style={{
                background: 'rgba(15, 23, 42, 0.65)',
                borderRadius: '12px',
                border: hasAnswered
                  ? isCorrect
                    ? '1px solid rgba(52, 211, 153, 0.35)'
                    : '1px solid rgba(239, 68, 68, 0.35)'
                  : '1px solid rgba(255, 255, 255, 0.08)',
                padding: '1.25rem',
                transition: 'all 0.2s ease',
              }}
            >
              {/* Card Meta Badges */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{
                    padding: '0.15rem 0.55rem',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    background: q.examType === 'JEE Advanced' ? 'rgba(236, 72, 153, 0.2)' : 'rgba(14, 165, 233, 0.2)',
                    border: `1px solid ${q.examType === 'JEE Advanced' ? 'rgba(236, 72, 153, 0.4)' : 'rgba(14, 165, 233, 0.4)'}`,
                    color: q.examType === 'JEE Advanced' ? '#f472b6' : '#38bdf8',
                    letterSpacing: '0.04em',
                  }}>
                    {q.examType || 'JEE Question'}
                  </span>

                  {q.examCitation && (
                    <span style={{
                      padding: '0.15rem 0.55rem',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      background: 'rgba(245, 158, 11, 0.18)',
                      border: '1px solid rgba(245, 158, 11, 0.4)',
                      color: '#fcd34d',
                      letterSpacing: '0.02em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}>
                      <span>🏛️</span>
                      {q.examCitation}
                    </span>
                  )}

                  {q.topic && (
                    <span style={{
                      padding: '0.15rem 0.55rem',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      background: 'rgba(99, 102, 241, 0.15)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      color: '#c7d2fe',
                    }}>
                      {q.topic}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {q.difficulty && (
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: q.difficulty === 'Advanced' ? '#f87171' : q.difficulty === 'Challenging' ? '#fbbf24' : '#34d399',
                    }}>
                      ● {q.difficulty}
                    </span>
                  )}
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    Q{qIndex + 1} of {questions.length}
                  </span>
                </div>
              </div>

              {/* Question Statement */}
              <div style={{
                fontSize: '0.92rem',
                fontWeight: 600,
                color: '#f1f5f9',
                lineHeight: 1.55,
                marginBottom: '1rem',
              }}>
                {q.question}
              </div>

              {/* Options Grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                {(q.options || []).map(opt => {
                  const isThisSelected = userAnswer === opt.key;
                  const isThisCorrect = opt.key === q.correctAnswer;

                  let optBg = 'rgba(255, 255, 255, 0.03)';
                  let optBorder = 'rgba(255, 255, 255, 0.08)';
                  let optColor = '#cbd5e1';

                  if (hasAnswered) {
                    if (isThisCorrect) {
                      optBg = 'rgba(52, 211, 153, 0.15)';
                      optBorder = 'rgba(52, 211, 153, 0.5)';
                      optColor = '#a7f3d0';
                    } else if (isThisSelected && !isCorrect) {
                      optBg = 'rgba(239, 68, 68, 0.15)';
                      optBorder = 'rgba(239, 68, 68, 0.5)';
                      optColor = '#fca5a5';
                    }
                  }

                  return (
                    <button
                      key={opt.key}
                      onClick={() => handleSelectOption(q.id, opt.key)}
                      disabled={hasAnswered}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        background: optBg,
                        border: `1px solid ${optBorder}`,
                        color: optColor,
                        textAlign: 'left',
                        cursor: hasAnswered ? 'default' : 'pointer',
                        fontSize: '0.85rem',
                        fontFamily: 'inherit',
                        lineHeight: 1.45,
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!hasAnswered) {
                          e.currentTarget.style.background = 'rgba(99, 102, 241, 0.12)';
                          e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.35)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!hasAnswered) {
                          e.currentTarget.style.background = optBg;
                          e.currentTarget.style.borderColor = optBorder;
                        }
                      }}
                    >
                      <span style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: hasAnswered && isThisCorrect
                          ? '#10b981'
                          : hasAnswered && isThisSelected
                            ? '#ef4444'
                            : 'rgba(255, 255, 255, 0.1)',
                        color: '#fff',
                      }}>
                        {hasAnswered && isThisCorrect ? '✓' : hasAnswered && isThisSelected ? '✕' : opt.key}
                      </span>
                      <span style={{ flex: 1 }}>{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Status & Explanation Reveal */}
              {hasAnswered && (
                <div style={{ marginTop: '0.85rem' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.9rem' }}>{isCorrect ? '🎉' : '❌'}</span>
                      <span style={{
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        color: isCorrect ? '#34d399' : '#f87171',
                      }}>
                        {isCorrect ? 'Correct Answer!' : `Incorrect — Option (${q.correctAnswer}) is correct.`}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleExplanation(q.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#93c5fd',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: '0.2rem 0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                      }}
                    >
                      {isExplanationOpen ? 'Hide Solution ▲' : 'View JEE Solution ▼'}
                    </button>
                  </div>

                  {isExplanationOpen && (
                    <div style={{
                      marginTop: '0.75rem',
                      padding: '1rem',
                      borderRadius: '8px',
                      background: 'rgba(30, 41, 59, 0.5)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      fontSize: '0.82rem',
                      color: '#cbd5e1',
                      lineHeight: 1.5,
                    }}>
                      {q.conceptTested && (
                        <div style={{ marginBottom: '0.5rem' }}>
                          <span style={{ fontWeight: 700, color: '#f59e0b' }}>Key Concept: </span>
                          <span style={{ color: '#fed7aa' }}>{q.conceptTested}</span>
                        </div>
                      )}
                      <div>
                        <span style={{ fontWeight: 700, color: '#38bdf8' }}>Mechanism & Solution: </span>
                        <span>{q.explanation}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
