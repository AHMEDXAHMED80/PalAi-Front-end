import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ConversationPage from './pages/ConversationPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/conversations" element={<ConversationPage />} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  )
}

export default App
