import React, { useState } from 'react';
import { QrCode, ArrowUpRight, ArrowDownLeft, Copy, CheckCircle, Headset } from 'lucide-react';
import Card from '../components/Card';
import '../App.css';
import { SendModal, ReceiveModal, ScanModal } from './Modals';

const Wallet = ({ address, balance = "0.00", symbol = "USDC" }) => {
    const [copied, setCopied] = useState(false);
    const [showSend, setShowSend] = useState(false);
    const [showReceive, setShowReceive] = useState(false);
    const [showScan, setShowScan] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Format address for display if it's long
    const displayAddress = address ? (address.length > 20 ? `${address.slice(0, 6)}...${address.slice(-4)}` : address) : 'Loading...';

    return (
        <>
            <Card className="wallet-card" style={{ marginBottom: '2rem', padding: '2rem' }}>
                <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
                    <div className="flex flex-col px-4">
                        <h2 style={{ color: '#9ca3af', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Total Balance</h2>
                        <div className="text-4xl font-bold flex items-center gap-2">
                            ${balance || '0.00'} <span style={{ fontSize: '1.25rem', color: '#6b7280', fontWeight: 400 }}>{symbol}</span>
                        </div>
                    </div>
                    <div
                        className="address-pill pointer"
                        onClick={handleCopy}
                        style={{ cursor: 'pointer', transition: 'background 0.2s' }}
                    >
                        <span>{displayAddress}</span>
                        {copied ? <CheckCircle size={14} style={{ color: '#4ade80' }} /> : <Copy size={14} style={{ color: '#9ca3af' }} />}
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                    <ActionButton icon={<ArrowUpRight />} label="Send" color="blue" onClick={() => setShowSend(true)} />
                    <ActionButton icon={<ArrowDownLeft />} label="Receive" color="green" onClick={() => setShowReceive(true)} />
                    <ActionButton icon={<QrCode />} label="Scan" color="indigo" onClick={() => setShowScan(true)} />
                    <ActionButton icon={<Headset />} label="Support" color="indigo" onClick={() => window.open('https://t.me/guess_the_username', '_blank')} />
                </div>
            </Card>

            <SendModal isOpen={showSend} onClose={() => setShowSend(false)} />
            <ReceiveModal isOpen={showReceive} onClose={() => setShowReceive(false)} address={address} />
            <ScanModal isOpen={showScan} onClose={() => setShowScan(false)} />
        </>
    );
};

const ActionButton = ({ icon, label, color, onClick }) => (
    <button className="action-btn group" onClick={onClick}>
        <div className={`action-icon icon-${color}`}>
            {React.cloneElement(icon, { size: 24 })}
        </div>
        <span style={{ fontSize: '0.875rem', color: '#9ca3af', fontWeight: 500 }}>{label}</span>
    </button>
);

export default Wallet;
