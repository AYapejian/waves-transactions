const test  = require('tape');
const nock  = require('nock');
const Waves = require('../../../src/waves').default;

test('it should instantiate', async function (t) {
    const waves = new Waves();
    t.equal(waves instanceof Waves, true, 'Instantiated waves should be instance of Waves');
    t.end();
});

// test('it should get transactions', async function (t) {
//     const waves = new Waves();
//     const transaction = await waves.getTransactions('7tZxVdAWc8QvsMrXBoicMgU2bSJsaEpFJnPYn1H31B8B');
// });
