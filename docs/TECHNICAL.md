# 🔧 Technical Documentation

## Overview

DETTERY is a decentralized lottery platform built on Ethereum that provides provably fair gaming through smart contracts. This document covers the technical architecture, implementation details, and development guidelines.

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Smart         │    │   Ethereum      │
│   (Next.js)     │◄──►│   Contracts     │◄──►│   Sepolia       │
│                 │    │   (Solidity)    │    │   Testnet       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Component Overview

1. **Frontend**: Next.js application with TypeScript
2. **Smart Contracts**: Solidity contracts deployed on Sepolia
3. **Blockchain**: Ethereum Sepolia testnet
4. **Wallet Integration**: MetaMask and Web3 wallets

## 📁 Project Structure

```
dettery/
├── contracts/                 # Smart contracts
│   ├── contracts/
│   │   └── Lottery.sol       # Main lottery contract
│   ├── scripts/
│   │   └── deploy.ts         # Deployment script
│   ├── test/                 # Contract tests
│   ├── hardhat.config.ts     # Hardhat configuration
│   └── package.json          # Contract dependencies
├── src/                      # Frontend source code
│   ├── app/                  # Next.js App Router
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home page
│   │   └── providers.tsx     # Wagmi providers
│   ├── components/           # React components
│   │   ├── ConnectWallet.tsx
│   │   ├── CreateLottery.tsx
│   │   ├── LotteryCard.tsx
│   │   └── LotteryList.tsx
│   └── lib/
│       └── config.ts         # Contract configuration
├── docs/                     # Documentation
├── README.md                 # Project overview
└── package.json              # Frontend dependencies
```

## 🔗 Smart Contracts

### LotteryFactory Contract

**Purpose**: Factory contract for creating new lottery instances.

```solidity
contract LotteryFactory {
    address payable public immutable i_admin;
    address[] public s_deployedLotteries;
    
    event LotteryCreated(
        address indexed lotteryAddress, 
        address indexed creator, 
        uint256 ticketPrice, 
        uint256 maxPlayers
    );
    
    function createLottery(uint256 _ticketPrice, uint256 _maxPlayers) public;
    function getDeployedLotteries() public view returns (address[] memory);
}
```

**Key Features**:
- Creates new lottery instances
- Tracks all deployed lotteries
- Sets admin address for all lotteries

### Lottery Contract

**Purpose**: Individual lottery instance with game logic.

```solidity
contract Lottery {
    // Immutable variables
    uint256 public immutable i_ticketPrice;
    uint256 public immutable i_maxPlayers;
    address payable public immutable i_admin;
    
    // State variables
    enum LotteryState { OPEN, CALCULATING_WINNER, CLOSED }
    LotteryState private s_lotteryState;
    
    address payable[] public s_players;
    address public s_winner;
    uint256 public s_commitBlock;
    uint256 public s_revealBlock;
    
    // Events
    event LotteryEntered(address indexed player);
    event WinnerCalculationStarted(uint256 indexed commitBlock, uint256 indexed revealBlock);
    event WinnerPicked(address indexed winner, uint256 amount);
    event AdminFeePaid(address indexed admin, uint256 amount);
}
```

**Key Functions**:

#### `enter()`
- Allows users to join the lottery
- Validates payment amount
- Transitions to CALCULATING_WINNER when full

#### `pickWinner()`
- Selects winner using block hash randomness
- Distributes 80% to winner, 20% to admin
- Transitions to CLOSED state

#### `getPlayers()`
- Returns array of all participants
- Public view function

#### `canPickWinner()`
- Checks if enough blocks have passed
- Ensures fair randomness

## 🎲 Randomness Implementation

### Block Hash Randomness

DETTERY uses a combination of blockchain data for randomness:

```solidity
uint256 randomSeed = uint256(keccak256(abi.encodePacked(
    blockhash(s_revealBlock),
    block.timestamp,
    block.prevrandao,
    s_players.length
)));

uint256 winnerIndex = randomSeed % s_players.length;
```

**Components**:
- `blockhash(s_revealBlock)`: Hash of a future block
- `block.timestamp`: Current block timestamp
- `block.prevrandao`: Ethereum's randomness beacon
- `s_players.length`: Number of participants

**Security Features**:
- Commits to randomness block when lottery fills
- Waits 2 blocks before revealing
- Prevents manipulation by miners
- Uses multiple entropy sources

## 🎨 Frontend Architecture

### Technology Stack

- **Framework**: Next.js 15.5.2 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Ethereum**: Wagmi + Viem
- **State Management**: React hooks

### Component Architecture

```
App
├── Providers (Wagmi, QueryClient)
├── Layout
│   ├── Header
│   │   └── ConnectWallet
│   └── Main
│       ├── CreateLottery
│       ├── HowItWorks
│       └── LotteryList
│           └── LotteryCard[]
```

### Key Components

#### ConnectWallet
- Handles wallet connection
- Shows connection status
- Manages disconnect functionality

#### CreateLottery
- Form for creating new lotteries
- Validates input
- Handles transaction submission
- Shows transaction status

#### LotteryCard
- Displays individual lottery information
- Shows participants and winner
- Handles participation
- Manages winner selection

#### LotteryList
- Lists all active lotteries
- Fetches lottery data
- Handles data refresh

### State Management

The application uses React hooks for state management:

- `useState`: Local component state
- `useEffect`: Side effects and lifecycle
- `useCallback`: Memoized functions
- `useReadContract`: Reading blockchain data
- `useWriteContract`: Writing to blockchain
- `useWaitForTransactionReceipt`: Transaction confirmation

## 🔄 Data Flow

### Lottery Creation Flow

1. User fills form in `CreateLottery`
2. `writeContract` submits transaction
3. `useWaitForTransactionReceipt` waits for confirmation
4. `onLotteryCreated` callback triggers refresh
5. `LotteryList` refetches data
6. New lottery appears in UI

### Participation Flow

1. User clicks "Enter Lottery" in `LotteryCard`
2. `writeContract` submits transaction with ETH value
3. `useWaitForTransactionReceipt` waits for confirmation
4. `onDataChange` callback triggers refresh
5. Lottery data updates to show new participant

### Winner Selection Flow

1. Lottery reaches maximum players
2. State changes to CALCULATING_WINNER
3. User clicks "Pick Winner" when ready
4. `pickWinner` function executes
5. Winner is selected and payouts are made
6. State changes to CLOSED

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Local Development

1. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/dettery.git
   cd dettery
   ```

2. **Install Dependencies**
   ```bash
   # Frontend
   npm install
   
   # Smart contracts
   cd contracts
   npm install
   cd ..
   ```

3. **Environment Configuration**
   ```bash
   cp contracts/.env.example contracts/.env
   # Edit contracts/.env with your values
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

### Smart Contract Development

```bash
cd contracts

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to local network
npx hardhat node
npx hardhat run scripts/deploy.ts --network localhost

# Deploy to Sepolia
npx hardhat run scripts/deploy.ts --network sepolia
```

## 🧪 Testing

### Smart Contract Testing

```bash
cd contracts
npx hardhat test
```

**Test Coverage**:
- Lottery creation
- Participant entry
- Winner selection
- Payout distribution
- Edge cases and error handling

### Frontend Testing

```bash
npm run test
```

**Test Types**:
- Unit tests for components
- Integration tests for user flows
- E2E tests for complete workflows

### Manual Testing Checklist

- [ ] Wallet connection
- [ ] Lottery creation
- [ ] Multiple participants
- [ ] Winner selection
- [ ] Payout verification
- [ ] Error handling
- [ ] Responsive design

## 🚀 Deployment

### Smart Contract Deployment

1. **Configure Environment**
   ```bash
   # contracts/.env
   SEPOLIA_RPC_URL=https://ethereum-sepolia.publicnode.com
   PRIVATE_KEY=your_private_key
   ETHERSCAN_API_KEY=your_api_key
   ```

2. **Deploy Contracts**
   ```bash
   cd contracts
   npx hardhat run scripts/deploy.ts --network sepolia
   ```

3. **Verify Contracts**
   ```bash
   npx hardhat verify --network sepolia <contract_address>
   ```

### Frontend Deployment

1. **Update Configuration**
   ```typescript
   // src/lib/config.ts
   export const FACTORY_ADDRESS = 'deployed_contract_address';
   ```

2. **Build Application**
   ```bash
   npm run build
   ```

3. **Deploy to Vercel/Netlify**
   ```bash
   # Vercel
   vercel --prod
   
   # Netlify
   netlify deploy --prod
   ```

## 🔒 Security Considerations

### Smart Contract Security

- **Access Control**: Only participants can trigger winner selection
- **Input Validation**: All inputs are validated
- **Reentrancy Protection**: No external calls before state updates
- **Randomness**: Multiple entropy sources prevent manipulation

### Frontend Security

- **Input Sanitization**: All user inputs are validated
- **Wallet Security**: No private key storage
- **HTTPS**: All communications encrypted
- **Content Security Policy**: Prevents XSS attacks

### Operational Security

- **Private Key Management**: Use hardware wallets for mainnet
- **Environment Variables**: Never commit secrets
- **Access Control**: Limit admin privileges
- **Monitoring**: Track all transactions

## 📊 Performance Optimization

### Smart Contract Optimization

- **Gas Efficiency**: Optimized for minimal gas usage
- **Storage Layout**: Efficient variable packing
- **Function Optimization**: Minimal external calls

### Frontend Optimization

- **Code Splitting**: Lazy loading of components
- **Image Optimization**: Next.js automatic optimization
- **Caching**: React Query for data caching
- **Bundle Size**: Tree shaking and minification

## 🔍 Monitoring and Analytics

### Smart Contract Monitoring

- **Event Logging**: All important events are logged
- **Transaction Tracking**: Monitor all contract interactions
- **Error Handling**: Comprehensive error events

### Frontend Analytics

- **User Interactions**: Track user behavior
- **Performance Metrics**: Monitor loading times
- **Error Tracking**: Capture and report errors

## 🐛 Troubleshooting

### Common Issues

1. **Transaction Failures**
   - Check gas limits
   - Verify network connection
   - Ensure sufficient ETH balance

2. **Wallet Connection Issues**
   - Check MetaMask installation
   - Verify network (Sepolia)
   - Clear browser cache

3. **Contract Interaction Errors**
   - Verify contract address
   - Check ABI compatibility
   - Ensure contract is deployed

### Debug Tools

- **Hardhat Console**: Interactive contract debugging
- **Etherscan**: Transaction and contract verification
- **MetaMask**: Transaction details and gas estimation
- **Browser DevTools**: Frontend debugging

## 📚 Additional Resources

- [Solidity Documentation](https://docs.soliditylang.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Wagmi Documentation](https://wagmi.sh/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethereum Sepolia Faucet](https://sepoliafaucet.com/)

---

For more information, see the [main README](../README.md) or [Contributing Guidelines](../CONTRIBUTING.md).
