/* eslint-disable prettier/prettier */
/* eslint-disable consistent-return */
import { promisify } from 'util';
import { connect } from './Database.service';
import ICategory from '../../types/ICategory';

const addCategory = async (category: ICategory) => {
  const db = connect();
  const query = `INSERT INTO Category (name, type, accountId) VALUES (?, ?, ?)`;

  db.run(
    query,
    [category.name, category.type, category.accountId],
    (err: any) => {
      if (err) {
        return console.log(err.message);
      }
      console.log('New Daybook Added Successfully 🤡');
    },
  );
};

const getAllCategories = async (accountId: number) => {
  const db = connect();
  const dbAll = promisify(db.all).bind(db);
  try {
    const query = `SELECT * FROM Category WHERE accountId = '${accountId}'`;
    const row = dbAll(query);
    return row;
  } catch (err) {
    console.log(err);
  }
};

const getCategoriesByFilters = async (entryType: string, accountId: number) => {
  const db = connect();
  const dbAll = promisify(db.all).bind(db);
  try {
    let query;
    if (entryType === 'ALL') {
      query = 'SELECT * FROM Category';
    } else {
      query = `SELECT * FROM Category WHERE type = '${entryType}' AND accountId = '${accountId}'`;
    }
    const rows = dbAll(query);
    return rows;
  } catch (err) {
    console.log(err);
  }
};

const updateCategory = async (category: ICategory) => {
  const db = connect();
  const query = `UPDATE Category SET name = ?, accountId = ? WHERE id = ?`;
  db.run(
    query,
    [category.name, category.accountId, category.id],
    (err: any) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Category updated successfully Clown 🤡');
    },
  );
};

const deleteCategory = async (id: number) => {
  const db = connect();
  const query = `DELETE FROM Category WHERE id = '${id}'`;
  const stm = db.prepare(query);
  stm.run((err) => {
    if (err) throw err;
    console.log('Category Deleted Successfully Clown 🤡');
  });
};

export {
  addCategory,
  getAllCategories,
  getCategoriesByFilters,
  updateCategory,
  deleteCategory,
};
