import { enablePromise, openDatabase } from 'react-native-sqlite-storage';
import { ToDoItem } from '../models';

const tableName = 'todoData';

enablePromise(true);

/**
 * Get a connection to the database.
 * @returns {Promise<SQLiteDatabase>}
 */
export const getDBConnection = async () => {
  return openDatabase({ name: 'todo-data.db', location: 'default' });
};

/**
 * Create a table if it does not exist.
 * @param {SQLiteDatabase} db - The database connection.
 * @returns {Promise<void>}
 */
export const createTable = async (db) => {
  const query = `CREATE TABLE IF NOT EXISTS ${tableName}(
        value TEXT NOT NULL
    );`;

  await db.executeSql(query);
};

/**
 * Get all ToDo items from the database.
 * @param {SQLiteDatabase} db - The database connection.
 * @returns {Promise<ToDoItem[]>}
 */
export const getTodoItems = async (db) => {
  try {
    const todoItems = [];
    const results = await db.executeSql(`SELECT rowid as id, value FROM ${tableName}`);
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        todoItems.push(result.rows.item(index));
      }
    });
    return todoItems;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get todoItems !!!');
  }
};

/**
 * Save ToDo items to the database.
 * @param {SQLiteDatabase} db - The database connection.
 * @param {ToDoItem[]} todoItems - The ToDo items to save.
 * @returns {Promise<void>}
 */
export const saveTodoItems = async (db, todoItems) => {
  const insertQuery =
    `INSERT OR REPLACE INTO ${tableName}(rowid, value) values` +
    todoItems.map(i => `(${i.id}, '${i.value}')`).join(',');

  return db.executeSql(insertQuery);
};

/**
 * Delete a ToDo item from the database.
 * @param {SQLiteDatabase} db - The database connection.
 * @param {number} id - The ID of the ToDo item to delete.
 * @returns {Promise<void>}
 */
export const deleteTodoItem = async (db, id) => {
  const deleteQuery = `DELETE from ${tableName} where rowid = ${id}`;
  await db.executeSql(deleteQuery);
};

/**
 * Delete the table from the database.
 * @param {SQLiteDatabase} db - The database connection.
 * @returns {Promise<void>}
 */
export const deleteTable = async (db) => {
  const query = `drop table ${tableName}`;

  await db.executeSql(query);
};
