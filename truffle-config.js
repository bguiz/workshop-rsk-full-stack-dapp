const fs = require('fs');
const path = require('path');

const HDWalletProvider = require('@truffle/hdwallet-provider');

// adjust these as fit to get faster transaction speeds
// minimum value is 1.0, adjust higher to incentivise miners
const TESTNET_GAS_MULT = 1.1;
const MAINNET_GAS_MULT = 1.0;

const testnetSeedPhrase = fs
  .readFileSync('.testnet.seed-phrase')
  .toString()
  .trim();
if (!testnetSeedPhrase || testnetSeedPhrase.split(' ').length !== 12) {
  throw new Error('unable to retrieve testnet seed phrase from .testnet.seed-phrase');
}

// NOTE Depending on your security requirements this is (most) likely insufficient.
// Please consider replacing/ overriding this to suit your needs on Mainnet.
const mainnetSeedPhrase = process.env.RSK_MAINNET_SEED_PHRASE || '';

const gasPriceTestnetRaw = fs
  .readFileSync('.testnet.gas-price.json')
  .toString()
  .trim();
const gasPriceTestnet = parseInt(JSON.parse(gasPriceTestnetRaw).result, 16);
if (typeof gasPriceTestnet !== 'number' || isNaN(gasPriceTestnet)) {
  throw new Error('unable to retrieve testnet gas price from .testnet.gas-price.json');
}

const gasPriceMainnetRaw = fs
  .readFileSync('.mainnet.gas-price.json')
  .toString()
  .trim();
const gasPriceMainnet = parseInt(JSON.parse(gasPriceMainnetRaw).result, 16);
if (typeof gasPriceMainnet !== 'number' || isNaN(gasPriceMainnet)) {
  throw new Error('unable to retrieve mainnet gas price from .mainnet.gas-price.json');
}

module.exports = {
  networks: {
    regtest: {
      // Use default provider, Regtest starts with unlocked accounts
      host: '127.0.0.1',
      port: 4444,
      network_id: 33,
      networkCheckTimeout: 1e3,
    },
    testnet: {
      provider: () => new HDWalletProvider({
        mnemonic: {
          phrase: testnetSeedPhrase,
        },
        providerOrUrl: 'https://public-node.testnet.rsk.co/',
        // Higher polling interval to check for blocks less frequently
        pollingInterval: 15e3,
      }),
      // Ref: http://developers.rsk.co/rsk/architecture/account-based/#chainid
      network_id: 31,
      gasPrice: Math.floor(gasPriceTestnet * TESTNET_GAS_MULT),
      networkCheckTimeout: 1e6,
      timeoutBlocks: 100,
      // Higher polling interval to check for blocks less frequently
      // during deployment
      deploymentPollingInterval: 15e3,
    },
    localtestnet: {
      provider: () => new HDWalletProvider({
        mnemonic: {
          phrase: testnetSeedPhrase,
        },
        providerOrUrl: 'http://localhost:7777/',
        // Default polling interval when running your own node
      }),
      network_id: 31,
      gasPrice: Math.floor(gasPriceTestnet * TESTNET_GAS_MULT),
      networkCheckTimeout: 10e3,
      timeoutBlocks: 100,
    },
    mainnet: {
      // NOTE that this configuration is a template.
      // You should modify it according to your needs and security requirements.
      provider: () => new HDWalletProvider({
        mnemonic: {
          phrase: mainnetSeedPhrase,
        },
        providerOrUrl: 'https://public-node.rsk.co/2.0.1/',
        // Higher polling interval to check for blocks less frequently
        pollingInterval: 15e3,
      }),
      // Ref: http://developers.rsk.co/rsk/architecture/account-based/#chainid
      network_id: 30,
      gasPrice: Math.floor(gasPriceMainnet * MAINNET_GAS_MULT),
      networkCheckTimeout: 10e3,
      timeoutBlocks: 100,
      // Higher polling interval to check for blocks less frequently
      // during deployment
      deploymentPollingInterval: 15e3,
    },
    localmainnet: {
      // NOTE that this configuration is a template.
      // You should modify it according to your needs and security requirements.
      provider: () => new HDWalletProvider({
        mnemonic: {
          phrase: mainnetSeedPhrase,
        },
        providerOrUrl: 'http://localhost:8888/',
        // Default polling interval when running your own node
      }),
      // Ref: http://developers.rsk.co/rsk/architecture/account-based/#chainid
      network_id: 30,
      gasPrice: Math.floor(gasPriceMainnet * MAINNET_GAS_MULT),
      networkCheckTimeout: 10e3,
      timeoutBlocks: 100,
    },
  },
  compilers: {
    solc: {
      version: '0.5.7',
    }
  },
  contracts_build_directory: path.join(__dirname, 'build/contracts'),
}
