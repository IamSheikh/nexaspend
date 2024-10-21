/* eslint-disable prettier/prettier */
/* eslint-disable consistent-return */
import { promisify } from 'util';
import { connect } from './Database.service';
import ICategory from '../../types/ICategory';

const addCategory = async (category: ICategory) => {
  const db = connect();
  const query = `INSERT INTO Category (name, type) VALUES (?, ?)`;

  db.run(query, [category.name, category.type], (err: any) => {
    if (err) {
      return console.log(err.message);
    }
    console.log('New Daybook Added Successfully 🤡');
  });
};

const getAllCategories = async () => {
  const db = connect();
  const dbAll = promisify(db.all).bind(db);
  try {
    const query = `SELECT * FROM Category`;
    const row = dbAll(query);
    return row;
  } catch (err) {
    console.log(err);
  }
};

export { addCategory, getAllCategories };
