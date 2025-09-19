import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { MessageCircle, ArrowLeft, Mail } from 'lucide-react';
import { apiPath } from '../config'

const ForgotPasswordPage = () => {
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState(null);
	const [error, setError] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage(null);
		setError(null);
		
		try {
			const response = await fetch(apiPath('/SendRestPasswordLink'), {
				method: 'POST',
				headers: { 
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				body: JSON.stringify({ email }),
			});
			
			const data = await response.json();
			
			// Check if response is ok (status 200-299) and data.success is true
			if (response.ok && data.success) {
				setMessage(data.message);
				setEmail(''); // Clear email field on success
			} else {
				setError(data.message || 'Failed to send reset link.');
			}
		} catch (err) {
			console.error('Reset password error:', err);
			setError('Network error. Please check your connection and try again.');
		} finally {
			setLoading(false);
		}
	};

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
						<Link to="/login" className="back-link">
							<ArrowLeft className="back-icon" />
							<span>Back to Login</span>
						</Link>
						<div className="sidebar-brand">
							<MessageCircle className="brand-icon" />
							<span className="brand-text gradient-text">PalAi</span>
						</div>
						<div className="sidebar-welcome">
							<h1>Forgot Password?</h1>
							<p>Enter your email to receive a password reset link and regain access to your account.</p>
						</div>
						<div className="sidebar-features">
							<div className="feature-item">
								<div className="feature-icon">🔒</div>
								<span>Secure Account Recovery</span>
							</div>
							<div className="feature-item">
								<div className="feature-icon">⚡</div>
								<span>Fast Email Delivery</span>
							</div>
							<div className="feature-item">
								<div className="feature-icon">💡</div>
								<span>Easy to Use</span>
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
							<h2>Reset Your Password</h2>
							<p>We'll send a reset link to your email address</p>
						</div>
						<form onSubmit={handleSubmit} className="auth-form">
							<div className="form-group">
								<label htmlFor="email" className="form-label">Email Address</label>
								<div className="input-wrapper">
									<Mail className="input-icon" />
									<input
										type="email"
										id="email"
										name="email"
										value={email}
										onChange={e => setEmail(e.target.value)}
										className="form-input"
										placeholder="Enter your email"
										required
										disabled={loading}
									/>
								</div>
							</div>
							{error && (
								<div className="form-error" role="alert">
									{error}
								</div>
							)}
							{message && (
								<div className="form-success" role="alert">
									{message}
								</div>
							)}
							<motion.button
								whileHover={!loading ? { scale: 1.02 } : {}}
								whileTap={!loading ? { scale: 0.98 } : {}}
								type="submit"
								className="btn btn-primary btn-lg auth-submit"
								disabled={loading}
							>
								{loading ? 'Sending...' : 'Send Reset Link'}
							</motion.button>
						</form>
						<div className="form-footer">
							Remembered your password?{' '}
							<Link to="/login" className="forgot-link">Back to Login</Link>
						</div>
					</div>
				</motion.div>
			</div>
		</motion.div>
	);
};

export default ForgotPasswordPage;