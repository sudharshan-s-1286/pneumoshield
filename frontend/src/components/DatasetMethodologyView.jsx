import React from 'react'
import {
  Database,
  Layers,
  Cpu,
  AlertTriangle,
  CheckCircle2,
  PieChart
} from 'lucide-react'

export default function DatasetMethodologyView() {
  return (
    <div className="dataset-page">
      {/* Header */}
      <div className="section-header-block">
        <div className="hero-badge">
          <Database size={14} /> Dataset &amp; Methodology
        </div>
        <h2 className="hero-title" style={{ fontSize: '2.3rem' }}>
          Data Curation, Partitioning &amp; Preprocessing
        </h2>
        <p className="hero-subtitle">
          Detailed technical documentation of the Kermany et al. pediatric chest radiograph cohort,
          two-stage transfer learning schedule, and input normalization pipeline.
        </p>
      </div>

      {/* Dataset Composition Breakdown */}
      <div className="analytics-dual-grid">
        {/* Split Visualization */}
        <div className="panel-card">
          <div className="panel-card-header">
            <div>
              <h3 className="panel-title" style={{ marginBottom: '0.2rem' }}>
                <PieChart size={18} /> Dataset Partitioning (N = 5,856)
              </h3>
              <span className="panel-subtitle">Train, Validation, and Held-Out Test Partitions</span>
            </div>
          </div>

          <p className="card-prose">
            The benchmark dataset comprises 5,856 anterior-posterior chest radiographs. To ensure rigorous,
            leakage-free validation, the original 5,216 base training corpus was partitioned with an 80/20 stratified
            split into training and validation sets, while keeping the 624-image test cohort strictly untouched:
          </p>

          <div className="partition-list">
            {/* Training */}
            <div className="partition-item">
              <div className="partition-info">
                <div className="partition-name">
                  <span className="p-dot dot-train" /> Training Partition
                </div>
                <div className="partition-stats">
                  <strong>4,173</strong> images <small>(71.26%)</small>
                </div>
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: '71.26%', background: 'var(--accent-teal)' }}>
                  <span>71.3%</span>
                </div>
              </div>
              <span className="partition-detail">Used for backward gradient descent and weight updates.</span>
            </div>

            {/* Validation */}
            <div className="partition-item">
              <div className="partition-info">
                <div className="partition-name">
                  <span className="p-dot dot-val" /> Validation Partition
                </div>
                <div className="partition-stats">
                  <strong>1,043</strong> images <small>(17.81%)</small>
                </div>
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: '17.81%', background: 'var(--accent-cyan)' }}>
                  <span>17.8%</span>
                </div>
              </div>
              <span className="partition-detail">Monitors generalization and triggers early stopping checkpoints.</span>
            </div>

            {/* Test Cohort */}
            <div className="partition-item">
              <div className="partition-info">
                <div className="partition-name">
                  <span className="p-dot dot-test" /> Held-Out Test Cohort
                </div>
                <div className="partition-stats">
                  <strong>624</strong> images <small>(10.66%)</small>
                </div>
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: '10.66%', background: 'var(--secondary-navy)' }}>
                  <span>10.7%</span>
                </div>
              </div>
              <span className="partition-detail">Strictly held out for final benchmark reporting (234 Normal, 390 Pneumonia).</span>
            </div>
          </div>
        </div>

        {/* Class Distribution Breakdown */}
        <div className="panel-card">
          <div className="panel-card-header">
            <div>
              <h3 className="panel-title" style={{ marginBottom: '0.2rem' }}>
                <Layers size={18} /> Test Cohort Class Distribution
              </h3>
              <span className="panel-subtitle">Held-Out Test Set (N = 624)</span>
            </div>
          </div>

          <p className="card-prose">
            The held-out test cohort reflects real-world hospital referral distributions where symptomatic
            pathology scans outnumber clear normal scans:
          </p>

          <div className="class-dist-box">
            <div className="dist-card dist-normal">
              <div className="dist-head">
                <CheckCircle2 size={24} style={{ color: 'var(--success-color)' }} />
                <div>
                  <h4>NORMAL</h4>
                  <span>Healthy pediatric lungs</span>
                </div>
              </div>
              <div className="dist-count">234 Images</div>
              <div className="dist-pct">37.50% of Test Set</div>
              <p>Characterized by clear bilateral lung fields without focal opacities or consolidations.</p>
            </div>

            <div className="dist-card dist-pneumonia">
              <div className="dist-head">
                <AlertTriangle size={24} style={{ color: 'var(--danger-color)' }} />
                <div>
                  <h4>PNEUMONIA</h4>
                  <span>Infectious pathology</span>
                </div>
              </div>
              <div className="dist-count">390 Images</div>
              <div className="dist-pct">62.50% of Test Set</div>
              <p>Bacterial focal consolidations and viral diffuse interstitial infiltrates across lung lobes.</p>
            </div>
          </div>

          <div className="data-leakage-badge">
            <CheckCircle2 size={16} style={{ color: 'var(--success-color)', flexShrink: 0 }} />
            <span>
              <strong>Zero Data Leakage:</strong> The 624 test images were preserved completely isolated.
              No augmentation, threshold tuning, or hyperparameter searching accessed test labels during training.
            </span>
          </div>
        </div>
      </div>

      {/* Preprocessing & Training Methodology Steps */}
      <div className="panel-card" style={{ marginTop: '2rem' }}>
        <div className="panel-card-header">
          <div>
            <h3 className="panel-title" style={{ marginBottom: '0.2rem' }}>
              <Cpu size={18} /> Preprocessing Pipeline &amp; Transfer Learning Strategy
            </h3>
            <span className="panel-subtitle">Standardized Transform Applied to Training and Real-Time Inference</span>
          </div>
        </div>

        <div className="methodology-steps-grid">
          {/* Step 1 */}
          <div className="method-step-card">
            <div className="step-num">01</div>
            <h4>Ingestion &amp; 3-Channel RGB Conversion</h4>
            <p>
              Chest radiographs arrive in grayscale or single-channel formats. The pipeline converts all inputs
              to a 3-channel RGB representation via PIL, satisfying the input channel tensor requirements of
              the pre-trained ImageNet convolutional filters.
            </p>
          </div>

          {/* Step 2 */}
          <div className="method-step-card">
            <div className="step-num">02</div>
            <h4>Bicubic Resizing to 224 × 224</h4>
            <p>
              High-resolution radiographs are uniformly resized to <code>(224, 224, 3)</code> using high-quality
              bicubic Lanczos interpolation, balancing morphological detail with real-time inference throughput.
            </p>
          </div>

          {/* Step 3 */}
          <div className="method-step-card">
            <div className="step-num">03</div>
            <h4>DenseNet ImageNet Normalization</h4>
            <p>
              Pixel values are standardized through <code>densenet.preprocess_input</code>. This applies
              channel-wise zero-centering using ImageNet mean <code>[103.939, 116.779, 123.68]</code>,
              ensuring numerical stability throughout all 121 network layers.
            </p>
          </div>

          {/* Step 4 */}
          <div className="method-step-card">
            <div className="step-num">04</div>
            <h4>Two-Stage Transfer Learning</h4>
            <p>
              <strong>Stage 1:</strong> Frozen base feature extraction. The DenseNet-121 backbone is frozen,
              training only the custom head.<br />
              <strong>Stage 2:</strong> Deep fine-tuning of upper dense blocks with a reduced learning rate (1e-5)
              under class-weighted binary crossentropy loss.
            </p>
          </div>
        </div>
      </div>

      {/* Dataset Limitations & Scope Warning */}
      <div className="limitations-banner" style={{ marginTop: '2rem' }}>
        <AlertTriangle size={22} className="lim-icon" />
        <div className="lim-content">
          <h4>Dataset Diversity &amp; Generalization Limitations</h4>
          <p>
            The training and evaluation images were acquired exclusively from pediatric patients (ages 1 to 5) at
            Guangzhou Women and Children’s Medical Center. Consequently:
          </p>
          <ul style={{ paddingLeft: '1.25rem', marginTop: '0.4rem', lineHeight: '1.6' }}>
            <li>
              <strong>Not Representative of General Hospital Admissions:</strong> The cohort does not represent
              adult or geriatric lung parenchymal characteristics, such as emphysema, cardiomegaly, or interstitial lung disease.
            </li>
            <li>
              <strong>Hardware &amp; Technique Variations:</strong> Different radiograph machines, X-ray dosages,
              or patient rotations (e.g. portable bedside X-rays vs. standing PA) may yield distribution shifts not
              present in this dataset.
            </li>
            <li>
              <strong>Single-Center Collection:</strong> True clinical deployment requires external multi-center
              validation across diverse hospital hardware before any real-world assistive consideration.
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
