import React from 'react';
import { SQLiteProvider } from 'expo-sqlite';

/**
 * Initialize the database if it doesn't exist.
 */
const initializeDatabase = async (db) => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      endereco TEXT NOT NULL,
      numero TEXT NOT NULL,
      complemento TEXT,
      cep TEXT NOT NULL,
      telefone TEXT,
      plano TEXT NOT NULL
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS doctors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      specialty TEXT NOT NULL,
      location TEXT NOT NULL,
      email TEXT UNIQUE,
      phone TEXT,
      available BOOLEAN DEFAULT 1
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      doctor_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      status TEXT NOT NULL,
      FOREIGN KEY (doctor_id) REFERENCES doctors (id),
      FOREIGN KEY (user_id) REFERENCES users (id)
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS medical_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      record TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );
  `);

  // Register some default doctors
  await db.execAsync(`
    INSERT OR IGNORE INTO doctors (name, specialty, location, email, phone, available) VALUES
    ('Dr. João Silva', 'Cardiologista', 'Rua das Flores, 123', 'joao.silva@example.com', '14987654321', 1),
    ('Dr. Maria Souza', 'Pediatra', 'Rua das Palmeiras, 456', 'maria.souza@example.com', '14987654322', 1),
    ('Dr. Carlos Pereira', 'Dermatologista', 'Rua dos Anéis, 789', 'carlos.pereira@example.com', '14987654323', 1);
  `);
};

/**
 * DatabaseProvider wraps the app and provides the SQLite context.
 */
export const DatabaseContext = ({ children }) => {
  return (
    <SQLiteProvider databaseName="myapp.db" onInit={initializeDatabase}>
      {children}
    </SQLiteProvider>
  );
};