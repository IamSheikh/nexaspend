/* eslint-disable prettier/prettier */
/* eslint-disable consistent-return */

import { promisify } from 'util';
import { connect } from './Database.service';
import { IAccount } from '../../types';

const addAccount = async (account: IAccount) => {
  const db = connect();
  const query = `INSERT INTO Account (name, pin) VALUES (?, ?)`;

  db.run(query, [account.name, account.pin], (err: any) => {
    if (err) {
      return console.log(err.message);
    }
    console.log('Account Added Successfully 🤡');
  });
};

const getAllAccounts = async () => {
  const db = connect();
  const dbAll = promisify(db.all).bind(db);
  try {
    const query = `SELECT * FROM Account`;
    const row = dbAll(query);
    return row;
  } catch (err) {
    console.log(err);
  }
};

const updateAccount = async (account: IAccount) => {
  const db = connect();
  const query = `UPDATE Account SET name = ?, pin = ? WHERE id = ?`;

  db.run(query, [account.name, account.pin, account.id], (err: any) => {
    if (err) {
      return console.log(err.message);
    }
    console.log('Account Updated Successfully 📅');
  });
};

export { addAccount, getAllAccounts, updateAccount };
