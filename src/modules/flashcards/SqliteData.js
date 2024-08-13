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

/** @type {(db: SQLiteDatabase, query: string, params?: any[]) => Promise<any[]>} */
export const getItems = async (db, query, params) => {
  try {
    const results = await db.executeSql(query, params);
    const items = [];
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        items.push(result.rows.item(index));
      }
    });
    return items;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get items!');
  }
};

/** @type {(db: SQLiteDatabase) => Promise<void>} */
export const dropDeckTable  = async (db) => {
  try {
    await db.executeSql('drop table Deck');
  } catch(err) {
  }
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

/** @type {(db: SQLiteDatabase, names?: string[]) => Promise<DBDeck[]>} */
export const getDecks = async (db, names = []) => {
  let query = 'SELECT id, name FROM Deck'
  if (names.length > 0) {
    query += ` WHERE name in (${names.map(() => '?').join(',')})`;
  }
  return getItems(db, query, names);
};

/** @type {(db: SQLiteDatabase, items: DBDeck[]) => Promise<void>} */
export const saveDecks = async (db, items) => {
  const insertQuery = `INSERT OR REPLACE INTO Deck(name) VALUES ${items.map(() => '(?)').join(',')}`;
  const params = items.map(i => i.name);
  return db.executeSql(insertQuery, params);
};

/** @type {(db: SQLiteDatabase, ids: string[]) => Promise<void>} */
export const deleteDecks = async (db, ids) => {
  await db.executeSql(`DELETE from Deck where id in (${ids.map(() => '?').join(',')})`, ids);
};

/** @type {(db: SQLiteDatabase) => Promise<void>} */
export const createCardTable = async (db) => {
  const query = `CREATE TABLE IF NOT EXISTS Card(
    "id" ${genUuid} NOT NULL,
    "term" text NOT NULL,
    "definition" text NOT NULL,
    "deckId" char(36) NOT NULL,
    primary key ("id")
    );`;
  await db.executeSql(query);
};

/** @type {(db: SQLiteDatabase) => Promise<void>} */
export const dropCardTable  = async (db) => {
  try {
    await db.executeSql('drop table Card');
  } catch(err) {
  }
};

/** @type {(db: SQLiteDatabase, deckId: string) => Promise<DBCard[]>} */
export const getCards = async (db, deckId) => {
  return getItems(db, 'SELECT id, term, definition, deckId FROM Card WHERE deckId = ?', [deckId]);
};

/** @type {(db: SQLiteDatabase, items: DBCard[], deck: DBDeck) => Promise<void>} */
export const saveCards = async (db, items, deck) => {
  const insertQuery = `INSERT OR REPLACE INTO Card(term, definition, deckId) VALUES ${items.map(() => '(?, ?, ?)').join(',')}`;
  const params = items.flatMap(i => [i.term, i.definition, deck.id]);
  return db.executeSql(insertQuery, params);
};

/** @type {(db: SQLiteDatabase, ids: string[]) => Promise<void>} */
export const deleteCards = async (db, ids) => {
  await db.executeSql(`DELETE from Card where id in (${ids.map(() => '?').join(',')})`, ids);
};

/** @type {(db: SQLiteDatabase, deckIds: string[]) => Promise<void>} */
export const deleteCardInDecks = async (db, deckIds) => {
  await db.executeSql(`DELETE from Card where deckId in (${deckIds.map(() => '?').join(',')})`, deckIds);
};
