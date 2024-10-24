/* eslint-disable prettier/prettier */
/* eslint-disable radix */
/* eslint-disable consistent-return */
import { promisify } from 'util';
import { connect } from './Database.service';
import IDaybook from '../../types/IDaybook';

const addDaybook = async (daybook: IDaybook) => {
  const db = connect();
  const query = `INSERT INTO Daybook (date, amount, categoryId, details, type) VALUES (?, ?, ?, ?, ?)`;

  db.run(
    query,
    [
      daybook.date,
      daybook.amount,
      daybook.categoryId,
      daybook.details,
      daybook.type,
    ],
    (err: any) => {
      if (err) {
        return console.log(err.message);
      }
      console.log('New Daybook Added Successfully 🤡');
    },
  );
};

const getAllDaybook = async () => {
  const db = connect();
  const dbAll = promisify(db.all).bind(db);
  try {
    const query = `SELECT * FROM Daybook`;
    const row = dbAll(query);
    return row;
  } catch (err) {
    console.log(err);
  }
};

const getLastTenDaybook = async () => {
  const db = connect();
  const dbAll = promisify(db.all).bind(db);
  try {
    const query = `SELECT * FROM Daybook ORDER BY id DESC LIMIT 10`;
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
) => {
  const db = connect();
  const dbAll = promisify(db.all).bind(db);
  try {
    let query = '';
    if (entryType === 'ALL' && categoryId === 'ALL' && dateRange !== null) {
      query = `SELECT * FROM Daybook WHERE date BETWEEN '${dateRange[0]}' AND '${dateRange[1]}'`;
    } else if (
      entryType !== 'ALL' &&
      categoryId !== 'ALL' &&
      dateRange !== null
    ) {
      query = `SELECT * FROM Daybook WHERE date BETWEEN '${dateRange[0]}' AND '${dateRange[1]}' AND type = '${entryType}' AND categoryId = '${parseInt(categoryId as unknown as string)}'`;
    } else if (
      entryType === 'ALL' &&
      categoryId !== 'ALL' &&
      dateRange !== null
    ) {
      query = `SELECT * FROM Daybook WHERE date BETWEEN '${dateRange[0]}' AND '${dateRange[1]}' AND categoryId = '${parseInt(categoryId as unknown as string)}'`;
    } else if (
      entryType !== 'ALL' &&
      categoryId === 'ALL' &&
      dateRange !== null
    ) {
      query = `SELECT * FROM Daybook WHERE date BETWEEN '${dateRange[0]}' AND '${dateRange[1]}' AND type = '${entryType}'`;
    } else if (
      entryType === 'ALL' &&
      categoryId === 'ALL' &&
      dateRange === null
    ) {
      query = `SELECT * FROM Daybook`;
    } else if (
      entryType === 'ALL' &&
      categoryId !== 'ALL' &&
      dateRange === null
    ) {
      query = `SELECT * FROM Daybook WHERE categoryId = '${parseInt(categoryId as unknown as string)}'`;
    } else if (
      entryType !== 'ALL' &&
      categoryId === 'ALL' &&
      dateRange === null
    ) {
      query = `SELECT * FROM Daybook WHERE type = '${entryType}'`;
    } else if (
      entryType !== 'ALL' &&
      categoryId !== 'ALL' &&
      dateRange === null
    ) {
      query = `SELECT * FROM Daybook WHERE type = '${entryType}' AND categoryId = '${parseInt(categoryId as unknown as string)}'`;
    }

    const rows = dbAll(query);
    return rows;
  } catch (err) {
    console.log(err);
  }
};

const updateDaybook = async (daybook: IDaybook) => {
  const db = connect();
  const query = `UPDATE Daybook SET date = ?, amount = ?, categoryId = ?, details = ?, type = ? WHERE id = ?`;

  db.run(
    query,
    [
      daybook.date,
      daybook.amount,
      daybook.categoryId,
      daybook.details,
      daybook.type,
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
