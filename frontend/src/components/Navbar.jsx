import React, { useState } from 'react'
import {
  Activity,
  Upload,
  BarChart3,
  Database,
  Layers,
  Network,
  Info,
  Menu,
  X
} from 'lucide-react'

export default function Navbar({ activeTab, setActiveTab, backendHealth }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { id: 'home', label: 'Home', icon: Activity },
    { id: 'predict', label: 'Analyze X-Ray', icon: Upload },
    { id: 'performance', label: 'Performance Analytics', icon: BarChart3 },
    { id: 'dataset', label: 'Dataset & Methodology', icon: Database },
    { id: 'architecture', label: 'System Architecture', icon: Network },
    { id: 'xai', label: 'Grad-CAM XAI', icon: Layers },
    { id: 'about', label: 'About Project', icon: Info }
  ]

  const handleNavClick = (id) => {
    setActiveTab(id)
    setMobileMenuOpen(false)
  }

  return (
    <header className="navbar">
      <div className="nav-brand" onClick={() => handleNavClick('home')}>
        <div className="brand-icon">
          <Activity size={22} />
        </div>
        <div className="brand-text">
          <h1>PneumoShield AI</h1>
          <span>DenseNet-121 Clinical Radiograph Classifier</span>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="desktop-nav">
        <ul className="nav-links">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.id}>
                <button
                  className={`nav-item-btn ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.id)}
                >
                  <Icon size={16} /> {item.label}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Right controls: Backend Status & Mobile Toggle */}
      <div className="nav-right-cluster">
        <div className="backend-status-pill" title={backendHealth.message}>
          <span
            className={`status-dot ${
              backendHealth.status === 'online' ? 'online' : 'offline'
            }`}
          />
          <span className="status-label">
            {backendHealth.status === 'online'
              ? backendHealth.modelLoaded
                ? 'Model Ready (5000)'
                : 'API Connected'
              : 'Backend Offline'}
          </span>
        </div>

        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <ul className="mobile-nav-links">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.id}>
                  <button
                    className={`mobile-nav-btn ${activeTab === item.id ? 'active' : ''}`}
                    onClick={() => handleNavClick(item.id)}
                  >
                    <Icon size={18} /> {item.label}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </header>
  )
}
