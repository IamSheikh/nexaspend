CREATE TABLE IF NOT EXISTS Ledger (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    partyId INTEGER,
    details TEXT,
    amount INTEGER,
    transaction_type TEXT,
    date DATE,
    transactionAccountId INTEGER,
    accountId INTEGER
)