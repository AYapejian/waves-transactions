# Waves Transactions

Quick and dirty POC of fetching waves transactions for a wallet address via APIs

# To run
1. Clone repo
2. `npm install` or `yarn`
3. `npm run dev`
4. Navigate to `http://localhost:8080`
  a. Enter wallet address and submit

# TODO
* Some symbols missing from lookup (suspect these are actually `WAVES` tokens which are sometimes ID `WAVES` in the API and sometimes assumed `WAVES` if id is missing )
* Calculate actual token values instead of displaying "wavelets" and "asset'lets"
* List orders of transactions for `Exhcange` type transactions

