import React from 'react'

export default function Footer({ setActiveTab }) {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          <strong>PneumoShield AI</strong> • Pneumonia Detection from Chest X-Ray Images Using Deep Learning
        </p>
        <p style={{ marginTop: '0.4rem', fontSize: '0.82rem', color: '#94a3b8' }}>
          DenseNet-121 Deep Transfer Learning • Gradient-Weighted Class Activation Mapping (Grad-CAM) • Flask &amp; React 18
        </p>
        <div className="footer-links">
          <button onClick={() => setActiveTab('home')}>Home</button>
          <span>•</span>
          <button onClick={() => setActiveTab('predict')}>Analyze X-Ray</button>
          <span>•</span>
          <button onClick={() => setActiveTab('performance')}>Performance Analytics</button>
          <span>•</span>
          <button onClick={() => setActiveTab('dataset')}>Dataset</button>
          <span>•</span>
          <button onClick={() => setActiveTab('architecture')}>Architecture</button>
          <span>•</span>
          <button onClick={() => setActiveTab('xai')}>Grad-CAM XAI</button>
          <span>•</span>
          <button onClick={() => setActiveTab('about')}>About Project</button>
        </div>
        <p className="footer-disclaimer">
          ⚠️ <strong>Educational Prototype:</strong> Intended solely for academic demonstration and research.
          Not clinically validated or FDA-cleared. Not a substitute for professional radiological consultation.
        </p>
      </div>
    </footer>
  )
}
