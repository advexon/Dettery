# 🤝 Contributing to DETTERY

Thank you for your interest in contributing to DETTERY! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Expected Behavior

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- Basic knowledge of React, TypeScript, and Solidity

### Fork and Clone

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/yourusername/dettery.git
   cd dettery
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/originalowner/dettery.git
   ```

4. **Install dependencies**
   ```bash
   # Frontend dependencies
   npm install
   
   # Smart contract dependencies
   cd contracts
   npm install
   cd ..
   ```

### Development Setup

1. **Create environment file**
   ```bash
   cp contracts/.env.example contracts/.env
   # Edit contracts/.env with your configuration
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Run tests**
   ```bash
   # Frontend tests
   npm test
   
   # Smart contract tests
   cd contracts
   npx hardhat test
   cd ..
   ```

## 🔄 Development Process

### Branch Naming

Use descriptive branch names:
- `feature/add-new-component`
- `fix/wallet-connection-bug`
- `docs/update-readme`
- `refactor/optimize-contracts`

### Commit Messages

Follow conventional commit format:
```
type(scope): description

[optional body]

[optional footer]
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples**:
```
feat(ui): add participant count display
fix(contract): resolve winner selection bug
docs(readme): update installation instructions
```

### Workflow

1. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes**
   - Write code
   - Add tests
   - Update documentation

3. **Test your changes**
   ```bash
   npm test
   npm run build
   ```

4. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**
   - Go to GitHub
   - Click "New Pull Request"
   - Fill out the template

## 📝 Pull Request Process

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No console errors
- [ ] Responsive design tested

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Manual testing completed
- [ ] Cross-browser testing (if applicable)

## Screenshots (if applicable)
Add screenshots to help explain your changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Review Process

1. **Automated Checks**
   - Tests must pass
   - Build must succeed
   - Linting must pass

2. **Code Review**
   - At least one maintainer review required
   - Address all feedback
   - Make requested changes

3. **Merge**
   - Squash and merge preferred
   - Delete feature branch after merge

## 🐛 Issue Guidelines

### Bug Reports

Use the bug report template:

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
What you expected to happen

## Actual Behavior
What actually happened

## Environment
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 91]
- Node.js version: [e.g. 18.0.0]
- Wallet: [e.g. MetaMask 10.0.0]

## Screenshots
If applicable, add screenshots

## Additional Context
Any other context about the problem
```

### Feature Requests

Use the feature request template:

```markdown
## Feature Description
Clear description of the feature

## Problem Statement
What problem does this solve?

## Proposed Solution
How should this work?

## Alternatives Considered
Other solutions you've considered

## Additional Context
Any other context or screenshots
```

## 📏 Coding Standards

### TypeScript/React

**File Structure**:
```
src/
├── components/
│   ├── ComponentName.tsx
│   └── index.ts
├── hooks/
├── lib/
└── types/
```

**Naming Conventions**:
- Components: PascalCase (`LotteryCard.tsx`)
- Functions: camelCase (`handleSubmit`)
- Constants: UPPER_SNAKE_CASE (`FACTORY_ADDRESS`)
- Types: PascalCase (`LotteryProps`)

**Code Style**:
```typescript
// Use functional components with hooks
const LotteryCard: React.FC<LotteryCardProps> = ({ address, index }) => {
  const [state, setState] = useState(initialState);
  
  const handleClick = useCallback(() => {
    // Handle click
  }, [dependencies]);
  
  return (
    <div className="lottery-card">
      {/* JSX content */}
    </div>
  );
};

export default LotteryCard;
```

### Solidity

**File Structure**:
```
contracts/
├── contracts/
│   ├── Lottery.sol
│   └── interfaces/
├── scripts/
└── test/
```

**Naming Conventions**:
- Contracts: PascalCase (`LotteryFactory`)
- Functions: camelCase (`createLottery`)
- Variables: snake_case with prefix (`s_players`, `i_ticketPrice`)
- Events: PascalCase (`LotteryCreated`)

**Code Style**:
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Lottery {
    // State variables
    uint256 public immutable i_ticketPrice;
    address payable[] public s_players;
    
    // Events
    event LotteryEntered(address indexed player);
    
    // Functions
    function enter() public payable {
        // Function body
    }
}
```

### CSS/Styling

**Use Tailwind CSS**:
```tsx
<div className="rounded-lg border bg-white p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
  <h2 className="text-2xl font-bold text-gray-800 mb-4">
    Lottery Title
  </h2>
</div>
```

**Custom CSS** (when needed):
```css
/* Use CSS modules or styled-components */
.lottery-card {
  @apply rounded-lg border bg-white p-6;
}
```

## 🧪 Testing

### Frontend Testing

**Unit Tests**:
```typescript
import { render, screen } from '@testing-library/react';
import LotteryCard from './LotteryCard';

describe('LotteryCard', () => {
  it('renders lottery information', () => {
    render(<LotteryCard address="0x123..." index={0} />);
    expect(screen.getByText('Lottery #1')).toBeInTheDocument();
  });
});
```

**Integration Tests**:
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

describe('Lottery Creation Flow', () => {
  it('creates lottery successfully', async () => {
    // Test implementation
  });
});
```

### Smart Contract Testing

**Unit Tests**:
```typescript
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Lottery", function () {
  it("Should create lottery with correct parameters", async function () {
    const Lottery = await ethers.getContractFactory("Lottery");
    const lottery = await Lottery.deploy(ethers.parseEther("0.01"), 10, admin);
    
    expect(await lottery.i_ticketPrice()).to.equal(ethers.parseEther("0.01"));
    expect(await lottery.i_maxPlayers()).to.equal(10);
  });
});
```

**Integration Tests**:
```typescript
describe("Lottery Flow", function () {
  it("Should complete full lottery cycle", async function () {
    // Test complete lottery flow
  });
});
```

### Test Coverage

- Aim for >80% code coverage
- Test all public functions
- Test error conditions
- Test edge cases

## 📚 Documentation

### Code Documentation

**JSDoc for Functions**:
```typescript
/**
 * Creates a new lottery pool
 * @param ticketPrice - Price per ticket in ETH
 * @param maxPlayers - Maximum number of participants
 * @returns Promise that resolves when lottery is created
 */
const createLottery = async (ticketPrice: string, maxPlayers: string): Promise<void> => {
  // Implementation
};
```

**Comments for Complex Logic**:
```typescript
// Calculate winner using block hash randomness
// This ensures fair and unpredictable winner selection
const randomSeed = uint256(keccak256(abi.encodePacked(
  blockhash(s_revealBlock),
  block.timestamp,
  block.prevrandao,
  s_players.length
)));
```

### README Updates

When adding features:
- Update feature list
- Add new installation steps
- Update configuration examples
- Add new screenshots

### API Documentation

Document all public functions:
- Parameters
- Return values
- Error conditions
- Examples

## 🏷️ Release Process

### Version Numbering

Follow [Semantic Versioning](https://semver.org/):
- `MAJOR.MINOR.PATCH`
- `1.0.0` - Initial release
- `1.1.0` - New features
- `1.1.1` - Bug fixes

### Release Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] Version numbers updated
- [ ] Changelog updated
- [ ] Release notes written
- [ ] Tagged release created

## 🆘 Getting Help

### Resources

- **Documentation**: [Technical Docs](docs/TECHNICAL.md)
- **Issues**: [GitHub Issues](https://github.com/yourusername/dettery/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/dettery/discussions)

### Contact

- **Maintainers**: @maintainer1, @maintainer2
- **Discord**: [Join our Discord](https://discord.gg/dettery)
- **Email**: contact@dettery.com

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to DETTERY! 🎲✨
