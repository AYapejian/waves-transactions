<template>
<div id="app" class="container-fluid">
    <div class="row mb-4">
        <b-col></b-col>
        <b-col cols="8">
            <b-form @submit.prevent="onFetchSubmit">
                 <b-input-group prepend="Wallet Address">
                    <b-form-input id="inputWalletAddress" placeholder="Wallet Address" v-model="walletAddress" required></b-form-input>

                    <b-input-group-append>
                        <b-form-select v-model="numTransactionsSelected" :options="numTransactionsOptions"></b-form-select>
                        <b-btn  type="submit" variant="primary">Fetch Transactions</b-btn>
                    </b-input-group-append>
                </b-input-group>
            </b-form>
        </b-col>
        <b-col></b-col>
    </div>
    <div class="row mb-4">
         <scale-loader :loading="isLoading" color="#0438F7" size="150px"></scale-loader>
    </div>

    <transactions-table :transactions="transactions" :wallet-address="walletAddress" />
</div>
</template>

<script>
import ScaleLoader from 'vue-spinner/src/ScaleLoader.vue'
import Waves from './waves';
import TransactionsTable from './TransactionsTable';

export default {
    name: 'app',
    data () {
        return {
            walletAddress:           '',
            numTransactionsSelected: 10,
            numTransactionsOptions:  [
                { value: 10,    text: 'Get 10'  },
                { value: 50,    text: 'Get 50'  },
                { value: 100,   text: 'Get 100' },
                { value: 5000,  text: 'Get All' }
            ],
            transactions: [],
            isLoading:    false,
            waves: new Waves()
        }
    },
    methods: {
        async onFetchSubmit() {
            try {
                if (!this.walletAddress) throw new Error('No address');

                this.isLoading = true;
                this.transactions = await this.waves.getTransactions(this.walletAddress, this.numTransactionsSelected);
                this.isLoading = false;
            } catch (e) {
                this.isLoading = false;
                throw e;
            }
        },
    },
    components: { ScaleLoader, TransactionsTable }
}
</script>

<style>
#app {
    margin: 10px auto;
}
</style>
