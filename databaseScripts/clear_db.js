import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('database/data.db');

db.run('DELETE FROM transacoes', function(err) {
  if (err) {
    console.error('Erro ao limpar tabela:', err.message);
  } else {
    console.log('Tabela "transacoes" limpa com sucesso.');
  }
  db.close();
});