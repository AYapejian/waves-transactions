import api from './waves-api';

const TRANSACTION_TYPES = {
    3:  { id: 3,  label: 'Issue'         },
    4:  { id: 4,  label: 'Transfer'      },
    5:  { id: 5,  label: 'Reissue'       },
    6:  { id: 6,  label: 'Burn'          },
    7:  { id: 7,  label: 'Exchange'      },
    8:  { id: 8,  label: 'Lease'         },
    9:  { id: 9,  label: 'Lease Cancel'  },
    10: { id: 10, label: 'Alias'         }
};

const cache = {
    tickers:      null,
    symbols:      null,
    assetDetails: {
        'WAVES': {
            id:          'WAVES',
            name:        'Waves Token',
            description: 'Official Waves token',
            symbol:      'WAVES',
            decimals:    8
        }
    }
};

export default class Waves {
    static get api() { return api }
    static get transactionTypes() { return TRANSACTION_TYPES }
    static async getTickers() {
        if (cache.tickers) return cache.tickers;
        cache.tickers = await Waves.api.getMarketTickers();
        return cache.tickers;
    }
    static async getSymbols() {
        if (cache.symbols) return cache.symbols;
        cache.symbols = await Waves.api.getSymbols();
        return cache.symbols;
    }
    static async getSymbol(assetId) {
        const symbols = await this.getSymbols();
        const s = symbols.filter(item => (item.assetID === assetId));
        return (s.length) ? s[0].symbol : 'no symbol found';
    }

    async getTransactions(address, limit = 10) {
        const transactions = await Waves.api.getTransactions(address, limit);
        const list = [];
        for (let t of transactions) {
            const transaction    = await this._normalizeTransaction(t);
            transaction.orders = await this._getOrders(t);

            if (transaction.recipient === address) transaction.isIncoming = true;
            if (transaction.sender === address)    transaction.isOutgoing = true;
            list.push(transaction);
        }
        return list;
    }

    async getAssetDetails(assetId) {
        if (cache.assetDetails[assetId]) return cache.assetDetails[assetId];
        try {
            const fetchedDetails = await Waves.api.getTransactionInfo(assetId);
            if (!fetchedDetails) throw new Error(`Details not found for asset id ${assetId}`);
            fetchedDetails.symbol = await Waves.getSymbol(fetchedDetails.id);
            cache.assetDetails[assetId] = fetchedDetails;
            return fetchedDetails;
        } catch(e) {
            console.log(e);
            return null;
        }
    }

    _getOrders(t) {
        if (t.type.id !== '7') return null;
        const orderKeys = Object.keys(t).filter(tk => tk.match(/order/));
        if (!orderKeys.length) return null;

        const orders = [];
        for (let key of orderKeys) {
            const order = t[key];
            // const market = internals.getMarket(priceAssetId, amountAssetId);

            orders.push({
                id:             order.id,
                orderType:      order.orderType,
                timestamp:      order.timestamp,
                transactionKey: key,
                amount:         this._getTransactionAssetDetails(order.assetPair.amountAsset, order.amount),
                price:          this._getTransactionAssetDetails(order.assetPair.priceAsset,  order.price)
            });
        }
        return orders;
    }
    async _normalizeTransaction(t) {
        return {
            id:              t.id,
            sender:          t.sender,
            timestamp:       t.timestamp,
            signature:       t.signature,
            recipient:       t.recipient,
            type:            Waves.transactionTypes[t.type],
            senderPublicKey: t.senderPublicKey,
            attachment:      t.attachment,
            height:          t.height,
            asset:           await this._getTransactionAssetDetails(t.assetId, t.amount),
            fee:             await this._getTransactionAssetDetails(t.feeAsset, t.fee)
        };
    }
    async _getTransactionAssetDetails(assetId, amountRaw) {
        assetId = assetId || 'WAVES';
        const assetDetails = await this.getAssetDetails(assetId);
        if (!assetDetails) {
            throw new Error(`AssetId "${assetId}" not found during lookup`);
        }

        return {
            id:          assetId,
            name:        assetDetails.name,
            description: assetDetails.description,
            symbol:      assetDetails.symbol,
            decimals:    assetDetails.decimals,
            amountRaw:   amountRaw,
            amountToken: (assetDetails.decimals)
                ? amountRaw / Math.pow(10, assetDetails.decimals)
                : 'cannot calculate amount'
        };
    }
};

