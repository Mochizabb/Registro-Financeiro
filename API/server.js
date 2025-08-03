import express from 'express'
import sqlite3 from 'sqlite3'
import cors from 'cors'
import { exec } from 'child_process';
import { promisify } from 'util';

const app = express()
const execAsync = promisify(exec)
app.use(cors())
app.use(express.json())

const db = new sqlite3.Database('database/data.db')

// Requisição de informações do banco
app.get('/api/data', (req, res) => {
    db.all('SELECT descricao, entradas, saidas, data FROM transacoes', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message })
            return
        }
        
        res.json(rows.sort((a, b) => a.data.localeCompare(b.data)))
    })
})

app.delete('/api/data', (req, res) => {
    const db = new sqlite3.Database('database/data.db');
    
    db.run(`DELETE FROM transacoes 
            WHERE data = '2024-01-01' 
            AND descricao = 'Salário Janeiro' 
            AND entradas = 3500.00`, function(err) {
      if (err) {
        console.error('Erro ao apagar transação:', err.message);
      } else {
        return ('Transação apagada com sucesso.');
      }
      db.close();
    });
})

// Envio de informações para o banco
app.post('/api/data', async(req, res) => {
    const { descricao, entradas, saidas, data } = req.body
    
    if (!descricao || !entradas && !saidas || !data) {
        return res.status(400).json({ error: 'Campos obrigatórios não enviados' })
    }
   
    db.run(
        `INSERT INTO transacoes (descricao, entradas, saidas, data) VALUES (?,?,?,?)`,
        [descricao, entradas, saidas, data],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message })
            }
            res.status(201).json({ 
                id: this.lastID, 
                descricao, 
                entradas,
                saidas, 
                data 
            })
        }
    )
})

// Reset do banco
app.post('/api/reset', async (req, res) => {
    try {
        console.log('🔄 Iniciando reset do banco...')
        
        // Executa os scripts
        await execAsync('node databaseScripts/clear_db.js')
        await execAsync('node databaseScripts/create_db.js')
        
        console.log('✅ Reset concluído!')
        res.json({ success: true, message: 'Banco resetado com sucesso!' })
        
    } catch (error) {
        console.error('❌ Erro no reset:', error.message)
        res.status(500).json({ error: error.message })
    }
})

app.listen(3030, () => {
    console.log('🚀 Servidor rodando em http://localhost:3030')
})