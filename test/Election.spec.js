const assert = require('assert');

const Election = artifacts.require('Election');

const BN = web3.utils.BN;

contract('Election', function(accounts) {
  let electionInstance;

  before(async () => {
    electionInstance = await Election.deployed();
  });

  it('initializes with two candidates', async () => {
    const count = await electionInstance.candidatesCount();
    assert.strictEqual(
      count.toString(), '2');
  });

  it('it initializes the candidates with the correct values', async () => {
    const candidate1 = await electionInstance.candidates(1);
    assert.strictEqual(
      candidate1.id.toString(), '1',
      'contains the correct id');
    assert.strictEqual(
      candidate1.name, 'Carrot',
      'contains the correct name');
    assert.strictEqual(
      candidate1.voteCount.toString(), '0',
      'contains the correct votes count');
    const candidate2 = await electionInstance.candidates(2);
    assert.strictEqual(
      candidate2.id.toString(), '2',
      'contains the correct id');
    assert.strictEqual(
      candidate2.name, 'Potato',
      'contains the correct name');
    assert.strictEqual(
      candidate2.voteCount.toString(), '0',
      'contains the correct votes count');
  });

  it('disallows voting on invalid candidates', async () => {
    let err;
    try {
      await electionInstance.vote(1234, { from: accounts[3] });
    } catch (ex) {
      err = ex;
    }
    assert(err, 'expected transaction to revert');
    assert(err.message.indexOf('revert') >= 0,
      'error message must contain revert');
    const candidate1 = await electionInstance.candidates(1);
    const candidate2 = await electionInstance.candidates(2);
    assert.strictEqual(
      candidate1.voteCount.toString(), '0',
      'candidate 1 did not receive any votes');
    assert.strictEqual(
      candidate2.voteCount.toString(), '0',
      'candidate 2 did not receive any votes');
  });

  it('disallows double voting', async () => {
    const candidateId = 2;
    let err;
    let candidate1;
    let candidate2;

    try {
      await electionInstance.vote(candidateId, { from: accounts[2] });
    } catch (ex) {
      err = ex;
    }
    assert(!err, 'expected transaction not to revert');
    candidate1 = await electionInstance.candidates(1);
    candidate2 = await electionInstance.candidates(2);
    assert.strictEqual(
      candidate1.voteCount.toString(), '0',
      'candidate 1 did not receive any votes');
    assert.strictEqual(
      candidate2.voteCount.toString(), '1',
      'candidate 2 did receive a vote');

    try {
      await electionInstance.vote(candidateId, { from: accounts[2] });
    } catch (ex) {
      err = ex;
    }
    assert(err, 'expected transaction to revert');
    assert(err.message.indexOf('revert') >= 0,
      'error message must contain revert');
    candidate1 = await electionInstance.candidates(1);
    candidate2 = await electionInstance.candidates(2);
    assert.strictEqual(
      candidate1.voteCount.toString(), '0',
      'candidate 1 did not receive any extra votes');
    assert.strictEqual(
      candidate2.voteCount.toString(), '1',
      'candidate 2 did not receive any extra votes');
  });

  it('allows a voter to cast a vote', async () => {
    // TODO specification code
  });
});
