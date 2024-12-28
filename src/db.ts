import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('events.db');

db.run(`
    CREATE TABLE IF NOT EXISTS UserOperationEvent (
        userOpHash TEXT PRIMARY KEY,
        sender TEXT,
        paymaster TEXT,
        nonce TEXT,
        success INTEGER,
        actualGasCost TEXT,
        actualGasUsed TEXT,
        blockNumber INTEGER,
        timestamp INTEGER
    )
`);

export default db;