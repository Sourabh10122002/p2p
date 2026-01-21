import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Loader2, CheckCircle, QrCode, XCircle } from 'lucide-react';
import Button from './Button';
import Card from './Card';
import '../App.css';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                style={{ position: 'relative', width: '100%', maxWidth: '28rem', zIndex: 60 }}
            >
                <Card style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 className="text-xl font-bold">{title}</h3>
                        <button onClick={onClose} style={{ color: '#9ca3af', padding: '0.25rem' }}><X size={20} /></button>
                    </div>
                    <div style={{ padding: '1.5rem' }}>
                        {children}
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};

export const SendModal = ({ isOpen, onClose }) => {
    const [step, setStep] = useState('input'); // input, confirming, success
    const [amount, setAmount] = useState('');
    const [address, setAddress] = useState('');

    const [error, setError] = useState('');

    // Dynamically import auth to avoid top-level issues if possible, or just use global
    // Assumption: User is logged in

    const handleSend = async () => {
        if (!amount || !address) return;

        setStep('confirming');
        setError('');

        try {
            const user = (await import('../firebase')).auth.currentUser;
            if (!user) throw new Error("Not logged in");

            const response = await fetch('http://localhost:5050/api/wallet/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    uid: user.uid,
                    to: address,
                    amount: amount
                })
            });

            const data = await response.json();

            if (response.ok) {
                setStep('success');
            } else {
                setError(data.error || "Transaction Failed");
                setStep('input');
            }
        } catch (err) {
            console.error(err);
            setError(err.message || "Network Error");
            setStep('input');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Send USDC">
            <AnimatePresence mode="wait">
                {step === 'input' && (
                    <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', color: '#9ca3af', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Recipient Address</label>
                            <input
                                className="glass-panel w-full"
                                placeholder="0x..."
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', color: 'white', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem' }}
                            />
                        </div>
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', color: '#9ca3af', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Amount</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    className="glass-panel w-full"
                                    type="number"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem', paddingRight: '4rem', color: 'white', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', fontSize: '1.5rem', fontWeight: 600 }}
                                />
                                <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', fontWeight: 500 }}>USDC</span>
                            </div>
                        </div>

                        {error && (
                            <div style={{ color: '#f87171', marginBottom: '1rem', fontSize: '0.875rem' }}>
                                {error}
                            </div>
                        )}

                        <Button variant="primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleSend} disabled={!amount || !address}>
                            Confirm Send
                        </Button>
                    </motion.div>
                )}
                {step === 'confirming' && (
                    <motion.div key="confirming" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center" style={{ padding: '2rem 0' }}>
                        <Loader2 className="animate-spin mb-4 text-blue-500" size={48} style={{ margin: '0 auto 1rem', color: '#3b82f6' }} />
                        <p style={{ color: '#9ca3af' }}>Processing transaction on Base...</p>
                    </motion.div>
                )}
                {step === 'success' && (
                    <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center" style={{ padding: '1rem 0' }}>
                        <div style={{ width: '4rem', height: '4rem', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <CheckCircle size={32} style={{ color: '#34d399' }} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Transaction Sent!</h3>
                        <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>You successfully sent {amount} USDC to {address.slice(0, 6)}...</p>
                        <Button variant="secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => { onClose(); setStep('input'); setAmount(''); setAddress(''); window.location.reload(); }}>
                            Done
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </Modal>
    );
};

// Import QrScanner
import QrScanner from 'react-qr-scanner';

export const ScanModal = ({ isOpen, onClose }) => {
    const [step, setStep] = useState('input'); // input, scanning, review, processing, success, failed
    const [upiId, setUpiId] = useState('');
    const [amountInr, setAmountInr] = useState('');
    const [amountUsdc, setAmountUsdc] = useState('0.00');
    const [rate, setRate] = useState(88.5); // Default/Fallback
    const [loadingQuote, setLoadingQuote] = useState(false);
    const [isScanning, setIsScanning] = useState(false); // Toggle for Camera

    // Debounced Quote Fetch
    React.useEffect(() => {
        const fetchQuote = async () => {
            if (!amountInr) {
                setAmountUsdc('0.00');
                return;
            }
            setLoadingQuote(true);
            try {
                const response = await fetch('http://localhost:5050/api/p2p/quote', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amountInr })
                });
                const data = await response.json();
                if (response.ok) {
                    setAmountUsdc(data.amountUsdc);
                    setRate(data.rate);
                }
            } catch (err) {
                console.error("Quote error", err);
            } finally {
                setLoadingQuote(false);
            }
        };

        const timer = setTimeout(fetchQuote, 500); // 500ms debounce
        return () => clearTimeout(timer);
    }, [amountInr]);

    const handleScanError = (err) => {
        console.error(err);
        setIsScanning(false);
        setStep('input');
    };

    const handleScanResult = (data) => {
        if (data && data.text) {
            setUpiId(data.text);
            setIsScanning(false);
            setStep('input');
        }
    };

    const handlePay = async () => {
        setStep('processing');
        try {
            const user = (await import('../firebase')).auth.currentUser;
            if (!user) throw new Error("Not logged in");

            const response = await fetch('http://localhost:5050/api/p2p/pay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    uid: user.uid,
                    amountUsdc: amountUsdc,
                    amountInr: amountInr,
                    upiId: upiId
                })
            });

            const data = await response.json();
            if (response.ok) {
                setNewBalance(data.newBalance); // Store the returned balance
                setStep('success');
            } else {
                console.error(data.error);
                setStep('failed');
            }
        } catch (err) {
            console.error(err);
            setStep('failed');
        }
    };

    const startScan = () => {
        setIsScanning(true);
        setStep('scanning');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Scan & Pay">
            <AnimatePresence mode="wait">
                {step === 'input' && (
                    <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', color: '#9ca3af', marginBottom: '0.5rem', fontSize: '0.875rem' }}>UPI ID or Scan QR</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    className="glass-panel w-full"
                                    placeholder="friend@upi"
                                    value={upiId}
                                    onChange={e => setUpiId(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem', paddingRight: '3rem', color: 'white', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem' }}
                                />
                                <button
                                    onClick={startScan}
                                    style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#60a5fa', cursor: 'pointer' }}
                                    title="Open Scanner"
                                >
                                    <QrCode size={20} />
                                </button>
                            </div>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', color: '#9ca3af', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Amount (INR)</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    className="glass-panel w-full"
                                    type="number"
                                    placeholder="0"
                                    value={amountInr}
                                    onChange={e => setAmountInr(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem', paddingRight: '3rem', color: 'white', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', fontSize: '1.5rem', fontWeight: 600 }}
                                />
                                <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', fontWeight: 500 }}>INR</span>
                            </div>
                            {amountInr && (
                                <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>You Pay</span>
                                    <span style={{ color: 'white', fontWeight: 600 }}>{amountUsdc} USDC</span>
                                </div>
                            )}
                        </div>

                        <Button variant="primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setStep('review')} disabled={!upiId || !amountInr}>
                            Continue
                        </Button>
                    </motion.div>
                )}

                {step === 'scanning' && (
                    <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center" style={{ padding: '2rem 0', minHeight: '300px' }}>
                        {/* Actual Scanner */}
                        <div style={{ borderRadius: '1rem', overflow: 'hidden', margin: '0 auto', maxWidth: '300px' }}>
                            <QrScanner
                                delay={300}
                                onError={handleScanError}
                                onScan={handleScanResult}
                                style={{ width: '100%' }}
                            />
                        </div>
                        <Button variant="secondary" onClick={() => { setIsScanning(false); setStep('input'); }} style={{ marginTop: '1rem' }}>
                            Cancel
                        </Button>
                    </motion.div>
                )}

                {step === 'review' && (
                    <motion.div key="review" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <h4 style={{ color: '#9ca3af', marginBottom: '1rem', textAlign: 'center' }}>Confirm Payment</h4>

                        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>{amountUsdc} USDC</div>
                            <div style={{ color: '#6b7280', fontSize: '1rem' }}>≈ ₹{amountInr} INR</div>

                            <div style={{ margin: '1.5rem 0', height: '1px', background: 'rgba(255,255,255,0.1)' }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ color: '#9ca3af' }}>To</span>
                                <span style={{ color: 'white' }}>{upiId}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#9ca3af' }}>Rate</span>
                                <span style={{ color: '#60a5fa' }}>1 USDC = ₹{rate}</span>
                            </div>
                        </div>

                        <Button variant="gradient" style={{ width: '100%', justifyContent: 'center' }} onClick={handlePay}>
                            Pay Now
                        </Button>
                    </motion.div>
                )}

                {step === 'processing' && (
                    <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center" style={{ padding: '2rem 0' }}>
                        <Loader2 className="animate-spin mb-4 text-blue-500" size={48} style={{ margin: '0 auto 1rem', color: '#3b82f6' }} />
                        <p style={{ color: '#9ca3af' }}>Processing P2P Payment...</p>
                    </motion.div>
                )}

                {step === 'success' && (
                    <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center" style={{ padding: '1rem 0' }}>
                        <div style={{ width: '4rem', height: '4rem', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <CheckCircle size={32} style={{ color: '#34d399' }} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Payment Sent!</h3>
                        <p style={{ color: '#9ca3af', marginBottom: '0.5rem' }}>Successfully sent {amountUsdc} USDC to {upiId}</p>

                        {newBalance && (
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '2rem' }}>
                                <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Remaining Balance</p>
                                <p style={{ color: 'white', fontWeight: 600, fontSize: '1.25rem' }}>{newBalance} USDC</p>
                            </div>
                        )}

                        <Button variant="secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => { onClose(); setStep('input'); setUpiId(''); setAmountInr(''); setNewBalance(null); window.location.reload(); }}>
                            Done
                        </Button>
                    </motion.div>
                )}

                {step === 'failed' && (
                    <motion.div key="failed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center" style={{ padding: '1rem 0' }}>
                        <div style={{ width: '4rem', height: '4rem', background: 'rgba(239, 68, 68, 0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <XCircle size={32} style={{ color: '#ef4444' }} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Payment Failed</h3>
                        <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>Transaction could not be processed. Please try again.</p>
                        <Button variant="secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setStep('review')}>
                            Try Again
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </Modal>
    );
};

export const ReceiveModal = ({ isOpen, onClose, address }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Receive USDC">
            <div className="text-center" style={{ padding: '1rem 0' }}>
                <div style={{ background: 'white', padding: '1rem', borderRadius: '1rem', display: 'inline-block', marginBottom: '1.5rem' }}>
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${address}`} alt="Wallet QR" style={{ width: '200px', height: '200px' }} />
                </div>
                <p style={{ color: '#9ca3af', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Your Wallet Address</p>
                <div
                    onClick={handleCopy}
                    className="glass-panel"
                    style={{
                        padding: '1rem', background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                        cursor: 'pointer', transition: 'background 0.2s'
                    }}
                >
                    <span style={{ fontFamily: 'monospace', fontSize: '1rem', color: 'white' }}>{address}</span>
                    <button style={{ color: copied ? '#34d399' : '#9ca3af' }}>{copied ? "Copied" : "Copy"}</button>
                </div>
                <p style={{ color: '#6b7280', marginTop: '1.5rem', fontSize: '0.75rem' }}>Send only USDC or ETH to this address. Sending other assets may result in permanent loss.</p>
            </div>
        </Modal>
    );
};
