import React from 'react'
import {
  Info,
  CheckCircle2,
  Cpu,
  Layers,
  Code2,
  ShieldAlert,
  Target,
  BookOpen,
  Sliders
} from 'lucide-react'

export default function AboutView() {
  return (
    <div className="about-page">
      {/* Header */}
      <div className="section-header-block">
        <div className="hero-badge">
          <Info size={14} /> Project Documentation
        </div>
        <h2 className="hero-title" style={{ fontSize: '2.3rem' }}>
          Pneumonia Detection from Chest X-Ray Images Using Deep Learning
        </h2>
        <p className="hero-subtitle">
          PneumoShield AI: Deep Transfer Learning &amp; Explainable AI for Pediatric Chest Radiographs
        </p>
      </div>

      {/* Problem Statement & Motivation */}
      <div className="analytics-dual-grid">
        <div className="panel-card">
          <div className="panel-card-header">
            <div>
              <h3 className="panel-title" style={{ marginBottom: '0.2rem' }}>
                <BookOpen size={18} /> Problem Statement &amp; Motivation
              </h3>
              <span className="panel-subtitle">Clinical Urgency in Global Pediatric Health</span>
            </div>
          </div>

          <p className="card-prose">
            Pneumonia remains a leading cause of infectious mortality among pediatric populations globally,
            claiming hundreds of thousands of lives each year according to the World Health Organization (WHO).
            Frontal chest radiography (CXR) is the standard frontline diagnostic imaging modality; however,
            its clinical utility is often throttled by significant radiologist shortages in low- and middle-income regions.
          </p>

          <p className="card-prose">
            Furthermore, human radiographic interpretation suffers from substantial intra- and inter-observer
            variability, particularly in subtle viral interstitial infiltrates versus early-stage bacterial consolidations.
            There is a compelling need for an automated, highly sensitive screening prototype that alerts clinicians
            to potential pathologies and provides visual spatial justification for its output.
          </p>
        </div>

        <div className="panel-card">
          <div className="panel-card-header">
            <div>
              <h3 className="panel-title" style={{ marginBottom: '0.2rem' }}>
                <Target size={18} /> Project Objectives
              </h3>
              <span className="panel-subtitle">Core Engineering Milestones</span>
            </div>
          </div>

          <div className="objectives-list">
            <div className="obj-item">
              <CheckCircle2 size={18} className="obj-icon" />
              <div>
                <strong>High-Sensitivity Detection:</strong> Develop a deep convolutional network achieving &gt;95%
                sensitivity on held-out test cases to minimize dangerous false negatives (missed infections).
              </div>
            </div>

            <div className="obj-item">
              <CheckCircle2 size={18} className="obj-icon" />
              <div>
                <strong>Explainable Visual Evidence:</strong> Integrate Gradient-Weighted Class Activation Mapping
                (Grad-CAM) to generate real-time heatmaps without external computational dependencies.
              </div>
            </div>

            <div className="obj-item">
              <CheckCircle2 size={18} className="obj-icon" />
              <div>
                <strong>Calibrated Decision Thresholding:</strong> Implement physician-adjustable decision thresholds
                (0.50–0.90) to enable flexible balancing between screening sensitivity and specific confirmatory testing.
              </div>
            </div>

            <div className="obj-item">
              <CheckCircle2 size={18} className="obj-icon" />
              <div>
                <strong>Lightweight Decoupled Architecture:</strong> Build a clean, stateless Flask REST API and
                responsive React 18 client for rapid, accessible deployment.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Proposed Solution & Key Features */}
      <div className="panel-card" style={{ marginTop: '2rem' }}>
        <div className="panel-card-header">
          <div>
            <h3 className="panel-title" style={{ marginBottom: '0.2rem' }}>
              <Cpu size={18} /> Proposed Solution &amp; Key Features
            </h3>
            <span className="panel-subtitle">Architectural &amp; Algorithmic Highlights</span>
          </div>
        </div>

        <div className="features-grid" style={{ marginTop: '0.5rem' }}>
          <div className="feature-card">
            <div className="feature-card-icon">
              <Cpu size={22} />
            </div>
            <h3>DenseNet-121 Transfer Learning</h3>
            <p>
              Employs dense connectivity where each convolutional layer receives collective feature maps from
              all prior layers. Alleviates vanishing gradients and enables rich multi-scale tissue feature reuse
              with only 7.03M parameters.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-card-icon">
              <Layers size={22} />
            </div>
            <h3>On-The-Fly Grad-CAM Generation</h3>
            <p>
              Computes gradient activation maps directly from the final convolutional layer (<code>relu</code>),
              encoding both 55/45 blended overlays and raw JET colormaps into Base64 strings inside the primary
              JSON prediction payload.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-card-icon">
              <Sliders size={22} />
            </div>
            <h3>Threshold Calibration</h3>
            <p>
              Provides interactive slider control from 0.50 to 0.90, allowing doctors to compare baseline
              screening (0.50 cutoff, 96.67% recall) with calibrated operating points (0.75 cutoff) to reduce false alarms.
            </p>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="panel-card" style={{ marginTop: '2rem' }}>
        <div className="panel-card-header">
          <div>
            <h3 className="panel-title" style={{ marginBottom: '0.2rem' }}>
              <Code2 size={18} /> Verified Technology Stack
            </h3>
            <span className="panel-subtitle">Standardized Frameworks &amp; Core Dependencies</span>
          </div>
        </div>

        <div className="tech-stack-grid">
          <div className="tech-item">
            <div className="tech-badge">Deep Learning</div>
            <h4>TensorFlow &amp; Keras</h4>
            <p>DenseNet-121 architecture, two-stage fine-tuning schedule, and GradientTape backpropagation.</p>
          </div>

          <div className="tech-item">
            <div className="tech-badge">Inference API</div>
            <h4>Flask REST Framework</h4>
            <p>Lightweight, stateless Python HTTP microservice coordinating image decode, tensor preparation, and inference.</p>
          </div>

          <div className="tech-item">
            <div className="tech-badge">Computer Vision</div>
            <h4>OpenCV &amp; Pillow (PIL)</h4>
            <p>High-fidelity byte stream decoding, bicubic 224×224 resizing, JET colormap mapping, and alpha blending.</p>
          </div>

          <div className="tech-item">
            <div className="tech-badge">Client Interface</div>
            <h4>React 18 &amp; Vite</h4>
            <p>Modern single-page application with responsive layouts, real-time health polling, and Lucide icons.</p>
          </div>
        </div>
      </div>

      {/* Intended Use, Scope & Contributor Context */}
      <div className="panel-card" style={{ marginTop: '2rem' }}>
        <div className="panel-card-header">
          <div>
            <h3 className="panel-title" style={{ marginBottom: '0.2rem' }}>
              <ShieldAlert size={18} /> Intended Use &amp; Educational Scope
            </h3>
            <span className="panel-subtitle">Academic Project Disclosure</span>
          </div>
        </div>

        <div className="card-prose">
          <p>
            <strong>Project Context:</strong> This application was designed, implemented, and audited as an
            academic B.Tech Artificial Intelligence and Machine Learning demonstration project.
          </p>
          <p style={{ marginTop: '0.8rem' }}>
            <strong>Intended Use:</strong> This software is intended strictly for educational exploration,
            benchmarking, and algorithmic transparency research. It illustrates how deep convolutional networks
            and Grad-CAM explainability can be combined in an intuitive web interface.
          </p>
          <p style={{ marginTop: '0.8rem' }}>
            <strong>Explicit Non-Diagnostic Boundary:</strong> Under no circumstances should this software be
            employed as a certified medical device, diagnostic determinant, or treatment decision engine. It has not
            undergone multi-center clinical trials, regulatory audit (FDA/CE), or safety validation on heterogeneous
            patient populations.
          </p>
        </div>
      </div>
    </div>
  )
}
