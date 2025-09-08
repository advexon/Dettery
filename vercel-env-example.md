# Vercel Environment Variables Setup

To deploy DETTERY on Vercel, you need to set up the following environment variables:

## Required Environment Variables

### 1. NEXT_PUBLIC_FACTORY_ADDRESS
- **Value**: `0xDE22C7fF7Ac8C7645AfB673a4Ea7087705FE94Ce`
- **Description**: The deployed LotteryFactory contract address on Sepolia testnet
- **Type**: Public (visible in browser)

## How to Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your DETTERY project
3. Go to Settings → Environment Variables
4. Add the following variable:
   - **Name**: `NEXT_PUBLIC_FACTORY_ADDRESS`
   - **Value**: `0xDE22C7fF7Ac8C7645AfB673a4Ea7087705FE94Ce`
   - **Environment**: Production, Preview, Development (select all)
   - **Type**: Plain Text

## Alternative: Use the Hardcoded Address

The application will work without environment variables as it has a fallback to the hardcoded address. However, using environment variables is the recommended approach for production deployments.

## Verification

After setting the environment variable, redeploy your application. The error should be resolved and the application should work correctly.
