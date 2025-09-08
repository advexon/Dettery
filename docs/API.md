# 📚 API Documentation

This document provides comprehensive API documentation for DETTERY's smart contracts and frontend interfaces.

## 🏗️ Smart Contract APIs

### LotteryFactory Contract

**Address**: `0xDE22C7fF7Ac8C7645AfB673a4Ea7087705FE94Ce` (Sepolia)

#### Functions

##### `createLottery(uint256 _ticketPrice, uint256 _maxPlayers)`

Creates a new lottery pool.

**Parameters**:
- `_ticketPrice` (uint256): Price per ticket in wei
- `_maxPlayers` (uint256): Maximum number of participants

**Returns**: None

**Events**:
```solidity
event LotteryCreated(
    address indexed lotteryAddress,
    address indexed creator,
    uint256 ticketPrice,
    uint256 maxPlayers
);
```

**Example**:
```typescript
const tx = await factory.createLottery(
  ethers.parseEther("0.01"), // 0.01 ETH
  10 // Max 10 players
);
```

##### `getDeployedLotteries()`

Returns array of all deployed lottery addresses.

**Parameters**: None

**Returns**: `address[]` - Array of lottery contract addresses

**Example**:
```typescript
const lotteries = await factory.getDeployedLotteries();
console.log(lotteries); // ['0x1234...', '0x5678...']
```

##### `i_admin()`

Returns the admin address that receives 20% of lottery winnings.

**Parameters**: None

**Returns**: `address payable` - Admin address

**Example**:
```typescript
const admin = await factory.i_admin();
console.log(admin); // '0x1234...'
```

### Lottery Contract

Each lottery is an individual contract instance created by the factory.

#### Functions

##### `enter()`

Allows a user to participate in the lottery.

**Parameters**: None (payable function)

**Value**: Must equal `i_ticketPrice`

**Returns**: None

**Events**:
```solidity
event LotteryEntered(address indexed player);
```

**Example**:
```typescript
const tx = await lottery.enter({
  value: ethers.parseEther("0.01") // Pay ticket price
});
```

##### `pickWinner()`

Selects a winner using block hash randomness.

**Parameters**: None

**Returns**: None

**Requirements**:
- Lottery must be in `CALCULATING_WINNER` state
- Current block must be >= `s_revealBlock`

**Events**:
```solidity
event WinnerPicked(address indexed winner, uint256 amount);
event AdminFeePaid(address indexed admin, uint256 amount);
```

**Example**:
```typescript
const tx = await lottery.pickWinner();
```

##### `getPlayers()`

Returns array of all participants.

**Parameters**: None

**Returns**: `address payable[]` - Array of participant addresses

**Example**:
```typescript
const players = await lottery.getPlayers();
console.log(players); // ['0x1234...', '0x5678...']
```

##### `getLotteryState()`

Returns current lottery state.

**Parameters**: None

**Returns**: `uint8` - Lottery state (0=OPEN, 1=CALCULATING_WINNER, 2=CLOSED)

**Example**:
```typescript
const state = await lottery.getLotteryState();
console.log(state); // 0, 1, or 2
```

##### `canPickWinner()`

Checks if winner can be picked.

**Parameters**: None

**Returns**: `bool` - True if winner can be picked

**Example**:
```typescript
const canPick = await lottery.canPickWinner();
console.log(canPick); // true or false
```

##### `getRevealBlock()`

Returns the block number when winner can be picked.

**Parameters**: None

**Returns**: `uint256` - Block number

**Example**:
```typescript
const revealBlock = await lottery.getRevealBlock();
console.log(revealBlock); // 12345678
```

#### State Variables

##### `i_ticketPrice`

Immutable ticket price in wei.

**Type**: `uint256`

**Example**:
```typescript
const ticketPrice = await lottery.i_ticketPrice();
console.log(ethers.formatEther(ticketPrice)); // "0.01"
```

##### `i_maxPlayers`

Immutable maximum number of players.

**Type**: `uint256`

**Example**:
```typescript
const maxPlayers = await lottery.i_maxPlayers();
console.log(maxPlayers.toString()); // "10"
```

##### `i_admin`

Immutable admin address.

**Type**: `address payable`

**Example**:
```typescript
const admin = await lottery.i_admin();
console.log(admin); // "0x1234..."
```

##### `s_winner`

Winner address (set after `pickWinner()` is called).

**Type**: `address`

**Example**:
```typescript
const winner = await lottery.s_winner();
console.log(winner); // "0x1234..." or "0x0000..." if not set
```

##### `s_commitBlock`

Block number when lottery reached maximum players.

**Type**: `uint256`

**Example**:
```typescript
const commitBlock = await lottery.s_commitBlock();
console.log(commitBlock.toString()); // "12345678"
```

## 🎨 Frontend API

### React Hooks

#### `useReadContract`

Reads data from smart contracts.

**Parameters**:
```typescript
{
  address: `0x${string}`;
  abi: Abi;
  functionName: string;
  args?: readonly unknown[];
}
```

**Returns**:
```typescript
{
  data: TData | undefined;
  error: Error | null;
  isError: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  refetch: () => void;
}
```

**Example**:
```typescript
const { data: players } = useReadContract({
  address: lotteryAddress,
  abi: LOTTERY_ABI,
  functionName: 'getPlayers',
});
```

#### `useWriteContract`

Writes to smart contracts.

**Parameters**:
```typescript
{
  address: `0x${string}`;
  abi: Abi;
  functionName: string;
  args?: readonly unknown[];
  value?: bigint;
}
```

**Returns**:
```typescript
{
  writeContract: (args?: WriteContractArgs) => void;
  data: `0x${string}` | undefined;
  error: Error | null;
  isError: boolean;
  isIdle: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  isPending: boolean;
  reset: () => void;
}
```

**Example**:
```typescript
const { writeContract } = useWriteContract();

const handleEnter = () => {
  writeContract({
    address: lotteryAddress,
    abi: LOTTERY_ABI,
    functionName: 'enter',
    value: ticketPrice,
  });
};
```

#### `useWaitForTransactionReceipt`

Waits for transaction confirmation.

**Parameters**:
```typescript
{
  hash: `0x${string}` | undefined;
  confirmations?: number;
  timeout?: number;
}
```

**Returns**:
```typescript
{
  data: TransactionReceipt | undefined;
  error: Error | null;
  isError: boolean;
  isLoading: boolean;
  isSuccess: boolean;
}
```

**Example**:
```typescript
const { writeContract, data: hash } = useWriteContract();
const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
  hash,
});

useEffect(() => {
  if (isConfirmed) {
    // Transaction confirmed
    refetch();
  }
}, [isConfirmed]);
```

#### `useAccount`

Manages wallet connection state.

**Returns**:
```typescript
{
  address: `0x${string}` | undefined;
  isConnected: boolean;
  isConnecting: boolean;
  isDisconnected: boolean;
  isReconnecting: boolean;
  status: 'connected' | 'connecting' | 'reconnecting' | 'disconnected';
}
```

**Example**:
```typescript
const { address, isConnected } = useAccount();

if (isConnected) {
  console.log('Connected:', address);
}
```

### Utility Functions

#### `formatEther`

Converts wei to ETH string.

**Parameters**: `bigint` - Value in wei

**Returns**: `string` - ETH value

**Example**:
```typescript
const ethValue = formatEther(ethers.parseEther("0.01"));
console.log(ethValue); // "0.01"
```

#### `parseEther`

Converts ETH string to wei.

**Parameters**: `string` - ETH value

**Returns**: `bigint` - Value in wei

**Example**:
```typescript
const weiValue = parseEther("0.01");
console.log(weiValue); // 10000000000000000n
```

## 🔄 Event Handling

### Smart Contract Events

#### LotteryCreated

Emitted when a new lottery is created.

```solidity
event LotteryCreated(
    address indexed lotteryAddress,
    address indexed creator,
    uint256 ticketPrice,
    uint256 maxPlayers
);
```

**Frontend Usage**:
```typescript
const factory = new ethers.Contract(factoryAddress, factoryABI, provider);

factory.on("LotteryCreated", (lotteryAddress, creator, ticketPrice, maxPlayers) => {
  console.log("New lottery created:", {
    address: lotteryAddress,
    creator,
    ticketPrice: ethers.formatEther(ticketPrice),
    maxPlayers: maxPlayers.toString(),
  });
});
```

#### LotteryEntered

Emitted when a player enters a lottery.

```solidity
event LotteryEntered(address indexed player);
```

**Frontend Usage**:
```typescript
const lottery = new ethers.Contract(lotteryAddress, lotteryABI, provider);

lottery.on("LotteryEntered", (player) => {
  console.log("Player entered:", player);
  // Refresh lottery data
  refetch();
});
```

#### WinnerPicked

Emitted when a winner is selected.

```solidity
event WinnerPicked(address indexed winner, uint256 amount);
```

**Frontend Usage**:
```typescript
lottery.on("WinnerPicked", (winner, amount) => {
  console.log("Winner selected:", {
    winner,
    amount: ethers.formatEther(amount),
  });
  // Update UI to show winner
});
```

## 🛠️ Error Handling

### Common Errors

#### Insufficient Funds

**Error**: `insufficient funds for gas * price + value`

**Solution**: Ensure wallet has enough ETH for gas + ticket price.

```typescript
try {
  await writeContract({
    address: lotteryAddress,
    abi: LOTTERY_ABI,
    functionName: 'enter',
    value: ticketPrice,
  });
} catch (error) {
  if (error.message.includes('insufficient funds')) {
    alert('Insufficient funds. Please add ETH to your wallet.');
  }
}
```

#### Lottery Not Open

**Error**: `Lottery__NotOpen()`

**Solution**: Check lottery state before attempting to enter.

```typescript
const { data: state } = useReadContract({
  address: lotteryAddress,
  abi: LOTTERY_ABI,
  functionName: 'getLotteryState',
});

if (state === 0) { // OPEN
  // Allow entry
} else {
  // Show appropriate message
}
```

#### Incorrect Value

**Error**: `Lottery__IncorrectValue()`

**Solution**: Ensure payment amount matches ticket price.

```typescript
const { data: ticketPrice } = useReadContract({
  address: lotteryAddress,
  abi: LOTTERY_ABI,
  functionName: 'i_ticketPrice',
});

await writeContract({
  address: lotteryAddress,
  abi: LOTTERY_ABI,
  functionName: 'enter',
  value: ticketPrice, // Use exact ticket price
});
```

### Error Boundaries

**React Error Boundary**:
```typescript
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <LotteryApp />
    </ErrorBoundary>
  );
}
```

## 📊 Data Types

### TypeScript Interfaces

```typescript
interface LotteryData {
  address: string;
  ticketPrice: bigint;
  maxPlayers: bigint;
  players: string[];
  state: number;
  winner: string;
  canPickWinner: boolean;
  revealBlock: bigint;
}

interface CreateLotteryParams {
  ticketPrice: string;
  maxPlayers: string;
}

interface LotteryCardProps {
  address: string;
  index: number;
  onDataChange?: () => void;
}
```

### Solidity Types

```solidity
// Lottery state enum
enum LotteryState { 
    OPEN,           // 0
    CALCULATING_WINNER, // 1
    CLOSED          // 2
}

// Event parameters
struct LotteryCreatedParams {
    address lotteryAddress;
    address creator;
    uint256 ticketPrice;
    uint256 maxPlayers;
}
```

## 🔍 Query Examples

### Get All Lotteries

```typescript
const { data: lotteryAddresses } = useReadContract({
  address: FACTORY_ADDRESS,
  abi: FACTORY_ABI,
  functionName: 'getDeployedLotteries',
});

// Fetch details for each lottery
const lotteryDetails = await Promise.all(
  lotteryAddresses.map(async (address) => {
    const lottery = new ethers.Contract(address, LOTTERY_ABI, provider);
    const [ticketPrice, maxPlayers, players, state, winner] = await Promise.all([
      lottery.i_ticketPrice(),
      lottery.i_maxPlayers(),
      lottery.getPlayers(),
      lottery.getLotteryState(),
      lottery.s_winner(),
    ]);
    
    return {
      address,
      ticketPrice,
      maxPlayers,
      players,
      state,
      winner,
    };
  })
);
```

### Check User Participation

```typescript
const { address: userAddress } = useAccount();
const { data: players } = useReadContract({
  address: lotteryAddress,
  abi: LOTTERY_ABI,
  functionName: 'getPlayers',
});

const isUserParticipating = players?.includes(userAddress);
const userEntryCount = players?.filter(player => player === userAddress).length || 0;
```

## 🚀 Integration Examples

### Complete Lottery Flow

```typescript
// 1. Create lottery
const createLottery = async (ticketPrice: string, maxPlayers: string) => {
  const tx = await factory.createLottery(
    parseEther(ticketPrice),
    BigInt(maxPlayers)
  );
  await tx.wait();
};

// 2. Enter lottery
const enterLottery = async (lotteryAddress: string, ticketPrice: bigint) => {
  const lottery = new ethers.Contract(lotteryAddress, LOTTERY_ABI, signer);
  const tx = await lottery.enter({ value: ticketPrice });
  await tx.wait();
};

// 3. Pick winner
const pickWinner = async (lotteryAddress: string) => {
  const lottery = new ethers.Contract(lotteryAddress, LOTTERY_ABI, signer);
  const tx = await lottery.pickWinner();
  await tx.wait();
};
```

### Real-time Updates

```typescript
// Listen for events and update UI
useEffect(() => {
  const factory = new ethers.Contract(factoryAddress, factoryABI, provider);
  
  const handleLotteryCreated = () => {
    refetch(); // Refresh lottery list
  };
  
  factory.on("LotteryCreated", handleLotteryCreated);
  
  return () => {
    factory.off("LotteryCreated", handleLotteryCreated);
  };
}, []);
```

---

For more information, see the [Technical Documentation](TECHNICAL.md) or [Deployment Guide](DEPLOYMENT.md).
