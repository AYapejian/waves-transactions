import axios from 'axios';

const apiNodeClient = axios.create({
    baseURL: 'https://nodes.wavesnodes.com',
    timeout: 20000
});
const apiMarketClient = axios.create({
    baseURL: 'https://marketdata.wavesplatform.com/api',
    timeout: 20000
});

export default {
    async getSymbols() {
        const res = await apiMarketClient.get('symbols');
        return res.data;
    },
    async getMarkets() {
        const res = await apiMarketClient.get('markets');
        return res.data;
    },
    async getMarketTickers() {
        const res = await apiMarketClient.get('tickers');
        return res.data;
    },
    async getTransactions(address, limit = 10) {
        const res = await apiNodeClient.get(`transactions/address/${address}/limit/${limit}`);
        return res.data[0];
    },
    async getTransactionInfo(address) {
        const res = await apiNodeClient.get(`transactions/info/${address}`);
        return res.data;
    },
    async getAddressBalance(address) {
        const res = await apiNodeClient.get(`addresses/balance/${address}`);
        return res.data;
    },
    async getAddressAssetBalance(address) {
        const res = await apiNodeClient.get(`/assets/balance/${address}`);
        return res.data;
    }
};

