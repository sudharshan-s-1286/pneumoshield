import React from 'react'
import {
  Layers,
  Upload,
  BarChart3,
  ArrowRight,
  Cpu,
  Activity,
  Database
} from 'lucide-react'

export default function HomeView({ setActiveTab }) {
  return (
    <section className="hero-section">
      <div className="hero-badge">
        <Layers size={14} /> DenseNet-121 Deep Transfer Learning
      </div>
      <h2 className="hero-title">
        AI-Powered Chest Radiograph <br />
        <span>Pneumonia Detection &amp; Explainability</span>
      </h2>
      <p className="hero-subtitle">
        Automated classification of frontal chest radiographs into <strong>NORMAL</strong> vs.{' '}
        <strong>PNEUMONIA</strong> using a fine-tuned DenseNet-121 convolutional architecture paired
        with Gradient-Weighted Class Activation Mapping (Grad-CAM).
      </p>

      <div className="hero-actions">
        <button
          className="btn-primary"
          onClick={() => setActiveTab('predict')}
        >
          <Upload size={18} /> Analyze Chest Radiograph <ArrowRight size={16} />
        </button>
        <button
          className="btn-secondary"
          onClick={() => setActiveTab('performance')}
        >
          <BarChart3 size={18} /> Model Performance Analytics
        </button>
      </div>

      {/* Reported Stats Strip */}
      <div className="stats-strip">
        <div className="stat-item">
          <div className="stat-value">89.58%</div>
          <div className="stat-label">Test Accuracy (0.50)</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">96.67%</div>
          <div className="stat-label">Pneumonia Sensitivity</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">~0.965</div>
          <div className="stat-label">ROC-AUC Score</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">0.75</div>
          <div className="stat-label">Calibrated Operating Point</div>
        </div>
      </div>

      {/* Architecture Highlights */}
      <div className="features-grid">
        <div className="feature-card" onClick={() => setActiveTab('architecture')} style={{ cursor: 'pointer' }}>
          <div className="feature-card-icon">
            <Cpu size={24} />
          </div>
          <h3>DenseNet-121 Backbone</h3>
          <p>
            Utilizes 121 densely connected neural layers pre-trained on ImageNet, enabling rich multi-scale
            feature reuse and robust gradient flow across lung tissue representations with 7.03M parameters.
          </p>
        </div>

        <div className="feature-card" onClick={() => setActiveTab('xai')} style={{ cursor: 'pointer' }}>
          <div className="feature-card-icon">
            <Activity size={24} />
          </div>
          <h3>Grad-CAM Explainability</h3>
          <p>
            Overcomes "black box" skepticism by synthesizing localized JET heatmaps from the final convolutional
            activation layer (<code>relu</code>), highlighting focal opacities directly on the original radiograph.
          </p>
        </div>

        <div className="feature-card" onClick={() => setActiveTab('dataset')} style={{ cursor: 'pointer' }}>
          <div className="feature-card-icon">
            <Database size={24} />
          </div>
          <h3>Curated Dataset &amp; Splits</h3>
          <p>
            Trained and benchmarked on 5,856 radiographs from the Kermany et al. pediatric cohort, with an
            untouched 624-image held-out test set guaranteeing zero data leakage.
          </p>
        </div>
      </div>
    </section>
  )
}
