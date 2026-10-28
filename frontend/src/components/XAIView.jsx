import React, { useState } from 'react'
import {
  Layers,
  Eye,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  ArrowRight
} from 'lucide-react'

export default function XAIView({ onNavigateToAnalyze }) {
  const [activeGuideView, setActiveGuideView] = useState('overlay')

  return (
    <div className="xai-page">
      {/* Header */}
      <div className="section-header-block">
        <div className="hero-badge">
          <Layers size={14} /> Explainable AI (XAI)
        </div>
        <h2 className="hero-title" style={{ fontSize: '2.3rem' }}>
          Gradient-Weighted Class Activation Mapping (Grad-CAM)
        </h2>
        <p className="hero-subtitle">
          How deep convolutional features are visually mapped back to anatomical lung regions,
          providing transparency into the deep learning classification process.
        </p>
      </div>

      {/* Intro Grid */}
      <div className="analytics-dual-grid">
        <div className="panel-card">
          <div className="panel-card-header">
            <div>
              <h3 className="panel-title" style={{ marginBottom: '0.2rem' }}>
                <Eye size={18} /> The Clinical Imperative for Explainability
              </h3>
              <span className="panel-subtitle">Overcoming the "Black Box" Barrier in Medical Imaging</span>
            </div>
          </div>

          <p className="card-prose">
            Standard deep neural networks are frequently criticized as opaque "black boxes." In medical radiology,
            a high numerical probability score alone is insufficient. Clinicians must verify that the neural network
            is attending to legitimate pulmonary consolidations—rather than spurious imaging artifacts such as
            implanted pacemakers, medical markers, or diaphragmatic contours.
          </p>

          <p className="card-prose">
            PneumoShield AI implements <strong>Grad-CAM (Selvaraju et al., 2017)</strong> directly inside the
            Flask inference microservice. Upon forward inference, the system intercepts backpropagated gradients
            at the network's final convolutional layer, producing high-resolution, interpretable heatmaps in real time.
          </p>
        </div>

        <div className="panel-card">
          <div className="panel-card-header">
            <div>
              <h3 className="panel-title" style={{ marginBottom: '0.2rem' }}>
                <Sliders size={18} /> Mathematical Mechanism
              </h3>
              <span className="panel-subtitle">Step-by-Step Gradient Backpropagation</span>
            </div>
          </div>

          <div className="math-steps-list">
            <div className="math-step-item">
              <span className="m-step-badge">1</span>
              <div>
                <strong>Target Conv Layer Isolation:</strong> Locates the final convolutional layer{' '}
                (<code>relu</code> in DenseNet-121) where high-level semantic representations remain spatially mapped.
              </div>
            </div>

            <div className="math-step-item">
              <span className="m-step-badge">2</span>
              <div>
                <strong>Gradient Extraction:</strong> Calculates the gradient of the predicted pneumonia score{' '}
                <code>y^c</code> with respect to feature activation maps <code>A^k</code>:
                <div className="math-eq">∂yᶜ / ∂Aᵏ</div>
              </div>
            </div>

            <div className="math-step-item">
              <span className="m-step-badge">3</span>
              <div>
                <strong>Global Average Pooling:</strong> Pools gradients across spatial height and width to compute
                importance weights <code>α_k^c</code> for each feature map.
              </div>
            </div>

            <div className="math-step-item">
              <span className="m-step-badge">4</span>
              <div>
                <strong>Rectified Linear Combination:</strong> Applies <code>ReLU(∑ α_k^c A^k)</code> to isolate only
                those visual features that positively contribute to the pneumonia diagnosis.
              </div>
            </div>

            <div className="math-step-item">
              <span className="m-step-badge">5</span>
              <div>
                <strong>Compositing:</strong> Heatmap is normalized to [0, 1], resized to native image resolution,
                color-mapped with OpenCV <code>JET</code>, and alpha-blended (55% original radiograph, 45% heatmap).
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Guide: Original vs Heatmap vs Overlay */}
      <div className="panel-card" style={{ marginTop: '2rem' }}>
        <div className="panel-card-header">
          <div>
            <h3 className="panel-title" style={{ marginBottom: '0.2rem' }}>
              <Layers size={18} /> Visual Guide to Diagnostic Display Modes
            </h3>
            <span className="panel-subtitle">Understanding the 3 Toggleable Views in the Analysis Interface</span>
          </div>

          <div className="chart-filter-toggle">
            <button
              className={`filter-btn ${activeGuideView === 'overlay' ? 'active' : ''}`}
              onClick={() => setActiveGuideView('overlay')}
            >
              Overlay Mode
            </button>
            <button
              className={`filter-btn ${activeGuideView === 'heatmap' ? 'active' : ''}`}
              onClick={() => setActiveGuideView('heatmap')}
            >
              Heatmap Mode
            </button>
            <button
              className={`filter-btn ${activeGuideView === 'original' ? 'active' : ''}`}
              onClick={() => setActiveGuideView('original')}
            >
              Original Radiograph
            </button>
          </div>
        </div>

        <div className="guide-view-container">
          <div className="guide-description-card">
            {activeGuideView === 'overlay' && (
              <>
                <div className="guide-tag tag-overlay">Alpha-Blended Composite (Default)</div>
                <h4>55% Radiograph + 45% JET Color Heatmap</h4>
                <p>
                  Combines high-contrast grayscale anatomical tissue structures with thermal activation intensities.
                  Allows radiologists to visually correlate glowing hot zones directly against focal infiltrates,
                  bronchovascular markings, or lobar opacities.
                </p>
                <div className="guide-pointers">
                  <div className="gp-item">
                    <span className="color-swatch-red" />
                    <span><strong>Red / Yellow Hues:</strong> Peak neural network attention correlating with pneumonia features.</span>
                  </div>
                  <div className="gp-item">
                    <span className="color-swatch-blue" />
                    <span><strong>Deep Blue / Cyan Hues:</strong> Baseline lung parenchyma with neutral or negligible activation.</span>
                  </div>
                </div>
              </>
            )}

            {activeGuideView === 'heatmap' && (
              <>
                <div className="guide-tag tag-heatmap">Raw JET Colormap</div>
                <h4>Normalized Thermal Spectrum Only</h4>
                <p>
                  Isolates the gradient activation intensity map without anatomical background overlay.
                  Useful for assessing the spatial dispersion, focal concentration, and peak density of the
                  model's internal feature activations.
                </p>
                <div className="guide-pointers">
                  <div className="gp-item">
                    <CheckCircle2 size={16} style={{ color: 'var(--accent-teal)' }} />
                    <span>Enables inspection of whether attention is focal (localized) or diffuse (widespread bilateral).</span>
                  </div>
                </div>
              </>
            )}

            {activeGuideView === 'original' && (
              <>
                <div className="guide-tag tag-original">Unprocessed Input</div>
                <h4>Baseline Patient Chest Radiograph</h4>
                <p>
                  The untouched radiograph uploaded by the clinician. Preserves raw greyscale radiographic
                  density for baseline anatomic comparison without any overlaid artifacts.
                </p>
                <div className="guide-pointers">
                  <div className="gp-item">
                    <CheckCircle2 size={16} style={{ color: 'var(--accent-teal)' }} />
                    <span>Verify rib cage symmetry, mediastinal contour, and exposure quality.</span>
                  </div>
                </div>
              </>
            )}

            <div style={{ marginTop: '1.5rem' }}>
              <button className="btn-primary" onClick={onNavigateToAnalyze}>
                Try Live Inference with Grad-CAM <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="guide-schematic-card">
            <div className="schematic-view-box">
              <div className={`schematic-inner ${activeGuideView}`}>
                {activeGuideView === 'original' && (
                  <div className="schematic-simulated sim-original">
                    <div className="lung-field left-lung" />
                    <div className="lung-field right-lung" />
                    <div className="cardiac-shadow" />
                    <span className="sim-label">Original Radiograph Anatomy</span>
                  </div>
                )}
                {activeGuideView === 'heatmap' && (
                  <div className="schematic-simulated sim-heatmap">
                    <div className="heat-glow glow-hot" />
                    <div className="heat-glow glow-warm" />
                    <span className="sim-label">JET Thermal Gradient Activations</span>
                  </div>
                )}
                {activeGuideView === 'overlay' && (
                  <div className="schematic-simulated sim-overlay">
                    <div className="lung-field left-lung" />
                    <div className="lung-field right-lung">
                      <div className="overlay-heat" />
                    </div>
                    <div className="cardiac-shadow" />
                    <span className="sim-label">55% Anatomical / 45% JET Heatmap</span>
                  </div>
                )}
              </div>
            </div>
            <span className="schematic-caption">
              Mode: <strong>{activeGuideView.toUpperCase()}</strong> (Interactive toggle in Analyze X-Ray view)
            </span>
          </div>
        </div>
      </div>

      {/* Critical Scientific Limitations Warning */}
      <div className="limitations-banner" style={{ marginTop: '2rem' }}>
        <AlertTriangle size={22} className="lim-icon" />
        <div className="lim-content">
          <h4>Critical Scientific &amp; Clinical XAI Clarifications</h4>
          <p>
            While Grad-CAM provides valuable diagnostic transparency, its limitations must be clearly understood:
          </p>
          <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem', lineHeight: '1.6' }}>
            <li>
              <strong>Coarse Spatial Resolution:</strong> Because feature maps from layer <code>relu</code> have
              been downsampled multiple times through DenseNet transition blocks, the resulting heatmap is low-resolution
              (e.g., 7×7 upsampled to 224×224). It cannot resolve micro-nodules or subtle subsegmental atelectasis.
            </li>
            <li>
              <strong>Not a Segmentation Mask:</strong> Grad-CAM highlights regions <em>correlated</em> with the
              output decision. It is <strong>NOT</strong> an exact organ or lesion segmentation boundary.
            </li>
            <li>
              <strong>Not Proof of Clinical Reasoning:</strong> A high activation zone does not prove the model
              understands human physiology or microbiological causation; it simply identifies input features most
              influential to the mathematical classification.
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
