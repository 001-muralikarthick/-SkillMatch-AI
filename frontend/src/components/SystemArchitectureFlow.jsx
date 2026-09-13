import React from 'react';
import { Upload, FileText, Settings, Cpu, Award, CheckCircle, XCircle, AlertTriangle, Sparkles, Database, Layers, ArrowRight, UserCheck, Briefcase } from 'lucide-react';

export default function SystemArchitectureFlow() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h1 style={{ fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Layers color="#6366f1" size={24} />
          End-to-End System Architecture & Execution Flow
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0, marginTop: '4px' }}>
          Visual representation of the 12-stage recruitment intelligence pipeline from document extraction to Explainable AI & Job Recommendation.
        </p>
      </div>

      {/* Pipeline Diagram Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Step 1: Input & Extraction */}
        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #6366f1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span style={{ background: '#6366f1', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700 }}>
              STAGE 1 & 2
            </span>
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Document Upload & Text Extraction</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: '#818cf8' }}>
                <Upload size={16} /> Candidate Resumes (PDF / DOCX)
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', margin: 0 }}>
                PyPDF & python-docx stream parsing into normalized raw text strings.
              </p>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: '#06b6d4' }}>
                <FileText size={16} /> Job Description Requirements
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', margin: 0 }}>
                Extracts required skills, experience thresholds, and domain expectations.
              </p>
            </div>
          </div>
        </div>

        {/* Step 2: Preprocessing & Triad Feature Extraction */}
        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #06b6d4' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span style={{ background: '#06b6d4', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700 }}>
              STAGE 3 - 6
            </span>
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Text Preprocessing & Feature Extraction Triad</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700 }}>LEVEL 1 NLP</span>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', marginTop: '2px' }}>TF-IDF & Cosine Similarity</div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                N-gram term frequency vectorizer & vector dot-product matrix.
              </p>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700 }}>LEVEL 2 NLP</span>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', marginTop: '2px' }}>Skill Extraction & Taxonomy</div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                7-domain taxonomy database & alias resolution (`React.js` → `React`).
              </p>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.75rem', color: '#ec4899', fontWeight: 700 }}>LEVEL 4 NLP</span>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', marginTop: '2px' }}>Sentence Embeddings</div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Transformer embeddings (`all-MiniLM-L6-v2`) for contextual intent.
              </p>
            </div>
          </div>
        </div>

        {/* Step 3: Match Score & ML Suitability */}
        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span style={{ background: '#10b981', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700 }}>
              STAGE 7 - 9
            </span>
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>5-Dimensional Scoring & ML Classification</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: '10px' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399' }}>86%</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>OVERALL MATCH SCORE</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                Weighted combination of Skills (35%), Semantic (25%), Exp (20%), Edu (10%), Projects (10%).
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: '10px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f59e0b' }}>ML Suitability Model</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#34d399', marginTop: '4px' }}>
                "Suitable" (78.3% Probability)
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                Scikit-learn ensemble model evaluating feature vectors.
              </div>
            </div>
          </div>
        </div>

        {/* Step 4: AI Dashboard & Explainable AI & Job Recommender */}
        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span style={{ background: '#f59e0b', color: '#000', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700 }}>
              STAGE 10 - 12
            </span>
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>AI Recruiter Dashboard, Explainable AI & Job Matcher</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: '10px' }}>
              <div style={{ fontWeight: 600, color: '#818cf8', fontSize: '0.9rem' }}>Candidate Ranking Table</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                #1 Candidate A → 94% ⭐<br />
                #2 Candidate B → 89%<br />
                #3 Candidate C → 84%<br />
                #4 Candidate D → 77%
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: '10px' }}>
              <div style={{ fontWeight: 600, color: '#34d399', fontSize: '0.9rem' }}>Explainable AI (Why this score?)</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                ✓ React, ✓ JavaScript, ✓ SQL<br />
                ✗ AWS, ✗ Docker<br />
                → Actionable learning recommendations
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: '10px' }}>
              <div style={{ fontWeight: 600, color: '#06b6d4', fontSize: '0.9rem' }}>Job Recommendation Engine</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                1. Frontend Dev → 92%<br />
                2. React Dev → 89%<br />
                3. Full Stack → 84%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
