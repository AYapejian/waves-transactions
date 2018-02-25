const test  = require('tape');
const nock  = require('nock');
const wavesApi = require('../../../src/waves/waves-api').default;

test('it should return symbols', async function (t) {
    nock('https://marketdata.wavesplatform.com/api').get('/symbols').reply(200, true);
    t.equal(await wavesApi.getSymbols(), true);
    t.end();
});
test('it should return markets', async function (t) {
    nock('https://marketdata.wavesplatform.com/api').get('/markets').reply(200, true);
    t.equal(await wavesApi.getMarkets(), true);
    t.end();
});
test('it should return transactions', async function (t) {
    const address = '123';
    const limit   = 10;

    nock('https://nodes.wavesnodes.com')
        .get((uri) => {
            return uri === `/transactions/address/${address}/limit/${limit}`;
        })
        .reply(200, [true]);    // Transactions returned as array of arrays

    t.equal(await wavesApi.getTransactions(address, limit), true);
    t.end();
});

test('it should return transaction info', async function (t) {
    const address = '123';

    nock('https://nodes.wavesnodes.com')
        .get(`/transactions/info/${address}`)
        .reply(200, true);    // Transactions returned as array of arrays

    t.equal(await wavesApi.getTransactionInfo(address), true);
    t.end();
});

test('it should return address balance', async function (t) {
    const address = '123';

    nock('https://nodes.wavesnodes.com')
        .get(`/addresses/balance/${address}`)
        .reply(200, true);    // Transactions returned as array of arrays

    t.equal(await wavesApi.getAddressBalance(address), true);
    t.end();
});

test('it should return address asset balance', async function (t) {
    const address = '123';

    nock('https://nodes.wavesnodes.com')
        .get(`/assets/balance/${address}`)
        .reply(200, true);    // Transactions returned as array of arrays

    t.equal(await wavesApi.getAddressAssetBalance(address), true);
    t.end();
});
