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
    // TODO implementation code
  },

  updateAccounts: async function(accounts) {
    // TODO implementation code
  },

  initContract: async function() {
    // TODO implementation code
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
