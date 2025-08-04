import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('database/data.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE transacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    descricao TEXT NOT NULL,
    entradas DECIMAL(10,2) DEFAULT 0,
    saidas DECIMAL(10,2) DEFAULT 0,
    data DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
  `, (err) => {
    if (err) {
      console.error('Erro ao criar tabela:', err.message);
    } else {
      console.log('Tabela "transacoes" criada ou já existe.');
    }
    db.close();
  });
});