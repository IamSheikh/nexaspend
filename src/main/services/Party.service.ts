/* eslint-disable prettier/prettier */
/* eslint-disable consistent-return */

import { promisify } from 'util';
import { IParty } from '../../types';
import { connect } from './Database.service';

const addParty = (party: IParty) => {
  const db = connect();
  const query = `INSERT INTO Party (partyName, mobileNumber, address, email, balance, details, accountId) VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.run(
    query,
    [
      party.partyName,
      party.mobileNumber,
      party.address,
      party.email,
      party.balance,
      party.details,
      party.accountId,
    ],
    (err: any) => {
      if (err) {
        return console.log(err.message);
      }
      console.log('New Party Added Successfully 🤡');
    },
  );
};

const getAllParties = async (accountId: number) => {
  const db = connect();
  const dbAll = promisify(db.all).bind(db);
  try {
    const query = `SELECT * FROM Party WHERE accountId = '${accountId}'`;
    const row = dbAll(query);
    return row;
  } catch (err) {
    console.log(err);
  }
};

const updateParty = async (party: IParty) => {
  const db = connect();
  const query = `UPDATE Party SET partyName = ?, mobileNumber = ?, address = ?, email = ?, balance = ?, details = ?, accountId = ? WHERE id = ?`;
  db.run(
    query,
    [
      party.partyName,
      party.mobileNumber,
      party.address,
      party.email,
      party.balance,
      party.details,
      party.accountId,
      party.id,
    ],
    (err: any) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Party updated successfully Clown 🤡');
    },
  );
};

const deleteParty = async (id: number) => {
  const db = connect();
  const query = `DELETE FROM Party WHERE id = '${id}'`;
  const stm = db.prepare(query);
  stm.run((err) => {
    if (err) throw err;
    console.log('Party Deleted Successfully Clown 🤡');
  });
};

export { addParty, getAllParties, updateParty, deleteParty };
