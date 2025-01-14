/* eslint-disable prettier/prettier */
/* eslint-disable consistent-return */

import { promisify } from 'util';
import { ILedger } from '../../types';
import { connect } from './Database.service';

const addLedger = (ledger: ILedger) => {
  const db = connect();
  const query = `INSERT INTO Ledger (partyId, details, amount, transaction_type, date, transactionAccountId, accountId) VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.run(
    query,
    [
      ledger.partyId,
      ledger.details,
      ledger.amount,
      ledger.transaction_type,
      ledger.date,
      ledger.transactionAccountId,
      ledger.accountId,
    ],
    (err: any) => {
      if (err) {
        return console.log(err.message);
      }
      console.log('New Ledger Added Successfully 🤡');
    },
  );
};

const getAllLedgers = async (accountId: number) => {
  const db = connect();
  const dbAll = promisify(db.all).bind(db);
  try {
    const query = `SELECT * FROM Ledger WHERE accountId = '${accountId}'`;
    const row = dbAll(query);
    return row;
  } catch (err) {
    console.log(err);
  }
};

const getLedgerByFilters = async (
  dateRange: Array<string> | null,
  transactionType: string,
  partyId: number | string,
  accountId: number,
) => {
  const db = connect();
  const dbAll = promisify(db.all).bind(db);

  try {
    let query = '';

    // Case 1: All filters are applied
    if (transactionType === 'ALL' && partyId === 'ALL' && dateRange !== null) {
      query = `SELECT * FROM Ledger WHERE date BETWEEN '${dateRange[0]}' AND '${dateRange[1]}' AND accountId = '${accountId}' ORDER BY id DESC`;
    }
    // Case 2: All specific filters are applied
    else if (
      transactionType !== 'ALL' &&
      partyId !== 'ALL' &&
      dateRange !== null
    ) {
      query = `SELECT * FROM Ledger WHERE date BETWEEN '${dateRange[0]}' AND '${dateRange[1]}' AND transaction_type = '${transactionType}' AND partyId = '${parseInt(partyId as unknown as string, 10)}' AND accountId = '${accountId}' ORDER BY id DESC`;
    }
    // Case 3: Filter by date and partyId
    else if (
      transactionType === 'ALL' &&
      partyId !== 'ALL' &&
      dateRange !== null
    ) {
      query = `SELECT * FROM Ledger WHERE date BETWEEN '${dateRange[0]}' AND '${dateRange[1]}' AND partyId = '${parseInt(partyId as unknown as string, 10)}' AND accountId = '${accountId}' ORDER BY id DESC`;
    }
    // Case 4: Filter by date and transactionType
    else if (
      transactionType !== 'ALL' &&
      partyId === 'ALL' &&
      dateRange !== null
    ) {
      query = `SELECT * FROM Ledger WHERE date BETWEEN '${dateRange[0]}' AND '${dateRange[1]}' AND transaction_type = '${transactionType}' AND accountId = '${accountId}' ORDER BY id DESC`;
    }
    // Case 5: No date range, all transaction types and parties
    else if (
      transactionType === 'ALL' &&
      partyId === 'ALL' &&
      dateRange === null
    ) {
      query = `SELECT * FROM Ledger WHERE accountId = '${accountId}' ORDER BY id DESC`;
    }
    // Case 6: No date range, filter by partyId
    else if (
      transactionType === 'ALL' &&
      partyId !== 'ALL' &&
      dateRange === null
    ) {
      query = `SELECT * FROM Ledger WHERE partyId = '${parseInt(partyId as unknown as string, 10)}' AND accountId = '${accountId}' ORDER BY id DESC`;
    }
    // Case 7: No date range, filter by transactionType
    else if (
      transactionType !== 'ALL' &&
      partyId === 'ALL' &&
      dateRange === null
    ) {
      query = `SELECT * FROM Ledger WHERE transaction_type = '${transactionType}' AND accountId = '${accountId}' ORDER BY id DESC`;
    }
    // Case 8: No date range, filter by transactionType and partyId
    else if (
      transactionType !== 'ALL' &&
      partyId !== 'ALL' &&
      dateRange === null
    ) {
      query = `SELECT * FROM Ledger WHERE transaction_type = '${transactionType}' AND partyId = '${parseInt(partyId as unknown as string, 10)}' AND accountId = '${accountId}' ORDER BY id DESC`;
    }

    // Execute query
    const rows = await dbAll(query);
    return rows;
  } catch (err) {
    console.error(err);
  }
};

const updateLedger = async (ledger: ILedger) => {
  const db = connect();
  const query = `UPDATE Ledger SET partyId = ?, details = ?, amount = ?, transaction_type = ?, date = ?, accountId = ?, transactionAccountId = ? WHERE id = ?`;
  db.run(
    query,
    [
      ledger.partyId,
      ledger.details,
      ledger.amount,
      ledger.transaction_type,
      ledger.date,
      ledger.accountId,
      ledger.transactionAccountId,
      ledger.id,
    ],
    (err: any) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Ledger updated successfully Clown 🤡');
    },
  );
};

const deleteLedger = async (id: number) => {
  const db = connect();
  const query = `DELETE FROM Ledger WHERE id = '${id}'`;
  const stm = db.prepare(query);
  stm.run((err) => {
    if (err) throw err;
    console.log('Ledger Deleted Successfully Clown 🤡');
  });
};

export {
  addLedger,
  getAllLedgers,
  getLedgerByFilters,
  updateLedger,
  deleteLedger,
};
