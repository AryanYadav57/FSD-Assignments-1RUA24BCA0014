import React, { useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import Card from '../components/Card';
import EvidencePanel from '../sections/EvidencePanel';

const LayoutLab = () => {
  const [layoutMode, setLayoutMode] = useState('grid');
  const [gap, setGap] = useState(16);
  const [columns, setColumns] = useState(3);
  const [justify, setJustify] = useState('space-between');
  const [align, setAlign] = useState('stretch');
  const [previewWidth, setPreviewWidth] = useState('100%'); // For simulating viewports

  const sandboxItems = [
    { id: 1, title: 'Component A', desc: 'Encapsulates data visualization tools.' },
    { id: 2, title: 'Component B', desc: 'Directs client side navigation triggers.' },
    { id: 3, title: 'Component C', desc: 'Handles asynchronous fetch response caches.' },
    { id: 4, title: 'Component D', desc: 'Tracks authentication state scopes.' },
  ];

  // Dynamic CSS generation text
  const generateCSSCode = () => {
    if (layoutMode === 'grid') {
      return `.sandbox-container {
  display: grid;
  grid-template-columns: repeat(${columns}, 1fr);
  gap: ${gap}px;
  align-items: ${align};
}`;
    } else {
      return `.sandbox-container {
  display: flex;
  flex-wrap: wrap;
  gap: ${gap}px;
  justify-content: ${justify};
  align-items: ${align};
}`;
    }
  };

  const controlContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.25rem',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg)',
    padding: '1.5rem',
    marginBottom: '1.5rem'
  };

  const sandboxWrapperStyle = {
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg)',
    padding: '1.5rem',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    width: previewWidth,
    maxWidth: '100%',
    margin: '0 auto',
    transition: 'width 0.3s ease',
    minHeight: '220px'
  };

  const getSandboxLayout = () => {
    if (layoutMode === 'grid') {
      return {
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, minmax(180px, 1fr))`,
        gap: `${gap}px`,
        alignItems: align
      };
    } else {
      return {
        display: 'flex',
        flexWrap: 'wrap',
        gap: `${gap}px`,
        justifyContent: justify,
        alignItems: align
      };
    }
  };

  const sandboxItemStyle = {
    backgroundColor: 'var(--bg-tertiary)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-sm)',
    padding: '1rem',
    flex: layoutMode === 'flex' ? '1 1 200px' : undefined,
    minHeight: '100px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  };

  return (
    <div className="fade-in">
      <SectionHeader 
        badge="Tutorial 02" 
        title="CSS Layout Lab" 
        subtitle="Interact with Flexbox and CSS Grid alignments, spacing ratios, and responsive viewports."
      />

      {/* Before / After Layout Comparison */}
      <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--text-primary)' }}>
        Layout Evaluation: Before vs After
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
        
        {/* BEFORE Container */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span className="badge badge-danger">BEFORE — Problems</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Non-responsive float layout, hardcoded fixed widths, text overflow, zero flex gap.
            </span>
          </div>

          <div style={{ overflowX: 'auto', border: '1px solid #ff5555', borderRadius: 'var(--radius-md)' }}>
            <div className="layout-before-container">
              <div className="layout-before-title">⚠️ Floated layout with absolute sizing elements (Width: 1000px container)</div>
              
              <div className="layout-before-card">
                <h4>Card Item 1</h4>
                <p>This layout uses legacy floating layout rules that break wrappers. The text overflows the parent boundaries entirely because width is fixed at 320px.</p>
              </div>

              <div className="layout-before-card">
                <h4>Card Item 2</h4>
                <p>Notice the uneven vertical gaps and margin collapse between these blocks. On small viewports, it induces horizontal overflow scrolling.</p>
              </div>

              <div className="layout-before-card">
                <h4>Card Item 3</h4>
                <p>Alignment is completely lost, and text overflows card edges because the card content width is hardcoded at 400px.</p>
              </div>

              {/* Clearfix for float layout */}
              <div style={{ clear: 'both' }}></div>
            </div>
          </div>
        </div>

        {/* AFTER Container */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span className="badge badge-success">AFTER — Fixed Layout</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              CSS Grid/Flexbox layout, dynamic flexbox reflow, responsive padding, content safety bounds.
            </span>
          </div>

          <div style={{ border: '1px solid var(--success)', borderRadius: 'var(--radius-md)', padding: '1.25rem', backgroundColor: 'rgba(16, 185, 129, 0.03)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
                <h4 style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>Card Item 1</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                  This layout leverages responsive grids that resize fluidly. Content boundaries remain secured.
                </p>
              </div>
              <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
                <h4 style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>Card Item 2</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                  Unified padding and spacing. Standard media queries ensure the content wraps nicely on narrow screens.
                </p>
              </div>
              <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
                <h4 style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>Card Item 3</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                  No floats, no hardcoded widths. Standard column mappings adapt dynamically from mobile to desktop.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Layout Playground Controls */}
      <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--text-primary)' }}>
        Interactive Layout Sandbox
      </h3>

      <div style={controlContainerStyle}>
        
        {/* Layout Selection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Layout Mode</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={() => setLayoutMode('flex')}
              style={{
                flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)',
                backgroundColor: layoutMode === 'flex' ? 'var(--primary)' : 'var(--bg-tertiary)',
                color: 'var(--text-primary)', cursor: 'pointer', transition: 'var(--transition)', fontSize: '0.85rem'
              }}
            >
              Flexbox
            </button>
            <button 
              onClick={() => setLayoutMode('grid')}
              style={{
                flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)',
                backgroundColor: layoutMode === 'grid' ? 'var(--primary)' : 'var(--bg-tertiary)',
                color: 'var(--text-primary)', cursor: 'pointer', transition: 'var(--transition)', fontSize: '0.85rem'
              }}
            >
              CSS Grid
            </button>
          </div>
        </div>

        {/* Spacing Gap Selection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Gap (Spacing)</label>
          <select 
            value={gap} 
            onChange={(e) => setGap(Number(e.target.value))}
            style={{ padding: '0.5rem', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', outline: 'none', cursor: 'pointer' }}
          >
            <option value={8}>8px (Small)</option>
            <option value={16}>16px (Medium)</option>
            <option value={24}>24px (Large)</option>
            <option value={32}>32px (X-Large)</option>
          </select>
        </div>

        {/* Columns Control (only for Grid) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', opacity: layoutMode === 'grid' ? 1 : 0.4 }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Columns (Grid Only)</label>
          <select 
            value={columns} 
            onChange={(e) => setColumns(Number(e.target.value))}
            disabled={layoutMode !== 'grid'}
            style={{ padding: '0.5rem', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', outline: 'none', cursor: 'pointer' }}
          >
            <option value={1}>1 Column</option>
            <option value={2}>2 Columns</option>
            <option value={3}>3 Columns</option>
            <option value={4}>4 Columns</option>
          </select>
        </div>

        {/* Justification Control (only for Flex) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', opacity: layoutMode === 'flex' ? 1 : 0.4 }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Justify Content (Flex Only)</label>
          <select 
            value={justify} 
            onChange={(e) => setJustify(e.target.value)}
            disabled={layoutMode !== 'flex'}
            style={{ padding: '0.5rem', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', outline: 'none', cursor: 'pointer' }}
          >
            <option value="flex-start">flex-start</option>
            <option value="center">center</option>
            <option value="space-between">space-between</option>
            <option value="space-around">space-around</option>
            <option value="space-evenly">space-evenly</option>
          </select>
        </div>

        {/* Cross Axis Alignment Control */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Align Items (Cross Axis)</label>
          <select 
            value={align} 
            onChange={(e) => setAlign(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', outline: 'none', cursor: 'pointer' }}
          >
            <option value="stretch">stretch</option>
            <option value="flex-start">flex-start</option>
            <option value="center">center</option>
            <option value="flex-end">flex-end</option>
          </select>
        </div>
      </div>

      {/* Simulator viewports control */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Viewport Sandbox Simulator:</span>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button 
            onClick={() => setPreviewWidth('100%')}
            style={{ padding: '0.3rem 0.6rem', border: '1px solid var(--border-color)', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer', backgroundColor: previewWidth === '100%' ? 'rgba(59, 130, 246, 0.15)' : 'transparent', color: previewWidth === '100%' ? 'var(--primary)' : 'var(--text-secondary)' }}
          >
            Desktop (100%)
          </button>
          <button 
            onClick={() => setPreviewWidth('600px')}
            style={{ padding: '0.3rem 0.6rem', border: '1px solid var(--border-color)', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer', backgroundColor: previewWidth === '600px' ? 'rgba(59, 130, 246, 0.15)' : 'transparent', color: previewWidth === '600px' ? 'var(--primary)' : 'var(--text-secondary)' }}
          >
            Tablet (600px)
          </button>
          <button 
            onClick={() => setPreviewWidth('340px')}
            style={{ padding: '0.3rem 0.6rem', border: '1px solid var(--border-color)', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer', backgroundColor: previewWidth === '340px' ? 'rgba(59, 130, 246, 0.15)' : 'transparent', color: previewWidth === '340px' ? 'var(--primary)' : 'var(--text-secondary)' }}
          >
            Mobile (340px)
          </button>
        </div>
      </div>

      {/* Sandbox Container */}
      <div style={sandboxWrapperStyle}>
        <div style={getSandboxLayout()}>
          {sandboxItems.map((item) => (
            <div key={item.id} style={sandboxItemStyle}>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  {item.desc}
                </p>
              </div>
              <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: 'var(--primary)', fontWeight: '600' }}>
                Active Bounds ✓
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS Code and Explanatory Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
        
        {/* Dynamic CSS Panel */}
        <Card title="Generated CSS Code" subtitle="Real-time CSS rule compiler">
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            The code block below represents the active CSS layout rules applied to the sandbox item container above.
          </p>
          <pre style={{ backgroundColor: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', color: '#818cf8', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', lineHeight: '1.5' }}>
            {generateCSSCode()}
          </pre>
        </Card>

        {/* Explain Grid, Flex, Gap, alignments */}
        <Card title="Academic CSS Theory" subtitle="Grid vs Flexbox architectural alignment">
          <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', paddingLeft: '1.25rem', lineHeight: '1.6' }}>
            <li><strong>Flexbox:</strong> Designed for one-dimensional layouts along a single axis (row or column). Excellent for flow wrapping and alignment distribution.</li>
            <li><strong>CSS Grid:</strong> Designed for two-dimensional layouts, addressing both columns and rows concurrently. Perfect for page structural blueprints.</li>
            <li><strong>Gap spacing:</strong> Allocates space directly between child elements. Eliminates margin collapse and complex outer-child selector calculations.</li>
            <li><strong>Cross Axis (Align-items):</strong> Adjusts positioning perpendicular to main line vectors (e.g., vertical centering in flex rows).</li>
          </ul>
        </Card>
      </div>

      {/* DevTools evidence panel */}
      <EvidencePanel 
        title="How to demonstrate this tutorial to your evaluator" 
        steps={[
          'First, click the "Flexbox" and "CSS Grid" layout mode toggle buttons to change structural schemes.',
          'Change the "Gap" select box values to immediately adjust the grid separation spacing.',
          'Toggle columns (1 to 4) when in CSS Grid mode to show column subdivisions.',
          'Modify "Justify Content" and "Align Items" values to alter the cross and main axis layout properties.',
          'Click the Tablet (600px) and Mobile (340px) preview simulation buttons to inspect the layout wrapping inside the simulator container.',
          'Open Chrome Developer Tools (F12) and inspect the sandbox container element to view the dynamically updated inline CSS rules matching the generated code box.'
        ]}
      />
    </div>
  );
};

export default LayoutLab;
