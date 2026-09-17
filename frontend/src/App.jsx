import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import RecruiterScreener from './components/RecruiterScreener';
import LiveResumeParser from './components/LiveResumeParser';
import CandidateJobMatcher from './components/CandidateJobMatcher';
import NlpSandbox from './components/NlpSandbox';
import SystemArchitectureFlow from './components/SystemArchitectureFlow';
import SkillTaxonomyExplorer from './components/SkillTaxonomyExplorer';

const API_BASE = 'http://localhost:8000';

export default function App() {
  const [activeTab, setActiveTab] = useState('screener');
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [backendStatus, setBackendStatus] = useState(false);
  const [uploadedCandidates, setUploadedCandidates] = useState([]);

  const handleAddCandidateToPool = (candidate) => {
    setUploadedCandidates((prev) => [candidate, ...prev]);
  };

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/jobs`);
      const data = await res.json();
      if (data.jobs && data.jobs.length > 0) {
        setJobs(data.jobs);
        setSelectedJob(prev => prev || data.jobs[0]);
        setBackendStatus(true);
        return data.jobs;
      }
    } catch (err) {
      console.error("Failed to connect to backend API:", err);
      setBackendStatus(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} backendStatus={backendStatus} />

      <main style={{ flex: 1, padding: '0 24px 40px 24px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
        {activeTab === 'screener' && (
          <RecruiterScreener
            jobs={jobs}
            selectedJob={selectedJob}
            setSelectedJob={setSelectedJob}
            onRefreshJobs={fetchJobs}
            apiBase={API_BASE}
            extraUploadedCandidates={uploadedCandidates}
          />
        )}

        {activeTab === 'parser' && (
          <LiveResumeParser
            jobs={jobs}
            selectedJob={selectedJob}
            setSelectedJob={setSelectedJob}
            onAddCandidateToPool={handleAddCandidateToPool}
            apiBase={API_BASE}
          />
        )}

        {activeTab === 'recommender' && (
          <CandidateJobMatcher apiBase={API_BASE} />
        )}

        {activeTab === 'sandbox' && (
          <NlpSandbox apiBase={API_BASE} />
        )}

        {activeTab === 'flow' && (
          <SystemArchitectureFlow />
        )}

        {activeTab === 'taxonomy' && (
          <SkillTaxonomyExplorer apiBase={API_BASE} />
        )}
      </main>


      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '20px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
        SkillMatch AI — Level 1 to Level 5 NLP & Machine Learning Recruitment Intelligence System
      </footer>
    </div>
  );
}
