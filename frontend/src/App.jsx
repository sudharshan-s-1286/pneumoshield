import React, { useState, useEffect, useRef } from 'react'
import {
  Activity,
  Upload,
  Cpu,
  BarChart3,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Layers,
  ArrowRight,
  RefreshCw,
  Image as ImageIcon,
  Sliders,
  Info,
  Check,
  X
} from 'lucide-react'

export default function App() {
  const [activeTab, setActiveTab] = useState('predict')
  const [backendHealth, setBackendHealth] = useState({
    status: 'checking',
    modelLoaded: false,
    message: 'Checking Flask API...'
  })

  // Upload and inference state
  const [selectedFile, setSelectedFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [threshold, setThreshold] = useState(0.75)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const [predictionResult, setPredictionResult] = useState(null)
  const [activeImageView, setActiveImageView] = useState('overlay') // 'original', 'overlay', 'heatmap'

  const fileInputRef = useRef(null)

  // Check backend health
  const checkHealth = () => {
    fetch('/api/health')
      .then(res => {
        if (!res.ok) throw new Error('Backend HTTP error')
        return res.json()
      })
      .then(data => {
        setBackendHealth({
          status: 'online',
          modelLoaded: Boolean(data.model_loaded),
          message: data.message || 'Connected to Backend'
        })
      })
      .catch(() => {
        setBackendHealth({
          status: 'offline',
          modelLoaded: false,
          message: 'Backend not started yet'
        })
      })
  }

  useEffect(() => {
    checkHealth()
    const timer = setInterval(checkHealth, 10000)
    return () => clearInterval(timer)
  }, [])

  // Handle file selection
  const handleFile = (file) => {
    if (!file) return
    setErrorMsg(null)
    setPredictionResult(null)

    // Validate type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (!validTypes.includes(file.type.toLowerCase())) {
      setErrorMsg('Please upload a valid chest X-ray image (JPEG, JPG, or PNG).')
      return
    }

    // Validate size (max 15MB)
    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg('Image size exceeds 15MB limit. Please upload a smaller radiograph.')
      return
    }

    setSelectedFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  // Reset file selection
  const handleReset = () => {
    setSelectedFile(null)
    setImagePreview(null)
    setPredictionResult(null)
    setErrorMsg(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Trigger Model Prediction
  const handleAnalyze = async () => {
    if (!selectedFile) {
      setErrorMsg('Please select an X-ray image first.')
      return
    }

    setIsLoading(true)
    setErrorMsg(null)

    const formData = new FormData()
    formData.append('image', selectedFile)
    formData.append('threshold', threshold.toString())

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Prediction request failed.')
      }

      setPredictionResult(data)
    } catch (err) {
      console.error(err)
      setErrorMsg(
        err.message || 'Unable to connect to Flask backend. Make sure the backend server is running.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <header className="navbar">
        <div className="nav-brand" onClick={() => setActiveTab('home')}>
          <div className="brand-icon">
            <Activity size={22} />
          </div>
          <div className="brand-text">
            <h1>PneumoShield AI</h1>
            <span>DenseNet-121 Clinical Radiograph Classifier</span>
          </div>
        </div>

        <nav>
          <ul className="nav-links">
            <li>
              <button
                className={`nav-item-btn ${activeTab === 'home' ? 'active' : ''}`}
                onClick={() => setActiveTab('home')}
              >
                <Cpu size={16} /> Home
              </button>
            </li>
            <li>
              <button
                className={`nav-item-btn ${activeTab === 'predict' ? 'active' : ''}`}
                onClick={() => setActiveTab('predict')}
              >
                <Upload size={16} /> Analyze X-Ray
              </button>
            </li>
            <li>
              <button
                className={`nav-item-btn ${activeTab === 'how-it-works' ? 'active' : ''}`}
                onClick={() => setActiveTab('how-it-works')}
              >
                <HelpCircle size={16} /> How It Works
              </button>
            </li>
            <li>
              <button
                className={`nav-item-btn ${activeTab === 'performance' ? 'active' : ''}`}
                onClick={() => setActiveTab('performance')}
              >
                <BarChart3 size={16} /> Model Performance
              </button>
            </li>
          </ul>
        </nav>

        {/* Backend Status Indicator */}
        <div className="backend-status-pill" title={backendHealth.message}>
          <span
            className={`status-dot ${
              backendHealth.status === 'online' ? 'online' : 'offline'
            }`}
          />
          <span>
            {backendHealth.status === 'online'
              ? backendHealth.modelLoaded
                ? 'Model Loaded (Ready)'
                : 'API Connected'
              : 'Backend Offline'}
          </span>
        </div>
      </header>

      {/* Main Content (Notice: Warning box removed as requested) */}
      <main className="main-content">
        {/* TAB 1: HOME */}
        {activeTab === 'home' && (
          <section className="hero-section">
            <div className="hero-badge">
              <Layers size={14} /> DenseNet-121 Deep Transfer Learning
            </div>
            <h2 className="hero-title">
              AI-Powered Chest Radiograph <br />
              <span>Pneumonia Detection &amp; Explainability</span>
            </h2>
            <p className="hero-subtitle">
              Automated classification of frontal chest radiographs into{' '}
              <strong>NORMAL</strong> vs. <strong>PNEUMONIA</strong> using a fine-tuned
              DenseNet-121 convolutional architecture paired with Gradient-Weighted Class
              Activation Mapping (Grad-CAM).
            </p>

            <div className="hero-actions">
              <button
                className="btn-primary"
                onClick={() => setActiveTab('predict')}
              >
                <Upload size={18} /> Start Analyzing An X-Ray <ArrowRight size={16} />
              </button>
              <button
                className="btn-secondary"
                onClick={() => setActiveTab('performance')}
              >
                <BarChart3 size={18} /> View Test Metrics
              </button>
            </div>

            {/* Reported Stats Strip */}
            <div className="stats-strip">
              <div className="stat-item">
                <div className="stat-value">89.58%</div>
                <div className="stat-label">Test Accuracy</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">96.51%</div>
                <div className="stat-label">Test ROC-AUC</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">96.67%</div>
                <div className="stat-label">Recall (Sensitivity)</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">0.75</div>
                <div className="stat-label">Calibrated Threshold</div>
              </div>
            </div>

            {/* Architecture Highlights */}
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-card-icon">
                  <Cpu size={24} />
                </div>
                <h3>DenseNet-121 Backbone</h3>
                <p>
                  Utilizes 121 densely connected neural layers pre-trained on
                  ImageNet, allowing rich feature reuse and robust gradient flow
                  across lung tissue representations.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-card-icon">
                  <Activity size={24} />
                </div>
                <h3>Grad-CAM Explainability</h3>
                <p>
                  Eliminates the "black box" concern by computing gradient-weighted
                  feature maps directly from the final convolutional activation layer,
                  highlighting suspect pathological regions.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-card-icon">
                  <FileText size={24} />
                </div>
                <h3>Calibrated Confidence</h3>
                <p>
                  Evaluates radiographs at standard (0.50) and optimized (0.75)
                  decision thresholds to minimize false positive alerts on normal
                  patients while safeguarding sensitivity.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* TAB 2: ANALYZE X-RAY (Fully Functional Upload & Inference) */}
        {activeTab === 'predict' && (
          <section className="analyze-section">
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div className="hero-badge">DenseNet-121 Clinical Inference</div>
              <h2 className="hero-title" style={{ fontSize: '2.2rem' }}>
                Chest X-Ray Analysis &amp; Grad-CAM
              </h2>
              <p className="hero-subtitle" style={{ marginBottom: '1rem' }}>
                Upload a frontal chest radiograph (PNG or JPEG) to generate automated
                classification and interpretability heatmaps.
              </p>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="alert-box error">
                <AlertTriangle size={20} style={{ flexShrink: 0 }} />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="analyze-grid">
              {/* Left Column: Upload & Controls */}
              <div className="panel-card">
                <h3 className="panel-title">
                  <Upload size={18} /> Upload Chest Radiograph
                </h3>

                {/* Drag & Drop Upload Zone */}
                <div
                  className={`dropzone ${isDragging ? 'dragging' : ''} ${
                    imagePreview ? 'has-image' : ''
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => !imagePreview && fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />

                  {imagePreview ? (
                    <div className="preview-container">
                      <img
                        src={imagePreview}
                        alt="Uploaded Chest X-ray"
                        className="preview-img"
                      />
                      <div className="preview-overlay">
                        <button
                          type="button"
                          className="btn-sm btn-change"
                          onClick={(e) => {
                            e.stopPropagation()
                            fileInputRef.current?.click()
                          }}
                        >
                          <RefreshCw size={14} /> Change Image
                        </button>
                        <button
                          type="button"
                          className="btn-sm btn-clear"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleReset()
                          }}
                        >
                          <X size={14} /> Clear
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="dropzone-empty">
                      <div className="upload-icon-circle">
                        <Upload size={32} />
                      </div>
                      <p className="dropzone-text-primary">
                        Drag &amp; drop chest X-ray image here
                      </p>
                      <p className="dropzone-text-secondary">
                        or click to browse your computer
                      </p>
                      <span className="file-format-badge">
                        Supports PNG, JPG, JPEG (Max 15MB)
                      </span>
                    </div>
                  )}
                </div>

                {/* Selected File Details */}
                {selectedFile && (
                  <div className="file-info-badge">
                    <ImageIcon size={16} />
                    <span className="file-name">{selectedFile.name}</span>
                    <span className="file-size">
                      ({(selectedFile.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                )}

                {/* Threshold Configuration */}
                <div className="threshold-container">
                  <div className="threshold-header">
                    <label htmlFor="threshold-slider" className="threshold-label">
                      <Sliders size={16} /> Decision Threshold
                    </label>
                    <span className="threshold-value">{threshold.toFixed(2)}</span>
                  </div>
                  <input
                    id="threshold-slider"
                    type="range"
                    min="0.50"
                    max="0.90"
                    step="0.05"
                    value={threshold}
                    onChange={(e) => setThreshold(parseFloat(e.target.value))}
                    className="slider-input"
                  />
                  <div className="threshold-hint">
                    <span>0.50 (Standard)</span>
                    <span style={{ color: 'var(--accent-teal)', fontWeight: 700 }}>
                      0.75 (Trained Optimal)
                    </span>
                    <span>0.90 (High Specificity)</span>
                  </div>
                </div>

                {/* Analyze Button */}
                <button
                  className="btn-primary btn-analyze"
                  onClick={handleAnalyze}
                  disabled={!selectedFile || isLoading}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw size={18} className="spinner" /> Running DenseNet-121
                      Inference...
                    </>
                  ) : (
                    <>
                      <Activity size={18} /> Analyze Chest Radiograph
                    </>
                  )}
                </button>
              </div>

              {/* Right Column: Prediction Results & Grad-CAM */}
              <div className="panel-card">
                <h3 className="panel-title">
                  <Activity size={18} /> Diagnostic Findings &amp; Visual Evidence
                </h3>

                {predictionResult ? (
                  <div className="results-wrapper">
                    {/* Primary Verdict Banner */}
                    <div
                      className={`verdict-banner ${
                        predictionResult.prediction === 'PNEUMONIA'
                          ? 'verdict-pneumonia'
                          : 'verdict-normal'
                      }`}
                    >
                      <div className="verdict-icon">
                        {predictionResult.prediction === 'PNEUMONIA' ? (
                          <AlertTriangle size={32} />
                        ) : (
                          <CheckCircle2 size={32} />
                        )}
                      </div>
                      <div>
                        <div className="verdict-label">Predicted Classification</div>
                        <div className="verdict-value">
                          {predictionResult.prediction}
                        </div>
                      </div>
                      <div className="confidence-pill">
                        {predictionResult.confidence.toFixed(1)}% Confidence
                      </div>
                    </div>

                    {/* Probability Breakdown Bar */}
                    <div className="score-breakdown-card">
                      <div className="score-row">
                        <span>Pneumonia Probability:</span>
                        <strong>
                          {(predictionResult.pneumonia_probability * 100).toFixed(2)}%
                        </strong>
                      </div>
                      <div className="progress-bar-bg">
                        <div
                          className="progress-bar-fill"
                          style={{
                            width: `${Math.min(
                              Math.max(
                                predictionResult.pneumonia_probability * 100,
                                3
                              ),
                              100
                            )}%`,
                            backgroundColor:
                              predictionResult.prediction === 'PNEUMONIA'
                                ? 'var(--danger-color)'
                                : 'var(--success-color)'
                          }}
                        />
                      </div>
                      <div className="score-row" style={{ marginTop: '0.4rem' }}>
                        <span>Normal Probability:</span>
                        <strong>
                          {(predictionResult.normal_probability * 100).toFixed(2)}%
                        </strong>
                      </div>
                      <div className="threshold-note">
                        Evaluated against threshold ={' '}
                        <strong>{predictionResult.threshold}</strong>. (Score ≥{' '}
                        {predictionResult.threshold} classifies as PNEUMONIA).
                      </div>
                    </div>

                    {/* Grad-CAM Viewer */}
                    {predictionResult.gradcam_url && (
                      <div className="gradcam-section">
                        <div className="gradcam-header">
                          <h4>
                            <Layers size={16} /> Grad-CAM Heatmap Visualization
                          </h4>
                          <div className="view-switch-btns">
                            <button
                              className={`switch-btn ${
                                activeImageView === 'overlay' ? 'active' : ''
                              }`}
                              onClick={() => setActiveImageView('overlay')}
                            >
                              Overlay
                            </button>
                            <button
                              className={`switch-btn ${
                                activeImageView === 'heatmap' ? 'active' : ''
                              }`}
                              onClick={() => setActiveImageView('heatmap')}
                            >
                              Heatmap Only
                            </button>
                            <button
                              className={`switch-btn ${
                                activeImageView === 'original' ? 'active' : ''
                              }`}
                              onClick={() => setActiveImageView('original')}
                            >
                              Original
                            </button>
                          </div>
                        </div>

                        <div className="gradcam-display-container">
                          {activeImageView === 'overlay' && (
                            <img
                              src={predictionResult.gradcam_url}
                              alt="Grad-CAM Overlay"
                              className="gradcam-image"
                            />
                          )}
                          {activeImageView === 'heatmap' && (
                            <img
                              src={
                                predictionResult.heatmap_url ||
                                predictionResult.gradcam_url
                              }
                              alt="Grad-CAM Heatmap"
                              className="gradcam-image"
                            />
                          )}
                          {activeImageView === 'original' && (
                            <img
                              src={imagePreview}
                              alt="Original X-ray"
                              className="gradcam-image"
                            />
                          )}
                        </div>

                        <p className="gradcam-explanation">
                          <Info size={14} style={{ flexShrink: 0 }} />
                          <span>
                            <strong>Explainability Insight:</strong> Highlighted regions
                            (warm red/yellow hues) indicate radiological zones where
                            DenseNet-121's deepest convolutional layer (
                            <code>relu</code>) registered the highest activation
                            gradients for pneumonia detection.
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="results-placeholder">
                    <div className="placeholder-icon">
                      <ImageIcon size={48} />
                    </div>
                    <h4>Awaiting Chest Radiograph</h4>
                    <p>
                      Select an image on the left and click{' '}
                      <strong>"Analyze Chest Radiograph"</strong> to generate the
                      verdict and Grad-CAM interpretability visualization.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* TAB 3: HOW IT WORKS */}
        {activeTab === 'how-it-works' && (
          <section style={{ padding: '2rem 1rem' }}>
            <h2 className="hero-title" style={{ textAlign: 'center' }}>
              System Workflow &amp; Architecture
            </h2>
            <p className="hero-subtitle" style={{ textAlign: 'center' }}>
              How raw chest radiographs are processed, evaluated, and explained.
            </p>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-card-icon">1</div>
                <h3>1. Image Input &amp; Resize</h3>
                <p>
                  The uploaded chest X-ray is converted to RGB and resized to{' '}
                  <strong>224 × 224 pixels</strong>.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-card-icon">2</div>
                <h3>2. DenseNet Preprocessing</h3>
                <p>
                  Normalized using <code>densenet.preprocess_input</code>, centering
                  and scaling pixel channels identically to training.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-card-icon">3</div>
                <h3>3. Model Forward Pass</h3>
                <p>
                  Feature maps flow through frozen and fine-tuned Dense blocks into
                  GlobalAveragePooling and Sigmoid activation.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-card-icon">4</div>
                <h3>4. Grad-CAM Generation</h3>
                <p>
                  Gradients are computed with respect to the final convolutional
                  activation layer (<code>relu</code> inside DenseNet121) to synthesize
                  a diagnostic heatmap.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* TAB 4: MODEL PERFORMANCE */}
        {activeTab === 'performance' && (
          <section style={{ padding: '2rem 1rem' }}>
            <h2 className="hero-title" style={{ textAlign: 'center' }}>
              Reported Model Evaluation
            </h2>
            <p className="hero-subtitle" style={{ textAlign: 'center' }}>
              Rigorous benchmarks computed on the untouched 624-image test set.
            </p>

            <div className="stats-strip">
              <div className="stat-item">
                <div className="stat-value">89.58%</div>
                <div className="stat-label">Accuracy (0.50 Threshold)</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">96.51%</div>
                <div className="stat-label">ROC-AUC Score</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">87.88%</div>
                <div className="stat-label">Precision (at 0.50)</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">96.67%</div>
                <div className="stat-label">Recall (at 0.50)</div>
              </div>
            </div>

            <div
              style={{
                background: 'white',
                padding: '2rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                marginTop: '2rem'
              }}
            >
              <h3 style={{ marginBottom: '1rem', color: 'var(--primary-navy)' }}>
                Reported Test Confusion Matrix (Threshold = 0.50)
              </h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Note: These values are reported historical benchmarks from the test set
                evaluation and are not a guarantee for future predictions.
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '1rem',
                  maxWidth: '500px'
                }}
              >
                <div
                  style={{
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#166534' }}>
                    182
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#15803d' }}>
                    True Normal (TN)
                  </div>
                </div>
                <div
                  style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#991b1b' }}>
                    52
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#b91c1c' }}>
                    False Positive (FP)
                  </div>
                </div>
                <div
                  style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#991b1b' }}>
                    13
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#b91c1c' }}>
                    False Negative (FN)
                  </div>
                </div>
                <div
                  style={{
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#166534' }}>
                    377
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#15803d' }}>
                    True Pneumonia (TP)
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>
          <strong>PneumoShield AI</strong> • Chest Radiograph Pneumonia Detection
          using DenseNet-121
        </p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#64748b' }}>
          Academic demonstration for research &amp; education. DenseNet-121 ImageNet
          Transfer Learning • Grad-CAM Explainability.
        </p>
      </footer>
    </div>
  )
}
