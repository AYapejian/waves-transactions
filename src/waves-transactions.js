/* eslint-disable no-console, no-process-env */
import axios from 'axios';

const transferClient = axios.create({
    baseURL: 'https://nodes.wavesnodes.com',
    timeout: 20000
});
const marketClient = axios.create({
    baseURL: 'https://marketdata.wavesplatform.com/api',
    timeout: 20000
});

const TYPES = {
    3:  'Issue',
    4:  'Transfer',
    5:  'Reissue',
    6:  'Burn',
    7:  'DEX Exchange',
    8:  'Lease',
    9:  'Lease Cancel',
    10: 'Alias'
};
let symbols, markets;

const internals = {
    async loadSymbols() {
        try {
            symbols = await marketClient.get('symbols');
            symbols = symbols.data;
        } catch (e) { throw e }
    },
    async loadMarkets() {
        try {
            markets = await marketClient.get('markets');
            markets = markets.data;
        } catch (e) { throw e }
    },
    getSymbol(assetId) {
        if (!symbols) throw new Error('must load symbols first');
        if (assetId === 'WAVES') assetId;

        const results = symbols.filter(s => (s.assetID === assetId));
        return results.length ? results[0].symbol : null;
    },
    getMarket(priceAssetId, amountAssetId) {
        if (!markets) throw new Error('must load markets first');

        const results = markets.filter(m => {
            return (m.amountAssetID === amountAssetId && m.priceAssetID === priceAssetId);
        });
        return results.length ? results[0] : null;
    },
    getMarketAsset(assetId) {
        if (!markets) throw new Error('must load markets first');
        let results = markets.filter(m => {
            return (m.amountAssetID === assetId);
        });

        if (results.length) {
            results = results[0];

            return {
                amountAssetID:       results.amountAssetID,
                amountAssetDecimals: results.amountAssetDecimals,
                amountAssetName:     results.amountAssetName
            };
        }
        return null;
    },
    findOrders(transaction) {
        const orderKeys = Object.keys(transaction).filter(tk => tk.match(/order/));
        if (!orderKeys.length) return null;
        const orders = [];

        for (let key of orderKeys) {
            const order = transaction[key];

            // Asset IDs here are either a unique ID or assumed to be 'WAVES'
            let amountAssetId, priceAssetId;
            if (order.assetPair.hasOwnProperty('amountAsset')) {
                amountAssetId = order.assetPair.amountAsset || 'WAVES';
            }
            if (order.assetPair.hasOwnProperty('priceAsset')) {
                priceAssetId = order.assetPair.priceAsset || 'WAVES';
            }

            const market = internals.getMarket(priceAssetId, amountAssetId);

            orders.push({
                transactionKey: key,
                id:             order.id,
                amountAsset:    internals.getSymbol(amountAssetId),
                priceAsset:     internals.getSymbol(priceAssetId),
                amount:         order.amount,
                price:          order.price,
                orderType:      order.orderType,
                date:           new Date(order.timestamp),
                market:         market
            });
        }
        return orders;
    },
    async getTransactions(address, limit) {
        let results;
        let readableResults = [];
        try {
            results = await transferClient.get(`transactions/address/${address}/limit/${limit}`);
            results = results.data[0];
            if (!results.length) throw new Error('no transactions found');


            for (let t of results) {
                const orders = internals.findOrders(t);

                const readable = {
                    recipient: t.recipient,
                    sender:    t.sender,
                    date:      new Date(t.timestamp),
                    type:      TYPES[t.type],
                    fee:       t.fee,
                    amount:    t.amount
                };

                if (t.hasOwnProperty('assetId')) {
                    const assetId = t.assetId || 'WAVES';
                    const assetDetails = internals.getMarketAsset(assetId);

                    readable.assetId      = assetId;
                    readable.assetSymbol  = internals.getSymbol(assetId);
                    readable.assetDetails = assetDetails;
                    // readable.assetSymbol  = readable.assetSymbol || (assetDetails) ? assetDetails.amountAssetName : null;
                }

                if (t.hasOwnProperty('feeAsset')) {
                    const feeAssetId = t.feeAsset || 'WAVES';
                    const feeAssetDetails = internals.getMarketAsset(feeAssetId);

                    readable.feeAssetId      = feeAssetId;
                    readable.feeAssetSymbol  = internals.getSymbol(feeAssetId);
                    readable.feeAssetDetails = feeAssetDetails;
                    // readable.feeAssetSymbol   = readable.feeAssetSymbol || (feeAssetDetails) ? feeAssetDetails.amountAssetName : null;
                }

                if (orders) readable.orders = orders;
                readableResults.push(readable);
            }

        } catch (e) { throw e }

        return readableResults;
    }
};

export const fetchTransactions = async function(walletAddress, limit = 50) {
    if (!symbols) await internals.loadSymbols();
    if (!markets) await internals.loadMarkets();
    const transactions = await internals.getTransactions(walletAddress, limit);
    return transactions;
};

// const address = process.argv[2] || process.env.WAVES_TRANSACTION_WALLET;
// if (!address) throw new Error('Must supply wallet address as first argument or set WAVES_WALLET environment variable');
// const limit = process.argv[3] || process.env.WAVES_TRANSACTION_LIMIT || 1000;

// exports.fetchTransactions(address, limit)
//     .then(res => console.log(require('util').inspect(res, { depth: 6, color: true })))
//     .then(res => process.exit(0))
//     .catch(e  => {
//         console.error(e);
//         process.exit(1);
//     });
