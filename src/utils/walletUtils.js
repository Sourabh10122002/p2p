import { ethers } from 'ethers';

export const generateWalletFromUid = (uid) => {
    const wallet = getWalletFromUid(uid);
    return wallet ? wallet.address : null;
};

export const getWalletFromUid = (uid) => {
    if (!uid) return null;

    // Deterministic Private Key from UID
    const privateKey = ethers.id(uid);

    // Create Wallet
    const wallet = new ethers.Wallet(privateKey);
    return wallet;
};
