/* eslint-disable prettier/prettier */
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

export { addDaybook, getAllDaybook };
