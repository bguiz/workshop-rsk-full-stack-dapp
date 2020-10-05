import Web3 from 'web3';
import electionArtefact from '../build/contracts/Election.json';

import utils from './utils.js';

document.addEventListener('DOMContentLoaded', onDocumentLoad);

function onDocumentLoad() {
  DApp.init();
}

const DApp = {
  web3: null,
  contracts: {},
  accounts: [],

  init: function() {
    return DApp.initWeb3();
  },

  initWeb3: async function () {
    if (typeof window.ethereum !== 'undefined') {
      // New web3 provider
      // As per EIP1102 and EIP1193
      // Ref: https://eips.ethereum.org/EIPS/eip-1102
      // Ref: https://eips.ethereum.org/EIPS/eip-1193
      try {
        // Request account access if needed
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        // Accounts now exposed, use them
        DApp.updateAccounts(accounts);

        // Opt out of refresh page on network change
        // Ref: https://docs.metamask.io/guide/ethereum-provider.html#properties
        ethereum.autoRefreshOnNetworkChange = false;

        // When user changes to another account,
        // trigger necessary updates within DApp
        window.ethereum.on('accountsChanged', DApp.updateAccounts);
      } catch (error) {
        // User denied account access
        console.error('User denied web3 access');
        return;
      }
      DApp.web3 = new Web3(window.ethereum);
    }
    else if (window.web3) {
      // Deprecated web3 provider
      DApp.web3 = new Web3(web3.currentProvider);
      // no need to ask for permission
    }
    // No web3 provider
    else {
      console.error('No web3 provider detected');
      return;
    }
    return DApp.initContract();
  },

  updateAccounts: async function(accounts) {
    const firstUpdate = !(DApp.accounts && DApp.accounts[0]);
    DApp.accounts = accounts || await DApp.web3.eth.getAccounts();
    console.log('updateAccounts', accounts[0]);
    if (!firstUpdate) {
      DApp.render();
    }
  },

  initContract: async function() {
    let networkId = await DApp.web3.eth.net.getId();
    console.log('networkId', networkId);

    let deployedNetwork = electionArtefact.networks[networkId];
    if (!deployedNetwork) {
      console.error('No contract deployed on the network that you are connected. Please switch networks.');
      return;
    }
    console.log('deployedNetwork', deployedNetwork);

    DApp.contracts.Election = new DApp.web3.eth.Contract(
      electionArtefact.abi,
      deployedNetwork.address,
    );
    console.log('Election', DApp.contracts.Election);

    return DApp.render();
  },

  render: async function() {
    // TODO implementation code
  },

  renderVotes: async function() {
    // TODO implementation code
  },

  onVoteSubmitClick: async function(ev) {
    // TODO implementation code
  },
};
