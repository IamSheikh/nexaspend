/* eslint-disable prettier/prettier */
/* eslint-disable consistent-return */

import { promisify } from 'util';
import { ITransactionAccount } from '../../types';
import { connect } from './Database.service';

const addTransactionAccount = (transactionAccount: ITransactionAccount) => {
  const db = connect();
  const query = `INSERT INTO TransactionAccount (accountName, accountId, balance) VALUES (?, ?, ?)`;

  db.run(
    query,
    [
      transactionAccount.accountName,
      transactionAccount.accountId,
      transactionAccount.balance,
    ],
    (err: any) => {
      if (err) {
        return console.log(err.message);
      }
      console.log('New Transaction Added Successfully 🤡');
    },
  );
};

const getAllTransactionAccounts = async (accountId: number) => {
  const db = connect();
  const dbAll = promisify(db.all).bind(db);
  try {
    const query = `SELECT * FROM TransactionAccount WHERE accountId = '${accountId}'`;
    const row = dbAll(query);
    return row;
  } catch (err) {
    console.log(err);
  }
};

const getTransactionAccountById = async (id: number, accountId: number) => {
  const db = connect();
  const dbAll = promisify(db.all).bind(db);
  try {
    const query = `SELECT * FROM TransactionAccount WHERE accountId = '${accountId}' AND id = '${id}'`;
    const row = dbAll(query);
    return row;
  } catch (err) {
    console.log(err);
  }
};

const getTransactionAccountByName = async (
  accountName: string,
  accountId: number,
) => {
  const db = connect();
  const dbAll = promisify(db.all).bind(db);
  try {
    const query = `SELECT * FROM TransactionAccount WHERE accountId = '${accountId}' AND accountName = '${accountName}'`;
    const row = dbAll(query);
    return row;
  } catch (err) {
    console.log(err);
  }
};

const updateTransactionAccount = async (
  transactionAccount: ITransactionAccount,
) => {
  const db = connect();
  const query = `UPDATE TransactionAccount SET accountName = ?, accountId = ?, balance = ? WHERE id = ?`;
  db.run(
    query,
    [
      transactionAccount.accountName,
      transactionAccount.accountId,
      transactionAccount.balance,
      transactionAccount.id,
    ],
    (err: any) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Transaction Account updated successfully Clown 🤡');
    },
  );
};

const deleteTransactionAccount = async (id: number) => {
  const db = connect();
  const query = `DELETE FROM TransactionAccount WHERE id = '${id}'`;
  const stm = db.prepare(query);
  stm.run((err) => {
    if (err) throw err;
    console.log('Transaction Account Deleted Successfully Clown 🤡');
  });
};

export {
  addTransactionAccount,
  getAllTransactionAccounts,
  getTransactionAccountById,
  getTransactionAccountByName,
  updateTransactionAccount,
  deleteTransactionAccount,
};
