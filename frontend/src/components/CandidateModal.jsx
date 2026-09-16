import React, { useState, useEffect } from 'react';
import { 
  X, Check, AlertTriangle, Lightbulb, ChevronDown, ChevronUp, 
  Layers, Award, BookOpen, User, Briefcase, GraduationCap, 
  Sparkles, Printer, Bot, HelpCircle, FileText, Copy, Key, 
  Cpu, Zap, ShieldAlert 
} from 'lucide-react';

export default function CandidateModal({ candidate, onClose, apiBase = 'http://localhost:8000' }) {
  const [activeModalTab, setActiveModalTab] = useState('overview'); // 'overview', 'copilot', 'raw'
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [activeSkillTab, setActiveSkillTab] = useState('all');
  const [copilotLoading, setCopilotLoading] = useState(false);
  const [copilotData, setCopilotData] = useState(null);
  
  // LLM Provider state
  const [selectedProvider, setSelectedProvider] = useState('auto');
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [copiedQuestionIdx, setCopiedQuestionIdx] = useState(null);

  if (!candidate) return null;

  const score = candidate.overall_match_pct || 0;
  const breakdown = candidate.match_breakdown || {};
  const suitability = candidate.suitability || {};
  const strongMatches = candidate.strong_matches || [];
  const missingSkills = candidate.missing_skills || [];
  const relatedSkills = candidate.related_skills || [];
  const learningRecs = candidate.recommended_learning || [];
  const expMeta = candidate.experience_meta || {};
  const eduMeta = candidate.education_meta || {};

  const fetchCopilotInsights = (providerOverride = null) => {
    setCopilotLoading(true);
    const providerToUse = providerOverride || selectedProvider;
    fetch(`${apiBase}/api/ai-interview-questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        job_title: candidate.headline || 'Software Engineer',
        matching_skills: strongMatches,
        missing_skills: missingSkills,
        experience_years: expMeta.candidate_years || 0,
        match_score: score,
        provider: providerToUse,
        api_key: apiKey || undefined,
        resume_text: candidate.resume_snippet || candidate.full_analysis?.raw_resume_text || ""
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.copilot) setCopilotData(data.copilot);
      })
      .catch(err => console.error("Failed to load AI Copilot:", err))
      .finally(() => setCopilotLoading(false));
  };

  // Fetch AI Co-Pilot insights when tab changes
  useEffect(() => {
    if (activeModalTab === 'copilot' && !copilotData && !copilotLoading) {
      fetchCopilotInsights();
    }
  }, [activeModalTab, candidate]);

  const handleProviderChange = (e) => {
    const newProvider = e.target.value;
    setSelectedProvider(newProvider);
    fetchCopilotInsights(newProvider);
  };

  const handleCopyQuestion = (questionText, idx) => {
    navigator.clipboard.writeText(questionText);
    setCopiedQuestionIdx(idx);
    setTimeout(() => setCopiedQuestionIdx(null), 2000);
  };

  const getScoreColor = (val) => {
    if (val >= 80) return '#10b981';
    if (val >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const circleCircumference = 282.7;
  const strokeOffset = circleCircumference - (score / 100) * circleCircumference;

  const handlePrintScorecard = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="glass-panel printable-scorecard" 
        onClick={(e) => e.stopPropagation()} 
        style={{
          maxWidth: '920px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: '32px',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: 'rgba(15, 20, 32, 0.95)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)'
              }}>
                <User size={28} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.65rem', margin: 0, fontWeight: 800 }}>{candidate.name}</h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                  {candidate.headline} • <span style={{ color: 'var(--primary-light)' }}>{candidate.email}</span>
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="no-print">
            <button
              onClick={handlePrintScorecard}
              title="Print / Save as PDF Scorecard"
              style={{
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.4)',
                color: '#818cf8',
                borderRadius: '12px',
                padding: '8px 16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 600,
                fontSize: '0.85rem'
              }}
            >
              <Printer size={16} /> Print / Save PDF
            </button>
            <button 
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--text-muted)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }} className="no-print">
          <button
            onClick={() => setActiveModalTab('overview')}
            style={{
              background: activeModalTab === 'overview' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              border: '1px solid',
              borderColor: activeModalTab === 'overview' ? '#6366f1' : 'transparent',
              color: activeModalTab === 'overview' ? '#ffffff' : 'var(--text-muted)',
              padding: '8px 18px',
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Award size={16} color="#6366f1" /> Evaluation Scorecard
          </button>

          <button
            onClick={() => setActiveModalTab('copilot')}
            style={{
              background: activeModalTab === 'copilot' ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
              border: '1px solid',
              borderColor: activeModalTab === 'copilot' ? '#06b6d4' : 'transparent',
              color: activeModalTab === 'copilot' ? '#ffffff' : 'var(--text-muted)',
              padding: '8px 18px',
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Bot size={16} color="#06b6d4" /> 🤖 AI Co-Pilot (LLM Insights)
          </button>

          <button
            onClick={() => setActiveModalTab('raw')}
            style={{
              background: activeModalTab === 'raw' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              border: '1px solid',
              borderColor: activeModalTab === 'raw' ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: activeModalTab === 'raw' ? '#ffffff' : 'var(--text-muted)',
              padding: '8px 18px',
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FileText size={16} /> Resume Text Preview
          </button>
        </div>

        {/* TAB 1: OVERVIEW SCORECARD */}
        {activeModalTab === 'overview' && (
          <>
            {/* Hero Score & KPI Overview Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '28px' }}>
              <div style={{ 
                background: 'rgba(7, 9, 14, 0.5)', 
                padding: '24px', 
                borderRadius: '20px', 
                border: '1px solid rgba(255,255,255,0.08)', 
                display: 'flex',
                alignItems: 'center',
                gap: '20px'
              }}>
                <div style={{ position: 'relative', width: '100px', height: '100px', flexShrink: 0 }}>
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" strokeWidth="8" className="circle-gauge-bg" fill="none" />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="45" 
                      strokeWidth="8" 
                      className="circle-gauge circle-gauge-fill" 
                      fill="none" 
                      stroke={getScoreColor(score)} 
                      style={{ strokeDashoffset: strokeOffset }}
                    />
                  </svg>
                  <div style={{ 
                    position: 'absolute', 
                    top: 0, left: 0, right: 0, bottom: 0, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.6rem', fontWeight: 800, color: getScoreColor(score)
                  }}>
                    {score}%
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>OVERALL MATCH</span>
                  <h3 style={{ fontSize: '1.25rem', margin: '4px 0 6px 0', fontWeight: 800 }}>
                    {suitability.status_label || (score >= 75 ? 'Highly Suitable' : 'Suitable')}
                  </h3>
                  <span className={`pill ${score >= 70 ? 'pill-matched' : 'pill-missing'}`}>
                    <Sparkles size={12} /> {suitability.suitability_probability_pct || score}% ML Fit Probability
                  </span>
                </div>
              </div>

              {/* Experience & Education KPI Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
                <div className="kpi-card">
                  <div className="kpi-icon-box" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
                    <Briefcase size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>EXPERIENCE MATCH</div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>
                      {expMeta.candidate_years || 0} Yrs Candidate vs {expMeta.required_years || 2} Yrs Required
                    </div>
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-icon-box" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#38bdf8' }}>
                    <GraduationCap size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>EDUCATION BACKGROUND</div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>
                      {(eduMeta.detected_degrees || []).join(', ')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 5-Dimensional Match Breakdown Progress Bars */}
            <div style={{ background: 'rgba(7, 9, 14, 0.4)', padding: '24px', borderRadius: '20px', marginBottom: '28px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Award size={20} color="#6366f1" /> 5-Dimensional Match Breakdown
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { label: 'Skills Coverage Match (35% weight)', value: breakdown.skills_match_pct || 0, color: '#10b981' },
                  { label: 'Semantic Embeddings Similarity (25% weight)', value: breakdown.semantic_similarity_pct || 0, color: '#06b6d4' },
                  { label: 'Experience Level Alignment (20% weight)', value: breakdown.experience_match_pct || 0, color: '#6366f1' },
                  { label: 'Education Profile Match (10% weight)', value: breakdown.education_match_pct || 0, color: '#a855f7' },
                  { label: 'Project Context Relevance (10% weight)', value: breakdown.project_relevance_pct || 0, color: '#f59e0b' },
                ].map((dim, idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{dim.label}</span>
                      <span style={{ fontWeight: 700, color: dim.color }}>{dim.value}%</span>
                    </div>
                    <div className="progress-container">
                      <div 
                        className="progress-bar" 
                        style={{ width: `${dim.value}%`, background: dim.color }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Extracted Section */}
            <div style={{ background: 'rgba(7, 9, 14, 0.4)', padding: '24px', borderRadius: '20px', marginBottom: '28px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.05rem', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <BookOpen size={20} color="#38bdf8" /> Skills Taxonomy & Gap Analysis
                </h3>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['all', 'matched', 'missing'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveSkillTab(tab)}
                      style={{
                        background: activeSkillTab === tab ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                        border: '1px solid',
                        borderColor: activeSkillTab === tab ? '#6366f1' : 'transparent',
                        color: activeSkillTab === tab ? '#ffffff' : 'var(--text-muted)',
                        padding: '4px 12px',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                        fontWeight: 600
                      }}
                    >
                      {tab} ({tab === 'all' ? strongMatches.length + missingSkills.length : tab === 'matched' ? strongMatches.length : missingSkills.length})
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {(activeSkillTab === 'all' || activeSkillTab === 'matched') && (
                  <div style={{ background: 'rgba(16, 185, 129, 0.04)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '18px', borderRadius: '16px' }}>
                    <h4 style={{ fontSize: '0.9rem', color: '#34d399', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Check size={16} /> Matched Core Skills ({strongMatches.length})
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {strongMatches.length > 0 ? (
                        strongMatches.map((skill, i) => <span key={i} className="pill pill-matched">✓ {skill}</span>)
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No direct skills matched</span>
                      )}
                    </div>
                  </div>
                )}

                {(activeSkillTab === 'all' || activeSkillTab === 'missing') && (
                  <div style={{ background: 'rgba(239, 68, 68, 0.04)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '18px', borderRadius: '16px' }}>
                    <h4 style={{ fontSize: '0.9rem', color: '#f87171', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <AlertTriangle size={16} /> Missing Skills ({missingSkills.length})
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {missingSkills.length > 0 ? (
                        missingSkills.map((skill, i) => <span key={i} className="pill pill-missing">✗ {skill}</span>)
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: '#34d399' }}>✓ All required skills matched!</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Explainable AI Actionable Learning Recommendations */}
            {learningRecs.length > 0 && (
              <div style={{ background: 'rgba(99, 102, 241, 0.06)', border: '1px solid rgba(99, 102, 241, 0.25)', padding: '22px', borderRadius: '18px', marginBottom: '28px' }}>
                <h3 style={{ fontSize: '1.05rem', color: '#a5b4fc', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Lightbulb size={20} /> Explainable AI — Actionable Skill Acquisition Plan
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {learningRecs.map((rec, i) => (
                    <div key={i} style={{ fontSize: '0.875rem', background: 'rgba(7, 9, 14, 0.4)', padding: '12px 16px', borderRadius: '10px', borderLeft: '4px solid #6366f1' }}>
                      {rec.recommendation}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* TAB 2: AI CO-PILOT INTERVIEW QUESTIONS & EXECUTIVE SUMMARY */}
        {activeModalTab === 'copilot' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* AI Provider Switcher & Key Bar */}
            <div style={{ 
              background: 'rgba(7, 9, 14, 0.6)', 
              border: '1px solid rgba(99, 102, 241, 0.3)', 
              padding: '16px 20px', 
              borderRadius: '16px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Cpu size={20} color="#818cf8" />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>AI Engine Provider</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Choose your preferred model for deep intelligence</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <select 
                  value={selectedProvider} 
                  onChange={handleProviderChange}
                  style={{
                    background: 'rgba(15, 23, 42, 0.9)',
                    color: '#e2e8f0',
                    border: '1px solid rgba(99, 102, 241, 0.4)',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <option value="auto">⚡ Auto-Detect (Best Available)</option>
                  <option value="gemini">✨ Google Gemini API</option>
                  <option value="openai">🤖 OpenAI GPT-4o-mini</option>
                  <option value="ollama">🦙 Local Ollama LLM</option>
                  <option value="fallback">⚙️ Fast Rule Engine</option>
                </select>

                <button
                  onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                  title="Configure custom API key"
                  style={{
                    background: showApiKeyInput ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: showApiKeyInput ? '#a5b4fc' : 'var(--text-muted)',
                    borderRadius: '10px',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}
                >
                  <Key size={14} /> Key
                </button>

                <button
                  onClick={() => fetchCopilotInsights()}
                  style={{
                    background: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
                    border: 'none',
                    color: '#ffffff',
                    borderRadius: '10px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: 700,
                    fontSize: '0.825rem',
                    boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)'
                  }}
                >
                  <Zap size={14} /> Regenerate
                </button>
              </div>

              {showApiKeyInput && (
                <div style={{ width: '100%', marginTop: '10px', display: 'flex', gap: '10px' }}>
                  <input
                    type="password"
                    placeholder="Paste Gemini or OpenAI API Key here (or leave blank to use backend ENV)"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    style={{
                      flex: 1,
                      background: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(99, 102, 241, 0.4)',
                      color: '#ffffff',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontSize: '0.825rem'
                    }}
                  />
                  <button
                    onClick={() => fetchCopilotInsights()}
                    style={{
                      background: '#4f46e5',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 14px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}
                  >
                    Apply Key
                  </button>
                </div>
              )}
            </div>

            {copilotLoading ? (
              <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--primary-light)' }}>
                <Bot size={40} className="spin" style={{ marginBottom: '14px', color: '#06b6d4' }} />
                <p style={{ fontWeight: 600, fontSize: '1.05rem', color: '#f8fafc' }}>
                  Generating AI Executive Insights & Interview Plan...
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Analyzing missing skill gaps and synthesizing candidate profile evaluation.
                </p>
              </div>
            ) : copilotData ? (
              <>
                {/* Provider Status Pill */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    background: copilotData.is_llm_generated ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                    color: copilotData.is_llm_generated ? '#34d399' : '#818cf8',
                    border: '1px solid',
                    borderColor: copilotData.is_llm_generated ? 'rgba(16, 185, 129, 0.3)' : 'rgba(99, 102, 241, 0.3)',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    {copilotData.is_llm_generated ? '✨ Powered by LLM:' : '⚙️ Engine:'} {copilotData.provider_used.toUpperCase()}
                  </span>
                </div>

                {/* Executive Summary Card */}
                <div style={{ 
                  background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(99, 102, 241, 0.08) 100%)', 
                  border: '1px solid rgba(6, 182, 212, 0.35)', 
                  padding: '24px', 
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(6, 182, 212, 0.1)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '1.15rem', color: '#38bdf8', margin: 0, display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 800 }}>
                      <Bot size={24} /> Executive AI Assessment
                    </h3>
                    <span style={{
                      background: score >= 80 ? 'rgba(16, 185, 129, 0.2)' : score >= 60 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: score >= 80 ? '#34d399' : score >= 60 ? '#fbbf24' : '#f87171',
                      border: '1px solid',
                      borderColor: score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontWeight: 800,
                      fontSize: '0.85rem'
                    }}>
                      {copilotData.recruiter_verdict || "Evaluated"}
                    </span>
                  </div>

                  <p style={{ margin: '0 0 16px 0', fontSize: '0.95rem', lineHeight: 1.6, color: '#f1f5f9' }}>
                    {copilotData.executive_summary || copilotData.recruiter_verdict}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                    {/* Strengths */}
                    {copilotData.strengths && copilotData.strengths.length > 0 && (
                      <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '14px 18px', borderRadius: '14px' }}>
                        <h4 style={{ fontSize: '0.85rem', color: '#34d399', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                          <Check size={14} /> Key Technical Strengths
                        </h4>
                        <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.825rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                          {copilotData.strengths.map((str, idx) => (
                            <li key={idx}>{str}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Watchouts */}
                    {copilotData.watchouts && copilotData.watchouts.length > 0 && (
                      <div style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '14px 18px', borderRadius: '14px' }}>
                        <h4 style={{ fontSize: '0.85rem', color: '#fbbf24', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                          <ShieldAlert size={14} /> Probe & Watchout Areas
                        </h4>
                        <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.825rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                          {copilotData.watchouts.map((wo, idx) => (
                            <li key={idx}>{wo}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Custom Technical Interview Questions */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '1.1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 800 }}>
                      <HelpCircle size={22} color="#818cf8" /> Tailored Interview Questions ({copilotData.questions?.length || 0})
                    </h3>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {(copilotData.questions || []).map((q, idx) => (
                      <div key={idx} style={{ 
                        background: 'rgba(7, 9, 14, 0.6)', 
                        padding: '20px', 
                        borderRadius: '16px', 
                        border: '1px solid rgba(255,255,255,0.08)',
                        transition: 'border-color 0.2s'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <span className="pill pill-related" style={{ fontWeight: 700, fontSize: '0.75rem' }}>
                            {q.category}
                          </span>
                          <button
                            onClick={() => handleCopyQuestion(q.question, idx)}
                            style={{
                              background: copiedQuestionIdx === idx ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)',
                              border: '1px solid',
                              borderColor: copiedQuestionIdx === idx ? '#10b981' : 'rgba(255,255,255,0.1)',
                              color: copiedQuestionIdx === idx ? '#34d399' : 'var(--text-muted)',
                              borderRadius: '8px',
                              padding: '4px 10px',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontWeight: 600
                            }}
                          >
                            {copiedQuestionIdx === idx ? <Check size={12} /> : <Copy size={12} />}
                            {copiedQuestionIdx === idx ? 'Copied!' : 'Copy'}
                          </button>
                        </div>

                        <h4 style={{ fontSize: '0.975rem', margin: '8px 0 12px 0', color: '#f8fafc', lineHeight: 1.5, fontWeight: 700 }}>
                          {idx + 1}. "{q.question}"
                        </h4>

                        <div style={{ 
                          fontSize: '0.825rem', 
                          color: '#94a3b8', 
                          background: 'rgba(255,255,255,0.03)', 
                          padding: '12px 14px', 
                          borderRadius: '10px',
                          borderLeft: '3px solid #06b6d4'
                        }}>
                          🎯 <strong>What to look for:</strong> {q.what_to_look_for}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Candidate Resume Tailoring Tips */}
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 800 }}>
                    <Sparkles size={20} color="#f59e0b" /> ATS Resume Optimization Recommendations
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {(copilotData.candidate_tips || []).map((tip, idx) => (
                      <div key={idx} style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '16px', borderRadius: '14px' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fbbf24', marginBottom: '4px' }}>
                          • {tip.title}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                          {tip.detail}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        )}

        {/* TAB 3: RAW RESUME PREVIEW */}
        {activeModalTab === 'raw' && (
          <div style={{ background: '#07090e', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '12px' }}>Extracted Resume Content</h3>
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#e2e8f0', lineHeight: 1.6 }}>
              {candidate.resume_snippet || candidate.full_analysis?.raw_resume_text || "No raw text available."}
            </pre>
          </div>
        )}

        {/* Technical Level-by-Level Execution Logs Accordion */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '18px', marginTop: '24px' }} className="no-print">
          <button
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              padding: '6px 0',
              fontWeight: 500
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={17} color="#818cf8" /> Inspect Level 1 to Level 5 NLP Calculation Logs
            </span>
            {showTechnicalDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showTechnicalDetails && (
            <div style={{ background: '#07090e', padding: '18px', borderRadius: '14px', marginTop: '14px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: '#38bdf8', border: '1px solid rgba(255,255,255,0.05)', overflowX: 'auto' }}>
              <pre>{JSON.stringify(candidate.full_analysis?.level_details || candidate, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
