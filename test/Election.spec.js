const assert = require('assert');

const Election = artifacts.require('Election');

const BN = web3.utils.BN;

contract('Election', function(accounts) {
  let electionInstance;

  before(async () => {
    electionInstance = await Election.deployed();
  });

  it('initializes with two candidates', async () => {
    // TODO specification code
  });

  it('it initializes the candidates with the correct values', async () => {
    // TODO specification code
  });

  it('disallows voting on invalid candidates', async () => {
    // TODO specification code
  });

  it('disallows double voting', async () => {
    // TODO specification code
  });

  it('allows a voter to cast a vote', async () => {
    // TODO specification code
  });
});
