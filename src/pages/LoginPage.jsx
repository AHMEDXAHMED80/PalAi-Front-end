import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Eye, EyeOff, MessageCircle, ArrowLeft, Mail, Lock, Loader2 } from 'lucide-react'
import { apiPath } from '../config'

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
  const response = await fetch(apiPath('/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          device_name: `Web - ${navigator.userAgent.substring(0, 50)}...`
        })
      })

      const data = await response.json()

      if (data.success) {
        // Store the authentication token (use same key as register - 'token')
        if (formData.rememberMe) {
          localStorage.setItem('token', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))
        } else {
          sessionStorage.setItem('token', data.token)
          sessionStorage.setItem('user', JSON.stringify(data.user))
        }

        // Navigate to conversations page
        navigate('/conversations')
      } else {
        setError(data.message || 'Login failed. Please try again.')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Network error. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider) => {
    // Implement OAuth flow - redirect to your backend OAuth endpoint
  window.location.href = apiPath(`/auth/${provider}/redirect`)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="auth-page"
    >
      <div className="auth-container">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="auth-sidebar"
        >
          <div className="sidebar-content">
            <Link to="/" className="back-link">
              <ArrowLeft className="back-icon" />
              <span>Back to Home</span>
            </Link>

            <div className="sidebar-brand">
              <MessageCircle className="brand-icon" />
              <span className="brand-text gradient-text">PalAi</span>
            </div>

            <div className="sidebar-welcome">
              <h1>Welcome Back!</h1>
              <p>Continue your AI conversation journey with PalAi</p>
            </div>

            <div className="sidebar-features">
              <div className="feature-item">
                <div className="feature-icon">💬</div>
                <span>Intelligent Conversations</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🔒</div>
                <span>End-to-End Encryption</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">⚡</div>
                <span>Lightning Fast Responses</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="auth-form-container"
        >
          <div className="auth-form-wrapper">
            <div className="form-header">
              <h2>Sign In</h2>
              <p>Enter your credentials to access your account</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="error-message"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <div className="input-wrapper">
                  <Mail className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="input-wrapper">
                  <Lock className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="checkbox-wrapper">
                  <input 
                    type="checkbox" 
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="checkbox"
                    disabled={isLoading}
                  />
                  <span className="checkbox-label">Remember me</span>
                </label>
                <Link to="/forgot-password" className="forgot-link">
                  Forgot password?
                </Link>
              </div>

              <motion.button
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
                type="submit"
                className="btn btn-primary btn-lg auth-submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="loading-icon" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </motion.button>
            </form>

            <div className="auth-divider">
              <span>or continue with</span>
            </div>

            <div className="social-auth">
              <motion.button
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
                onClick={() => handleSocialLogin('google')}
                className="social-btn google-btn"
                disabled={isLoading}
              >
                <svg className="social-icon" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </motion.button>

              <motion.button
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
                onClick={() => handleSocialLogin('github')}
                className="social-btn github-btn"
                disabled={isLoading}
              >
                <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Continue with GitHub
              </motion.button>
            </div>

            <div className="auth-footer">
              <p>
                Don't have an account?{' '}
                <Link to="/register" className="auth-link">
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          background: linear-gradient(135deg, var(--primary-50) 0%, var(--gray-100) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-4);
        }

        .auth-container {
          max-width: 1000px;
          width: 100%;
          background: white;
          border-radius: var(--radius-2xl);
          box-shadow: var(--shadow-xl);
          overflow: hidden;
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 600px;
        }

        .auth-sidebar {
          background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
          color: white;
          padding: var(--space-8);
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        .auth-sidebar::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
          pointer-events: none;
        }

        .sidebar-content {
          position: relative;
          z-index: 1;
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: var(--space-8);
        }

        .back-link {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          font-size: 0.875rem;
          transition: color var(--transition-fast);
          width: fit-content;
        }

        .back-link:hover {
          color: white;
        }

        .back-icon {
          width: 16px;
          height: 16px;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .brand-icon {
          width: 40px;
          height: 40px;
          color: white;
        }

        .brand-text {
          font-size: 2rem;
          font-weight: 800;
          color: white !important;
          background: none !important;
          -webkit-text-fill-color: white !important;
        }

        .sidebar-welcome {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: var(--space-4);
        }

        .sidebar-welcome h1 {
          font-size: 2.5rem;
          font-weight: 800;
          line-height: 1.2;
        }

        .sidebar-welcome p {
          font-size: 1.125rem;
          opacity: 0.9;
          line-height: 1.6;
        }

        .sidebar-features {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          font-size: 0.875rem;
          opacity: 0.9;
        }

        .feature-icon {
          font-size: 1.25rem;
        }

        .auth-form-container {
          padding: var(--space-8);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .auth-form-wrapper {
          width: 100%;
          max-width: 400px;
        }

        .form-header {
          text-align: center;
          margin-bottom: var(--space-8);
        }

        .form-header h2 {
          font-size: 2rem;
          font-weight: 700;
          color: var(--gray-900);
          margin-bottom: var(--space-2);
        }

        .form-header p {
          color: var(--gray-600);
          font-size: 0.875rem;
        }

        .error-message {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-lg);
          font-size: 0.875rem;
          margin-bottom: var(--space-4);
          text-align: center;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: var(--space-4);
          width: 20px;
          height: 20px;
          color: var(--gray-400);
          z-index: 1;
        }

        .form-input {
          padding-left: calc(var(--space-4) + 20px + var(--space-3));
          width: 100%;
          transition: all var(--transition-fast);
        }

        .form-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .password-toggle {
          position: absolute;
          right: var(--space-4);
          background: none;
          border: none;
          cursor: pointer;
          color: var(--gray-400);
          padding: var(--space-1);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color var(--transition-fast);
        }

        .password-toggle:hover:not(:disabled) {
          color: var(--gray-600);
        }

        .password-toggle:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .password-toggle svg {
          width: 20px;
          height: 20px;
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .checkbox-wrapper {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          cursor: pointer;
          opacity: 1;
          transition: opacity var(--transition-fast);
        }

        .checkbox-wrapper:has(.checkbox:disabled) {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .checkbox {
          width: 16px;
          height: 16px;
        }

        .checkbox-label {
          font-size: 0.875rem;
          color: var(--gray-600);
        }

        .forgot-link {
          color: var(--primary-600);
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          transition: color var(--transition-fast);
        }

        .forgot-link:hover {
          color: var(--primary-700);
        }

        .auth-submit {
          width: 100%;
          margin-top: var(--space-2);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          position: relative;
        }

        .auth-submit:disabled {
          opacity: 0.8;
          cursor: not-allowed;
        }

        .loading-icon {
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .auth-divider {
          text-align: center;
          margin: var(--space-6) 0;
          position: relative;
          color: var(--gray-500);
          font-size: 0.875rem;
        }

        .auth-divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: var(--gray-200);
          z-index: 0;
        }

        .auth-divider span {
          background: white;
          padding: 0 var(--space-4);
          position: relative;
          z-index: 1;
        }

        .social-auth {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          border: 2px solid var(--gray-200);
          border-radius: var(--radius-lg);
          background: white;
          color: var(--gray-700);
          font-weight: 500;
          text-decoration: none;
          cursor: pointer;
          transition: all var(--transition-fast);
          font-size: 0.875rem;
        }

        .social-btn:hover:not(:disabled) {
          border-color: var(--gray-300);
          box-shadow: var(--shadow-sm);
        }

        .social-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .social-icon {
          width: 20px;
          height: 20px;
        }

        .auth-footer {
          text-align: center;
          margin-top: var(--space-6);
        }

        .auth-footer p {
          color: var(--gray-600);
          font-size: 0.875rem;
        }

        .auth-link {
          color: var(--primary-600);
          text-decoration: none;
          font-weight: 500;
          transition: color var(--transition-fast);
        }

        .auth-link:hover {
          color: var(--primary-700);
        }

        @media (max-width: 768px) {
          .auth-container {
            grid-template-columns: 1fr;
            margin: var(--space-4);
            max-width: 400px;
          }

          .auth-sidebar {
            padding: var(--space-6);
            text-align: center;
          }

          .sidebar-welcome h1 {
            font-size: 2rem;
          }

          .auth-form-container {
            padding: var(--space-6);
          }
        }
      `}</style>
    </motion.div>
  )
}

export default LoginPage