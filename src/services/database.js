import { openDatabase } from 'expo-sqlite';

const db = openDatabase('epubLibrary.db');

export const createTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, author TEXT, filePath TEXT);'
    );
  });
};

export const addBook = (title, author, filePath) => {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO books (title, author, filePath) VALUES (?, ?, ?);',
      [title, author, filePath]
    );
  });
};

export const getBooks = (callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM books;',
      [],
      (_, { rows }) => {
        callback(rows._array);
      }
    );
  });
};

export const updateBook = (id, title, author, filePath) => {
  db.transaction(tx => {
    tx.executeSql(
      'UPDATE books SET title = ?, author = ?, filePath = ? WHERE id = ?;',
      [title, author, filePath, id]
    );
  });
};

export const deleteBook = (id) => {
  db.transaction(tx => {
    tx.executeSql(
      'DELETE FROM books WHERE id = ?;',
      [id]
    );
  });
};