import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Smartphone, Lock, Loader2, AlertCircle } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import '../App.css';
import { auth } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { generateWalletFromUid } from '../utils/walletUtils';

const Auth = () => {
    const [step, setStep] = useState('phone'); // phone, otp, generating
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [confirmationResult, setConfirmationResult] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
                'callback': (response) => {
                    // reCAPTCHA solved
                },
                'expired-callback': () => {
                    setError('Recaptcha expired. Please try again.');
                }
            });
        }
    }, []);

    const handlePhoneSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (phoneNumber.length < 10) {
            setError('Please enter a valid phone number.');
            return;
        }

        setLoading(true);
        const appVerifier = window.recaptchaVerifier;

        try {
            // Ensure format is +[country code][number]
            // Ensure format is +91[number]
            const formattedNumber = `+91${phoneNumber}`;
            const confirmation = await signInWithPhoneNumber(auth, formattedNumber, appVerifier);
            setConfirmationResult(confirmation);
            setStep('otp');
        } catch (err) {
            console.error("Error sending SMS:", err);
            setError(err.message || 'Failed to send SMS. Try again.');
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.render().then(widgetId => {
                    window.grecaptcha.reset(widgetId);
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return;
        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Focus next input
        if (element.nextSibling && element.value !== "") {
            element.nextSibling.focus();
        }
    };

    const handleOtpSubmit = async () => {
        setError('');
        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            setError('Please enter the full 6-digit code.');
            return;
        }

        setLoading(true);
        try {
            const result = await confirmationResult.confirm(otpCode);
            const user = result.user;
            // Auth successful
            setStep('generating');

            // Call Backend to Get/Create Wallet
            try {
                const response = await fetch('http://localhost:5050/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ uid: user.uid })
                });

                const data = await response.json();

                if (response.ok) {
                    setTimeout(() => {
                        navigate('/dashboard', { state: { walletAddress: data.walletAddress, balance: data.balance } });
                    }, 2000);
                } else {
                    throw new Error(data.error || 'Server Error');
                }
            } catch (err) {
                console.error("Backend Error:", err);
                setError('Failed to connect to server. Using offline mode.');
                // Fallback (Offline Mode)
                setTimeout(() => {
                    const deterministicWallet = generateWalletFromUid(user.uid);
                    navigate('/dashboard', { state: { walletAddress: deterministicWallet } });
                }, 2000);
            }

        } catch (err) {
            console.error("Error verifying OTP:", err);
            setError('Invalid code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div id="recaptcha-container"></div>
            <AnimatePresence mode="wait">

                {/* Step 1: Phone Number */}
                {step === 'phone' && (
                    <motion.div
                        key="phone"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        style={{ width: '100%', maxWidth: '400px' }}
                    >
                        <Card className="p-8 text-center" style={{ padding: '2rem' }}>
                            <div style={{ margin: '0 auto 1.5rem', width: '3.5rem', height: '3.5rem', background: 'rgba(59, 130, 246, 0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Smartphone size={28} className="text-blue-400" style={{ color: '#60a5fa' }} />
                            </div>

                            <h1 className="text-2xl font-bold mb-2">Get Started</h1>
                            <p className="text-gray-400 mb-6" style={{ color: 'var(--text-gray)' }}>Enter your phone number to sign in.</p>

                            {error && (
                                <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                    <AlertCircle size={16} /> {error}
                                </div>
                            )}

                            <form onSubmit={handlePhoneSubmit}>
                                <div style={{ marginBottom: '1.5rem', position: 'relative', display: 'flex', alignItems: 'center' }}>
                                    <span style={{
                                        position: 'absolute',
                                        left: '1rem',
                                        color: '#9ca3af',
                                        fontSize: '1.1rem',
                                        zIndex: 10
                                    }}>+91</span>
                                    <input
                                        type="tel"
                                        placeholder="98765 43210"
                                        value={phoneNumber}
                                        onChange={(e) => {
                                            // Sanitize input: only numbers
                                            const val = e.target.value.replace(/\D/g, '');
                                            setPhoneNumber(val);
                                        }}
                                        className="w-full glass-panel"
                                        style={{
                                            width: '100%',
                                            padding: '1rem 1rem 1rem 3.5rem', // Added padding-left for +91
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '0.75rem',
                                            color: 'white',
                                            fontSize: '1.1rem',
                                            outline: 'none'
                                        }}
                                        autoFocus
                                        disabled={loading}
                                    />
                                </div>
                                <Button variant="primary" className="w-full" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : <>Continue <ArrowRight size={18} /></>}
                                </Button>
                            </form>
                        </Card>
                    </motion.div>
                )}

                {/* Step 2: OTP */}
                {step === 'otp' && (
                    <motion.div
                        key="otp"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        style={{ width: '100%', maxWidth: '400px' }}
                    >
                        <Card className="p-8 text-center" style={{ padding: '2rem' }}>
                            <div style={{ margin: '0 auto 1.5rem', width: '3.5rem', height: '3.5rem', background: 'rgba(139, 92, 246, 0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Lock size={28} style={{ color: '#a78bfa' }} />
                            </div>

                            <h1 className="text-2xl font-bold mb-2">Verify it's you</h1>
                            <p className="text-gray-400 mb-6" style={{ color: 'var(--text-gray)' }}>
                                Enter the 6-digit code sent to <span style={{ color: 'white' }}>+91 {phoneNumber}</span>
                            </p>

                            {error && (
                                <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                    <AlertCircle size={16} /> {error}
                                </div>
                            )}

                            <div className="flex justify-center gap-2 mb-8" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                                {otp.map((data, index) => (
                                    <input
                                        className="glass-panel text-center"
                                        type="text"
                                        name="otp"
                                        maxLength="1"
                                        key={index}
                                        value={data}
                                        onChange={e => handleOtpChange(e.target, index)}
                                        onKeyDown={e => {
                                            if (e.key === 'Backspace' && !data && index > 0) {
                                                // Move to prev and focus
                                                const prev = e.target.previousSibling;
                                                if (prev) {
                                                    prev.focus();
                                                }
                                            } else if (e.key === 'Enter') {
                                                handleOtpSubmit();
                                            }
                                        }}
                                        onFocus={e => e.target.select()}
                                        disabled={loading}
                                        style={{
                                            width: '3rem', height: '3.5rem', fontSize: '1.5rem', fontWeight: 'bold',
                                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '0.5rem', color: 'white'
                                        }}
                                    />
                                ))}
                            </div>

                            <Button variant="gradient" className="w-full" style={{ width: '100%', justifyContent: 'center' }} onClick={handleOtpSubmit} disabled={loading}>
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <>Verify <ArrowRight size={18} /></>}
                            </Button>

                            <button
                                onClick={() => {
                                    setStep('phone');
                                    setError('');
                                }}
                                className="mt-6 text-sm text-gray-500 hover:text-white transition-colors"
                                style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: '#6b7280' }}
                            >
                                Change Phone Number
                            </button>
                        </Card>
                    </motion.div>
                )}

                {/* Step 3: Generating Wallet */}
                {step === 'generating' && (
                    <motion.div
                        key="generating"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}
                    >
                        <div style={{ marginBottom: '2rem', position: 'relative', display: 'inline-block' }}>
                            <div style={{
                                width: '5rem', height: '5rem', borderRadius: '50%',
                                border: '3px solid rgba(59, 130, 246, 0.3)', borderTopColor: '#3b82f6',
                                animation: 'spin 1s linear infinite'
                            }} />
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                                <Loader2 size={32} className="text-blue-500 animate-spin" style={{ color: '#3b82f6' }} />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold mb-2">Securing Wallet</h2>
                        <p className="text-gray-400" style={{ color: 'var(--text-gray)' }}>Generating your unique ZK-KYC identity and smart contract wallet...</p>

                        <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
};

export default Auth;
