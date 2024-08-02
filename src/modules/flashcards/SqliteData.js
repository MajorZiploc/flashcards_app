import { enablePromise, openDatabase, SQLiteDatabase } from 'react-native-sqlite-storage';

/**
 * @typedef {import('../interfaces').DBCard} DBCard
 * @typedef {import('../interfaces').DBDeck} DBDeck
 */

enablePromise(true);

/** @type {() => Promise<SQLiteDatabase>} */
export const getDBConnection = async () => {
  return openDatabase({ name: 'flashcards-data.db', location: 'default' });
};

/** @type {(db: SQLiteDatabase) => Promise<void>} */
export const createDeckTable = async (db) => {
  const query = `CREATE TABLE IF NOT EXISTS Deck(
    "id" char(36) default (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))), 
    "name" varchar(255) NOT NULL,
    primary key ("id")
    );`;
  await db.executeSql(query);
};

/** @type {(db: SQLiteDatabase) => Promise<DBDeck[]>} */
export const getDeckItems = async (db) => {
  try {
    const results = await db.executeSql(`SELECT id, name FROM Deck`);
    const items = results.flatMap(result => {
      const items = [];
      for (let index = 0; index < result.rows.length; index++) {
        items.push(result.rows.item(index));
      }
      return items;
    });
    return items;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get decks !!!');
  }
};

/** @type {(db: SQLiteDatabase, items: DBDeck[]) => Promise<void>} */
export const saveDecks = async (db, items) => {
  const insertQuery =
    `INSERT OR REPLACE INTO Deck(name) values` +
    items.map(i => `('${i.name}')`).join(',');
  return db.executeSql(insertQuery);
};

/** @type {(db: SQLiteDatabase, id: string) => Promise<void>} */
export const deleteDeck = async (db, id) => {
  const deleteQuery = `DELETE from Deck where id = ${id}`;
  await db.executeSql(deleteQuery);
};

/** @type {(db: SQLiteDatabase, tableName: string) => Promise<void>} */
export const deleteTable = async (db, tableName) => {
  const query = `drop table ${tableName}`;
  await db.executeSql(query);
};
