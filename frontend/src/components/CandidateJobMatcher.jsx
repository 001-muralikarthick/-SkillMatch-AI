import React, { useState } from 'react';
import { Sparkles, Briefcase, Upload, FileText, CheckCircle, AlertTriangle, BookOpen, ChevronRight } from 'lucide-react';

export default function CandidateJobMatcher({ apiBase }) {
  const [resumeText, setResumeText] = useState(`Java
Python
JavaScript
React
HTML
CSS
MongoDB
Git`);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [extractedSkills, setExtractedSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleRecommendJobs = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      if (uploadedFile) {
        formData.append('file', uploadedFile);
      } else {
        formData.append('resume_text', resumeText);
      }

      const res = await fetch(`${apiBase}/api/recommend-jobs`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.recommendations) {
        setRecommendations(data.recommendations);
        setExtractedSkills(data.candidate_skills_extracted || []);
      }
    } catch (err) {
      console.error("Job recommendation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (val) => {
    if (val >= 80) return 'var(--success)';
    if (val >= 60) return 'var(--warning)';
    return 'var(--danger)';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h1 style={{ fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles color="#06b6d4" size={24} />
          Reverse AI Job Recommendation Engine
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0, marginTop: '4px' }}>
          Upload or paste a candidate resume to evaluate suitability across all open tech positions and discover top matching job roles.
        </p>
      </div>

      {/* Input Section */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {/* Paste Resume Box */}
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              PASTE RESUME SKILLS / TEXT
            </label>
            <textarea
              rows={8}
              value={resumeText}
              onChange={(e) => {
                setResumeText(e.target.value);
                setUploadedFile(null);
              }}
              placeholder="Paste candidate resume skills or full document text here..."
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border-glass)',
                color: '#ffffff',
                padding: '12px',
                borderRadius: '10px',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Upload Resume File */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '2px dashed var(--border-glass)', padding: '20px', borderRadius: '14px', background: 'rgba(0,0,0,0.15)' }}>
            <div>
              <Upload size={28} color="#06b6d4" style={{ marginBottom: '8px' }} />
              <h4 style={{ fontSize: '0.95rem', marginBottom: '4px' }}>Upload Candidate PDF / DOCX</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                AI will extract text, recognize skills, and match against job database.
              </p>
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={(e) => {
                  if (e.target.files[0]) {
                    setUploadedFile(e.target.files[0]);
                  }
                }}
                style={{ display: 'none' }}
                id="single-resume-file"
              />
              <label htmlFor="single-resume-file" className="btn-secondary" style={{ cursor: 'pointer', fontSize: '0.85rem' }}>
                {uploadedFile ? `Selected: ${uploadedFile.name}` : 'Upload PDF/DOCX Resume'}
              </label>
            </div>

            <button className="btn-primary" onClick={handleRecommendJobs} disabled={loading} style={{ width: '100%', marginTop: '16px', padding: '12px' }}>
              <Sparkles size={18} /> {loading ? 'Running AI Job Matcher...' : 'Find Best Matching Jobs'}
            </button>
          </div>
        </div>

        {/* Extracted Skills Chips */}
        {extractedSkills.length > 0 && (
          <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>EXTRACTED CANDIDATE SKILLS ({extractedSkills.length}):</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
              {extractedSkills.map((sk, idx) => (
                <span key={idx} className="pill pill-matched">✓ {sk}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Job Recommendations Results */}
      {recommendations.length > 0 && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Briefcase color="#10b981" size={22} />
            Best Job Matches ({recommendations.length})
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {recommendations.map((job, idx) => (
              <div
                key={job.job_id}
                className="glass-panel glass-panel-hover"
                style={{ padding: '20px', borderRadius: '14px', borderLeft: `4px solid ${getScoreColor(job.overall_match_pct)}` }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-muted)' }}>#{idx + 1}</span>
                      <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{job.title}</h3>
                      <span className={`pill ${job.overall_match_pct >= 70 ? 'pill-matched' : 'pill-missing'}`}>
                        {job.suitability_label}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 32px' }}>
                      {job.company} • {job.location}
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: getScoreColor(job.overall_match_pct), lineHeight: 1 }}>
                      {job.overall_match_pct}%
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Overall Match</span>
                  </div>
                </div>

                {/* Skill Pills Comparison */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>MATCHED SKILLS:</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                      {(job.matched_skills || []).map((m, i) => (
                        <span key={i} className="pill pill-matched" style={{ fontSize: '0.75rem' }}>✓ {m}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#f87171', fontWeight: 600 }}>MISSING SKILLS TO ACQUIRE:</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                      {(job.missing_skills || []).map((m, i) => (
                        <span key={i} className="pill pill-missing" style={{ fontSize: '0.75rem' }}>✗ {m}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
