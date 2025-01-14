CREATE TABLE IF NOT EXISTS Party (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    partyName TEXT,
    mobileNumber TEXT,
    address TEXT,
    email TEXT,
    balance INTEGER,
    details TEXT,
    accountId INTEGER
)