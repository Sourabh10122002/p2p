import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap, Globe, Plus, Minus } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem', paddingBottom: '5rem' }}>
            {/* Hero Section */}
            <section style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative' }}>
                <div className="hero-glow" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 style={{ fontSize: 'clamp(3rem, 5vw, 6rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.5rem' }}>
                        <span className="text-gradient">Crypto to Fiat</span> <br />
                        <span style={{ color: 'white' }}>Instantly.</span>
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    style={{ fontSize: '1.25rem', color: 'var(--text-gray)', maxWidth: '30rem', margin: '0 auto 2.5rem' }}
                >
                    The decentralized platform for swapping USDC to <span style={{ color: '#60a5fa', fontWeight: 900 }}>Rupees</span> at any QR code. Secure, private, and powered by ZK-KYC.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="flex gap-4"
                    style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}
                >
                    <Link to="/auth">
                        <Button variant="gradient" style={{ height: '3.5rem', padding: '0 2rem', fontSize: '1.125rem' }}>
                            Launch App <ArrowRight size={20} />
                        </Button>
                    </Link>
                    <Button variant="secondary" style={{ height: '3.5rem', padding: '0 2rem', fontSize: '1.125rem' }}>
                        Learn More
                    </Button>
                </motion.div>
            </section>

            {/* Features Grid */}
            <section id="features" className="container">
                <div className="features-grid">
                    <FeatureCard
                        icon={<Zap size={24} />}
                        title="Instant Settlement"
                        desc="Transactions clear in under 90 seconds. No waiting for bank transfers."
                        color="blue"
                    />
                    <FeatureCard
                        icon={<ShieldCheck size={24} />}
                        title="Zero-Knowledge KYC"
                        desc="Verify your identity without exposing personal data. Total privacy."
                        color="violet"
                    />
                    <FeatureCard
                        icon={<Globe size={24} />}
                        title="Global Access"
                        desc="Pay at any QR code worldwide. Bridge the gap between crypto and fiat."
                        color="indigo"
                    />
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="container py-20">
                <h2 className="section-title text-center">Frequently Asked Questions</h2>
                <div className="faq-grid">
                    <FAQItem
                        question="How does the ZK-KYC work?"
                        answer="We use zero-knowledge proofs to verify your identity without revealing your personal data to us or the merchant. It's fully private and secure."
                    />
                    <FAQItem
                        question="Is it really instant?"
                        answer="Yes! Transactions typically settle in under 90 seconds, making it comparable to traditional digital payments but with the benefits of crypto."
                    />
                    <FAQItem
                        question="What fees are involved?"
                        answer="We charge a minimal transaction fee of less than 1% to cover network costs and maintain the platform. There are no hidden charges."
                    />
                    <FAQItem
                        question="Which wallets are supported?"
                        answer="Currently, we support Coinbase Smart Wallet for the smoothest experience. We are working on adding support for more wallets soon."
                    />
                </div>
            </section>

            {/* Trust Section */}
            <section className="text-center">
                <p style={{ color: '#6b7280', textAlign: 'center', marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.875rem' }}>Trusted by industry leaders</p>
                <div className="trust-logos-container">
                    <span className="trust-logo">BASE</span>
                    <span className="trust-logo">COINBASE</span>
                    <span className="trust-logo">MULTICOIN</span>
                    <span className="trust-logo">PARADIGM</span>
                </div>
            </section>

            {/* Stats Section */}
            <section className="container text-center py-16">
                <div className="stats-grid">
                    <div className="stat-card">
                        <span className="stat-value text-gradient">$10M+</span>
                        <span className="stat-label">Total Volume</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value text-gradient">50k+</span>
                        <span className="stat-label">Transactions</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value text-gradient">&lt;90s</span>
                        <span className="stat-label">Settlement Time</span>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="container text-center py-20 relative">
                <div className="section-glow" />
                <h2 className="section-title">How It Works</h2>
                <div className="steps-grid">
                    <div className="step-item">
                        <div className="step-number">1</div>
                        <h3 className="step-title">Login with Number</h3>
                        <p className="step-desc">Creates a secure account and deposits USDC into your wallet.</p>
                    </div>
                    <div className="step-connector"></div>
                    <div className="step-item">
                        <div className="step-number">2</div>
                        <h3 className="step-title">Scan QR</h3>
                        <p className="step-desc">Scan any standard UPI QR code at your favorite store.</p>
                    </div>
                    <div className="step-connector"></div>
                    <div className="step-item">
                        <div className="step-number">3</div>
                        <h3 className="step-title">Pay Instantly</h3>
                        <p className="step-desc">Confirm transaction. Using ZK-KYC, funds settle in Rupees.</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container text-center py-20">
                <div className="cta-box">
                    <h2 className="cta-title">Ready to leave the bank behind?</h2>
                    <p className="cta-desc">Join thousands of users bridging the gap between De-Fi and the real world today.</p>
                    <Link to="/auth">
                        <Button variant="gradient" style={{ height: '3.5rem', padding: '0 2.5rem', fontSize: '1.25rem' }}>
                            Get Started Now <ArrowRight size={20} />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc, color }) => (
    <Card className="feature-card" style={{ padding: '1.5rem', transition: 'background 0.3s' }}>
        <div style={{
            width: '3rem', height: '3rem', borderRadius: '0.75rem',
            background: `rgba(${color === 'blue' ? '59,130,246' : color === 'violet' ? '139,92,246' : '99,102,241'}, 0.2)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem',
            color: color === 'blue' ? '#60a5fa' : color === 'violet' ? '#a78bfa' : '#818cf8'
        }}>
            {icon}
        </div>
        <h3 className="text-xl font-bold" style={{ marginBottom: '0.5rem' }}>{title}</h3>
        <p style={{ color: 'var(--text-gray)' }}>{desc}</p>
    </Card>
);

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="faq-item" onClick={() => setIsOpen(!isOpen)}>
            <div className="faq-question">
                <h3>{question}</h3>
                <span className="faq-icon">
                    {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                </span>
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <p className="faq-answer">{answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Landing;
