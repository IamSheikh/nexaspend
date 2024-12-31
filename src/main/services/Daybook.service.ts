/* eslint-disable prettier/prettier */
/* eslint-disable radix */
/* eslint-disable consistent-return */
import { promisify } from 'util';
import { connect } from './Database.service';
import IDaybook from '../../types/IDaybook';

const addDaybook = async (daybook: IDaybook) => {
  const db = connect();
  const query = `INSERT INTO Daybook (date, amount, categoryId, details, type, accountId) VALUES (?, ?, ?, ?, ?, ?)`;

  db.run(
    query,
    [
      daybook.date,
      daybook.amount,
      daybook.categoryId,
      daybook.details,
      daybook.type,
      daybook.accountId,
    ],
    (err: any) => {
      if (err) {
        return console.log(err.message);
      }
      console.log('New Daybook Added Successfully 🤡');
    },
  );
};

const getAllDaybook = async (accountId: number) => {
  const db = connect();
  const dbAll = promisify(db.all).bind(db);
  try {
    const query = `SELECT * FROM Daybook ORDER BY id DESC WHERE accountId = '${accountId}'`;
    const row = dbAll(query);
    return row;
  } catch (err) {
    console.log(err);
  }
};

const getLastTenDaybook = async (accountId: number) => {
  const db = connect();
  const dbAll = promisify(db.all).bind(db);
  try {
    const query = `SELECT * FROM Daybook ORDER BY id DESC LIMIT 10 WHERE accountId = '${accountId}'`;
    const row = dbAll(query);
    return row;
  } catch (err) {
    console.log(err);
  }
};

const getDaybookByFilters = async (
  dateRange: Array<string> | null,
  entryType: string,
  categoryId: number | string,
  accountId: number,
) => {
  const db = connect();
  const dbAll = promisify(db.all).bind(db);
  try {
    let query = '';
    if (entryType === 'ALL' && categoryId === 'ALL' && dateRange !== null) {
      query = `SELECT * FROM Daybook WHERE date BETWEEN '${dateRange[0]}' AND '${dateRange[1]}' AND accountId = '${accountId}' ORDER BY id DESC`;
    } else if (
      entryType !== 'ALL' &&
      categoryId !== 'ALL' &&
      dateRange !== null
    ) {
      query = `SELECT * FROM Daybook WHERE date BETWEEN '${dateRange[0]}' AND '${dateRange[1]}' AND type = '${entryType}' AND categoryId = '${parseInt(categoryId as unknown as string)}' AND accountId = '${accountId}' ORDER BY id DESC`;
    } else if (
      entryType === 'ALL' &&
      categoryId !== 'ALL' &&
      dateRange !== null
    ) {
      query = `SELECT * FROM Daybook WHERE date BETWEEN '${dateRange[0]}' AND '${dateRange[1]}' AND categoryId = '${parseInt(categoryId as unknown as string)}' AND accountId = '${accountId}' ORDER BY id DESC`;
    } else if (
      entryType !== 'ALL' &&
      categoryId === 'ALL' &&
      dateRange !== null
    ) {
      query = `SELECT * FROM Daybook WHERE date BETWEEN '${dateRange[0]}' AND '${dateRange[1]}' AND type = '${entryType}' AND accountId = '${accountId}' ORDER BY id DESC`;
    } else if (
      entryType === 'ALL' &&
      categoryId === 'ALL' &&
      dateRange === null
    ) {
      query = `SELECT * FROM Daybook WHERE accountId = '${accountId}' ORDER BY id DESC`;
    } else if (
      entryType === 'ALL' &&
      categoryId !== 'ALL' &&
      dateRange === null
    ) {
      query = `SELECT * FROM Daybook WHERE categoryId = '${parseInt(categoryId as unknown as string)}' AND accountId = '${accountId}' ORDER BY id DESC`;
    } else if (
      entryType !== 'ALL' &&
      categoryId === 'ALL' &&
      dateRange === null
    ) {
      query = `SELECT * FROM Daybook WHERE type = '${entryType}' AND accountId = '${accountId}' ORDER BY id DESC`;
    } else if (
      entryType !== 'ALL' &&
      categoryId !== 'ALL' &&
      dateRange === null
    ) {
      query = `SELECT * FROM Daybook WHERE type = '${entryType}' AND categoryId = '${parseInt(categoryId as unknown as string)}' AND accountId = '${accountId}' ORDER BY id DESC`;
    }

    const rows = dbAll(query);
    return rows;
  } catch (err) {
    console.log(err);
  }
};

const updateDaybook = async (daybook: IDaybook) => {
  const db = connect();
  const query = `UPDATE Daybook SET date = ?, amount = ?, categoryId = ?, details = ?, type = ?, accountId = ? WHERE id = ?`;

  db.run(
    query,
    [
      daybook.date,
      daybook.amount,
      daybook.categoryId,
      daybook.details,
      daybook.type,
      daybook.accountId,
      daybook.id, // Make sure to include the ID for the WHERE clause
    ],
    (err: any) => {
      if (err) {
        return console.log(err.message);
      }
      console.log('Daybook Updated Successfully 📅');
    },
  );
};

const deleteDaybook = async (id: number) => {
  const db = connect();
  const query = `DELETE FROM Daybook WHERE id = '${id}'`;
  const stm = db.prepare(query);
  stm.run((err) => {
    if (err) throw err;
    console.log('Daybook successfully Deleted Clown 🤡');
  });
};

export {
  addDaybook,
  getAllDaybook,
  getLastTenDaybook,
  getDaybookByFilters,
  updateDaybook,
  deleteDaybook,
};
