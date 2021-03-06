<template>
<div>
    <!-- Table Toolbar -->
    <b-row>
        <b-col>
            <b-form-group label="Transaction Types">
                <b-dropdown :text="`${typeFilterSelected.text}`">
                    <b-dropdown-item @click="(typeFilterSelected = opt)" v-for="opt of typeFilterOptions" :key="opt.value">
                        {{ opt.text }}
                    </b-dropdown-item>
                </b-dropdown>
            </b-form-group>
        </b-col>
        <b-col>
            <b-form-group label="Transaction Direction">
                <b-dropdown :text="`${directionFilterSelected.text}`">
                    <b-dropdown-item @click="(directionFilterSelected = opt)" v-for="opt of directionFilterOptions" :key="opt.value">
                        {{ opt.text }}
                    </b-dropdown-item>
                </b-dropdown>
                <b-button variant="info" class="button" @click="exportToCsv"> Export CSV </b-button>
            </b-form-group>
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
            <b-row>
                <b-col>
                    <b-card no-body
                            :title="row.item.asset.name"
                            :sub-title="row.item.asset.description || row.item.asset.symbol ? row.item.asset.symbol : ''">

                        <b-card-body>
                            <b-row>
                                <b-col>
                                    <dl class="row">
                                        <dt class="col-sm-2">Transaction</dt>
                                        <dd class="col-sm-10">
                                            <dl class="row">
                                                <dt class="col-sm-3">ID</dt>
                                                <dd class="col-sm-9">{{ row.item.original.id }}</dd>

                                                <dt class="col-sm-3">Type</dt>
                                                <dd class="col-sm-9">{{ row.item.original.type ? row.item.original.type.label : '???' }}</dd>

                                                <dt class="col-sm-3">Type ID</dt>
                                                <dd class="col-sm-9">{{ row.item.original.type ? row.item.original.type.id : '???' }}</dd>

                                                <dt class="col-sm-3">Timestamp</dt>
                                                <dd class="col-sm-9">{{ row.item.original.timestamp }}</dd>

                                                <dt class="col-sm-3">Signature</dt>
                                                <dd class="col-sm-9">{{ row.item.original.signature }}</dd>

                                                <dt class="col-sm-3">Sender</dt>
                                                <dd class="col-sm-9">{{ row.item.original.sender }}</dd>

                                                <dt class="col-sm-3">Sender Public Key</dt>
                                                <dd class="col-sm-9">{{ row.item.original.senderPublicKey }}</dd>

                                                <dt class="col-sm-3">Recipient</dt>
                                                <dd class="col-sm-9">{{ row.item.original.recipient || '???' }}</dd>

                                                <dt class="col-sm-3">Attachment</dt>
                                                <dd class="col-sm-9">{{ row.item.original.attachment || 'none found' }}</dd>

                                                <dt class="col-sm-3">Height</dt>
                                                <dd class="col-sm-9">{{ row.item.original.height }}</dd>
                                            </dl>
                                        </dd>
                                    </dl>
                                </b-col>
                                <b-col>
                                    <dl class="row">
                                        <dt class="col-sm-2">Asset</dt>
                                        <dd class="col-sm-10">
                                            <dl class="row" v-if="!row.item.original.asset">
                                                <dt class="col-sm-3"></dt>
                                                <dd class="col-sm-9">No Asset Information Found</dd>
                                            </dl>
                                            <dl class="row" v-if="row.item.original.asset">
                                                <dt class="col-sm-3">Name</dt>
                                                <dd class="col-sm-9">{{ row.item.original.asset.name || '???' }}</dd>

                                                <dt class="col-sm-3">Symbol</dt>
                                                <dd class="col-sm-9">{{ row.item.original.asset.symbol || '???' }}</dd>

                                                <dt class="col-sm-3">ID</dt>
                                                <dd class="col-sm-9">{{ row.item.original.asset.id }}</dd>

                                                <dt class="col-sm-3">Decimals</dt>
                                                <dd class="col-sm-9">{{ row.item.original.asset.decimals || '???' }}</dd>

                                                <dt class="col-sm-3">Raw Amount</dt>
                                                <dd class="col-sm-9">{{ row.item.original.asset.amountRaw || '???' }}</dd>

                                                <dt class="col-sm-3">Calculated Amount</dt>
                                                <dd class="col-sm-9">{{ row.item.original.asset.amountToken || '???' }}</dd>
                                            </dl>
                                        </dd>

                                        <dt class="col-sm-2">Fee</dt>
                                        <dd class="col-sm-10">
                                            <dl class="row" v-if="!row.item.original.fee">
                                                <dt class="col-sm-3"></dt>
                                                <dd class="col-sm-9">No Fee Information Found</dd>
                                            </dl>
                                            <dl class="row" v-if="row.item.original.fee">
                                                <dt class="col-sm-3">Name</dt>
                                                <dd class="col-sm-9">{{ row.item.original.fee.name || '???' }}</dd>

                                                <dt class="col-sm-3">Symbol</dt>
                                                <dd class="col-sm-9">{{ row.item.original.fee.symbol || '???' }}</dd>

                                                <dt class="col-sm-3">ID</dt>
                                                <dd class="col-sm-9">{{ row.item.original.fee.id }}</dd>

                                                <dt class="col-sm-3">Decimals</dt>
                                                <dd class="col-sm-9">{{ row.item.original.fee.decimals || '???' }}</dd>

                                                <dt class="col-sm-3">Raw Amount</dt>
                                                <dd class="col-sm-9">{{ row.item.original.fee.amountRaw || '???' }}</dd>

                                                <dt class="col-sm-3">Calculated Amount</dt>
                                                <dd class="col-sm-9">{{ row.item.original.fee.amountToken || '???' }}</dd>
                                            </dl>
                                        </dd>
                                    </dl>
                                </b-col>
                            </b-row>
                        </b-card-body>

                        <b-card-body>
                            <a href="#" @click.prevent="row.toggleDetails" class="card-link">Hide Details</a>
                        </b-card-body>
                    </b-card>
                </b-col>
            </b-row>
        </template>
    </b-table>
</div>
</template>

<script>
import Waves from './waves';
const Papa = require('papaparse/papaparse.min.js');

export default {
    name: 'TransactionsTable',
    props: {
        walletAddress: { type: String, required: true, default: '' },
        transactions:  { type: Array, required:  true, default: [] }
    },
    data () {
        return {
            isLoading:          false,
            typeFilterSelected: { text: 'All', value: 'all' },
            directionFilterOptions: [
                { text: 'All',      value: 'all'      },
                { text: 'Incoming', value: 'Incoming' },
                { text: 'Outgoing', value: 'Outgoing' }
            ],
            directionFilterSelected: { text: 'All', value: 'all' }
        }
    },
    computed: {
        tableFields() {
            return [
                { key: 'date',      sortable: true },
                { key: 'type',      sortable: true },
                { key: 'direction', sortable: true },
                { key: 'asset',     sortable: true },
                { key: 'amount',    sortable: true },
                { key: 'feeAsset',  sortable: true },
                { key: 'feeAmount', sortable: true },
                { key: 'showDetails' }
            ];
        },
        tableTransactions() {
            if (!this.transactions || !this.transactions.length) return null;
            let tableTransactions = this.formatTransactionsForTable(this.transactions);
            if (this.typeFilterSelected.value === 'all' && this.directionFilterSelected.value === 'all') return tableTransactions;

            if (this.typeFilterSelected.value !== 'all') {
                tableTransactions = tableTransactions.filter(t => {
                    return (t.original.type)
                        ? (t.original.type.id === this.typeFilterSelected.value)
                        : false;
                });
            }
            if (this.directionFilterSelected.value !== 'all') {
                tableTransactions = tableTransactions.filter(t => (t.direction === this.directionFilterSelected.value));
            }
            return tableTransactions;

        },
        typeFilterOptions() {
            const opts = [{ text: 'All', value: 'all' }];
            const typeOpts = Object.entries(Waves.transactionTypes).map(([k,v]) => {
                return { text: v.label, value: v.id }
            });
            return opts.concat(typeOpts);
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
                    direction:     '???',
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
                if (t.isIncoming) {
                    rowObject.direction = 'Incoming';
                    rowObject._cellVariants.direction = 'success';
                }
                if (t.isOutgoing) {
                    rowObject.direction = 'Outgoing';
                    rowObject._cellVariants.direction = 'danger';
                }
                if (t.type && t.type.id === 7) { // Exchange
                    rowObject.direction = 'Check Orders';
                    rowObject._cellVariants.direction = 'info';
                }
                return rowObject;
            });
        },
        exportToCsv() {
            const transactionsCsvObj = this.transactions.map(t => {
                let date = new Date(t.timestamp);
                date = date.toISOString();
                const rowObject = {
                    id:              t.id,
                    date:            date,
                    timestamp:       t.timestamp,
                    height:          t.height,

                    typeId:          t.type ? t.type.id    : null,
                    typeLabel:       t.type ? t.type.label : null,
                    isIncoming:      t.isIncoming,
                    isExchange:      t.type ? t.type.id  === 7 : false,

                    recipient:       t.recipient || null,
                    sender:          t.sender    || null,
                    senderPublicKey: t.senderPublicKey,
                    signature:       t.signature,

                    assetId:          t.asset.id,
                    assetName:        t.asset.name,
                    assetDescription: t.asset.description,
                    assetSymbol:      t.asset.symbol,
                    assetAmountRaw:   t.asset.amountRaw,
                    assetAmountToken: t.asset.amountToken,

                    feeAssetId:          t.fee.id,
                    feeAssetName:        t.fee.name,
                    feeAssetDescription: t.fee.description,
                    feeAssetSymbol:      t.fee.symbol,
                    feeAssetAmountRaw:   t.fee.amountRaw,
                    feeAssetAmountToken: t.fee.amountToken,

                    attachment:      t.attachment
                };
                return rowObject;
            });

            const csv = Papa.unparse(transactionsCsvObj);

            function download(filename, text) {
                var pom = document.createElement('a');
                pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
                pom.setAttribute('download', filename);

                if (document.createEvent) {
                    var event = document.createEvent('MouseEvents');
                    event.initEvent('click', true, true);
                    pom.dispatchEvent(event);
                }
                else {
                    pom.click();
                }
            }

            download('waves-transactions.csv', csv);
        }
    }
}
</script>

<style>
</style>
