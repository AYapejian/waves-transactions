<template>
<div id="app">
    <b-form @submit.prevent="onFetchSubmit" inline>
        <b-form-group>
            <label class="sr-only" for="inputWalletAddress">Name</label>
            <b-input class="mb-2 mr-sm-2 mb-sm-0" id="inputWalletAddress" placeholder="Wallet Address" v-model="walletAddress" />

            <b-form-select v-model="numTransactionsSelected" :options="numTransactionsOptions"></b-form-select>

            <b-button type="submit" variant="primary">Fetch Transactions</b-button>
        </b-form-group>
    </b-form>
    <div>
         <b-progress style="margin: 20px" v-if="isLoading" :value="100" variant="primary" :animated="true" class="mb-3"></b-progress>
    </div>

    <table class="table" v-if="transactions && transactions.length">
        <thead>
            <tr>
                <th></th>
                <th>Date</th>
                <th>Type</th>
                <th>Recipient</th>
                <th>Sender</th>

                <th>Amount ID</th>
                <th>Amount Symbol</th>

                <th>Fee ID</th>
                <th>Fee Symbol</th>

                <th>Raw Amount</th>
                <th>Raw Fee</th>

                <th>Asset Amount</th>
                <th>Asset Fee</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(t, index) of transactions">
                <td>{{ index + 1 }}</td>
                <td>{{t.date | moment('MMMM Do YYYY, h:mm:ss a') }}</td>
                <td>{{t.type }}</td>
                <td :class="getAddressClass(t.recipient)">{{t.recipient || 'Not Found' }}</td>
                <td :class="getAddressClass(t.sender)">{{t.sender || 'Not Found' }}</td>

                <td>{{t.assetId || 'Not Found' }}</td>
                <td>{{t.assetSymbol || 'Not Found' }}</td>

                <td>{{t.feeAssetId || 'Not Found' }}</td>
                <td>{{t.feeAssetSymbol}}</td>

                <td>{{t.amount}}</td>
                <td>{{t.fee}}</td>

                <td>{{getAssetAmount(t.amount, t.assetDetails)}}</td>
                <td>{{getAssetAmount(t.fee, t.feeAssetDetails)}}</td>
            </tr>
        </tbody>
    </table>
</div>
</template>

<script>
import { fetchTransactions } from './waves-transactions';

export default {
    name: 'app',
    data () {
        return {
            walletAddress: '',
            numTransactionsSelected: 10,
            numTransactionsOptions: [
                { value: 10,    text: '10'  },
                { value: 50,    text: '50'  },
                { value: 100,   text: '100' },
                { value: 5000,  text: 'All' }
            ],
            transactions: null,
            isLoading: false
        }
    },
    methods: {
        getAssetAmount(amount, assetDetails) {
            if (!assetDetails || !assetDetails.amountAssetDecimals) return 'Cannot calculate';
            return amount / Math.pow(10, assetDetails.amountAssetDecimals);
        },
        getAddressClass(address) {
            return {
                'is-lookup-address': address === this.walletAddress
            };
        },
        async onFetchSubmit() {
            try {
                if (!this.walletAddress) throw new Error('No address');

                this.isLoading = true;
                this.transactions = await fetchTransactions(this.walletAddress, this.numTransactionsSelected);
                this.isLoading = false;
            } catch (e) {
                this.isLoading = false;
                throw e;
            }
        }
    }
}
</script>

<style>
.is-lookup-address {
    color: blue;
}
</style>
