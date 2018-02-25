<template>
<div>
    <!-- Table Toolbar -->
    <b-row v-if="tableTransactions && tableTransactions.length">
        <b-col>
            <b-button-group>
                <b-button>Button 1</b-button>
                <b-button>Button 2</b-button>
                <b-button>Button 3</b-button>
            </b-button-group>
        </b-col>
    </b-row>

    <!-- Table -->
    <b-table striped hover :items="tableTransactions" :fields="tableFields" :responsive="true">
        <template slot="date" slot-scope="data">
            {{ new Date(data.value.timestamp) | moment('MMM Do YYYY, h:mm:ss A') }}
        </template>

        <template slot="showDetails" slot-scope="row">
            <b-button size="sm" @click.stop="row.toggleDetails" class="mr-2">
                {{ row.detailsShowing ? 'Hide' : 'Show'}} Details
            </b-button>
        </template>

        <template slot="row-details" slot-scope="row">
            <b-card>
                <b-row class="mb-2">
                    <b-col sm="3" class="text-sm-right">
                        {{ JSON.stringify(row.item.original) }}
                    </b-col>
                </b-row>
                <b-button size="sm" @click="row.toggleDetails">Hide Details</b-button>
            </b-card>
        </template>
    </b-table>
</div>
</template>

<script>
export default {
    name: 'TransactionsTable',
    props: {
        walletAddress: { type: String, required: true, default: '' },
        transactions:  { type: Array, required:  true, default: [] }
    },
    data () {
        return {
            isLoading:         false
        }
    },
    computed: {
        tableFields() {
            return [
                { key: 'date',      sortable: true },
                { key: 'type',      sortable: true },
                { key: 'sender',    sortable: true },
                { key: 'recipient', sortable: true },
                { key: 'asset',     sortable: true },
                { key: 'amount',    sortable: true },
                { key: 'feeAsset',  sortable: true },
                { key: 'feeAmount', sortable: true },
                { key: 'showDetails' }
            ];
        },
        tableTransactions() {
            if (this.transactions && this.transactions.length) return this.formatTransactionsForTable(this.transactions);
        }
    },
    methods: {
        getAssetAmount(amount, assetDetails) {
            if (!assetDetails || !assetDetails.amountAssetDecimals) return 'Cannot calculate';
            return amount / Math.pow(10, assetDetails.amountAssetDecimals);
        },
        formatTransactionsForTable(transactions) {
            return transactions.map(t => {
                const rowObject = {
                    date:          { timestamp: t.timestamp },
                    type:          (t.type) ? t.type.label : '???',
                    sender:        t.sender      || '???',
                    recipient:     t.recipient   || '???',
                    asset:         (t.asset) ? t.asset.name || t.asset.symbol || t.asset.id : '???',
                    amount:        (t.asset) ? t.asset.amountToken : '???',
                    feeAsset:      (t.fee)   ? t.fee.name   || t.fee.symbol   || t.fee.id   :  '???',
                    feeAmount:     (t.fee)   ? t.fee.amountToken   : '???',
                    original:      t,
                    _showDetails:  false,
                    _cellVariants: {}
                };
                // If data missing, or wallet address of transaction is the same as one searched highlight the data cell
                // Object.keys(rowObject).forEach(k => {
                //     if (v === this.walletAddress) rowObject._cellVariants[k] = 'info';

                // });

                return rowObject;
            });
        },
    }
}
</script>

<style>
</style>
