# ⚡ Quick Start Guide

Get DETTERY up and running in minutes!

## 🚀 5-Minute Setup

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/dettery.git
cd dettery
npm install
cd contracts && npm install && cd ..
```

### 2. Configure Environment
```bash
cp contracts/.env.example contracts/.env
# Edit contracts/.env with your Sepolia RPC and private key
```

### 3. Deploy Contracts
```bash
npm run deploy
# Copy the deployed contract address
```

### 4. Update Frontend
```typescript
// Edit src/lib/config.ts
export const FACTORY_ADDRESS = 'your_deployed_address';
```

### 5. Start Application
```bash
npm run dev
# Open http://localhost:3000
```

## 🎯 What You Get

- ✅ **Smart Contracts**: Deployed on Sepolia testnet
- ✅ **Frontend**: Modern React app with Web3 integration
- ✅ **Wallet Support**: MetaMask and Web3 wallets
- ✅ **Real-time Updates**: No page refresh needed
- ✅ **Full Documentation**: Complete guides and API docs

## 🔗 Quick Links

- [Full Documentation](README.md)
- [Technical Details](TECHNICAL.md)
- [API Reference](API.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Contributing](CONTRIBUTING.md)

## 🆘 Need Help?

- [GitHub Issues](https://github.com/yourusername/dettery/issues)
- [Documentation](README.md)
- [Discord Community](https://discord.gg/dettery)

---

**Ready to build the future of decentralized gaming!** 🎲✨
