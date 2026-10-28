# PneumoShield AI 🫁⚡

> **Deep Transfer Learning & Explainable AI (Grad-CAM) for Pediatric Chest Radiograph Pneumonia Classification**

PneumoShield AI is an end-to-end medical AI diagnostic assistant designed to assist clinicians in detecting pneumonia from chest X-rays (CXR). Leveraging a fine-tuned **DenseNet-121** deep convolutional neural network and **Gradient-Weighted Class Activation Mapping (Grad-CAM)**, the system provides both diagnostic predictions with calibrated confidence scores and visual, interpretable heatmaps highlighting suspicious pulmonary regions.

---

## 🌟 Key Features

- **DenseNet-121 Architecture**: High-capacity feature extraction utilizing dense connectivity to alleviate vanishing gradients and preserve multi-scale radiograph features.
- **Explainable AI (Grad-CAM)**: Generates localized JET-colormap heatmaps and 55/45 alpha-blended overlays directly onto the radiograph, allowing radiologists to verify focal consolidations and infiltrates.
- **Interactive Web Interface**: Built with modern React and Vite, featuring intuitive drag-and-drop file upload, real-time threshold adjustments (0.05 – 0.99), and toggleable image comparison views.
- **Microservice Architecture**: Decoupled Flask REST API backend (`/api/predict`, `/api/health`) for rapid, stateless diagnostic inference.
- **Automated Startup Scripts**: Windows batch scripts (`pnewmonia.bat`, `backend.bat`, `frontend.bat`) for one-click development and deployment.

---

## 📁 Repository Structure

```text
pneumoshield/
├── backend/
│   ├── app.py                     # Flask inference API & Grad-CAM pipeline
│   └── requirements.txt           # Python backend dependencies
├── frontend/
│   ├── public/                    # Static assets & icons
│   ├── src/
│   │   ├── assets/                # Visual branding & illustrations
│   │   ├── App.jsx                # Main application UI & state management
│   │   ├── App.css                # Component styling
│   │   ├── index.css              # Global design system & theme tokens
│   │   └── main.jsx               # React entry point
│   ├── index.html                 # Single page application template
│   ├── package.json               # Node.js project manifest & scripts
│   ├── vite.config.js             # Vite development server & reverse proxy
│   └── .oxlintrc.json             # Code quality configuration
├── backend.bat                    # Start Flask backend server
├── frontend.bat                   # Start Vite React frontend server
├── pnewmonia.bat                  # Concurrent dual-server launcher
├── PneumoShield_AI_Report_Content.txt  # Detailed system architecture audit
├── report.txt                     # Comprehensive technical documentation
├── .gitignore                     # Git ignore rules
└── README.md                      # Project documentation
```

---

## 🚀 Quick Start Guide

### Prerequisites

- **Python 3.10+ / 3.11**
- **Node.js 18+ & npm**
- **DenseNet-121 Model Weights (`best_densenet121_finetuned.keras`)**

### 1. Model Weights Setup

Place your trained Keras model file named `best_densenet121_finetuned.keras` in either:
- The project root directory (`./best_densenet121_finetuned.keras`), or
- The backend directory (`./backend/best_densenet121_finetuned.keras`), or
- The parent workspace directory (`../best_densenet121_finetuned.keras`).

### 2. Backend Setup

```bash
# Create and activate a virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Run the Flask backend server
python backend/app.py
```
*The Flask backend runs on `http://127.0.0.1:5000`.*

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run the Vite development server
npm run dev
```
*The frontend will launch at `http://localhost:5173`.*

---

## ⚡ One-Click Startup (Windows)

Simply double-click:
```text
pnewmonia.bat
```
This automatically launches both the Flask backend server and the Vite development frontend server in synchronized terminal windows.

---

## 📡 API Reference

### Health Check
- **Endpoint**: `GET /api/health`
- **Response**:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "message": "PneumoShield AI DenseNet-121 ready"
}
```

### Predict & Explain
- **Endpoint**: `POST /api/predict`
- **Payload**: `multipart/form-data`
  - `image`: Radiograph image file (`.png`, `.jpg`, `.jpeg` up to 15MB)
  - `threshold` *(optional)*: Float between `0.05` and `0.99` (default: `0.75`)
- **Response**:
```json
{
  "prediction": "PNEUMONIA",
  "confidence": 98.42,
  "pneumonia_prob": 0.984215,
  "normal_prob": 0.015785,
  "threshold_used": 0.75,
  "gradcam_url": "data:image/png;base64,...",
  "heatmap_url": "data:image/png;base64,..."
}
```

---

## ⚖️ Disclaimer

*PneumoShield AI is developed as an academic and assistive clinical decision-support tool. It is not intended to replace definitive professional clinical judgment, laboratory confirmation, or formal radiologic reporting.*
