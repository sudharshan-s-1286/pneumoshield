import React from 'react'
import {
  Network,
  Upload,
  Cpu,
  Layers,
  ArrowRight,
  Server,
  Code2,
  FileCheck,
  CheckCircle2,
  Database,
  ArrowDown
} from 'lucide-react'

export default function ArchitectureView() {
  return (
    <div className="architecture-page">
      {/* Header */}
      <div className="section-header-block">
        <div className="hero-badge">
          <Network size={14} /> System Architecture
        </div>
        <h2 className="hero-title" style={{ fontSize: '2.3rem' }}>
          End-to-End System Pipeline &amp; Routing
        </h2>
        <p className="hero-subtitle">
          Modular separation between offline deep transfer learning and real-time, stateless inference
          microservices. Only two validated REST endpoints power the entire application.
        </p>
      </div>

      {/* Critical Clarification Banner */}
      <div className="academic-notice-banner" style={{ marginBottom: '2rem' }}>
        <CheckCircle2 size={18} className="notice-icon" />
        <div className="notice-text">
          <strong>Key Architectural Distinction:</strong> Model training is conducted strictly <strong>offline</strong>{' '}
          to generate the serialized weights file (<code>best_densenet121_finetuned.keras</code>). The live web application
          executes <strong>stateless forward-pass inference only</strong>—no retraining occurs when an image is uploaded.
        </div>
      </div>

      {/* Diagram Section 1: Real-Time Inference Pipeline */}
      <div className="panel-card">
        <div className="panel-card-header">
          <div>
            <h3 className="panel-title" style={{ marginBottom: '0.2rem' }}>
              <Server size={18} /> 1. Real-Time Inference Pipeline (Runtime Flow)
            </h3>
            <span className="panel-subtitle">Executed synchronously upon clicking "Analyze Chest Radiograph"</span>
          </div>
          <span className="th-badge-teal">Stateless Microservice</span>
        </div>

        {/* Visual Box-and-Arrow Diagram */}
        <div className="pipeline-flow-container">
          {/* Step 1: Client Upload */}
          <div className="pipeline-step-node">
            <div className="node-icon-box">
              <Upload size={20} />
            </div>
            <div className="node-role">Step 1 • Client Layer</div>
            <div className="node-title">React 18 + Vite UI</div>
            <div className="node-desc">
              Physician drops radiograph (PNG/JPG ≤ 15MB) and selects threshold (0.50–0.90).
            </div>
            <div className="node-tech">FormData Multipart</div>
          </div>

          <div className="pipeline-arrow">
            <ArrowRight size={20} className="arrow-h" />
            <ArrowDown size={20} className="arrow-v" />
            <span className="arrow-label">POST /api/predict</span>
          </div>

          {/* Step 2: Flask Ingestion */}
          <div className="pipeline-step-node">
            <div className="node-icon-box">
              <Server size={20} />
            </div>
            <div className="node-role">Step 2 • API Layer</div>
            <div className="node-title">Flask REST Backend</div>
            <div className="node-desc">
              Validates MIME type, limits size to 15MB, decodes byte stream with Pillow.
            </div>
            <div className="node-tech">Flask (port 5000)</div>
          </div>

          <div className="pipeline-arrow">
            <ArrowRight size={20} className="arrow-h" />
            <ArrowDown size={20} className="arrow-v" />
            <span className="arrow-label">PIL Image Object</span>
          </div>

          {/* Step 3: Preprocessing */}
          <div className="pipeline-step-node">
            <div className="node-icon-box">
              <FileCheck size={20} />
            </div>
            <div className="node-role">Step 3 • Preprocessing</div>
            <div className="node-title">Tensor Normalizer</div>
            <div className="node-desc">
              Converts to RGB, resizes to 224×224, centers channels via <code>densenet.preprocess_input</code>.
            </div>
            <div className="node-tech">Tensor (1, 224, 224, 3)</div>
          </div>

          <div className="pipeline-arrow">
            <ArrowRight size={20} className="arrow-h" />
            <ArrowDown size={20} className="arrow-v" />
            <span className="arrow-label">Forward Pass</span>
          </div>

          {/* Step 4: Model Inference */}
          <div className="pipeline-step-node">
            <div className="node-icon-box">
              <Cpu size={20} />
            </div>
            <div className="node-role">Step 4 • Neural Inference</div>
            <div className="node-title">DenseNet-121 Model</div>
            <div className="node-desc">
              Computes feature maps across 4 dense blocks; outputs scalar pneumonia probability.
            </div>
            <div className="node-tech">Keras / TensorFlow</div>
          </div>

          <div className="pipeline-arrow">
            <ArrowRight size={20} className="arrow-h" />
            <ArrowDown size={20} className="arrow-v" />
            <span className="arrow-label">Gradients</span>
          </div>

          {/* Step 5: Grad-CAM Generation */}
          <div className="pipeline-step-node">
            <div className="node-icon-box">
              <Layers size={20} />
            </div>
            <div className="node-role">Step 5 • Explainability</div>
            <div className="node-title">Grad-CAM XAI Engine</div>
            <div className="node-desc">
              Backpropagates to layer <code>relu</code>, generates JET heatmap, and produces 55/45 overlay.
            </div>
            <div className="node-tech">OpenCV + Base64 PNG</div>
          </div>

          <div className="pipeline-arrow">
            <ArrowRight size={20} className="arrow-h" />
            <ArrowDown size={20} className="arrow-v" />
            <span className="arrow-label">JSON Payload</span>
          </div>

          {/* Step 6: Presentation */}
          <div className="pipeline-step-node">
            <div className="node-icon-box">
              <Code2 size={20} />
            </div>
            <div className="node-role">Step 6 • Diagnostic Display</div>
            <div className="node-title">Interactive Results</div>
            <div className="node-desc">
              Renders verdict (NORMAL vs PNEUMONIA), confidence, and interactive 3-view Grad-CAM switch.
            </div>
            <div className="node-tech">React State</div>
          </div>
        </div>
      </div>

      {/* Diagram Section 2: Offline Training Flow */}
      <div className="panel-card" style={{ marginTop: '2rem' }}>
        <div className="panel-card-header">
          <div>
            <h3 className="panel-title" style={{ marginBottom: '0.2rem' }}>
              <Database size={18} /> 2. Offline Model Training Pipeline (Separate from Inference)
            </h3>
            <span className="panel-subtitle">Executed offline once during model development</span>
          </div>
          <span className="th-badge-blue">Offline Process</span>
        </div>

        <p className="card-prose">
          To prevent user confusion, model training is completely decoupled from the production inference API.
          Training is executed via Jupyter Notebook / GPU compute environments:
        </p>

        <div className="offline-flow-grid">
          <div className="offline-card">
            <div className="off-step">Phase 1</div>
            <h4>Data Curation &amp; Isolation</h4>
            <p>
              5,856 radiographs. The 624-image test cohort was isolated immediately. The remaining 5,216 images
              were split 80% (4,173) for training and 20% (1,043) for validation.
            </p>
          </div>

          <div className="offline-card">
            <div className="off-step">Phase 2</div>
            <h4>Transfer Learning Base</h4>
            <p>
              DenseNet-121 initialized with pre-trained ImageNet weights. The base convolutional feature extractor
              was initially frozen to prevent destructive gradient updates to early filters.
            </p>
          </div>

          <div className="offline-card">
            <div className="off-step">Phase 3</div>
            <h4>Custom Classification Head</h4>
            <p>
              Appended <code>GlobalAveragePooling2D</code>, a <code>Dropout(0.40)</code> regularization layer,
              and a single <code>Dense(1, sigmoid)</code> neuron for binary posterior estimation.
            </p>
          </div>

          <div className="offline-card">
            <div className="off-step">Phase 4</div>
            <h4>Deep Fine-Tuning &amp; Export</h4>
            <p>
              Unfroze upper dense blocks for fine-tuning with learning rate = 1e-5. Saved optimal checkpoint as{' '}
              <code>best_densenet121_finetuned.keras</code> (52.8 MB, 7,038,529 parameters).
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Verified API Endpoints Reference */}
      <div className="panel-card" style={{ marginTop: '2rem' }}>
        <div className="panel-card-header">
          <div>
            <h3 className="panel-title" style={{ marginBottom: '0.2rem' }}>
              <Code2 size={18} /> 3. Confirmed Backend REST Endpoints
            </h3>
            <span className="panel-subtitle">
              Verified through static code audit of <code>backend/app.py</code> (Exactly 2 routes implemented)
            </span>
          </div>
        </div>

        <div className="endpoints-detail-grid">
          {/* Endpoint 1 */}
          <div className="endpoint-detail-card">
            <div className="ep-badge-row">
              <span className="http-get">GET</span>
              <code>/api/health</code>
              <span className="ep-status-tag">Readiness Check</span>
            </div>
            <p className="ep-desc">
              Polled periodically by React client to verify Flask server availability and check whether the
              DenseNet-121 model has been loaded into memory.
            </p>
            <div className="code-snippet-box">
              <div className="snippet-title">Sample Response (200 OK)</div>
              <pre>{`{
  "status": "ok",
  "model_loaded": true,
  "message": "DenseNet-121 model is loaded and ready."
}`}</pre>
            </div>
          </div>

          {/* Endpoint 2 */}
          <div className="endpoint-detail-card">
            <div className="ep-badge-row">
              <span className="http-post">POST</span>
              <code>/api/predict</code>
              <span className="ep-status-tag">Inference &amp; Grad-CAM</span>
            </div>
            <p className="ep-desc">
              Ingests multipart payload containing radiograph byte stream and optional threshold. Returns
              categorical classification, probabilities, and Base64-encoded Grad-CAM visuals in a single response.
            </p>
            <div className="code-snippet-box">
              <div className="snippet-title">Sample Response (200 OK)</div>
              <pre>{`{
  "prediction": "PNEUMONIA",
  "confidence": 98.42,
  "pneumonia_probability": 0.984215,
  "normal_probability": 0.015785,
  "threshold": 0.75,
  "gradcam_url": "data:image/png;base64,...",
  "heatmap_url": "data:image/png;base64,..."
}`}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
