import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('database/data.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS transacoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao TEXT NOT NULL,
      entradas REAL,
      saidas REAL,
      data TEXT NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error('Erro ao criar tabela:', err.message);
    } else {
      console.log('Tabela "transacoes" criada ou já existe.');
    }
    db.close();
  });
});