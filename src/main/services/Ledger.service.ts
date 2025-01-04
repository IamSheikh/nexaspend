/* eslint-disable prettier/prettier */
/* eslint-disable consistent-return */

import { promisify } from 'util';
import { ILedger } from '../../types';
import { connect } from './Database.service';

const addLedger = (ledger: ILedger) => {
  const db = connect();
  const query = `INSERT INTO Ledger (partyId, details, amount, transaction_type, date, accountId) VALUES (?, ?, ?, ?, ?, ?)`;

  db.run(
    query,
    [
      ledger.partyId,
      ledger.details,
      ledger.amount,
      ledger.transaction_type,
      ledger.date,
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

const updateLedger = async (ledger: ILedger) => {
  const db = connect();
  const query = `UPDATE Ledger SET partyId = ?, details = ?, amount = ?, transaction_type = ?, date = ?, accountId = ? WHERE id = ?`;
  db.run(
    query,
    [
      ledger.partyId,
      ledger.details,
      ledger.amount,
      ledger.transaction_type,
      ledger.date,
      ledger.accountId,
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

export { addLedger, getAllLedgers, updateLedger, deleteLedger };
