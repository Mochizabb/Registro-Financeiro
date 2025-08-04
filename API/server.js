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

// Delete de dado unico
app.delete('/api/data', (req, res) => {
    const db = new sqlite3.Database('database/data.db');
    const { data, descricao, entradas, saidas } = req.body
    
    db.run(`DELETE FROM transacoes 
            WHERE (data, descricao, entradas, saidas) = (?,?,?,?)`,
            [ data, descricao, entradas, saidas],
            function (err) {
            if (err) {
                return res.status(500).json({ error: err.message })
            }
            res.status(200).json({ 
                descricao, 
                entradas,
                saidas, 
                data 
            })
        }
    );
})

//editar dados
app.put('/api/data', (req, res) => {
    const { filtro, novos_dados } = req.body;
    
    // Validar se tem filtro e novos dados
    if (!filtro || !novos_dados) {
        return res.status(400).json({ error: 'Filtro e novos_dados são obrigatórios' });
    }
    
    const sql = `
        UPDATE transacoes 
        SET 
            descricao = ?,
            entradas = ?,
            saidas = ?,
            data = ?
        WHERE 
            descricao = ? AND 
            entradas = ? AND 
            saidas = ? AND 
            data = ?
    `;
    
    const params = [
        // SET (novos dados)
        novos_dados.descricao,
        novos_dados.entradas,
        novos_dados.saidas,
        novos_dados.data,
        // WHERE (filtro - dados originais)
        filtro.descricao,
        filtro.entradas,
        filtro.saidas,
        filtro.data
    ];
    
    db.run(sql, params, function(err) {
        if (err) {
            console.error('Erro no UPDATE:', err);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
        
        // Verificar se alguma linha foi afetada
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Transação não encontrada' });
        }
        
        res.json({ 
            message: 'Transação atualizada com sucesso',
            changes: this.changes,
            dados_atualizados: novos_dados
        });
    });
});

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