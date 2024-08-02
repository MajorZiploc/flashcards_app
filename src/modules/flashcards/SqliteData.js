import { enablePromise, openDatabase } from 'react-native-sqlite-storage';

/**
 * @typedef {import('../interfaces').DBCard} DBCard
 * @typedef {import('../interfaces').DBDeck} DBDeck
 */

enablePromise(true);

/**
 * Get a connection to the database.
 * @returns {Promise<SQLiteDatabase>}
 */
export const getDBConnection = async () => {
  return openDatabase({ name: 'flashcards-data.db', location: 'default' });
};

/**
 * Create a table if it does not exist.
 * @param {SQLiteDatabase} db - The database connection.
 * @returns {Promise<void>}
 */
export const createDeckTable = async (db) => {
  const query = `CREATE TABLE IF NOT EXISTS Deck(
    "id" char(36) default (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))), 
    "name" varchar(255) NOT NULL,
    primary key ("id")
    );`;
  await db.executeSql(query);
};

/**
 * Get all ToDo items from the database.
 * @param {SQLiteDatabase} db - The database connection.
 * @returns {Promise<DBDeck[]>}
 */
export const getDeckItems = async (db) => {
  try {
    const items = [];
    const results = await db.executeSql(`SELECT id, name FROM Deck`);
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        items.push(result.rows.item(index));
      }
    });
    return items;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get decks !!!');
  }
};

/**
 * Save ToDo items to the database.
 * @param {SQLiteDatabase} db - The database connection.
 * @param {DBDeck[]} items - The ToDo items to save.
 * @returns {Promise<void>}
 */
export const saveDecks = async (db, items) => {
  const insertQuery =
    `INSERT OR REPLACE INTO Deck(name) values` +
    items.map(i => `('${i.name}')`).join(',');
  return db.executeSql(insertQuery);
};

/**
 * Delete a ToDo item from the database.
 * @param {SQLiteDatabase} db - The database connection.
 * @param {number} id - The ID of the ToDo item to delete.
 * @returns {Promise<void>}
 */
export const deleteDeck = async (db, id) => {
  const deleteQuery = `DELETE from Deck where id = ${id}`;
  await db.executeSql(deleteQuery);
};

/**
 * Delete the table from the database.
 * @param {SQLiteDatabase} db - The database connection.
 * @param {string} tableName
 * @returns {Promise<void>}
 */
export const deleteTable = async (db, tableName) => {
  const query = `drop table ${tableName}`;
  await db.executeSql(query);
};
