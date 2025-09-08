# DETTERY - Decentralized Lottery

A provably fair lottery system built with Chainlink VRF (Verifiable Random Function) for secure randomness.

## 🎯 Features

- **Decentralized**: Built on Ethereum using smart contracts
- **Provably Fair**: Uses Chainlink VRF for verifiable randomness
- **Transparent**: All lottery data is on-chain and publicly verifiable
- **Fair Distribution**: 80% to winner, 20% to admin
- **User-Friendly**: Modern Next.js frontend with wallet integration

## 🏗️ Architecture

### Backend (Smart Contracts)
- **LotteryFactory**: Deploys individual lottery contracts
- **Lottery**: Individual lottery pools with VRF integration
- **Chainlink VRF**: Provides cryptographically secure randomness

### Frontend (Next.js)
- **Wagmi**: Web3 React hooks for wallet integration
- **Tailwind CSS**: Modern, responsive UI design
- **TypeScript**: Type-safe development

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MetaMask or compatible wallet
- Sepolia ETH for testing
- Chainlink VRF subscription

### 1. Clone and Install

```bash
# Install root dependencies
npm install

# Install contract dependencies
cd contracts
npm install
```

### 2. Environment Setup

Create `contracts/.env` file:
```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

### 3. Deploy Contracts

```bash
cd contracts
npx hardhat compile
npx hardhat run scripts/deploy.ts --network sepolia
```

### 4. Update Frontend Config

Update `src/lib/config.ts` with your deployed contract address and ABIs.

### 5. Run Frontend

```bash
npm run dev
```

Visit `http://localhost:3000` to use the application.

## 📋 Contract Details

### Lottery Contract
- **Ticket Price**: Fixed price per entry (in ETH)
- **Max Players**: Maximum number of participants
- **States**: Open → Calculating Winner → Closed
- **Winner Selection**: Chainlink VRF random number generation
- **Prize Distribution**: 80% winner, 20% admin

### LotteryFactory Contract
- **Deployment**: Creates new lottery instances
- **Management**: Tracks all deployed lotteries
- **Configuration**: Sets VRF parameters

## 🔧 Development

### Smart Contract Commands
```bash
cd contracts

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to Sepolia
npx hardhat run scripts/deploy.ts --network sepolia

# Verify on Etherscan
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

### Frontend Commands
```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🔐 Security Features

- **VRF Integration**: Cryptographically secure randomness
- **Access Control**: Only authorized functions can be called
- **Error Handling**: Comprehensive error checking
- **State Management**: Clear lottery state transitions

## 🌐 Network Support

Currently configured for:
- **Sepolia Testnet**: For development and testing
- **Ethereum Mainnet**: Ready for production deployment

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## ⚠️ Disclaimer

This is a demonstration project. Use at your own risk. Always audit smart contracts before using with real funds.
