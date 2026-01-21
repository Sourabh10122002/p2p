# p2p4everyone Client

A peer-to-peer payment and wallet application client built with React and Vite. This application allows users to manage their wallet, send and receive funds, and view transaction history with a modern, responsive interface.

## Features

- **Wallet Management**: 
  - View total balance and wallet address.
  - Send and Receive functionality with modal interfaces.
  - QR Code scanning for easy transfers.
- **Dashboard**: 
  - Real-time balance updates.
  - Transaction history visualization (Send, Receive, etc.).
  - ZK-KYC Verification status display.
- **Authentication**: Secure user authentication integrated with Firebase.
- **Responsive Design**: Built with Tailwind CSS for a seamless experience across devices.
- **Animations**: smooth transitions using Framer Motion.

## Tech Stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State/Routing**: React Router DOM
- **Blockchain/Crypto**: Ethers.js
- **Backend Integration**: Interacts with a backend service (default: `http://localhost:5050`).

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Clone the repository and navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

Start the development server:

```bash
npm run dev
```

The application will launch at `http://localhost:5173` (or the port specified by Vite).

## Build

To build the application for production:

```bash
npm run build
```

Previews the production build:

```bash
npm run preview
```

## Configuration

- **Backend URL**: The application currently points to `http://localhost:5050` for API requests. Ensure your backend server is running on this port or update the fetch URLs in components like `Dashboard.jsx`.
- **Firebase**: Ensure your Firebase configuration is correctly set up in `src/firebase.js`.
