import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MessageCircle, Menu, X } from 'lucide-react'
import { useState } from 'react'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="navbar"
    >
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <MessageCircle className="brand-icon" />
          <span className="brand-text gradient-text">PalAi</span>
        </Link>

        <div className="navbar-menu">
          <Link to="#features" className="nav-link">Features</Link>
          <Link to="#about" className="nav-link">About</Link>
          <Link to="#contact" className="nav-link">Contact</Link>
        </div>

        <div className="navbar-actions">
          <Link to="/login" className="btn btn-secondary">Login</Link>
          <Link to="/register" className="btn btn-primary">Get Started</Link>
        </div>

        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <motion.div
        className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}
        initial={false}
        animate={{ height: isMenuOpen ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mobile-menu-content">
          <Link to="#features" className="mobile-nav-link">Features</Link>
          <Link to="#about" className="mobile-nav-link">About</Link>
          <Link to="#contact" className="mobile-nav-link">Contact</Link>
          <div className="mobile-actions">
            <Link to="/login" className="btn btn-secondary">Login</Link>
            <Link to="/register" className="btn btn-primary">Get Started</Link>
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--gray-200);
          padding: var(--space-4) 0;
        }

        .navbar-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 var(--space-6);
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          text-decoration: none;
          font-weight: 700;
          font-size: 1.5rem;
        }

        .brand-icon {
          width: 32px;
          height: 32px;
          color: var(--primary-600);
        }

        .brand-text {
          font-size: 1.75rem;
          font-weight: 800;
        }

        .navbar-menu {
          display: flex;
          gap: var(--space-8);
        }

        .nav-link {
          color: var(--gray-600);
          text-decoration: none;
          font-weight: 500;
          transition: color var(--transition-fast);
          position: relative;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--primary-600);
          transition: width var(--transition-fast);
        }

        .nav-link:hover {
          color: var(--primary-600);
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .navbar-actions {
          display: flex;
          gap: var(--space-3);
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: var(--space-2);
          color: var(--gray-600);
        }

        .mobile-menu {
          display: none;
          background: white;
          border-top: 1px solid var(--gray-200);
          overflow: hidden;
        }

        .mobile-menu-content {
          padding: var(--space-6);
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .mobile-nav-link {
          color: var(--gray-600);
          text-decoration: none;
          font-weight: 500;
          padding: var(--space-2) 0;
        }

        .mobile-actions {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          margin-top: var(--space-4);
        }

        @media (max-width: 768px) {
          .navbar-menu,
          .navbar-actions {
            display: none;
          }

          .mobile-menu-btn {
            display: block;
          }

          .mobile-menu {
            display: block;
          }
        }
      `}</style>
    </motion.nav>
  )
}

export default Navbar
