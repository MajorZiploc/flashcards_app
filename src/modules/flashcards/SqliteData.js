import { enablePromise, openDatabase, SQLiteDatabase } from 'react-native-sqlite-storage';

/**
 * @typedef {import('../interfaces').DBCard} DBCard
 * @typedef {import('../interfaces').DBDeck} DBDeck
 */

enablePromise(true);

const genUuid = `char(36) default (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))`;

/** @type {() => Promise<SQLiteDatabase>} */
export const getDBConnection = async () => {
  return openDatabase({ name: 'flashcards-data.db', location: 'default' });
};

/** @type {(db: SQLiteDatabase, query: string, params?: any[]) => Promise<DBDeck[]>} */
export const getItems = async (db, query, params) => {
  try {
    const results = await db.executeSql(query, params);
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
    throw Error('Failed to get items!');
  }
};

/** @type {(db: SQLiteDatabase) => Promise<void>} */
export const dropDeckTable  = async (db) => {
  await db.executeSql('drop table Deck');
};

/** @type {(db: SQLiteDatabase) => Promise<void>} */
export const createDeckTable = async (db) => {
  const query = `CREATE TABLE IF NOT EXISTS Deck(
    "id" ${genUuid} NOT NULL,
    "name" varchar(255) NOT NULL,
    primary key ("id")
    );`;
  await db.executeSql(query);
};

/** @type {(db: SQLiteDatabase) => Promise<DBDeck[]>} */
export const getDeckItems = async (db) => {
  return getItems(db, 'SELECT id, name FROM Deck');
};

/** @type {(db: SQLiteDatabase, items: DBDeck[]) => Promise<void>} */
export const saveDecks = async (db, items) => {
  const insertQuery = `INSERT OR REPLACE INTO Deck(name) VALUES ${items.map(() => '(?)').join(',')}`;
  const params = items.map(i => i.name);
  
  return db.executeSql(insertQuery, params);
};

/** @type {(db: SQLiteDatabase, id: string) => Promise<void>} */
export const deleteDeck = async (db, id) => {
  await db.executeSql('DELETE from Deck where id = ?', [id]);
};

/** @type {(db: SQLiteDatabase) => Promise<void>} */
export const createCardTable = async (db) => {
  const query = `CREATE TABLE IF NOT EXISTS Card(
    "id" ${genUuid}
    primary key ("id")
    );`;
  await db.executeSql(query);
};
