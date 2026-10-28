import React, { useState } from 'react'
import {
  BarChart3,
  AlertTriangle,
  Info,
  Sliders,
  Database,
  Layers,
  HelpCircle,
  ShieldAlert,
  ArrowRight
} from 'lucide-react'

export default function ModelPerformanceView({ onNavigateToAnalyze }) {
  const [selectedMetricGroup, setSelectedMetricGroup] = useState('all') // 'all', 'classes', 'averages'

  // Confirmed report figures on held-out test cohort (624 samples)
  const kpis = [
    {
      title: 'Test Accuracy',
      value: '89.58%',
      fraction: '559 / 624 correct',
      badge: 'Threshold = 0.50',
      description: 'Overall proportion of correctly classified normal and pneumonia test radiographs.',
      color: 'teal'
    },
    {
      title: 'Pneumonia Sensitivity (Recall)',
      value: '96.67%',
      fraction: '377 / 390 caught',
      badge: 'Positive Class Recall',
      description: 'Capacity to correctly identify positive pneumonia cases; only 13 cases missed (3.33% false negative rate).',
      color: 'green'
    },
    {
      title: 'Pneumonia Precision',
      value: '87.88%',
      fraction: '377 / 429 flagged',
      badge: 'Positive Predictive Value',
      description: 'Probability that a radiograph flagged as Pneumonia is an authentic pathology.',
      color: 'blue'
    },
    {
      title: 'Pneumonia F1-Score',
      value: '92.06%',
      fraction: 'Harmonic mean',
      badge: 'Balanced Precision/Recall',
      description: 'Primary clinical effectiveness indicator balancing diagnostic sensitivity and positive predictive accuracy.',
      color: 'purple'
    },
    {
      title: 'ROC-AUC Score',
      value: '~0.965',
      fraction: '0.9646 SKL / 0.9651 Keras',
      badge: 'Threshold-Independent',
      description: 'Degree of separability across all possible diagnostic operating thresholds.',
      color: 'amber'
    }
  ]

  // Detailed class-wise metrics
  const classMetrics = [
    {
      label: 'NORMAL Class',
      precision: 93.33,
      recall: 77.78,
      f1: 84.85,
      support: 234,
      supportPct: '37.5%',
      type: 'class'
    },
    {
      label: 'PNEUMONIA Class',
      precision: 87.88,
      recall: 96.67,
      f1: 92.06,
      support: 390,
      supportPct: '62.5%',
      type: 'class'
    },
    {
      label: 'Macro Average',
      precision: 90.61,
      recall: 87.22,
      f1: 88.46,
      support: 624,
      supportPct: '100%',
      type: 'avg'
    },
    {
      label: 'Weighted Average',
      precision: 89.92,
      recall: 89.58,
      f1: 89.36,
      support: 624,
      supportPct: '100%',
      type: 'avg'
    }
  ]

  const filteredMetrics =
    selectedMetricGroup === 'classes'
      ? classMetrics.filter((m) => m.type === 'class')
      : selectedMetricGroup === 'averages'
      ? classMetrics.filter((m) => m.type === 'avg')
      : classMetrics

  return (
    <div className="analytics-page">
      {/* Page Header */}
      <div className="section-header-block">
        <div className="hero-badge">
          <BarChart3 size={14} /> Model Performance Analytics
        </div>
        <h2 className="hero-title" style={{ fontSize: '2.3rem' }}>
          Quantitative Evaluation &amp; Benchmarks
        </h2>
        <p className="hero-subtitle">
          Audited performance metrics evaluated on the untouched <strong>624-image test cohort</strong>{' '}
          (234 Normal, 390 Pneumonia). Values represent reported historical benchmarks on this benchmark
          dataset and are not a clinical warranty for prospective hospital admissions.
        </p>

        <div className="academic-notice-banner">
          <Info size={18} className="notice-icon" />
          <div className="notice-text">
            <strong>Data Integrity Standard:</strong> Baseline metrics reflect the standard{' '}
            <code>0.50</code> sigmoid decision threshold. Threshold <code>0.75</code> results are
            labeled as <em>Reported — Verification Pending</em> in compliance with strict verification
            requirements. ROC-AUC is reported as verified scalar scores without fabricated curve coordinates.
          </div>
        </div>
      </div>

      {/* Top 5 Primary KPI Cards */}
      <div className="kpi-grid">
        {kpis.map((kpi, idx) => (
          <div key={idx} className={`kpi-card kpi-${kpi.color}`}>
            <div className="kpi-top">
              <span className="kpi-title">{kpi.title}</span>
              <span className="kpi-badge">{kpi.badge}</span>
            </div>
            <div className="kpi-value">{kpi.value}</div>
            <div className="kpi-fraction">{kpi.fraction}</div>
            <p className="kpi-desc">{kpi.desc || kpi.description}</p>
          </div>
        ))}
      </div>

      {/* 2-Column Grid: Confusion Matrix & Class Support */}
      <div className="analytics-dual-grid">
        {/* Confusion Matrix Heatmap Panel */}
        <div className="panel-card">
          <div className="panel-card-header">
            <div>
              <h3 className="panel-title" style={{ marginBottom: '0.2rem' }}>
                <Layers size={18} /> Test Confusion Matrix Heatmap
              </h3>
              <span className="panel-subtitle">
                Threshold = 0.50 • Total Evaluated: 624 Radiographs
              </span>
            </div>
            <div className="accuracy-pill">Overall Acc: 89.58%</div>
          </div>

          <div className="matrix-wrapper">
            <div className="matrix-labels-col">
              <div className="axis-legend-v">ACTUAL DIAGNOSIS</div>
              <div className="row-label">
                <span>NORMAL</span>
                <small>234 cases</small>
              </div>
              <div className="row-label">
                <span>PNEUMONIA</span>
                <small>390 cases</small>
              </div>
            </div>

            <div className="matrix-cells-container">
              <div className="matrix-col-headers">
                <div className="axis-legend-h">PREDICTED BY DENSENET-121</div>
                <div className="col-header-pair">
                  <div className="col-hdr">
                    PREDICTED NORMAL
                    <small>195 cases total</small>
                  </div>
                  <div className="col-hdr">
                    PREDICTED PNEUMONIA
                    <small>429 cases total</small>
                  </div>
                </div>
              </div>

              <div className="matrix-grid-2x2">
                {/* Cell 1: True Negative */}
                <div className="cm-cell cell-tn" title="True Negative: Normal correctly identified">
                  <div className="cm-cell-tag">True Negative (TN)</div>
                  <div className="cm-count">182</div>
                  <div className="cm-pct">77.78% of Actual Normal</div>
                  <div className="cm-sub">182 / 234 Normal caught</div>
                </div>

                {/* Cell 2: False Positive */}
                <div className="cm-cell cell-fp" title="False Positive: Normal misdiagnosed as Pneumonia">
                  <div className="cm-cell-tag alert-tag">False Positive (FP)</div>
                  <div className="cm-count text-danger">52</div>
                  <div className="cm-pct">22.22% of Actual Normal</div>
                  <div className="cm-sub">False alarm rate</div>
                </div>

                {/* Cell 3: False Negative */}
                <div className="cm-cell cell-fn" title="False Negative: Pneumonia missed by model">
                  <div className="cm-cell-tag danger-tag">False Negative (FN)</div>
                  <div className="cm-count text-danger">13</div>
                  <div className="cm-pct">3.33% of Actual Pneumonia</div>
                  <div className="cm-sub">Low critical miss rate</div>
                </div>

                {/* Cell 4: True Positive */}
                <div className="cm-cell cell-tp" title="True Positive: Pneumonia correctly identified">
                  <div className="cm-cell-tag">True Positive (TP)</div>
                  <div className="cm-count">377</div>
                  <div className="cm-pct">96.67% of Actual Pneumonia</div>
                  <div className="cm-sub">377 / 390 caught</div>
                </div>
              </div>
            </div>
          </div>

          {/* Matrix Footnote Summary */}
          <div className="matrix-metrics-strip">
            <div className="mm-item">
              <span>Sensitivity (Recall):</span>
              <strong>96.67%</strong>
              <small>(377 / 390)</small>
            </div>
            <div className="mm-item">
              <span>Specificity:</span>
              <strong>77.78%</strong>
              <small>(182 / 234)</small>
            </div>
            <div className="mm-item">
              <span>Pos. Predictive Value:</span>
              <strong>87.88%</strong>
              <small>(377 / 429)</small>
            </div>
            <div className="mm-item">
              <span>Neg. Predictive Value:</span>
              <strong>93.33%</strong>
              <small>(182 / 195)</small>
            </div>
          </div>
        </div>

        {/* Class Support & Distribution */}
        <div className="panel-card">
          <div className="panel-card-header">
            <div>
              <h3 className="panel-title" style={{ marginBottom: '0.2rem' }}>
                <Database size={18} /> Test Class Support
              </h3>
              <span className="panel-subtitle">Sample Balance in Held-Out Cohort (N = 624)</span>
            </div>
          </div>

          <div className="support-card-body">
            <p className="card-prose">
              The test set represents real-world clinical prevalence where pulmonary pathologies frequently
              outnumber healthy baseline scans in symptomatic pediatric cohorts:
            </p>

            <div className="support-bars-wrapper">
              {/* Normal Support */}
              <div className="support-bar-row">
                <div className="support-header">
                  <div className="support-title">
                    <span className="bullet bullet-normal" /> NORMAL Cohort
                  </div>
                  <div className="support-count">
                    <strong>234</strong> images <small>(37.50%)</small>
                  </div>
                </div>
                <div className="bar-track">
                  <div className="bar-fill bar-fill-normal" style={{ width: '37.5%' }}>
                    <span>37.5%</span>
                  </div>
                </div>
              </div>

              {/* Pneumonia Support */}
              <div className="support-bar-row">
                <div className="support-header">
                  <div className="support-title">
                    <span className="bullet bullet-pneumonia" /> PNEUMONIA Cohort
                  </div>
                  <div className="support-count">
                    <strong>390</strong> images <small>(62.50%)</small>
                  </div>
                </div>
                <div className="bar-track">
                  <div className="bar-fill bar-fill-pneumonia" style={{ width: '62.5%' }}>
                    <span>62.5%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="support-ratio-card">
              <div className="ratio-title">Imbalance Ratio &amp; Mitigation</div>
              <p>
                Ratio of <strong>1.67 : 1.00</strong> (Pneumonia to Normal). The model was trained using
                inverse class weights during binary crossentropy optimization to prevent majority class bias,
                ensuring high precision for both categories.
              </p>
            </div>

            {/* Quick Action */}
            <div className="support-action-cta">
              <div>
                <strong>Test an individual image?</strong>
                <p>Run full inference and inspect Grad-CAM visualizations.</p>
              </div>
              <button className="btn-sm btn-primary" onClick={onNavigateToAnalyze}>
                Open Analyzer <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grouped Bar Chart Section: Per-Class & Aggregate Metrics */}
      <div className="panel-card" style={{ marginTop: '2rem' }}>
        <div className="panel-card-header">
          <div>
            <h3 className="panel-title" style={{ marginBottom: '0.2rem' }}>
              <BarChart3 size={18} /> Class-Wise &amp; Aggregate Performance Breakdown
            </h3>
            <span className="panel-subtitle">
              Precision, Recall, and F1-Scores across Classes and Summary Averages (Threshold = 0.50)
            </span>
          </div>

          <div className="chart-filter-toggle">
            <button
              className={`filter-btn ${selectedMetricGroup === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedMetricGroup('all')}
            >
              All (4 Groups)
            </button>
            <button
              className={`filter-btn ${selectedMetricGroup === 'classes' ? 'active' : ''}`}
              onClick={() => setSelectedMetricGroup('classes')}
            >
              Classes Only
            </button>
            <button
              className={`filter-btn ${selectedMetricGroup === 'averages' ? 'active' : ''}`}
              onClick={() => setSelectedMetricGroup('averages')}
            >
              Averages Only
            </button>
          </div>
        </div>

        {/* Grouped Bar Visualizer */}
        <div className="grouped-chart-container">
          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-swatch swatch-precision" />
              <span>Precision (Positive Predictive Value)</span>
            </div>
            <div className="legend-item">
              <span className="legend-swatch swatch-recall" />
              <span>Recall (Sensitivity)</span>
            </div>
            <div className="legend-item">
              <span className="legend-swatch swatch-f1" />
              <span>F1-Score (Harmonic Mean)</span>
            </div>
          </div>

          <div className="grouped-bars-list">
            {filteredMetrics.map((item, idx) => (
              <div key={idx} className="metric-group-row">
                <div className="group-label-col">
                  <strong>{item.label}</strong>
                  <span className="group-support-tag">N = {item.support} ({item.supportPct})</span>
                </div>

                <div className="group-bars-col">
                  {/* Precision Bar */}
                  <div className="bar-sub-row">
                    <span className="bar-kind-tag">Precision</span>
                    <div className="bar-bar-shell">
                      <div
                        className="bar-fill-seg bar-fill-prec"
                        style={{ width: `${item.precision}%` }}
                      >
                        <span className="seg-val">{item.precision.toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Recall Bar */}
                  <div className="bar-sub-row">
                    <span className="bar-kind-tag">Recall</span>
                    <div className="bar-bar-shell">
                      <div
                        className="bar-fill-seg bar-fill-rec"
                        style={{ width: `${item.recall}%` }}
                      >
                        <span className="seg-val">{item.recall.toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* F1 Bar */}
                  <div className="bar-sub-row">
                    <span className="bar-kind-tag">F1-Score</span>
                    <div className="bar-bar-shell">
                      <div
                        className="bar-fill-seg bar-fill-f1"
                        style={{ width: `${item.f1}%` }}
                      >
                        <span className="seg-val">{item.f1.toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="table-responsive" style={{ marginTop: '1.5rem' }}>
          <table className="custom-analytics-table">
            <thead>
              <tr>
                <th>Evaluation Cohort</th>
                <th>Precision</th>
                <th>Recall (Sensitivity)</th>
                <th>F1-Score</th>
                <th>Test Support</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>NORMAL</strong></td>
                <td>0.9333 (93.33%)</td>
                <td>0.7778 (77.78%)</td>
                <td>0.8485 (84.85%)</td>
                <td>234 images</td>
              </tr>
              <tr>
                <td><strong>PNEUMONIA</strong></td>
                <td>0.8788 (87.88%)</td>
                <td>0.9667 (96.67%)</td>
                <td>0.9206 (92.06%)</td>
                <td>390 images</td>
              </tr>
              <tr className="row-highlight">
                <td><strong>Macro Average</strong></td>
                <td>0.9061 (90.61%)</td>
                <td>0.8722 (87.22%)</td>
                <td>0.8846 (88.46%)</td>
                <td>624 images</td>
              </tr>
              <tr className="row-highlight">
                <td><strong>Weighted Average</strong></td>
                <td>0.8992 (89.92%)</td>
                <td>0.8958 (89.58%)</td>
                <td>0.8936 (89.36%)</td>
                <td>624 images</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Decision Threshold Comparison: 0.50 vs 0.75 */}
      <div className="panel-card" style={{ marginTop: '2rem' }}>
        <div className="panel-card-header">
          <div>
            <h3 className="panel-title" style={{ marginBottom: '0.2rem' }}>
              <Sliders size={18} /> Decision Threshold Calibration Comparison
            </h3>
            <span className="panel-subtitle">
              Evaluating Trade-Offs: Baseline 0.50 vs. Calibrated 0.75 Operating Cutoff
            </span>
          </div>
        </div>

        <div className="threshold-comparison-grid">
          {/* Card A: 0.50 Baseline */}
          <div className="th-card th-baseline">
            <div className="th-card-header">
              <span className="th-badge-blue">Standard Baseline</span>
              <h4>Threshold = 0.50</h4>
              <p>Standard neutral sigmoid midpoint cutoff</p>
            </div>

            <div className="th-metric-list">
              <div className="th-metric-item">
                <span>Test Accuracy:</span>
                <strong>89.58% (559 / 624)</strong>
              </div>
              <div className="th-metric-item">
                <span>Pneumonia Recall:</span>
                <strong style={{ color: 'var(--success-color)' }}>96.67% (High Sensitivity)</strong>
              </div>
              <div className="th-metric-item">
                <span>Pneumonia Precision:</span>
                <strong>87.88%</strong>
              </div>
              <div className="th-metric-item">
                <span>Pneumonia F1-Score:</span>
                <strong>92.06%</strong>
              </div>
              <div className="th-metric-item">
                <span>False Positives:</span>
                <strong style={{ color: 'var(--danger-color)' }}>52 cases (Higher False Alarms)</strong>
              </div>
              <div className="th-metric-item">
                <span>False Negatives:</span>
                <strong style={{ color: 'var(--success-color)' }}>13 cases (Safe Low Misses)</strong>
              </div>
            </div>

            <div className="th-clinical-verdict">
              <strong>Clinical Profile:</strong> Prioritizes maximum sensitivity (96.67%) to avoid missing
              pneumonia patients at the expense of generating 52 false alarms on normal radiographs.
            </div>
          </div>

          {/* Card B: 0.75 Calibrated */}
          <div className="th-card th-calibrated">
            <div className="th-card-header">
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="th-badge-teal">Reported Optimal F1</span>
                <span className="th-badge-amber">Verification Pending ⚠️</span>
              </div>
              <h4>Threshold = 0.75</h4>
              <p>Targeted operating point documented in empirical search report</p>
            </div>

            <div className="th-metric-list">
              <div className="th-metric-item">
                <span>Reported Accuracy:</span>
                <strong>91.35% (570 / 624)</strong>
              </div>
              <div className="th-metric-item">
                <span>Reported Recall:</span>
                <strong>93.08%</strong>
              </div>
              <div className="th-metric-item">
                <span>Reported Precision:</span>
                <strong>93.08% (Reduced False Alarms)</strong>
              </div>
              <div className="th-metric-item">
                <span>Reported F1-Score:</span>
                <strong>93.08%</strong>
              </div>
              <div className="th-metric-item">
                <span>False Positives:</span>
                <strong style={{ color: 'var(--success-color)' }}>24 cases (28 Alarms Saved)</strong>
              </div>
              <div className="th-metric-item">
                <span>False Negatives:</span>
                <strong>27 cases</strong>
              </div>
            </div>

            <div className="th-pending-warning">
              <AlertTriangle size={16} style={{ flexShrink: 0 }} />
              <div>
                <strong>Academic Data Integrity Note:</strong> The 0.75 figures were recorded in the
                preliminary grid-search audit. Per repository guidelines, they remain labeled as{' '}
                <em>reported — verification pending</em> until systematically recomputed against the
                authoritative saved prediction array.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Concise Clinical Metric Interpretation Area */}
      <div className="panel-card" style={{ marginTop: '2rem' }}>
        <div className="panel-card-header">
          <div>
            <h3 className="panel-title" style={{ marginBottom: '0.2rem' }}>
              <HelpCircle size={18} /> Metric Interpretation &amp; Clinical Context
            </h3>
            <span className="panel-subtitle">Plain-Language Engineering Explanations</span>
          </div>
        </div>

        <div className="interpret-grid">
          <div className="interpret-card">
            <h4>False Positives (FP = 52)</h4>
            <p>
              Occurs when the model classifies a healthy normal radiograph as <strong>PNEUMONIA</strong>.
              In a hospital setting, this results in patient anxiety and redundant antibiotic administration,
              but does not immediately imperil life. The calibrated 0.75 threshold seeks to suppress these false alarms.
            </p>
          </div>

          <div className="interpret-card card-alert">
            <h4>False Negatives (FN = 13)</h4>
            <p>
              Occurs when an authentic pneumonia patient is misclassified as <strong>NORMAL</strong>.
              This is the <em>most dangerous clinical error</em> because untreated bacterial or viral pneumonia
              can rapidly escalate to pulmonary consolidation or sepsis. PneumoShield AI achieves a low 3.33% miss rate.
            </p>
          </div>

          <div className="interpret-card">
            <h4>Precision vs. Recall</h4>
            <p>
              <strong>Precision</strong> answers: <em>"When the model flags pneumonia, how often is it right?"</em> (87.88%).{' '}
              <strong>Recall</strong> answers: <em>"Of all patients who truly have pneumonia, how many were detected?"</em> (96.67%).
            </p>
          </div>

          <div className="interpret-card">
            <h4>F1-Score &amp; ROC-AUC</h4>
            <p>
              <strong>F1-Score (92.06%)</strong> represents the harmonic mean of precision and recall.{' '}
              <strong>ROC-AUC (~0.965)</strong> reflects the global area under the receiver operating characteristic curve,
              confirming near-optimal separability between healthy and infected chest radiographs.
            </p>
          </div>
        </div>
      </div>

      {/* Dataset Summary & Architecture Specifications Panel */}
      <div className="panel-card" style={{ marginTop: '2rem' }}>
        <div className="panel-card-header">
          <div>
            <h3 className="panel-title" style={{ marginBottom: '0.2rem' }}>
              <Database size={18} /> Dataset Summary &amp; Architecture Specifications
            </h3>
            <span className="panel-subtitle">Repository Source of Truth Specifications</span>
          </div>
        </div>

        <div className="specs-grid">
          <div className="spec-item">
            <span className="spec-label">Total Corpus</span>
            <span className="spec-value">5,856 Images</span>
            <span className="spec-detail">Kermany et al. Pediatric CXR</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Training Partition</span>
            <span className="spec-value">4,173 Images (71.3%)</span>
            <span className="spec-detail">80% of 5,216 base corpus</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Validation Partition</span>
            <span className="spec-value">1,043 Images (17.8%)</span>
            <span className="spec-detail">20% of 5,216 base corpus</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Held-Out Test Cohort</span>
            <span className="spec-value">624 Images (10.7%)</span>
            <span className="spec-detail">234 Normal, 390 Pneumonia</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Model Architecture</span>
            <span className="spec-value">DenseNet-121</span>
            <span className="spec-detail">Transfer Learning + Custom Head</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Input Dimensions</span>
            <span className="spec-value">224 × 224 × 3</span>
            <span className="spec-detail">RGB, ImageNet Standardization</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Total Parameters</span>
            <span className="spec-value">7,038,529</span>
            <span className="spec-detail">Approx. 26.85 MB serialized</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Trainable Parameters</span>
            <span className="spec-value">2,890,433 (41.1%)</span>
            <span className="spec-detail">Stage 2 Fine-Tuned Layers</span>
          </div>
        </div>
      </div>

      {/* Limitations & Scientific Disclaimer */}
      <div className="limitations-banner" style={{ marginTop: '2rem' }}>
        <ShieldAlert size={22} className="lim-icon" />
        <div className="lim-content">
          <h4>Research Prototype &amp; Evaluation Limitations</h4>
          <p>
            1. <strong>Pediatric Demographic Bias:</strong> The underlying dataset originates from pediatric patients
            aged one to five years at Guangzhou Women and Children’s Medical Center. Performance on adult cohorts or
            geriatric populations with co-morbid COPD, congestive heart failure, or COVID-19 may vary significantly.
          </p>
          <p>
            2. <strong>Non-Diagnostic Demonstration:</strong> PneumoShield AI is strictly an engineering research
            and educational proof-of-concept. It is <em>not FDA-cleared, CE-marked, or clinically certified</em> as a
            standalone medical diagnostic system. All radiograph evaluations must be reviewed by board-certified radiologists.
          </p>
        </div>
      </div>
    </div>
  )
}
