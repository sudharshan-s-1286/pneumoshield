import React from 'react'
import {
  Upload,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Image as ImageIcon,
  RefreshCw,
  X,
  Sliders,
  Layers,
  Info,
  ShieldAlert
} from 'lucide-react'

export default function AnalyzeView({
  selectedFile,
  imagePreview,
  isDragging,
  threshold,
  setThreshold,
  isLoading,
  errorMsg,
  predictionResult,
  activeImageView,
  setActiveImageView,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleFileChange,
  handleReset,
  handleAnalyze,
  fileInputRef,
  backendHealth
}) {
  return (
    <section className="analyze-section">
      <div className="section-header-block" style={{ marginBottom: '1.75rem' }}>
        <div className="hero-badge">
          <Activity size={14} /> DenseNet-121 Clinical Inference
        </div>
        <h2 className="hero-title" style={{ fontSize: '2.2rem' }}>
          Chest X-Ray Analysis &amp; Grad-CAM
        </h2>
        <p className="hero-subtitle">
          Upload an anterior-posterior chest radiograph (PNG or JPEG ≤ 15MB) to execute forward inference
          and synthesize interpretability heatmaps.
        </p>
      </div>

      {/* Backend offline warning banner if not running */}
      {backendHealth.status === 'offline' && (
        <div className="alert-box warning" style={{ marginBottom: '1.5rem' }}>
          <AlertTriangle size={20} style={{ flexShrink: 0 }} />
          <span>
            <strong>Flask Backend Offline:</strong> The Python server at <code>http://127.0.0.1:5000</code> is
            not detected. You can upload an image, but please ensure <code>backend.bat</code> or{' '}
            <code>python backend/app.py</code> is running before analyzing.
          </span>
        </div>
      )}

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
                0.75 (Trained Default)
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
                <RefreshCw size={18} className="spinner" /> Running DenseNet-121 Inference...
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
                  Evaluated against decision cutoff ={' '}
                  <strong>{predictionResult.threshold}</strong>. (Pneumonia score ≥{' '}
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

      {/* Advisory Notice */}
      <div className="academic-notice-banner" style={{ marginTop: '2rem' }}>
        <ShieldAlert size={18} className="notice-icon" />
        <div className="notice-text">
          <strong>Decision Support Prototype Only:</strong> Predictions and heatmaps generated by PneumoShield AI
          are intended for educational demonstration and computer vision research. This tool does not provide medical
          diagnoses, triage confirmations, or treatment prescriptions.
        </div>
      </div>
    </section>
  )
}
