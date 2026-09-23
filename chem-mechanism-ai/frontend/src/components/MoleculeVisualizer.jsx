import React from 'react';

function MoleculeVisualizer({ reactionData, currentStep = 0 }) {
  const reactionType = reactionData?.reaction?.type;
  const reactant1Name = reactionData?.reactants?.[0]?.name || 'methyl bromide';
  const reactant2Name = reactionData?.reactants?.[1]?.name || 'hydroxide ion';
  const steps = reactionData?.steps || [];
  const currentStepData = steps[currentStep] || steps[0];

  const formatAction = (action) => {
    if (!action) return 'Nucleophile Attack';
    return action
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const stepNumber = currentStepData?.step || currentStep + 1;
  const stepActionText = formatAction(currentStepData?.action);
  const stepExplanation = currentStepData?.explanation;

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      padding: '1.75rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      marginTop: '1.5rem',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '0.5rem'
      }}>
        <h2 style={{
          fontSize: '1.35rem',
          fontWeight: 700,
          color: '#0f172a',
          margin: 0
        }}>
          Reaction Mechanism
        </h2>
        {reactionType && (
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            padding: '0.2rem 0.6rem',
            backgroundColor: '#dbeafe',
            color: '#1d4ed8',
            borderRadius: '999px'
          }}>
            {reactionType}
          </span>
        )}
      </div>

      <h3 style={{
        fontSize: '1rem',
        fontWeight: 600,
        color: '#2563eb',
        marginBottom: stepExplanation ? '0.35rem' : '1.25rem'
      }}>
        Step {stepNumber}: {stepActionText}
      </h3>

      {stepExplanation && (
        <p style={{
          fontSize: '0.92rem',
          color: '#475569',
          marginBottom: '1.25rem',
          lineHeight: 1.5
        }}>
          {stepExplanation}
        </p>
      )}

      <div style={{
        width: '100%',
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem'
      }}>
        <svg
          viewBox="0 0 460 320"
          style={{ width: '100%', maxWidth: '460px', height: 'auto', overflow: 'visible' }}
        >
          <line x1="200" y1="105" x2="200" y2="55" stroke="#94a3b8" strokeWidth="2.5" />
          <line x1="200" y1="105" x2="140" y2="105" stroke="#94a3b8" strokeWidth="2.5" />
          <line x1="200" y1="105" x2="200" y2="155" stroke="#94a3b8" strokeWidth="2.5" />
          <line x1="200" y1="105" x2="275" y2="105" stroke="#94a3b8" strokeWidth="2.5" />

          <g transform="translate(200, 45)">
            <circle r="14" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
            <text textAnchor="middle" dy="4" fill="#475569" fontSize="12" fontWeight="600">H</text>
          </g>

          <g transform="translate(130, 105)">
            <circle r="14" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
            <text textAnchor="middle" dy="4" fill="#475569" fontSize="12" fontWeight="600">H</text>
          </g>

          <g transform="translate(200, 165)">
            <circle r="14" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
            <text textAnchor="middle" dy="4" fill="#475569" fontSize="12" fontWeight="600">H</text>
          </g>

          <g transform="translate(200, 105)">
            <circle r="18" fill="#f1f5f9" stroke="#64748b" strokeWidth="2" />
            <text textAnchor="middle" dy="5" fill="#0f172a" fontSize="14" fontWeight="700">C</text>
            <text x="14" y="-10" fill="#64748b" fontSize="10" fontWeight="600">C1</text>
          </g>

          <g transform="translate(285, 105)">
            <circle r="18" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
            <text textAnchor="middle" dy="5" fill="#92400e" fontSize="14" fontWeight="700">Br</text>
            <text x="14" y="-10" fill="#d97706" fontSize="10" fontWeight="600">Br1</text>
          </g>

          <text x="330" y="110" fill="#64748b" fontSize="12" fontWeight="500">
            ({reactant1Name})
          </text>

          <text x="200" y="215" textAnchor="middle" fill="#94a3b8" fontSize="26" fontWeight="400">
            +
          </text>

          <line x1="200" y1="265" x2="260" y2="265" stroke="#94a3b8" strokeWidth="2.5" />

          <g transform="translate(190, 265)">
            <circle r="18" fill="#fee2e2" stroke="#ef4444" strokeWidth="2" />
            <text textAnchor="middle" dy="5" fill="#b91c1c" fontSize="14" fontWeight="700">O</text>
            <text x="14" y="-10" fill="#ef4444" fontSize="10" fontWeight="600">O1</text>

            <circle cx="12" cy="-12" r="7" fill="#ef4444" />
            <text x="12" y="-9" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="700">−</text>
          </g>

          <g transform="translate(270, 265)">
            <circle r="14" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
            <text textAnchor="middle" dy="4" fill="#475569" fontSize="12" fontWeight="600">H</text>
          </g>

          <text x="315" y="270" fill="#64748b" fontSize="12" fontWeight="500">
            ({reactant2Name})
          </text>
        </svg>
      </div>
    </div>
  );
}

export default MoleculeVisualizer;
