const path = require('path');
const wavesTransactions = require('./waves-transactions');
const app  = require('express')();


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/transactions/:walletAddress/limit/:limit', async (req, res) => {
    try {
        const transactions = await wavesTransactions.fetchTransactions(req.params.walletAddress, req.params.limit);
        res.json(transactions);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

app.listen(8080);
