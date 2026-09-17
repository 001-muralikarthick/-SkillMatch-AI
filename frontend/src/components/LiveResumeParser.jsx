import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, ShieldCheck, Cpu, ArrowRight, Sparkles, AlertCircle, RefreshCw, Layers } from 'lucide-react';

export function LiveResumeParser({ jobs, selectedJob, setSelectedJob, onAddCandidateToPool, apiBase }) {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [parsedResult, setParsedResult] = useState(null);
  const [error, setError] = useState(null);
  const [viewAnonymized, setViewAnonymized] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (selectedFile) => {
    const ext = selectedFile.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx', 'doc', 'txt', 'md'].includes(ext)) {
      setError('Please upload a valid document (.pdf, .docx, or .txt)');
      return;
    }
    setError(null);
    setFile(selectedFile);
    parseFile(selectedFile);
  };

  const parseFile = async (fileToParse) => {
    setLoading(true);
    setError(null);
    setAddedSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', fileToParse);
      if (selectedJob?.id) {
        formData.append('jd_id', selectedJob.id);
      }

      const res = await fetch(`${apiBase}/api/upload-parse`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Failed to parse resume document.');
      }

      const data = await res.json();
      setParsedResult(data);
    } catch (err) {
      console.error('Error uploading/parsing resume:', err);
      setError(err.message || 'Error occurred while processing file.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToPool = () => {
    if (parsedResult?.candidate && onAddCandidateToPool) {
      onAddCandidateToPool(parsedResult.candidate);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 4000);
    }
  };

  const getScoreColor = (pct) => {
    if (pct >= 80) return '#10b981'; // High green
    if (pct >= 60) return '#3b82f6'; // Good blue
    if (pct >= 40) return '#f59e0b'; // Moderate amber
    return '#ef4444'; // Low red
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner Header */}
      <div className="glass-card" style={{ padding: '24px 28px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <Sparkles className="icon-glow" style={{ color: 'var(--accent-cyan)' }} size={24} />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>Live Resume Drag & Drop Parser</h2>
              <span className="badge badge-cyan" style={{ fontSize: '0.75rem', fontWeight: 600 }}>Real-Time AI</span>
            </div>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', margin: 0 }}>
              Upload any raw resume document (<code style={{ color: 'var(--accent-cyan)' }}>.pdf</code>, <code style={{ color: 'var(--accent-cyan)' }}>.docx</code>, or <code style={{ color: 'var(--accent-cyan)' }}>.txt</code>). The engine extracts skills, generates PII redactions, and scores candidate fit instantly.
            </p>
          </div>

          {/* Job Selection Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '300px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>Target Job:</span>
            <select
              value={selectedJob?.id || ''}
              onChange={(e) => {
                const found = jobs.find((j) => j.id === e.target.value);
                if (found) {
                  setSelectedJob(found);
                  if (file) parseFile(file);
                }
              }}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#fff',
                fontSize: '0.88rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} ({j.company})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Dropzone Left / Results Right */}
      <div style={{ display: 'grid', gridTemplateColumns: parsedResult ? '1fr 1.3fr' : '1fr', gap: '24px', transition: 'all 0.3s ease' }}>
        
        {/* Drag & Drop Upload Zone */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              border: isDragging ? '2px dashed var(--accent-cyan)' : '2px dashed rgba(255, 255, 255, 0.2)',
              borderRadius: '16px',
              padding: '40px 24px',
              textAlign: 'center',
              background: isDragging ? 'rgba(6, 182, 212, 0.08)' : 'rgba(15, 23, 42, 0.4)',
              backdropFilter: 'blur(10px)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '260px'
            }}
            onClick={() => document.getElementById('resume-file-input').click()}
          >
            <input
              id="resume-file-input"
              type="file"
              accept=".pdf,.docx,.doc,.txt,.md"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(6, 182, 212, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              color: 'var(--accent-cyan)'
            }}>
              <Upload size={30} />
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '6px' }}>
              {isDragging ? 'Drop resume file here' : 'Drag & Drop Resume File'}
            </h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '16px' }}>
              Supports PDF, DOCX, and TXT (Max size 10MB)
            </p>

            <button
              className="btn btn-secondary"
              style={{ fontSize: '0.85rem', padding: '8px 18px', pointerEvents: 'none' }}
            >
              Browse Files
            </button>
          </div>

          {/* Error Message Display */}
          {error && (
            <div style={{
              padding: '12px 16px',
              borderRadius: '10px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.85rem'
            }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Loading Skeleton Indicator */}
          {loading && (
            <div className="glass-card" style={{ padding: '20px', textAlign: 'center', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'var(--accent-cyan)' }}>
                <RefreshCw className="spin" size={20} />
                <span style={{ fontWeight: 600 }}>Extracting document text & running 5D NLP model...</span>
              </div>
            </div>
          )}

          {/* Uploaded File Info Card */}
          {file && !loading && (
            <div className="glass-card" style={{ padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FileText style={{ color: 'var(--accent-cyan)' }} size={22} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{file.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    {(file.size / 1024).toFixed(1)} KB • Extracted format: {parsedResult?.file_format || 'Auto'}
                  </div>
                </div>
              </div>

              <button
                className="btn btn-secondary"
                onClick={() => parseFile(file)}
                style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                title="Re-run analysis"
              >
                <RefreshCw size={14} /> Re-parse
              </button>
            </div>
          )}
        </div>

        {/* Parsed AI Results Panel */}
        {parsedResult && parsedResult.candidate && (
          <div className="glass-card" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Candidate Header & Scorecard */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
                    {parsedResult.candidate.name}
                  </h3>
                  <span className="badge badge-purple" style={{ fontSize: '0.72rem' }}>
                    {parsedResult.candidate.file_format}
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', margin: 0 }}>
                  {parsedResult.candidate.char_count} chars • {parsedResult.candidate.word_count} words parsed
                </p>
              </div>

              {/* Match Score Badge */}
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontSize: '1.8rem',
                  fontWeight: 800,
                  color: getScoreColor(parsedResult.candidate.overall_match_pct),
                  lineHeight: 1
                }}>
                  {parsedResult.candidate.overall_match_pct.toFixed(1)}%
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                  {parsedResult.candidate.suitability}
                </div>
              </div>
            </div>

            {/* 5-Dimensional Score Breakdown Grid */}
            {parsedResult.candidate.match_breakdown && (
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                  5-Dimensional Explainable Fit Breakdown
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                  {Object.entries(parsedResult.candidate.match_breakdown).map(([dim, data]) => (
                    <div key={dim} style={{
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.06)'
                    }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'capitalize', marginBottom: '4px' }}>
                        {dim.replace('_', ' ')}
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: getScoreColor(data.score_pct) }}>
                        {data.score_pct.toFixed(0)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Auto-Extracted Skill Badges */}
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                Auto-Detected Skills ({parsedResult.candidate.extracted_skills?.length || 0})
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {parsedResult.candidate.extracted_skills?.map((skill) => (
                  <span key={skill} className="badge badge-cyan" style={{ fontSize: '0.75rem' }}>
                    {skill}
                  </span>
                ))}
                {(!parsedResult.candidate.extracted_skills || parsedResult.candidate.extracted_skills.length === 0) && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', italic: 'true' }}>No explicit skill taxonomy match detected.</span>
                )}
              </div>
            </div>

            {/* Blind Screening / PII Preview Toggle */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} style={{ color: viewAnonymized ? 'var(--accent-cyan)' : 'var(--text-dim)' }} />
                  <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                    {viewAnonymized ? 'Blind Screening Mode (PII Redacted)' : 'Extracted Raw Document Text'}
                  </span>
                </div>
                <button
                  className="btn btn-secondary"
                  onClick={() => setViewAnonymized(!viewAnonymized)}
                  style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                >
                  {viewAnonymized ? 'View Raw Text' : 'Toggle Blind Redaction'}
                </button>
              </div>

              <div style={{
                maxHeight: '160px',
                overflowY: 'auto',
                padding: '12px',
                borderRadius: '8px',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.05)',
                fontFamily: 'monospace',
                fontSize: '0.78rem',
                lineHeight: 1.5,
                color: 'var(--text-dim)',
                whiteSpace: 'pre-wrap'
              }}>
                {viewAnonymized ? parsedResult.candidate.anonymized_text : parsedResult.candidate.raw_text}
              </div>
            </div>

            {/* Add to Recruiter Dashboard Action Button */}
            <div style={{ paddingTop: '8px' }}>
              <button
                className="btn btn-primary"
                onClick={handleAddToPool}
                style={{ width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.92rem' }}
              >
                {addedSuccess ? (
                  <>
                    <CheckCircle2 size={18} />
                    Added to Recruiter Candidate Pool!
                  </>
                ) : (
                  <>
                    <Layers size={18} />
                    Add Candidate to Recruiter Screener Dashboard
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default LiveResumeParser;
