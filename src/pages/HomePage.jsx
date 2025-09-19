import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  MessageCircle, 
  Brain, 
  Sparkles, 
  Users, 
  Shield, 
  Zap,
  ArrowRight,
  Star
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Footer from '../components/Footer'

const HomePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="home-page"
    >
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </motion.div>
  )
}

export default HomePage
