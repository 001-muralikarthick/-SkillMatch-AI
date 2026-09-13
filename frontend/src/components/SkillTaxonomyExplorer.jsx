import React, { useState, useEffect } from 'react';
import { Database, Search, GitBranch, Layers } from 'lucide-react';

export default function SkillTaxonomyExplorer({ apiBase }) {
  const [taxonomy, setTaxonomy] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch(`${apiBase}/api/skill-taxonomy`)
      .then(res => res.json())
      .then(data => setTaxonomy(data))
      .catch(err => console.error("Taxonomy load error:", err));
  }, [apiBase]);

  if (!taxonomy) {
    return <div style={{ color: 'var(--text-muted)', padding: '20px' }}>Loading skill taxonomy...</div>;
  }

  const categories = taxonomy.categories || {};
  const aliases = taxonomy.aliases || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h1 style={{ fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Database color="#10b981" size={24} />
          Skills Taxonomy & Entity Resolution Database
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0, marginTop: '4px' }}>
          Browse system skill domains, canonical names, and alias resolution mappings used for Level 2 Skill Extraction.
        </p>

        {/* Search Input */}
        <div style={{ marginTop: '16px', position: 'relative', maxWidth: '400px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search skill (e.g. React, Docker, Python)..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid var(--border-glass)',
              color: '#fff',
              padding: '10px 12px 10px 38px',
              borderRadius: '10px',
              fontSize: '0.875rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {Object.entries(categories).map(([catName, skills]) => {
          const filteredSkills = skills.filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
          if (searchTerm && filteredSkills.length === 0) return null;

          return (
            <div key={catName} className="glass-panel glass-panel-hover" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={18} /> {catName} ({filteredSkills.length})
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {filteredSkills.map((sk, idx) => (
                  <span key={idx} className="pill pill-neutral">
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Alias Mapping Table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <GitBranch color="#06b6d4" size={20} /> Alias Canonical Resolution Table
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          {Object.entries(aliases).map(([alias, canonical]) => (
            <div key={alias} style={{ background: 'rgba(0,0,0,0.2)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>"{alias}"</span>
              <span style={{ margin: '0 8px', color: '#6366f1' }}>→</span>
              <span style={{ fontWeight: 600, color: '#34d399' }}>{canonical}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
