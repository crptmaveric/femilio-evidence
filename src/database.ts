import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(false);
SQLite.enablePromise(true);

const database_name = "app.db";
const database_version = "1.0";
const database_displayname = "SQLite Patients Database";
const database_size = 200000;

export const getDatabaseConnection = async () => {
    return SQLite.openDatabase(
        database_name,
        database_version,
        database_displayname,
        database_size
    );
};

export const createTables = async () => {
    const db = await getDatabaseConnection();

    await db.executeSql(
        `CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        role TEXT NOT NULL,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        login TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      );`
    );

    await db.executeSql(
        `CREATE TABLE IF NOT EXISTS Patients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT,
        lastName TEXT,
        diagnosis TEXT,
        address TEXT,
        birthNumber TEXT,
        photo TEXT,
        doctorId INTEGER,
        FOREIGN KEY (doctorId) REFERENCES Users(id)
      );`
    );

    await db.executeSql(
        `CREATE TABLE IF NOT EXISTS Photos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uri TEXT NOT NULL,
        date TEXT NOT NULL
      );`
    );

    // Check if the admin user already exists
    const results = await db.executeSql('SELECT * FROM Users WHERE login = ?', ['admin']);
    if (results.length > 0 && results[0].rows.length === 0) {
        // Insert the default admin user
        await db.executeSql(
            'INSERT INTO Users (firstName, lastName, login, email, password, role) VALUES (?, ?, ?, ?, ?, ?)',
            ['Admin', 'User', 'admin', 'admin@example.com', 'admin', 'admin']
        );
        await db.executeSql(
            'INSERT INTO Users (firstName, lastName, login, email, password, role) VALUES (?, ?, ?, ?, ?, ?)',
            ['Martina', 'Milčáková', 'martina', 'fyzio.crhova@gmail.com', 'martina', 'doctor']
        );
    }
};

export const deleteDatabase = async () => {
    const db = await getDatabaseConnection();

    await db.executeSql('DROP TABLE IF EXISTS Users;');
    await db.executeSql('DROP TABLE IF EXISTS Patients;');
    await db.executeSql('DROP TABLE IF EXISTS Photos;');

    await createTables();
};

export const closeDatabase = async () => {
    const db = await getDatabaseConnection();
    db.close();
};
