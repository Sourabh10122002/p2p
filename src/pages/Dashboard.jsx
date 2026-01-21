import React from 'react';
import Card from '../components/Card';
import Wallet from '../components/Wallet';
import { motion } from 'framer-motion';
import { QrCode, Clock, Check, ArrowUpRight, ArrowDownLeft, RefreshCw } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import { generateWalletFromUid } from '../utils/walletUtils';

const Dashboard = () => {
    const location = useLocation();

    // Attempt to get wallet from state, or derive from current user, or fallback
    let walletAddress = location.state?.walletAddress;

    // If no state (e.g. refresh), try to derive from auth
    if (!walletAddress && auth.currentUser) {
        // We can just rely on the API to get address too if needed, but for now derive locally
        // Actually, let's fetch everything from the API to be safe and get real balance
    }

    const [realBalance, setRealBalance] = React.useState(location.state?.balance || '0.00');
    const [realAddress, setRealAddress] = React.useState(location.state?.walletAddress || '');
    const [symbol, setSymbol] = React.useState('ETH'); // Default to ETH for Base

    const [transactions, setTransactions] = React.useState([]);

    React.useEffect(() => {
        const fetchData = async () => {
            if (auth.currentUser) {
                try {
                    // Fetch Balance
                    const balanceRes = await fetch(`http://localhost:5050/api/wallet/balance/${auth.currentUser.uid}`);
                    if (balanceRes.ok) {
                        const data = await balanceRes.json();
                        setRealAddress(data.address);
                        setRealBalance(parseFloat(data.balance).toFixed(4));
                        setSymbol(data.symbol);
                    }

                    // Fetch History
                    const historyRes = await fetch(`http://localhost:5050/api/wallet/history/${auth.currentUser.uid}`);
                    if (historyRes.ok) {
                        const historyData = await historyRes.json();
                        setTransactions(historyData);
                    }
                } catch (e) {
                    console.error("Failed to fetch data", e);
                }
            }
        };
        fetchData();
    }, []);

    // Use state values
    walletAddress = realAddress || walletAddress;

    return (
        // Added styling to container
        <div className="container" style={{ maxWidth: '30rem', paddingBottom: '5rem' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <h1 className="text-2xl font-bold">My Wallet</h1>
                    <span style={{ fontSize: '0.875rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(52, 211, 153, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>
                        <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', background: '#34d399' }} />
                        ZK-KYC Verified
                    </span>
                </div>

                <Wallet address={walletAddress} balance={realBalance} symbol={symbol} />

                <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={18} style={{ color: '#9ca3af' }} /> Recent Activity
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {transactions.length === 0 ? (
                        <div className="text-center text-gray-500 py-8" style={{ color: '#6b7280', padding: '2rem' }}>
                            No recent transactions
                        </div>
                    ) : (
                        transactions.map((tx, i) => (
                            <div key={tx.id || i} className="tx-item">
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div className="tx-icon" style={{
                                        background: tx.type === 'Receive' ? 'rgba(16, 185, 129, 0.2)' : tx.type === 'Send' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(139, 92, 246, 0.2)',
                                        color: tx.type === 'Receive' ? '#34d399' : tx.type === 'Send' ? '#60a5fa' : '#a78bfa'
                                    }}>
                                        {tx.type === 'Receive' ? <ArrowDownLeft size={18} /> :
                                            tx.type === 'Send' ? <ArrowUpRight size={18} /> :
                                                <RefreshCw size={18} />}
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 500, color: 'white' }}>{tx.type} {tx.to}</p>
                                        <p className="text-xs" style={{ color: '#6b7280' }}>{tx.date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p style={{ fontWeight: 500, color: tx.amount.startsWith('-') ? 'white' : '#4ade80' }}>
                                        {tx.amount}
                                    </p>
                                    <p className="text-xs" style={{ color: '#6b7280' }}>{tx.status}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
