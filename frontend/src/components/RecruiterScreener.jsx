import React, { useState, useEffect } from 'react';
import { Upload, Briefcase, Plus, Search, Eye, Award, CheckCircle, AlertCircle, FileText, Sparkles, Filter, Users, TrendingUp, Cpu, SlidersHorizontal, ArrowLeftRight, Check, X, Shield, Download, EyeOff } from 'lucide-react';
import CandidateModal from './CandidateModal';

export default function RecruiterScreener({ jobs, selectedJob, setSelectedJob, onRefreshJobs, apiBase }) {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [scoreFilter, setScoreFilter] = useState('all'); // all, high (80+), medium (60+)
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const [isAnonymized, setIsAnonymized] = useState(false);
  
  // Side-by-side comparison state
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const [newJobData, setNewJobData] = useState({
    title: '',
    company: 'TechCorp',
    department: 'Engineering',
    location: 'Remote',
    experience_required: '3+ years',
    required_skills: '',
    description: ''
  });

  // Handle batch candidate screening call
  const handleScreenCandidates = async (usePresetOnly = false) => {
    if (!selectedJob) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('jd_id', selectedJob.id);
      formData.append('anonymize', isAnonymized ? 'true' : 'false');
      
      const shouldIncludeSamples = usePresetOnly || uploadedFiles.length === 0;
      formData.append('include_samples', shouldIncludeSamples ? 'true' : 'false');

      if (!usePresetOnly && uploadedFiles.length > 0) {
        uploadedFiles.forEach((file) => {
          formData.append('files', file);
        });
      }

      const res = await fetch(`${apiBase}/api/batch-screen`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.candidates) {
        setCandidates(data.candidates);
      }
    } catch (err) {
      console.error("Screening failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCsv = () => {
    if (!selectedJob) return;
    window.open(`${apiBase}/api/export-candidates-csv?jd_id=${selectedJob.id}`, '_blank');
  };

  // Re-run screening if blind mode is toggled while candidates are present
  useEffect(() => {
    if (candidates.length > 0 && selectedJob) {
      handleScreenCandidates(false);
    }
  }, [isAnonymized]);

  // Create Custom Job Description
  const handleCreateJob = async (e) => {
    e.preventDefault();
    if (!newJobData.title || !newJobData.description) return;
    setLoading(true);
    try {
      const rawSkills = newJobData.required_skills || '';
      const skillsArray = rawSkills
        .split(',')
        .map(s => s.trim().replace(/[.,;]+$/, ''))
        .filter(Boolean);

      const payload = {
        title: newJobData.title.trim(),
        company: newJobData.company || 'TechCorp',
        department: newJobData.department || 'Engineering',
        location: newJobData.location || 'Remote',
        experience_required: newJobData.experience_required || '3+ years',
        required_skills: skillsArray.length > 0 ? skillsArray : ['JavaScript', 'React'],
        description: newJobData.description.trim()
      };

      const res = await fetch(`${apiBase}/api/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.job) {
        setShowCreateJobModal(false);
        setNewJobData({
          title: '',
          company: 'TechCorp',
          department: 'Engineering',
          location: 'Remote',
          experience_required: '3+ years',
          required_skills: '',
          description: ''
        });
        if (onRefreshJobs) {
          await onRefreshJobs();
        }
        setSelectedJob(data.job);
      }
    } catch (err) {
      console.error("Create job error:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCompareCandidate = (c) => {
    if (compareList.some(item => item.candidate_id === c.candidate_id)) {
      setCompareList(compareList.filter(item => item.candidate_id !== c.candidate_id));
    } else {
      if (compareList.length >= 2) {
        alert("You can compare up to 2 candidates side-by-side.");
        return;
      }
      setCompareList([...compareList, c]);
    }
  };

  const getScoreColor = (val) => {
    if (val >= 80) return '#10b981';
    if (val >= 60) return '#f59e0b';
    return '#f43f5e';
  };

  const getInitials = (name) => {
    if (!name) return 'CA';
    const parts = name.replace(/\([^)]*\)/g, '').trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts[0].substring(0, 2).toUpperCase();
  };

  // Filtered candidates by search and score
  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.headline.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (scoreFilter === 'high') return matchesSearch && c.overall_match_pct >= 80;
    if (scoreFilter === 'medium') return matchesSearch && c.overall_match_pct >= 60;
    return matchesSearch;
  });

  // Stats calculation
  const totalScreened = candidates.length;
  const avgScore = totalScreened > 0 ? Math.round(candidates.reduce((acc, c) => acc + c.overall_match_pct, 0) / totalScreened) : 0;
  const topScore = totalScreened > 0 ? Math.max(...candidates.map(c => c.overall_match_pct)) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Executive KPI Stats Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.12)', color: '#818cf8', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>CANDIDATES SCREENED</div>
            <div style={{ fontWeight: 700, fontSize: '1.35rem', color: '#ffffff' }}>{totalScreened}</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#34d399', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>AVG MATCH FIT</div>
            <div style={{ fontWeight: 700, fontSize: '1.35rem', color: avgScore >= 70 ? '#34d399' : '#ffffff' }}>
              {avgScore > 0 ? `${avgScore}%` : '--'}
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOP MATCH SCORE</div>
            <div style={{ fontWeight: 700, fontSize: '1.35rem', color: '#fbbf24' }}>
              {topScore > 0 ? `${topScore}%` : '--'}
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: 'rgba(8, 145, 178, 0.12)', color: '#38bdf8', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Cpu size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>NLP / ML PIPELINE</div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#38bdf8', marginTop: '2px' }}>
              5-Level Hybrid AI
            </div>
          </div>
        </div>
      </div>

      {/* Target Position Selection Card */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Briefcase color="var(--primary)" size={22} />
              Recruiter Candidate Screener
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Select a position, upload resumes, and rank candidates using multi-dimensional NLP algorithms.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Blind Screening Toggle Button */}
            <button
              onClick={() => setIsAnonymized(!isAnonymized)}
              style={{
                background: isAnonymized ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                border: '1px solid',
                borderColor: isAnonymized ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                color: isAnonymized ? '#34d399' : 'var(--text-muted)',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
              title="Redacts candidate names, emails, phone numbers, and location to prevent recruiting bias."
            >
              {isAnonymized ? <Shield size={16} /> : <EyeOff size={16} />}
              {isAnonymized ? '🛡️ Blind Mode ACTIVE' : 'Enable Blind Screening'}
            </button>

            <button className="btn-secondary" onClick={() => setShowCreateJobModal(true)}>
              <Plus size={15} /> Create Custom Job
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Select Target Job Position
            </label>
            <select
              value={selectedJob ? selectedJob.id : ''}
              onChange={(e) => {
                const found = jobs.find(j => j.id === e.target.value);
                if (found) setSelectedJob(found);
              }}
              style={{
                width: '100%',
                background: 'var(--bg-input)',
                color: '#ffffff',
                border: '1px solid var(--border-default)',
                padding: '11px 16px',
                borderRadius: '10px',
                fontSize: '0.9rem',
                outline: 'none',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              {jobs.map(j => (
                <option key={j.id} value={j.id} style={{ background: '#0e121b', color: '#fff' }}>
                  {j.title} ({j.company} - {j.experience_required})
                </option>
              ))}
            </select>
          </div>

          {selectedJob && (
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Required Skill Taxonomy ({selectedJob.required_skills?.length || 0})
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '6px' }}>
                {(selectedJob.required_skills || []).map((sk, i) => (
                  <span key={i} className="pill pill-neutral" style={{ fontSize: '0.75rem' }}>{sk}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Drop Area & Action Panel */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', alignItems: 'center' }}>
          {/* Dropzone */}
          <div style={{ border: '1px dashed var(--border-strong)', padding: '20px', borderRadius: '12px', textAlign: 'center', background: 'rgba(0, 0, 0, 0.2)' }}>
            <Upload size={28} color="var(--primary)" style={{ marginBottom: '8px' }} />
            <h4 style={{ fontSize: '0.95rem', marginBottom: '3px', fontWeight: 600 }}>Upload Candidate Resumes</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Accepts PDF, DOCX, and TXT resume files
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.docx,.txt"
              onChange={(e) => setUploadedFiles(Array.from(e.target.files))}
              style={{ display: 'none' }}
              id="file-upload-input"
            />
            <label htmlFor="file-upload-input" className="btn-secondary" style={{ cursor: 'pointer', fontSize: '0.825rem' }}>
              Browse Files ({uploadedFiles.length} selected)
            </label>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className="btn-primary" onClick={() => handleScreenCandidates(false)} disabled={loading} style={{ padding: '14px 24px', fontSize: '0.95rem' }}>
              <Sparkles size={18} /> {loading ? 'Processing AI Pipeline...' : 'Screen & Rank Candidates'}
            </button>
            <button className="btn-secondary" onClick={() => handleScreenCandidates(true)} disabled={loading}>
              Instant Demo: Screen 5 Sample Resumes
            </button>
          </div>
        </div>
      </div>

      {/* Ranked Candidate Results Table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        {/* Controls Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award color="#10b981" size={20} />
              Ranked Candidates ({filteredCandidates.length})
            </h3>
            {compareList.length > 0 && (
              <button className="btn-primary" onClick={() => setShowCompareModal(true)} style={{ padding: '5px 12px', fontSize: '0.78rem' }}>
                <ArrowLeftRight size={14} /> Compare Selected ({compareList.length}/2)
              </button>
            )}
            {selectedJob && candidates.length > 0 && (
              <button
                onClick={handleExportCsv}
                style={{
                  background: 'rgba(6, 182, 212, 0.15)',
                  border: '1px solid rgba(6, 182, 212, 0.4)',
                  color: '#38bdf8',
                  borderRadius: '8px',
                  padding: '6px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Download size={14} /> Export CSV Report
              </button>
            )}
          </div>

          {/* Search & Filter */}
          {candidates.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {/* Filter Pills */}
              <div style={{ display: 'flex', gap: '4px', background: 'rgba(255, 255, 255, 0.04)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                {[
                  { id: 'all', label: 'All Fits' },
                  { id: 'high', label: '80%+ Match' },
                  { id: 'medium', label: '60%+ Match' },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setScoreFilter(f.id)}
                    style={{
                      background: scoreFilter === f.id ? 'var(--primary)' : 'transparent',
                      color: scoreFilter === f.id ? '#ffffff' : 'var(--text-muted)',
                      border: 'none',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div style={{ position: 'relative', width: '220px' }}>
                <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search candidate..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-default)',
                    color: '#fff',
                    padding: '7px 12px 7px 34px',
                    borderRadius: '8px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {candidates.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            <FileText size={44} style={{ opacity: 0.2, marginBottom: '12px' }} />
            <p style={{ fontSize: '0.95rem', margin: 0, fontWeight: 500 }}>No candidates screened yet for this job position.</p>
            <p style={{ fontSize: '0.825rem', marginTop: '4px', color: 'var(--text-dim)' }}>Click "Instant Demo: Screen 5 Sample Resumes" or upload candidate PDF files above!</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  <th style={{ padding: '12px 10px' }}>COMPARE</th>
                  <th style={{ padding: '12px 10px' }}>RANK</th>
                  <th style={{ padding: '12px 10px' }}>CANDIDATE</th>
                  <th style={{ padding: '12px 10px' }}>MATCH SCORE</th>
                  <th style={{ padding: '12px 10px' }}>ML SUITABILITY</th>
                  <th style={{ padding: '12px 10px' }}>SKILL MATCHES</th>
                  <th style={{ padding: '12px 10px' }}>MISSING SKILLS</th>
                  <th style={{ padding: '12px 10px', textAlign: 'right' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.map((c) => {
                  const score = c.overall_match_pct;
                  const matchedCount = (c.strong_matches || []).length;
                  const totalReq = matchedCount + (c.missing_skills || []).length;
                  const isCompared = compareList.some(item => item.candidate_id === c.candidate_id);

                  return (
                    <tr key={c.candidate_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '14px 10px' }}>
                        <input
                          type="checkbox"
                          checked={isCompared}
                          onChange={() => toggleCompareCandidate(c)}
                          style={{ cursor: 'pointer', accentColor: '#6366f1' }}
                        />
                      </td>

                      <td style={{ padding: '14px 10px', fontWeight: 700 }}>
                        <span style={{
                          background: c.rank === 1 ? 'linear-gradient(135deg, #f59e0b, #d97706)' : (c.rank === 2 ? 'linear-gradient(135deg, #94a3b8, #64748b)' : (c.rank === 3 ? 'linear-gradient(135deg, #b45309, #78350f)' : 'rgba(255,255,255,0.06)')),
                          color: c.rank <= 3 ? '#ffffff' : 'var(--text-muted)',
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8rem'
                        }}>
                          #{c.rank}
                        </span>
                      </td>

                      <td style={{ padding: '14px 10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            background: 'rgba(99, 102, 241, 0.15)',
                            color: '#818cf8',
                            border: '1px solid rgba(99, 102, 241, 0.3)',
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.75rem'
                          }}>
                            {getInitials(c.name)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.9rem' }}>{c.name}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.headline}</div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '14px 10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 800, fontSize: '1.05rem', color: getScoreColor(score) }}>
                            {score}%
                          </span>
                          <div className="progress-container" style={{ width: '80px' }}>
                            <div className="progress-bar-fill" style={{ width: `${score}%`, background: getScoreColor(score) }} />
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '14px 10px' }}>
                        <span className={`pill ${score >= 70 ? 'pill-matched' : 'pill-missing'}`}>
                          {c.suitability?.status_label || 'Evaluated'}
                        </span>
                      </td>

                      <td style={{ padding: '14px 10px' }}>
                        <span style={{ fontWeight: 600, color: '#34d399' }}>
                          ✓ {matchedCount} / {totalReq || 1} Skills
                        </span>
                      </td>

                      <td style={{ padding: '14px 10px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '180px' }}>
                          {(c.missing_skills || []).slice(0, 2).map((m, i) => (
                            <span key={i} className="pill pill-missing" style={{ fontSize: '0.7rem', padding: '2px 6px' }}>
                              ✗ {m}
                            </span>
                          ))}
                          {(c.missing_skills || []).length > 2 && (
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                              +{c.missing_skills.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>

                      <td style={{ padding: '14px 10px', textAlign: 'right' }}>
                        <button className="btn-secondary" onClick={() => setSelectedCandidate(c)} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                          <Eye size={14} /> Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Side-by-Side Candidate Comparison Modal */}
      {showCompareModal && compareList.length === 2 && (
        <div className="modal-overlay" onClick={() => setShowCompareModal(false)}>
          <div className="glass-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: '900px', width: '100%', padding: '28px', background: '#0e121b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
              <h3 style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ArrowLeftRight color="#6366f1" size={20} /> Candidate Side-by-Side Comparison
              </h3>
              <button onClick={() => setShowCompareModal(false)} className="btn-secondary" style={{ padding: '4px 10px' }}>Close</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {compareList.map((cand, idx) => (
                <div key={idx} style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{cand.name}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>{cand.headline}</p>
                  
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: getScoreColor(cand.overall_match_pct), marginBottom: '12px' }}>
                    {cand.overall_match_pct}% Fit
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>MATCHED SKILLS:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                      {(cand.strong_matches || []).map((s, i) => (
                        <span key={i} className="pill pill-matched" style={{ fontSize: '0.7rem' }}>✓ {s}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>MISSING SKILLS:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                      {(cand.missing_skills || []).map((s, i) => (
                        <span key={i} className="pill pill-missing" style={{ fontSize: '0.7rem' }}>✗ {s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Candidate Deep Dive Modal */}
      {selectedCandidate && (
        <CandidateModal candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)} apiBase={apiBase} />
      )}

      {/* Create Custom Job Modal */}
      {showCreateJobModal && (
        <div className="modal-overlay" onClick={() => setShowCreateJobModal(false)}>
          <div className="glass-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px', width: '100%', padding: '28px', background: '#0e121b' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Create Custom Job Description</h3>
            <form onSubmit={handleCreateJob} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Job Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Frontend Developer"
                  value={newJobData.title}
                  onChange={e => setNewJobData({ ...newJobData, title: e.target.value })}
                  style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-default)', color: '#fff', padding: '10px', borderRadius: '8px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Required Skills (comma separated)</label>
                <input
                  type="text"
                  placeholder="React, JavaScript, HTML, CSS, Git, REST API"
                  value={newJobData.required_skills}
                  onChange={e => setNewJobData({ ...newJobData, required_skills: e.target.value })}
                  style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-default)', color: '#fff', padding: '10px', borderRadius: '8px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: 600 }}>Job Description Text *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Paste full job description requirements here..."
                  value={newJobData.description}
                  onChange={e => setNewJobData({ ...newJobData, description: e.target.value })}
                  style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-default)', color: '#fff', padding: '10px', borderRadius: '8px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowCreateJobModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Job</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
