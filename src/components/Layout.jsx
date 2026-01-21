import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Wallet } from 'lucide-react';
import Button from './Button';
import '../App.css'; // Ensure app styles are loaded

const Layout = ({ children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const location = useLocation();
    const isDashboard = location.pathname.startsWith('/dashboard');

    return (
        <div className="layout-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header className="fixed-header header-scrolled" style={{ position: 'sticky', top: 0, zIndex: 50, width: '100%' }}>
                <div className="container" style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(to top right, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ color: 'white', fontSize: '12px' }}>P</span>
                        </div>
                        <span style={{ color: 'inherit' }}>p2p4everyone</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="nav-desktop items-center gap-8">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            {!isDashboard ? (
                                <>
                                    <a href="#features" className="nav-link">Features</a>
                                    <a href="#how-it-works" className="nav-link">How it works</a>
                                    <a href="#faq" className="nav-link">FAQ</a>
                                    <Link to="/auth">
                                        <Button variant="gradient" style={{ padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}>Launch App</Button>
                                    </Link>
                                </>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginRight: '1rem' }}>
                                        <span className="text-xs text-gray">Connected</span>
                                        {/* <span className="text-sm" style={{ fontFamily: 'monospace', color: '#60a5fa' }}>0x12...890</span> */}
                                    </div>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(to right, #2563eb, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Wallet size={18} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="nav-mobile-toggle bg-none border-none outline-none"
                        style={{ color: '#d1d5db' }}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </header>

            {/* Mobile Nav - Moved outside header for proper z-index layering */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="mobile-menu-overlay"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="mobile-menu-drawer"
                        >
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
                                <button onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-gray)' }}>
                                    <X size={32} />
                                </button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <a href="#features" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
                                <a href="#how-it-works" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>How it works</a>
                                <a href="#faq" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>FAQ</a>
                                <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="gradient" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>Launch App</Button>
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <main style={{ paddingTop: '1rem' }}>
                {children}
            </main>

            <footer className="site-footer">
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-col">
                            <Link to="/" className="footer-logo">
                                <div className="logo-icon">P</div>
                                <span>p2p4everyone</span>
                            </Link>
                            <p className="footer-desc">
                                The decentralized platform for instant crypto-to-fiat transactions. Secure, private, and global.
                            </p>
                            <div className="footer-socials">
                                <a href="#" className="social-link">𝕏</a>
                                <a href="#" className="social-link">Gh</a>
                                <a href="#" className="social-link">Dc</a>
                            </div>
                        </div>

                        <div className="footer-col">
                            <h4 className="footer-title">Product</h4>
                            <ul className="footer-links">
                                <li><a href="#features">Features</a></li>
                                <li><a href="#how-it-works">How it Works</a></li>
                                <li><a href="#faq">FAQ</a></li>
                                <li><Link to="/auth">Launch App</Link></li>
                            </ul>
                        </div>

                        <div className="footer-col">
                            <h4 className="footer-title">Resources</h4>
                            <ul className="footer-links">
                                <li><a href="#">Documentation</a></li>
                                <li><a href="#">Help Center</a></li>
                                <li><a href="#">Community</a></li>
                            </ul>
                        </div>

                        <div className="footer-col">
                            <h4 className="footer-title">Legal</h4>
                            <ul className="footer-links">
                                <li><a href="#">Privacy Policy</a></li>
                                <li><a href="#">Terms of Service</a></li>
                                <li><a href="#">Cookie Policy</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <p>© {new Date().getFullYear()} p2p4everyone. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
