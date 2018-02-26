<template>
<div id="app">
    <b-navbar toggleable="md" type="dark" variant="dark">
        <b-navbar-brand href="#">Waves Transactions</b-navbar-brand>
    </b-navbar>

    <div class="app-content" container-fluid>
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
</div>
</template>

<script>
import ScaleLoader from 'vue-spinner/src/ScaleLoader.vue'
import Waves from './waves';
import TransactionsTable from './TransactionsTable';

// TODO: Add quick select for example addresses, just grabbed some leasing nodes below:
// WavesGo.com: 3P2HNUd5VUPLMQkJmctTPEeeHumiPN2GkTb
// WavesFullNode.com: 3P4MRJvttkghWsXxGZ61kqd2M79GtLujoey
// WavesCommunityNode: 3PDxnbR1UTXrj84smhUP5m8WidRJjujfmCm
// WavesNode.com: 3P33D6UePSWhgdL9PfB9Mm4rVSTJrgV7i47
// POSPool.io: 3PNMvAqJWYPkwf8fhz46rZiLEWpTmuhD3Uh
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
                { value: 1000,  text: 'Get 1000' }
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
.app-content {
    margin: 10px auto;
}
</style>
