/* eslint-disable no-console, no-process-env */
const axios  = require('axios');
const transferClient = axios.create({
    baseURL: 'https://nodes.wavesnodes.com',
    timeout: 20000
});
const marketClient = axios.create({
    baseURL: 'https://marketdata.wavesplatform.com/api',
    timeout: 20000
});


const address = process.argv[2] || process.env.WAVES_TRANSACTION_WALLET;
if (!address) throw new Error('Must supply wallet address as first argument or set WAVES_WALLET environment variable');

const limit = process.argv[3] || process.env.WAVES_TRANSACTION_LIMIT || 1000;

const TYPES = {
    3:  'Issue',
    4:  'Transfer',
    5:  'Reissue',
    6:  'Burn',
    7:  '*** Unknown, possibly market order?',
    8:  'Lease',
    9:  'Lease Cancel',
    10: 'Alias'
};
let symbols;

const internals = {
    async getSymbol(assetId) {
        try {
            if (!symbols) {
                symbols = await marketClient.get('symbols');
                symbols = symbols.data;
            }

            const results = symbols.filter(s => (s.assetID === assetId));
            return results.length ? results[0].symbol : null;
        } catch (e) { throw e }
    },
    async getTransactions() {
        let results;
        try {
            results = await transferClient.get(`transactions/address/${address}/limit/${limit}`);
            results = results.data[0];

            for (let t of results) {

                const readable = {
                    recipient:      t.recipient,
                    sender:         t.sender,
                    date:           new Date(t.timestamp),
                    type:           TYPES[t.type],
                    assetId:        t.assetId,
                    feeAssetId:     t.feeAsset,
                    assetSymbol:    await internals.getSymbol(t.assetId),
                    feeAssetSymbol: await internals.getSymbol(t.feeAsset),
                    fee:            t.fee,
                    amount:         t.amount
                };

                console.log(readable);
            }

        } catch (e) { throw e }
        return results;
    }
};


internals.getTransactions()
    // .then(res => console.log(res))
    .then(res => process.exit(0))
    .catch(e  => {
        console.error(e);
        process.exit(1);
    });
