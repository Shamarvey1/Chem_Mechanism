import { useState } from 'react';
export default function JeeQuestionsSection({ questions, reactionInput }) {
  const [userAnswers, setUserAnswers] = useState({});
  const [showExplanations, setShowExplanations] = useState({});
  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    return null;
  }
  const handleSelectOption = (questionId, optionKey) => {
    if (userAnswers[questionId]) return;
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionKey,
    }));
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
  const totalAnswered = Object.keys(userAnswers).length;
  const correctCount = questions.filter(q => userAnswers[q.id] === q.correctAnswer).length;
  return (
    <div style={{
      marginTop: '2rem',
      background: '#ffffff',
      borderRadius: '16px',
      border: '1px solid #d1fae5',
      padding: '1.5rem',
      boxShadow: '0 8px 30px rgba(5, 96, 70, 0.05)',
    }}>
      {}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.8rem',
        paddingBottom: '1.2rem',
        borderBottom: '1px solid #f1f5f9',
        marginBottom: '1.5rem',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.4rem' }}>🎯</span>
            <h2 style={{
              margin: 0,
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#064e3b',
              letterSpacing: '-0.015em',
            }}>
              IIT-JEE Practice & Conceptual Questions
            </h2>
          </div>
          <p style={{ margin: '0.35rem 0 0', fontSize: '0.84rem', color: '#64748b' }}>
            Curated questions directly testing this reaction's mechanism, transition states, and reaction conditions.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {totalAnswered > 0 && (
            <div style={{
              padding: '0.4rem 0.95rem',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: 800,
              background: correctCount === questions.length ? '#dcfce7' : '#ecfdf5',
              border: `1px solid ${correctCount === questions.length ? '#86efac' : '#a7f3d0'}`,
              color: correctCount === questions.length ? '#15803d' : '#047857',
            }}>
              Score: {correctCount}/{questions.length} ({Math.round((correctCount / questions.length) * 100)}%)
            </div>
          )}
          {totalAnswered > 0 && (
            <button
              onClick={handleReset}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                color: '#475569',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => { e.target.style.background = '#f1f5f9'; e.target.style.color = '#0f172a'; }}
              onMouseLeave={(e) => { e.target.style.background = '#f8fafc'; e.target.style.color = '#475569'; }}
            >
              ↻ Reset Quiz
            </button>
          )}
        </div>
      </div>
      {}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
        {questions.map((q, qIndex) => {
          const userAnswer = userAnswers[q.id];
          const hasAnswered = !!userAnswer;
          const isCorrect = userAnswer === q.correctAnswer;
          const isExplanationOpen = showExplanations[q.id];
          return (
            <div
              key={q.id || qIndex}
              style={{
                background: '#ffffff',
                borderRadius: '14px',
                border: hasAnswered
                  ? isCorrect
                    ? '1.5px solid #10b981'
                    : '1.5px solid #ef4444'
                  : '1px solid #e2e8f0',
                padding: '1.3rem',
                boxShadow: hasAnswered && isCorrect
                  ? '0 4px 16px rgba(16, 185, 129, 0.08)'
                  : '0 2px 8px rgba(0, 0, 0, 0.02)',
                transition: 'all 0.2s ease',
              }}
            >
              {}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    background: q.examType === 'JEE Advanced' ? '#fdf2f8' : '#f0fdf4',
                    border: `1px solid ${q.examType === 'JEE Advanced' ? '#fbcfe8' : '#bbf7d0'}`,
                    color: q.examType === 'JEE Advanced' ? '#db2777' : '#047857',
                    letterSpacing: '0.03em',
                  }}>
                    {q.examType || 'JEE Question'}
                  </span>
                  {q.examCitation && (
                    <span style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      background: '#fffbeb',
                      border: '1px solid #fde68a',
                      color: '#b45309',
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
                      padding: '0.2rem 0.6rem',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      background: '#ecfdf5',
                      border: '1px solid #a7f3d0',
                      color: '#065f46',
                    }}>
                      {q.topic}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {q.difficulty && (
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: q.difficulty === 'Advanced' ? '#dc2626' : q.difficulty === 'Challenging' ? '#d97706' : '#059669',
                    }}>
                      ● {q.difficulty}
                    </span>
                  )}
                  <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 600 }}>
                    Q{qIndex + 1} of {questions.length}
                  </span>
                </div>
              </div>
              {}
              <div style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: '#0f172a',
                lineHeight: 1.55,
                marginBottom: '1rem',
              }}>
                {q.question}
              </div>
              {}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                {(q.options || []).map(opt => {
                  const isThisSelected = userAnswer === opt.key;
                  const isThisCorrect = opt.key === q.correctAnswer;
                  let optBg = '#f8fafc';
                  let optBorder = '#e2e8f0';
                  let optColor = '#1e293b';
                  if (hasAnswered) {
                    if (isThisCorrect) {
                      optBg = '#dcfce7';
                      optBorder = '#10b981';
                      optColor = '#064e3b';
                    } else if (isThisSelected && !isCorrect) {
                      optBg = '#fee2e2';
                      optBorder = '#ef4444';
                      optColor = '#991b1b';
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
                        gap: '0.85rem',
                        padding: '0.85rem 1.1rem',
                        borderRadius: '10px',
                        background: optBg,
                        border: `1px solid ${optBorder}`,
                        color: optColor,
                        textAlign: 'left',
                        cursor: hasAnswered ? 'default' : 'pointer',
                        fontSize: '0.88rem',
                        fontFamily: 'inherit',
                        lineHeight: 1.45,
                        fontWeight: hasAnswered && (isThisCorrect || isThisSelected) ? 700 : 500,
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!hasAnswered) {
                          e.currentTarget.style.background = '#ecfdf5';
                          e.currentTarget.style.borderColor = '#10b981';
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
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        background: hasAnswered && isThisCorrect
                          ? '#10b981'
                          : hasAnswered && isThisSelected
                            ? '#ef4444'
                            : '#e2e8f0',
                        color: hasAnswered && (isThisCorrect || isThisSelected) ? '#ffffff' : '#334155',
                      }}>
                        {hasAnswered && isThisCorrect ? '✓' : hasAnswered && isThisSelected ? '✕' : opt.key}
                      </span>
                      <span style={{ flex: 1 }}>{opt.text}</span>
                    </button>
                  );
                })}
              </div>
              {}
              {hasAnswered && (
                <div style={{ marginTop: '0.95rem' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '1rem' }}>{isCorrect ? '🎉' : '❌'}</span>
                      <span style={{
                        fontSize: '0.85rem',
                        fontWeight: 800,
                        color: isCorrect ? '#047857' : '#dc2626',
                      }}>
                        {isCorrect ? 'Correct Answer!' : `Incorrect — Option (${q.correctAnswer}) is correct.`}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleExplanation(q.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#059669',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        padding: '0.2rem 0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                      }}
                    >
                      {isExplanationOpen ? 'Hide Solution ▲' : 'View JEE Mechanism Solution ▼'}
                    </button>
                  </div>
                  {isExplanationOpen && (
                    <div style={{
                      marginTop: '0.85rem',
                      padding: '1.1rem',
                      borderRadius: '10px',
                      background: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      fontSize: '0.84rem',
                      color: '#14532d',
                      lineHeight: 1.55,
                    }}>
                      {q.conceptTested && (
                        <div style={{ marginBottom: '0.55rem' }}>
                          <span style={{ fontWeight: 800, color: '#065f46' }}>Key Concept Tested: </span>
                          <span style={{ color: '#166534', fontWeight: 600 }}>{q.conceptTested}</span>
                        </div>
                      )}
                      <div>
                        <span style={{ fontWeight: 800, color: '#047857' }}>Mechanism & Chemistry Solution: </span>
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
