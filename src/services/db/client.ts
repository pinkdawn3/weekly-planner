import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("weeklymeal.db");
export default db;
