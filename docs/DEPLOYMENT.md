# 🚀 Deployment Guide

This guide covers deploying DETTERY to various environments, from local development to production mainnet.

## 📋 Prerequisites

### Required Tools
- Node.js 18+
- npm or yarn
- Git
- MetaMask or Web3 wallet
- Sepolia ETH (for testnet deployment)

### Required Accounts
- Ethereum wallet with private key
- Etherscan API key (for contract verification)
- RPC provider account (Infura, Alchemy, or public RPC)

## 🔧 Environment Setup

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/dettery.git
cd dettery
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install smart contract dependencies
cd contracts
npm install
cd ..
```

### 3. Environment Configuration

Create `contracts/.env`:
```env
# RPC URL for Ethereum network
SEPOLIA_RPC_URL=https://ethereum-sepolia.publicnode.com
# Or use Infura/Alchemy
# SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID

# Private key of deployment wallet (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# Etherscan API key for contract verification
ETHERSCAN_API_KEY=your_etherscan_api_key

# Optional: Custom gas settings
GAS_LIMIT=3000000
GAS_PRICE=20000000000
```

## 🌐 Network Configurations

### Local Development (Hardhat Network)

**Configuration**:
```typescript
// hardhat.config.ts
networks: {
  hardhat: {
    chainId: 31337,
  },
  localhost: {
    url: "http://127.0.0.1:8545",
    chainId: 31337,
  },
}
```

**Deployment**:
```bash
# Start local node
npx hardhat node

# Deploy to local network (in another terminal)
npx hardhat run scripts/deploy.ts --network localhost
```

### Sepolia Testnet

**Configuration**:
```typescript
// hardhat.config.ts
networks: {
  sepolia: {
    url: SEPOLIA_RPC_URL,
    accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    chainId: 11155111,
  },
}
```

**Deployment**:
```bash
# Deploy to Sepolia
npx hardhat run scripts/deploy.ts --network sepolia

# Verify contracts
npx hardhat verify --network sepolia <contract_address>
```

### Ethereum Mainnet

**Configuration**:
```typescript
// hardhat.config.ts
networks: {
  mainnet: {
    url: MAINNET_RPC_URL,
    accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    chainId: 1,
    gasPrice: 20000000000, // 20 gwei
  },
}
```

**Deployment**:
```bash
# Deploy to mainnet (BE CAREFUL!)
npx hardhat run scripts/deploy.ts --network mainnet

# Verify contracts
npx hardhat verify --network mainnet <contract_address>
```

## 📦 Smart Contract Deployment

### 1. Compile Contracts
```bash
cd contracts
npx hardhat compile
```

### 2. Run Tests
```bash
npx hardhat test
```

### 3. Deploy Contracts
```bash
npx hardhat run scripts/deploy.ts --network <network_name>
```

**Expected Output**:
```
Deploying LotteryFactory...
✅ LotteryFactory deployed to: 0x1234...
🎲 Using FREE block hash randomness - no VRF subscription needed!
📝 Contract verified: 0x1234...
```

### 4. Verify Contracts
```bash
npx hardhat verify --network <network_name> <contract_address>
```

### 5. Update Frontend Configuration

Update `src/lib/config.ts`:
```typescript
// Update with your deployed contract address
export const FACTORY_ADDRESS = '0x1234...'; // Your deployed address

// Update ABI if needed (usually not required)
export const FACTORY_ABI = [
  // ... ABI from artifacts/contracts/Lottery.sol/LotteryFactory.json
];
```

## 🎨 Frontend Deployment

### 1. Build Application
```bash
npm run build
```

### 2. Test Build Locally
```bash
npm start
```

### 3. Deploy to Vercel

**Option A: Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Option B: GitHub Integration**
1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables
4. Deploy automatically

**Environment Variables for Vercel**:
```
NEXT_PUBLIC_FACTORY_ADDRESS=0x1234...
NEXT_PUBLIC_NETWORK=sepolia
```

### 4. Deploy to Netlify

**Option A: Netlify CLI**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=out
```

**Option B: GitHub Integration**
1. Push code to GitHub
2. Connect repository to Netlify
3. Configure build settings
4. Deploy automatically

### 5. Deploy to Other Platforms

**Firebase Hosting**:
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

**AWS S3 + CloudFront**:
```bash
npm run build
aws s3 sync out/ s3://your-bucket-name
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## 🔍 Post-Deployment Verification

### 1. Smart Contract Verification

**Check on Etherscan**:
- Contract source code is verified
- All functions are visible
- Events are properly indexed

**Test Contract Functions**:
```bash
# Read contract data
npx hardhat console --network sepolia
> const factory = await ethers.getContractAt("LotteryFactory", "0x1234...")
> await factory.getDeployedLotteries()
```

### 2. Frontend Verification

**Check Application**:
- [ ] Application loads without errors
- [ ] Wallet connection works
- [ ] Can create lotteries
- [ ] Can participate in lotteries
- [ ] Winner selection works
- [ ] Payouts are distributed correctly

**Test User Flows**:
1. Connect wallet
2. Create a lottery
3. Participate with multiple addresses
4. Select winner
5. Verify payouts

### 3. Network Configuration

**Update Wagmi Configuration**:
```typescript
// src/app/providers.tsx
const config = createConfig({
  chains: [sepolia], // or mainnet
  connectors: [injected()],
  transports: {
    [sepolia.id]: http('https://ethereum-sepolia.publicnode.com'),
  },
});
```

## 🛡️ Security Checklist

### Pre-Deployment
- [ ] All tests pass
- [ ] Contracts are audited (for mainnet)
- [ ] Environment variables are secure
- [ ] Private keys are not committed
- [ ] Gas limits are appropriate

### Post-Deployment
- [ ] Contracts are verified on Etherscan
- [ ] Frontend is accessible via HTTPS
- [ ] Wallet connection works
- [ ] All functions work as expected
- [ ] Error handling is proper

## 📊 Monitoring Setup

### 1. Smart Contract Monitoring

**Etherscan Alerts**:
- Set up alerts for contract interactions
- Monitor for failed transactions
- Track gas usage

**Custom Monitoring**:
```javascript
// Monitor contract events
const factory = new ethers.Contract(factoryAddress, factoryABI, provider);
factory.on("LotteryCreated", (lotteryAddress, creator, ticketPrice, maxPlayers) => {
  console.log("New lottery created:", lotteryAddress);
});
```

### 2. Frontend Monitoring

**Error Tracking**:
```typescript
// Add error boundary
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}
```

**Analytics**:
```typescript
// Track user interactions
import { analytics } from './lib/analytics';

const handleCreateLottery = async () => {
  try {
    await writeContract(/* ... */);
    analytics.track('lottery_created', { ticketPrice, maxPlayers });
  } catch (error) {
    analytics.track('lottery_creation_failed', { error: error.message });
  }
};
```

## 🔄 Update and Maintenance

### Smart Contract Updates

**Note**: Smart contracts are immutable once deployed. For updates:
1. Deploy new contract version
2. Update frontend configuration
3. Migrate data if necessary
4. Communicate changes to users

### Frontend Updates

**Deployment Process**:
1. Make changes to code
2. Test locally
3. Push to repository
4. Deploy to staging
5. Test staging deployment
6. Deploy to production

**Rollback Plan**:
1. Keep previous version tagged
2. Have rollback deployment ready
3. Monitor for issues
4. Rollback if necessary

## 🆘 Troubleshooting

### Common Deployment Issues

**1. Contract Deployment Fails**
```bash
# Check gas limits
npx hardhat run scripts/deploy.ts --network sepolia --gas-limit 5000000

# Check RPC connection
curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' $SEPOLIA_RPC_URL
```

**2. Frontend Build Fails**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**3. Contract Verification Fails**
```bash
# Verify with constructor arguments
npx hardhat verify --network sepolia <contract_address> "constructor_arg1" "constructor_arg2"
```

**4. Wallet Connection Issues**
- Check network configuration
- Verify RPC URL
- Clear browser cache
- Check MetaMask network settings

### Getting Help

- **GitHub Issues**: [Create an issue](https://github.com/yourusername/dettery/issues)
- **Documentation**: Check [Technical Documentation](TECHNICAL.md)
- **Community**: Join our [Discord](https://discord.gg/dettery)

## 📚 Additional Resources

- [Hardhat Deployment Guide](https://hardhat.org/hardhat-runner/docs/guides/deploying)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Deployment](https://vercel.com/docs/deployments)
- [Etherscan Contract Verification](https://etherscan.io/apis#contracts)

---

For more information, see the [main README](../README.md) or [Technical Documentation](TECHNICAL.md).
