import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MessageCircle, Twitter, Github, Linkedin, Mail } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <Link to="/" className="brand-link">
              <MessageCircle className="brand-icon" />
              <span className="brand-text gradient-text">PalAi</span>
            </Link>
            <p className="brand-description">
              The future of AI conversation is here. Join the revolution in 
              intelligent communication.
            </p>
            <div className="social-links">
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                className="social-link"
              >
                <Twitter />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                className="social-link"
              >
                <Github />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                className="social-link"
              >
                <Linkedin />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                className="social-link"
              >
                <Mail />
              </motion.a>
            </div>
          </div>

          <div className="footer-links">
            <div className="link-group">
              <h4 className="link-title">Product</h4>
              <Link to="#" className="footer-link">Features</Link>
              <Link to="#" className="footer-link">Pricing</Link>
              <Link to="#" className="footer-link">API</Link>
              <Link to="#" className="footer-link">Documentation</Link>
            </div>

            <div className="link-group">
              <h4 className="link-title">Company</h4>
              <Link to="#" className="footer-link">About Us</Link>
              <Link to="#" className="footer-link">Careers</Link>
              <Link to="#" className="footer-link">Blog</Link>
              <Link to="#" className="footer-link">Contact</Link>
            </div>

            <div className="link-group">
              <h4 className="link-title">Support</h4>
              <Link to="#" className="footer-link">Help Center</Link>
              <Link to="#" className="footer-link">Community</Link>
              <Link to="#" className="footer-link">Status</Link>
              <Link to="#" className="footer-link">Updates</Link>
            </div>

            <div className="link-group">
              <h4 className="link-title">Legal</h4>
              <Link to="#" className="footer-link">Privacy Policy</Link>
              <Link to="#" className="footer-link">Terms of Service</Link>
              <Link to="#" className="footer-link">Cookie Policy</Link>
              <Link to="#" className="footer-link">GDPR</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            © 2025 PalAi. All rights reserved. Built with ❤️ for the future of AI.
          </p>
          <div className="footer-bottom-links">
            <Link to="#" className="bottom-link">Privacy</Link>
            <Link to="#" className="bottom-link">Terms</Link>
            <Link to="#" className="bottom-link">Cookies</Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: linear-gradient(135deg, var(--gray-900) 0%, var(--gray-800) 100%);
          color: white;
          padding: var(--space-16) 0 var(--space-8);
          position: relative;
          overflow: hidden;
        }

        .footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 20%, rgba(14, 165, 233, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 var(--space-6);
          position: relative;
          z-index: 1;
        }

        .footer-content {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: var(--space-16);
          margin-bottom: var(--space-12);
        }

        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .brand-link {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          text-decoration: none;
          width: fit-content;
        }

        .brand-icon {
          width: 32px;
          height: 32px;
          color: var(--primary-400);
        }

        .brand-text {
          font-size: 1.75rem;
          font-weight: 800;
        }

        .brand-description {
          color: var(--gray-300);
          line-height: 1.6;
          max-width: 300px;
        }

        .social-links {
          display: flex;
          gap: var(--space-3);
        }

        .social-link {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gray-300);
          transition: all var(--transition-fast);
          text-decoration: none;
        }

        .social-link:hover {
          background: var(--primary-600);
          color: white;
        }

        .footer-links {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-8);
        }

        .link-group {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .link-title {
          font-size: 1rem;
          font-weight: 600;
          color: white;
          margin-bottom: var(--space-2);
        }

        .footer-link {
          color: var(--gray-300);
          text-decoration: none;
          font-size: 0.875rem;
          transition: color var(--transition-fast);
        }

        .footer-link:hover {
          color: var(--primary-400);
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: var(--space-8);
          border-top: 1px solid var(--gray-700);
        }

        .copyright {
          color: var(--gray-400);
          font-size: 0.875rem;
        }

        .footer-bottom-links {
          display: flex;
          gap: var(--space-6);
        }

        .bottom-link {
          color: var(--gray-400);
          text-decoration: none;
          font-size: 0.875rem;
          transition: color var(--transition-fast);
        }

        .bottom-link:hover {
          color: var(--primary-400);
        }

        @media (max-width: 768px) {
          .footer-content {
            grid-template-columns: 1fr;
            gap: var(--space-8);
          }

          .footer-links {
            grid-template-columns: repeat(2, 1fr);
            gap: var(--space-6);
          }

          .footer-bottom {
            flex-direction: column;
            gap: var(--space-4);
            text-align: center;
          }

          .footer-bottom-links {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .footer-links {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </footer>
  )
}

export default Footer
