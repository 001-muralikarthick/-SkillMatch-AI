import React from 'react';
import { Sparkles, Users, Cpu, Database, Layers, ExternalLink, ShieldCheck } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'screener', label: 'Recruiter Screener', icon: Users },
    { id: 'recommender', label: 'Job Recommendation', icon: Sparkles },
    { id: 'sandbox', label: 'NLP & ML Sandbox', icon: Cpu },
    { id: 'flow', label: 'System Flowchart', icon: Layers },
    { id: 'taxonomy', label: 'Skill Taxonomy', icon: Database },
  ];

  return (
    <header 
      style={{ 
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(8, 10, 15, 0.85)',
        backdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '12px 32px'
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        {/* Brand & Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 2px 10px rgba(99, 102, 241, 0.3)'
          }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700, letterSpacing: '-0.02em' }}>
                ResumeIQ <span style={{ color: 'var(--primary-light)' }}>AI</span>
              </h1>
              <span style={{ background: 'rgba(99, 102, 241, 0.12)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600 }}>
                Enterprise v2.4
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              AI Resume Screening & Career Intelligence Engine
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '4px', 
          background: 'rgba(255, 255, 255, 0.03)', 
          padding: '4px', 
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)'
        }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: isActive ? 'var(--primary)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={15} color={isActive ? '#ffffff' : 'var(--text-muted)'} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Project Link Badge */}
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noreferrer" 
          className="btn-secondary" 
          style={{ padding: '7px 14px', fontSize: '0.8rem', textDecoration: 'none' }}
        >
          <span>LinkedIn Portfolio Demo</span>
          <ExternalLink size={13} />
        </a>
      </div>
    </header>
  );
}
