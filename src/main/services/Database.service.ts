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

  db.serialize(() => {
    db.run(daybookModel);
    db.run(categoryModel);
  });
};

export { connect, loadModels };
