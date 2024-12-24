/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import sqlite3 from 'sqlite3';

const connect = () => {
  const databaseName = 'database.db';
  // const sqlPathProd = path.join('./release', 'app', databaseName);
  const sqlPathProd = path.join(app.getPath('userData'), databaseName);
  return new sqlite3.Database(sqlPathProd, (err) => {
    if (err) throw err;
    else console.log('Database connected successfully clown 🤡');
  });
};

const loadModels = () => {
  const isDebug =
    process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';
  const db = connect();
  const daybookModel = fs
    .readFileSync(
      !isDebug
        ? path.join(process.resourcesPath, 'models', 'Daybook.model.sql')
        : './src/main/models/Daybook.model.sql',
    )
    .toString();

  const categoryModel = fs
    .readFileSync(
      !isDebug
        ? path.join(process.resourcesPath, 'models', 'Category.model.sql')
        : './src/main/models/Category.model.sql',
    )
    .toString();

  const accountModel = fs
    .readFileSync(
      !isDebug
        ? path.join(process.resourcesPath, 'models', 'Account.model.sql')
        : './src/main/models/Account.model.sql',
    )
    .toString();

  db.serialize(() => {
    db.run(daybookModel);
    db.run(categoryModel);
    db.run(accountModel);
  });
};

function columnExists(table: string, column: string, callback: any) {
  const db = connect();
  db.all(`PRAGMA table_info(${table})`, (err, columns) => {
    if (err) {
      callback(err, false);
      return;
    }
    // Check if the column exists
    const exists = columns.some((col: any) => col.name === column);
    callback(null, exists);
  });
}

function addColumnIfNotExists(tableName: string, newColumn: string) {
  const db = connect();
  // const tableName = 'Daybook';
  // const newColumn = 'accountId';

  columnExists(tableName, newColumn, (err: any, exists: any) => {
    if (err) {
      console.error('Error checking column:', err);
      return;
    }

    if (!exists) {
      db.run(
        `ALTER TABLE ${tableName} ADD COLUMN ${newColumn} TEXT`,
        (er: any) => {
          if (er) {
            console.error('Error adding column:', err);
          } else {
            console.log(`Column ${newColumn} added to ${tableName}`);
          }
        },
      );
    } else {
      console.log(`Column ${newColumn} already exists in ${tableName}`);
    }
  });
}

function updateAccountIdOfDaybook() {
  const db = connect();
  const tableName = 'Daybook'; // Table name
  const columnName = 'accountId'; // Column to check

  columnExists(tableName, columnName, (err: any, exists: any) => {
    if (err) {
      console.error('Error checking column:', err);
      return;
    }

    if (exists) {
      // If the column exists, update the rows where accountId is NULL
      db.run(
        `UPDATE ${tableName} SET accountId = 1 WHERE accountId IS NULL`,
        (er: any) => {
          if (er) {
            console.error('Error updating accountId:', err);
          } else {
            console.log('Successfully updated accountId where it was NULL.');
          }
        },
      );
    } else {
      console.log(`Column ${columnName} does not exist in ${tableName}.`);
    }
  });
}

function updateAccountIdOfCategory() {
  const db = connect();
  const tableName = 'Category'; // Table name
  const columnName = 'accountId'; // Column to check

  columnExists(tableName, columnName, (err: any, exists: any) => {
    if (err) {
      console.error('Error checking column:', err);
      return;
    }

    if (exists) {
      // If the column exists, update the rows where accountId is NULL
      db.run(
        `UPDATE ${tableName} SET accountId = 1 WHERE accountId IS NULL`,
        (er: any) => {
          if (er) {
            console.error('Error updating accountId:', err);
          } else {
            console.log('Successfully updated accountId where it was NULL.');
          }
        },
      );
    } else {
      console.log(`Column ${columnName} does not exist in ${tableName}.`);
    }
  });
}

export {
  connect,
  loadModels,
  addColumnIfNotExists,
  updateAccountIdOfDaybook,
  updateAccountIdOfCategory,
};
