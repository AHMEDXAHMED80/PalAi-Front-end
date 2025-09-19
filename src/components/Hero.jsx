import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, MessageCircle } from 'lucide-react'

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-badge"
          >
            <Sparkles className="badge-icon" />
            <span>AI-Powered Conversations</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hero-title"
          >
            Meet Your New
            <span className="gradient-text"> AI Companion</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="hero-description"
          >
            Experience the future of conversation with PalAi. Our advanced AI 
            understands context, learns from interactions, and provides 
            meaningful, helpful responses tailored just for you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="hero-actions"
          >
            <Link to="/register" className="btn btn-primary btn-lg">
              Start Chatting
              <ArrowRight className="btn-icon" />
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg">
              Sign In
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="hero-stats"
          >
            <div className="stat">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Active Users</span>
            </div>
            <div className="stat">
              <span className="stat-number">1M+</span>
              <span className="stat-label">Conversations</span>
            </div>
            <div className="stat">
              <span className="stat-number">99.9%</span>
              <span className="stat-label">Uptime</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="hero-visual"
        >
          <div className="chat-preview">
            <div className="chat-header">
              <div className="chat-avatar">
                <MessageCircle />
              </div>
              <div className="chat-info">
                <span className="chat-name">PalAi Assistant</span>
                <span className="chat-status">Online</span>
              </div>
            </div>
            <div className="chat-messages">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="message ai-message"
              >
                <div className="message-content">
                  Hello! I'm PalAi, your intelligent conversation partner. 
                  How can I help you today?
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
                className="message user-message"
              >
                <div className="message-content">
                  Tell me about the latest AI trends
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.6 }}
                className="message ai-message typing"
              >
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: var(--space-20) 0;
          background: linear-gradient(135deg, var(--primary-50) 0%, var(--gray-100) 100%);
          position: relative;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 50%, rgba(14, 165, 233, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }

        .hero-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 var(--space-6);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-16);
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .hero-content {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-4);
          background: rgba(14, 165, 233, 0.1);
          border: 1px solid rgba(14, 165, 233, 0.2);
          border-radius: var(--radius-2xl);
          color: var(--primary-700);
          font-size: 0.875rem;
          font-weight: 500;
          width: fit-content;
        }

        .badge-icon {
          width: 16px;
          height: 16px;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.1;
          color: var(--gray-900);
          margin: 0;
        }

        .hero-description {
          font-size: 1.25rem;
          line-height: 1.6;
          color: var(--gray-600);
          max-width: 500px;
        }

        .hero-actions {
          display: flex;
          gap: var(--space-4);
          flex-wrap: wrap;
        }

        .btn-icon {
          width: 20px;
          height: 20px;
        }

        .hero-stats {
          display: flex;
          gap: var(--space-8);
          margin-top: var(--space-4);
        }

        .stat {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }

        .stat-number {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--gray-900);
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--gray-500);
        }

        .hero-visual {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .chat-preview {
          width: 100%;
          max-width: 400px;
          background: white;
          border-radius: var(--radius-2xl);
          box-shadow: var(--shadow-xl);
          overflow: hidden;
          border: 1px solid var(--gray-200);
        }

        .chat-header {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-4);
          background: var(--primary-50);
          border-bottom: 1px solid var(--primary-100);
        }

        .chat-avatar {
          width: 40px;
          height: 40px;
          background: var(--primary-600);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .chat-info {
          display: flex;
          flex-direction: column;
        }

        .chat-name {
          font-weight: 600;
          color: var(--gray-900);
        }

        .chat-status {
          font-size: 0.75rem;
          color: var(--primary-600);
        }

        .chat-messages {
          padding: var(--space-4);
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          min-height: 200px;
        }

        .message {
          display: flex;
          max-width: 80%;
        }

        .ai-message {
          align-self: flex-start;
        }

        .user-message {
          align-self: flex-end;
        }

        .message-content {
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-lg);
          font-size: 0.875rem;
          line-height: 1.4;
        }

        .ai-message .message-content {
          background: var(--gray-100);
          color: var(--gray-800);
        }

        .user-message .message-content {
          background: var(--primary-600);
          color: white;
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: var(--space-3) var(--space-4);
          background: var(--gray-100);
          border-radius: var(--radius-lg);
        }

        .typing-indicator span {
          width: 6px;
          height: 6px;
          background: var(--gray-400);
          border-radius: 50%;
          animation: typing 1.4s infinite ease-in-out;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-10px);
          }
        }

        @media (max-width: 768px) {
          .hero-container {
            grid-template-columns: 1fr;
            gap: var(--space-8);
            text-align: center;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .hero-actions {
            justify-content: center;
          }

          .hero-stats {
            justify-content: center;
          }

          .chat-preview {
            max-width: 300px;
          }
        }
      `}</style>
    </section>
  )
}

export default Hero
