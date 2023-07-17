# Integral take home assement


## Objective

1. Write a Javascript or Typescript service that takes an Aptos (https://aptoslabs.com/) wallet address and saves all the historical transactions of that wallet address in a Postgres database. The service should check for new transactions every 4 hours and add the new ones to Postgres. Transactions should include all metadata like amount, amount currency, timestamp, block, etc.

2. Build a basic webpage that shows a table displaying the transactions. The table should be paginated to show 100 transactions at a time. Aside from that, the table can be super basic, and you can use any table library you like or use a basic HTML table.
