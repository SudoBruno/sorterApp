import * as SQLite from 'expo-sqlite';

const database= SQLite.openDatabase("database.db");

export default database;