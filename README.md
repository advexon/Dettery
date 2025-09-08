# 🎲 DETTERY - Decentralized Lottery Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-blue.svg)](https://soliditylang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Ethereum](https://img.shields.io/badge/Ethereum-Sepolia-627EEA.svg)](https://ethereum.org/)

> A provably fair, transparent, and decentralized lottery system built on Ethereum Sepolia testnet with automatic payouts and secure randomness.

## 🌟 Features

### 🔒 **Security & Transparency**
- ✅ **Smart Contract Verified** - All contracts are verified and auditable
- ✅ **Block Hash Randomness** - Free, secure randomness using blockchain data
- ✅ **No Central Authority** - Fully decentralized operation
- ✅ **Automatic Payouts** - Winner gets 80%, admin gets 20%
- ✅ **Public Blockchain** - All transactions are transparent and verifiable

### 🎯 **User Experience**
- ✅ **Modern UI/UX** - Beautiful, responsive design with Tailwind CSS
- ✅ **Real-time Updates** - No page refresh needed for lottery updates
- ✅ **Participant Visibility** - See all participants and their entries
- ✅ **Multiple Entry Support** - Users can enter multiple times
- ✅ **Wallet Integration** - MetaMask and Web3 wallet support

### 🛠️ **Technical Features**
- ✅ **TypeScript** - Full type safety across the application
- ✅ **Wagmi & Viem** - Modern Ethereum development tools
- ✅ **Hardhat** - Professional smart contract development
- ✅ **Sepolia Testnet** - Deployed and tested on Ethereum testnet
- ✅ **Auto-refresh** - Real-time data updates after transactions

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MetaMask or Web3 wallet
- Sepolia ETH (get from [faucets](https://sepoliafaucet.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/dettery.git
   cd dettery
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install smart contract dependencies
   cd contracts
   npm install
   cd ..
   ```

3. **Environment Setup**
   ```bash
   # Copy environment template
   cp contracts/.env.example contracts/.env
   
   # Edit contracts/.env with your configuration
   SEPOLIA_RPC_URL=https://ethereum-sepolia.publicnode.com
   PRIVATE_KEY=your_private_key_here
   ETHERSCAN_API_KEY=your_etherscan_api_key
   ```

4. **Deploy Smart Contracts**
   ```bash
   cd contracts
   npx hardhat compile
   npx hardhat run scripts/deploy.ts --network sepolia
   ```

5. **Update Frontend Configuration**
   ```typescript
   // Update src/lib/config.ts with your deployed contract address
   export const FACTORY_ADDRESS = 'your_deployed_contract_address';
   ```

6. **Start the Application**
   ```bash
   npm run dev
   ```

7. **Open in Browser**
   ```
   http://localhost:3000
   ```

## 📖 How It Works

### 1. **Create Lottery Pool**
- Set ticket price and maximum players
- Deploy a new lottery contract
- Lottery becomes available for participation

### 2. **Participate**
- Connect your Web3 wallet
- Pay the ticket price to enter
- Multiple entries allowed per user

### 3. **Winner Selection**
- When lottery reaches maximum players
- System waits 2 blocks for fair randomness
- Block hash randomness selects winner automatically

### 4. **Payouts**
- Winner receives 80% of total pool
- Admin receives 20% fee
- All transactions are automatic and transparent

## 🏗️ Architecture

### Smart Contracts

```
contracts/
├── Lottery.sol          # Individual lottery logic
├── LotteryFactory.sol   # Factory for creating lotteries
└── scripts/
    └── deploy.ts        # Deployment script
```

### Frontend

```
src/
├── app/                 # Next.js App Router
├── components/          # React components
│   ├── ConnectWallet.tsx
│   ├── CreateLottery.tsx
│   ├── LotteryCard.tsx
│   └── LotteryList.tsx
└── lib/
    └── config.ts        # Contract addresses and ABIs
```

## 🔧 Configuration

### Environment Variables

Create `contracts/.env`:

```env
SEPOLIA_RPC_URL=https://ethereum-sepolia.publicnode.com
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### Contract Addresses

Update `src/lib/config.ts`:

```typescript
export const FACTORY_ADDRESS = '0xDE22C7fF7Ac8C7645AfB673a4Ea7087705FE94Ce';
```

## 🧪 Testing

### Smart Contract Tests
```bash
cd contracts
npx hardhat test
```

### Frontend Testing
```bash
npm run test
```

### Manual Testing
1. Connect MetaMask to Sepolia testnet
2. Get Sepolia ETH from faucets
3. Create a lottery pool
4. Participate with multiple wallets
5. Test winner selection and payouts

## 📊 Smart Contract Details

### Lottery Contract

```solidity
contract Lottery {
    // Core state variables
    uint256 public immutable i_ticketPrice;
    uint256 public immutable i_maxPlayers;
    address payable public immutable i_admin;
    
    // Lottery state
    enum LotteryState { OPEN, CALCULATING_WINNER, CLOSED }
    LotteryState private s_lotteryState;
    
    // Participants and winner
    address payable[] public s_players;
    address public s_winner;
    
    // Randomness
    uint256 public s_commitBlock;
    uint256 public s_revealBlock;
}
```

### Key Functions

- `enter()` - Join the lottery by paying ticket price
- `pickWinner()` - Select winner using block hash randomness
- `getPlayers()` - Get list of all participants
- `getLotteryState()` - Get current lottery state

## 🔒 Security Features

### Randomness
- Uses `blockhash()`, `block.timestamp`, and `block.prevrandao`
- Commits to randomness block, reveals after 2 blocks
- Prevents manipulation and ensures fairness

### Access Control
- Only lottery participants can trigger winner selection
- Admin cannot manipulate results
- All functions are public and auditable

### Transparency
- All lottery data is public
- Contract source code is verified
- All transactions are on-chain

## 🌐 Deployment

### Sepolia Testnet (Current)
- **Factory Contract**: `0xDE22C7fF7Ac8C7645AfB673a4Ea7087705FE94Ce`
- **Network**: Ethereum Sepolia
- **RPC**: https://ethereum-sepolia.publicnode.com

### Mainnet Deployment
1. Update environment variables
2. Deploy to mainnet
3. Verify contracts on Etherscan
4. Update frontend configuration

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/dettery/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/dettery/discussions)
- **Documentation**: [Wiki](https://github.com/yourusername/dettery/wiki)

## 🙏 Acknowledgments

- [Hardhat](https://hardhat.org/) - Smart contract development framework
- [Next.js](https://nextjs.org/) - React framework
- [Wagmi](https://wagmi.sh/) - React hooks for Ethereum
- [Viem](https://viem.sh/) - TypeScript interface for Ethereum
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

## 📈 Roadmap

- [ ] Mainnet deployment
- [ ] Mobile app (React Native)
- [ ] Additional randomness providers
- [ ] Lottery categories and themes
- [ ] Governance token
- [ ] Multi-chain support

---

**Built with ❤️ for the decentralized future**

[![GitHub stars](https://img.shields.io/github/stars/yourusername/dettery?style=social)](https://github.com/yourusername/dettery)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/dettery?style=social)](https://github.com/yourusername/dettery)
[![GitHub watchers](https://img.shields.io/github/watchers/yourusername/dettery?style=social)](https://github.com/yourusername/dettery)