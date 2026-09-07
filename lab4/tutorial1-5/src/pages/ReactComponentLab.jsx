import React, { useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import Card from '../components/Card';
import EvidencePanel from '../sections/EvidencePanel';

const ReactComponentLab = () => {
  const [selectedNode, setSelectedNode] = useState('App');

  const componentsData = {
    App: {
      name: 'App',
      purpose: 'The root orchestrator of the entire application. Handles high-level state, active navigation mapping, layout shell structure, header/footer rendering.',
      props: 'None (Root Node)',
      state: 'activeSection (string) - controls which view/page is loaded.',
      reusable: 'No (Application Shell)'
    },
    Navbar: {
      name: 'Navbar',
      purpose: 'Main navigation panel matching university dashboard headers. Triggers state changes in parent to update active views without page reloads.',
      props: 'activeSection (string), onNavigate (function)',
      state: 'None (Pure Presentational)',
      reusable: 'No (App Specific Header)'
    },
    Dashboard: {
      name: 'Dashboard',
      purpose: 'The landing screen displaying card vectors for all four tutorial sections, brief syllabus explanations, progress levels, and summary checklists.',
      props: 'onNavigate (function)',
      state: 'None',
      reusable: 'No (App Specific Page)'
    },
    HTTPExplorer: {
      name: 'HTTPExplorer',
      purpose: 'Tutorial 01 workspace containing Request-Response cycle SVG visualizations, dynamic API fetch controls, and latency checkers.',
      props: 'None',
      state: 'loading (boolean), requestDetails (object), responseDetails (object)',
      reusable: 'No (App Specific Page)'
    },
    LayoutLab: {
      name: 'LayoutLab',
      purpose: 'Tutorial 02 workspace housing the float layout BEFORE/AFTER panels, Flexbox & Grid sandbox, dynamic CSS compiler, and viewport simulator.',
      props: 'None',
      state: 'layoutMode (string), gap (number), columns (number), justify (string), align (string), previewWidth (string)',
      reusable: 'No (App Specific Page)'
    },
    JavaScriptLab: {
      name: 'JavaScriptLab',
      purpose: 'Tutorial 03 workspace integrating the controlled Internship Application Form, Live Application Preview, validation handlers, and event log tracker.',
      props: 'None',
      state: 'form (object), errors (object), submitted (boolean), lastAction (string)',
      reusable: 'No (App Specific Page)'
    },
    InternshipForm: {
      name: 'InternshipForm (Form Sub-section)',
      purpose: 'Renders the fields for the internship registration, capturing events like inputs, checkbox clicks, changes, validations, submits and resets.',
      props: 'Renders inside JavaScriptLab. Inherits state handlers.',
      state: 'None (Controlled by JavaScriptLab parent)',
      reusable: 'No (Form Specific)'
    },
    InputField: {
      name: 'InputField',
      purpose: 'Reusable text/email input form-field displaying labels, dynamic borders on error, and red validation alerts.',
      props: 'label, type, name, value, placeholder, error, onChange, onBlur',
      state: 'None',
      reusable: 'Yes (Highly Reusable UI Input)'
    },
    SelectField: {
      name: 'SelectField',
      purpose: 'Reusable drop-down selector wrapper for course and domain vectors, displaying form error labels.',
      props: 'label, name, value, options (array), error, onChange, onBlur',
      state: 'None',
      reusable: 'Yes (Highly Reusable UI Input)'
    },
    TextAreaField: {
      name: 'TextAreaField',
      purpose: 'Reusable text area component for longer narrative text SOP statements.',
      props: 'label, name, value, placeholder, error, onChange, onBlur, rows',
      state: 'None',
      reusable: 'Yes (Highly Reusable UI Input)'
    },
    Button: {
      name: 'Button',
      purpose: 'Standardised actions trigger wrapper supporting multiple styles: primary, secondary, success, and danger. Incorporates micro-animations.',
      props: 'children, onClick, type, variant, disabled, style',
      state: 'None',
      reusable: 'Yes (Core UI Action Component)'
    },
    ApplicationPreview: {
      name: 'ApplicationPreview (Preview Sub-section)',
      purpose: 'Dynamic presentational block rendered side-by-side with the form. Formats active user form state into a professional resume mock.',
      props: 'form (object)',
      state: 'None',
      reusable: 'No'
    },
    ReactComponentLab: {
      name: 'ReactComponentLab',
      purpose: 'Tutorial 04 workspace displaying structural component mappings, concepts cards, and interactive detail boxes.',
      props: 'None',
      state: 'selectedNode (string)',
      reusable: 'No (App Specific Page)'
    },
    Footer: {
      name: 'Footer',
      purpose: 'Affixes practical details to bottom of views, presenting built credits and technologies used.',
      props: 'None',
      state: 'None',
      reusable: 'No'
    }
  };

  const currentInfo = componentsData[selectedNode] || componentsData['App'];

  // Node hierarchy styles
  const treeSectionStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    padding: '1.5rem',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg)',
    overflowX: 'auto'
  };

  const renderNode = (id, label, level = 0) => {
    const isActive = selectedNode === id;
    const paddingLeft = `${level * 1.5}rem`;
    
    return (
      <div 
        key={id} 
        onClick={() => setSelectedNode(id)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem 0.5rem ' + paddingLeft,
          cursor: 'pointer',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: isActive ? 'var(--primary-glow)' : 'transparent',
          borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
          transition: 'var(--transition)',
          color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)'
        }}
        className="tree-node-interactive"
      >
        <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>
          {level === 0 ? '💻' : level === 1 ? '📄' : '🧩'}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: isActive ? '600' : '400' }}>
          {label}
        </span>
        {isActive && (
          <span className="badge badge-primary" style={{ fontSize: '0.6rem', padding: '0.1rem 0.3rem', marginLeft: 'auto' }}>
            Active
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="fade-in">
      <SectionHeader 
        badge="Tutorial 04" 
        title="React Component Lab" 
        subtitle="Analyze application modularity and explore props, state, and hierarchical trees."
      />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        
        {/* Component Tree Navigation */}
        <div style={treeSectionStyle}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🌴</span> Application Component Tree
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
            {renderNode('App', 'App (Root)')}
            {renderNode('Navbar', '├── Navbar', 1)}
            {renderNode('Dashboard', '├── Dashboard', 1)}
            
            {renderNode('HTTPExplorer', '├── HTTPExplorer', 1)}
            
            {renderNode('LayoutLab', '├── LayoutLab', 1)}
            
            {renderNode('JavaScriptLab', '├── JavaScriptLab', 1)}
            {renderNode('InternshipForm', '│   ├── InternshipForm', 2)}
            {renderNode('InputField', '│   │   ├── InputField', 3)}
            {renderNode('SelectField', '│   │   ├── SelectField', 3)}
            {renderNode('TextAreaField', '│   │   ├── TextAreaField', 3)}
            {renderNode('Button', '│   │   └── Button', 3)}
            {renderNode('ApplicationPreview', '│   └── ApplicationPreview', 2)}
            
            {renderNode('ReactComponentLab', '├── ReactComponentLab', 1)}
            {renderNode('Footer', '└── Footer', 1)}
          </div>
        </div>

        {/* Selected Component metadata details */}
        <Card title={`Component: <${currentInfo.name} />`} subtitle="Metadata & Architecture Properties">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
            <div>
              <strong style={{ color: 'var(--primary)', display: 'block', marginBottom: '0.25rem' }}>Purpose & Role:</strong>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>{currentInfo.purpose}</p>
            </div>

            <div>
              <strong style={{ color: 'var(--accent)', display: 'block', marginBottom: '0.25rem' }}>Received Props:</strong>
              <pre style={{ backgroundColor: 'var(--bg-primary)', padding: '0.5rem 0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', overflowX: 'auto' }}>
                {currentInfo.props}
              </pre>
            </div>

            <div>
              <strong style={{ color: 'var(--success)', display: 'block', marginBottom: '0.25rem' }}>Internal State:</strong>
              <pre style={{ backgroundColor: 'var(--bg-primary)', padding: '0.5rem 0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', overflowX: 'auto' }}>
                {currentInfo.state}
              </pre>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
              <span style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>Reusable Component:</span>
              <span className={`badge ${currentInfo.reusable.startsWith('Yes') ? 'badge-success' : 'badge-primary'}`}>
                {currentInfo.reusable}
              </span>
            </div>
          </div>
        </Card>

      </div>

      {/* Academic React Concepts Panel */}
      <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--text-primary)' }}>
        React Architecture Theory
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        
        <Card title="Components" subtitle="Modular Building Blocks">
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Independent, reusable blocks of interface code that combine markup (JSX), styles, and interactive logic. Standardizing code into components allows developers to manage complex systems cleanly.
          </p>
        </Card>

        <Card title="Props" subtitle="Data Flow Vectors">
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Immutable input parameters passed down from parent elements to child components. Props enable customized behavior in generic controls (such as supplying specific labels or change triggers).
          </p>
        </Card>

        <Card title="State" subtitle="Internal Interactive Memory">
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Mutable variables managed internally within a specific component. When state references change, React schedules a component re-render, automatically refreshing child layers.
          </p>
        </Card>

        <Card title="Reusability" subtitle="Architecture Efficiency">
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            The process of creating generalized components (e.g. <code>Button</code>, <code>InputField</code>) that can be utilized multiple times with different attributes, avoiding code duplication (DRY principle).
          </p>
        </Card>
      </div>

      {/* DevTools evidence panel */}
      <EvidencePanel 
        title="How to demonstrate this tutorial to your evaluator" 
        steps={[
          'Click on different node items in the "Application Component Tree" (such as App, InputField, JavaScriptLab).',
          'Observe that the right-side metadata card updates dynamically to show the purpose, props, state parameters, and reusability rating.',
          'Explain how this hierarchy maps to the physical files in the project workspace (e.g. App.js contains navbar state, components folder contains reusables, pages folder contains major sections).',
          'Discuss how the InputField, SelectField, TextAreaField and Button components are instantiated inside the Internship Form to fulfill the DRY (Don\'t Repeat Yourself) principle.'
        ]}
      />
    </div>
  );
};

export default ReactComponentLab;
