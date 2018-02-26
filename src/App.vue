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
                    <b-input-group>
                        <template slot="prepend">
                            <b-dropdown :text="walletDropdownText">
                                <b-dropdown-item @click="(walletAddress = w.value)" v-for="w of exampleWalletAddresses" :key="w.value">
                                    {{ w.text }}
                                </b-dropdown-item>
                            </b-dropdown>
                        </template>

                        <b-form-input placeholder="Enter address here or select example" v-model="walletAddress" required></b-form-input>

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
            walletDropdownText: 'Wallet Address',
            exampleWalletAddresses: [
                { text: 'WavesGo.com',        value: '3P2HNUd5VUPLMQkJmctTPEeeHumiPN2GkTb' },
                { text: 'WavesFullNode.com',  value: '3P4MRJvttkghWsXxGZ61kqd2M79GtLujoey' },
                { text: 'WavesCommunityNode', value: '3PDxnbR1UTXrj84smhUP5m8WidRJjujfmCm' },
                { text: 'WavesNode.com',      value: '3P33D6UePSWhgdL9PfB9Mm4rVSTJrgV7i47' },
                { text: 'POSPool.io',         value: '3PNMvAqJWYPkwf8fhz46rZiLEWpTmuhD3Uh' }
            ],
            transactions: [],
            isLoading:    false,
            waves: new Waves()
        }
    },
    watch: {
        walletAddress(walletAddress) {
            let match = this.exampleWalletAddresses.filter(w => (w.value === walletAddress));
            match = (match && match.length) ? match[0] : null;
            this.walletDropdownText = (match) ? match.text : 'Wallet Address';
        }
    },
    methods: {
        async onFetchSubmit() {
            try {
                if (!this.walletAddress) throw new Error('No address');
                if (window.localStorage) window.localStorage.setItem('lastSearchedAddress', this.walletAddress);

                this.isLoading    = true;
                this.transactions = await this.waves.getTransactions(this.walletAddress, this.numTransactionsSelected);
                this.isLoading    = false;
            } catch (e) {
                this.isLoading = false;
                throw e;
            }
        }
    },
    components: { ScaleLoader, TransactionsTable },
    created() {
        if (window.localStorage) {
            const walletAddress = window.localStorage.getItem('lastSearchedAddress');
            if (walletAddress) {
                this.walletAddress = walletAddress;
                this.onFetchSubmit();
            }
        }
    }
}
</script>

<style>
.app-content {
    margin: 10px auto;
}
</style>
