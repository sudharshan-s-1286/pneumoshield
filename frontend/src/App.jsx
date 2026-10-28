import React, { useState, useEffect, useRef } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomeView from './components/HomeView'
import AnalyzeView from './components/AnalyzeView'
import ModelPerformanceView from './components/ModelPerformanceView'
import DatasetMethodologyView from './components/DatasetMethodologyView'
import ArchitectureView from './components/ArchitectureView'
import XAIView from './components/XAIView'
import AboutView from './components/AboutView'

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
  const [activeImageView, setActiveImageView] = useState('overlay') // 'overlay', 'heatmap', 'original'

  const fileInputRef = useRef(null)

  // Polling backend health
  const checkHealth = () => {
    fetch('/api/health')
      .then((res) => {
        if (!res.ok) throw new Error('Backend HTTP error')
        return res.json()
      })
      .then((data) => {
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
        err.message ||
          'Unable to connect to Flask backend. Make sure the backend server is running on port 5000.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendHealth={backendHealth}
      />

      {/* Main Routed Content */}
      <main className="main-content">
        {activeTab === 'home' && <HomeView setActiveTab={setActiveTab} />}

        {activeTab === 'predict' && (
          <AnalyzeView
            selectedFile={selectedFile}
            imagePreview={imagePreview}
            isDragging={isDragging}
            threshold={threshold}
            setThreshold={setThreshold}
            isLoading={isLoading}
            errorMsg={errorMsg}
            predictionResult={predictionResult}
            activeImageView={activeImageView}
            setActiveImageView={setActiveImageView}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
            handleDrop={handleDrop}
            handleFileChange={handleFileChange}
            handleReset={handleReset}
            handleAnalyze={handleAnalyze}
            fileInputRef={fileInputRef}
            backendHealth={backendHealth}
          />
        )}

        {activeTab === 'performance' && (
          <ModelPerformanceView
            onNavigateToAnalyze={() => setActiveTab('predict')}
          />
        )}

        {activeTab === 'dataset' && <DatasetMethodologyView />}

        {activeTab === 'architecture' && <ArchitectureView />}

        {activeTab === 'xai' && (
          <XAIView onNavigateToAnalyze={() => setActiveTab('predict')} />
        )}

        {activeTab === 'about' && <AboutView />}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  )
}
