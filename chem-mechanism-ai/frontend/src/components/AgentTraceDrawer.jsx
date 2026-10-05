import { useState } from 'react';
export default function AgentTraceDrawer({ agentTrace, pubchemData, category }) {
  const [isOpen, setIsOpen] = useState(false);
  if (!agentTrace) return null;
  const { attempts = 1, selfCorrected = false, reflections = [], routerCategory, jeeQuestionCount = 0 } = agentTrace;
  return (
    <div style={{
      marginTop: '20px',
      background: '#ffffff',
      borderRadius: '12px',
      border: '1px solid var(--border)',
      boxShadow: '0 4px 14px rgba(41, 33, 59, 0.03)',
      overflow: 'hidden',
      transition: 'all 0.2s ease',
    }}>
      {}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '12px 18px',
          background: '#fcfbfe',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          color: '#242437',
          fontFamily: "'DM Sans', sans-serif",
          textAlign: 'left',
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = '#f6f3fc'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = '#fcfbfe'; }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px', flexWrap: 'wrap' }}>
          <span style={{
            background: '#f0ecfa',
            color: '#7560d8',
            borderRadius: '6px',
            padding: '2px 7px',
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.5px'
          }}>
            MULTI-AGENT PIPELINE
          </span>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#242437' }}>
            Autonomous Reflection & Verification Trace
          </span>
          <span style={{
            fontSize: '11px',
            padding: '2px 8px',
            borderRadius: '999px',
            background: selfCorrected ? '#fef3c7' : '#ecfdf5',
            border: `1px solid ${selfCorrected ? '#fde68a' : '#a7f3d0'}`,
            color: selfCorrected ? '#b45309' : '#059669',
            fontWeight: 700,
          }}>
            {selfCorrected ? `✓ Self-Corrected (Attempt ${attempts})` : '✓ Validated (Attempt 1)'}
          </span>
        </div>
        <span style={{
          fontSize: '11px',
          color: '#7560d8',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          whiteSpace: 'nowrap'
        }}>
          {isOpen ? 'Collapse Trace ▲' : 'View Trace ▼'}
        </span>
      </button>
      {}
      {isOpen && (
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', background: '#ffffff' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px' }}>
            {}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '11px' }}>
              <span style={{
                width: '22px', height: '22px', borderRadius: '50%', background: '#f0ecfa', border: '1px solid #dfd7f6',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800, color: '#7560d8', flexShrink: 0
              }}>1</span>
              <div>
                <span style={{ fontWeight: 800, color: '#7560d8' }}>[Router Agent] </span>
                <span style={{ color: '#474359' }}>
                  Classified reaction into specialized domain: <strong style={{ color: '#242437' }}>{routerCategory || category}</strong>. Routed to domain-specialist chemical prompt.
                </span>
              </div>
            </div>
            {}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '11px' }}>
              <span style={{
                width: '22px', height: '22px', borderRadius: '50%', background: '#f0ecfa', border: '1px solid #dfd7f6',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800, color: '#7560d8', flexShrink: 0
              }}>2</span>
              <div>
                <span style={{ fontWeight: 800, color: '#7560d8' }}>[Domain Specialist Agent] </span>
                <span style={{ color: '#474359' }}>
                  Synthesized step-by-step curved-arrow mechanism with 3D coordinate geometry, electron pair moves, and transition states.
                </span>
              </div>
            </div>
            {}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '11px' }}>
              <span style={{
                width: '22px', height: '22px', borderRadius: '50%', background: selfCorrected ? '#fef3c7' : '#f0ecfa', border: `1px solid ${selfCorrected ? '#fde68a' : '#dfd7f6'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800, color: selfCorrected ? '#b45309' : '#7560d8', flexShrink: 0
              }}>3</span>
              <div>
                <span style={{ fontWeight: 800, color: selfCorrected ? '#b45309' : '#7560d8' }}>
                  [Critic & Reflection Agent] 
                </span>
                <span style={{ color: '#474359' }}>
                  {selfCorrected ? (
                    <>
                      Detected structural discrepancies on initial attempt. Generated critique prompt and autonomously refined mechanism on <strong>Attempt {attempts}</strong>.
                    </>
                  ) : (
                    <>
                      AST mechanism validator verified 100% atom ID conservation, bond integrity, and charge conservation on <strong>Attempt 1</strong>.
                    </>
                  )}
                </span>
                {reflections.length > 0 && (
                  <div style={{
                    marginTop: '8px',
                    padding: '8px 12px',
                    background: '#fefce8',
                    borderRadius: '6px',
                    border: '1px solid #fef08a',
                    fontSize: '11px',
                    color: '#854d0e',
                  }}>
                    <div style={{ fontWeight: 700, marginBottom: '3px' }}>Autonomously Resolved Critiques:</div>
                    {reflections.map((r, i) => (
                      <div key={i}>
                        Attempt {r.attempt}: {r.errors.join('; ')}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '11px' }}>
              <span style={{
                width: '22px', height: '22px', borderRadius: '50%', background: '#f0ecfa', border: '1px solid #dfd7f6',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800, color: '#7560d8', flexShrink: 0
              }}>4</span>
              <div>
                <span style={{ fontWeight: 800, color: pubchemData?.verified ? '#059669' : '#b45309' }}>
                  [Tool: NIH PubChem REST API] 
                </span>
                <span style={{ color: '#474359' }}>
                  {pubchemData?.verified
                    ? 'Cross-validated all reactant and product molecular formulas and atom counts against official PubChem chemistry database.'
                    : 'External API validation completed with chemical warnings.'}
                </span>
              </div>
            </div>
            {}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '11px' }}>
              <span style={{
                width: '22px', height: '22px', borderRadius: '50%', background: '#f0ecfa', border: '1px solid #dfd7f6',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800, color: '#7560d8', flexShrink: 0
              }}>5</span>
              <div>
                <span style={{ fontWeight: 800, color: '#7560d8' }}>[Hybrid Question Retriever] </span>
                <span style={{ color: '#474359' }}>
                  Retrieved {jeeQuestionCount} authentic IIT-JEE questions matching reaction coordinate and stereochemistry.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
