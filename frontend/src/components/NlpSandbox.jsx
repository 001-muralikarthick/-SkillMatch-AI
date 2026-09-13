import React, { useState } from 'react';
import { Cpu, Play, Layers, Code, Award, Lightbulb, Activity } from 'lucide-react';

export default function NlpSandbox({ apiBase }) {
  const [resumeText, setResumeText] = useState(`Java
Python
JavaScript
React
HTML
CSS
MongoDB
Git`);
  const [jdText, setJdText] = useState(`Frontend Developer

Required:
React
JavaScript
HTML
CSS
Git
REST API`);

  const [sandboxData, setSandboxData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeLevel, setActiveLevel] = useState('all');

  const handleRunSandbox = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/sandbox-nlp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume_text: resumeText, jd_text: jdText })
      });
      const data = await res.json();
      if (data.sandbox_results) {
        setSandboxData(data.sandbox_results);
      }
    } catch (err) {
      console.error("Sandbox NLP error:", err);
    } finally {
      setLoading(false);
    }
  };

  const levelDetails = sandboxData?.level_details || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h1 style={{ fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Cpu color="#818cf8" size={24} />
          Interactive NLP & Machine Learning Sandbox
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0, marginTop: '4px' }}>
          Test custom resume and job description text to inspect Level 1 to Level 5 NLP pipelines step-by-step.
        </p>
      </div>

      {/* Input Form */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              CANDIDATE RESUME TEXT
            </label>
            <textarea
              rows={7}
              value={resumeText}
              onChange={e => setResumeText(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border-glass)',
                color: '#fff',
                padding: '12px',
                borderRadius: '10px',
                fontFamily: 'monospace',
                fontSize: '0.85rem'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              JOB DESCRIPTION TEXT
            </label>
            <textarea
              rows={7}
              value={jdText}
              onChange={e => setJdText(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border-glass)',
                color: '#fff',
                padding: '12px',
                borderRadius: '10px',
                fontFamily: 'monospace',
                fontSize: '0.85rem'
              }}
            />
          </div>
        </div>

        <button className="btn-primary" onClick={handleRunSandbox} disabled={loading} style={{ width: '100%', marginTop: '20px', padding: '12px' }}>
          <Play size={18} /> {loading ? 'Executing NLP Pipeline...' : 'Run 5-Level NLP Analysis'}
        </button>
      </div>

      {/* Results View */}
      {sandboxData && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          {/* Level Filter Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
            {[
              { id: 'all', label: 'Overview & Score Summary' },
              { id: 'level1', label: 'Level 1: TF-IDF' },
              { id: 'level2', label: 'Level 2: Skill Extractor' },
              { id: 'level3', label: 'Level 3: ML Model' },
              { id: 'level4', label: 'Level 4: Sentence Embeddings' },
              { id: 'level5', label: 'Level 5: Explainable AI' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveLevel(tab.id)}
                className="btn-secondary"
                style={{
                  background: activeLevel === tab.id ? 'rgba(99,102,241,0.2)' : 'transparent',
                  borderColor: activeLevel === tab.id ? '#6366f1' : 'var(--border-glass)',
                  color: activeLevel === tab.id ? '#818cf8' : 'var(--text-muted)',
                  fontSize: '0.85rem'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          {(activeLevel === 'all' || activeLevel === 'level5') && (
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '14px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>Level 5 — Overall Explainable AI Match</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: sandboxData.overall_match_pct >= 75 ? '#34d399' : '#f87171' }}>
                {sandboxData.overall_match_pct}%
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                <span className="pill pill-matched">Skills: {sandboxData.match_breakdown.skills_match_pct}%</span>
                <span className="pill pill-related">Semantic: {sandboxData.match_breakdown.semantic_similarity_pct}%</span>
                <span className="pill pill-neutral">Experience: {sandboxData.match_breakdown.experience_match_pct}%</span>
                <span className="pill pill-neutral">Education: {sandboxData.match_breakdown.education_match_pct}%</span>
              </div>
            </div>
          )}

          {(activeLevel === 'all' || activeLevel === 'level1') && (
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '14px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1rem', color: '#38bdf8', marginBottom: '8px' }}>Level 1 — Basic NLP (TF-IDF & Cosine Similarity)</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                TF-IDF Similarity Score: <strong>{levelDetails.level1_tfidf?.match_score_pct}%</strong> (Cosine Similarity: {levelDetails.level1_tfidf?.cosine_similarity})
              </p>
              <div style={{ marginTop: '8px', fontSize: '0.8rem' }}>
                Top Shared Terms: {(levelDetails.level1_tfidf?.top_shared_terms || []).join(', ') || 'None'}
              </div>
            </div>
          )}

          {(activeLevel === 'all' || activeLevel === 'level2') && (
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '14px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1rem', color: '#34d399', marginBottom: '8px' }}>Level 2 — Skill Extraction & Taxonomy Engine</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '12px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#34d399' }}>MATCHED SKILLS:</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                    {(sandboxData.strong_matches || []).map((s, i) => (
                      <span key={i} className="pill pill-matched">✓ {s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#f87171' }}>MISSING SKILLS:</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                    {(sandboxData.missing_skills || []).map((s, i) => (
                      <span key={i} className="pill pill-missing">✗ {s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {(activeLevel === 'all' || activeLevel === 'level3') && (
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '14px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1rem', color: '#f59e0b', marginBottom: '8px' }}>Level 3 — Machine Learning Suitability Model</h3>
              <p style={{ fontSize: '0.85rem' }}>
                ML Prediction: <strong>{levelDetails.level3_ml?.prediction}</strong> ({levelDetails.level3_ml?.suitability_probability_pct}% Probability)
              </p>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Random Forest Prob: {levelDetails.level3_ml?.random_forest_prob_pct}% • Logistic Regression Prob: {levelDetails.level3_ml?.logistic_regression_prob_pct}%
              </div>
            </div>
          )}

          {(activeLevel === 'all' || activeLevel === 'level4') && (
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '14px' }}>
              <h3 style={{ fontSize: '1rem', color: '#ec4899', marginBottom: '8px' }}>Level 4 — Sentence Embeddings & Semantic Search</h3>
              <p style={{ fontSize: '0.85rem' }}>
                Semantic Similarity Score: <strong>{levelDetails.level4_semantic?.match_score_pct}%</strong>
              </p>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Model: {levelDetails.level4_semantic?.method} (Vector Dim: {levelDetails.level4_semantic?.embedding_dim})
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
