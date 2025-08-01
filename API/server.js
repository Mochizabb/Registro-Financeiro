import express from 'express'
import sqlite3 from 'sqlite3'
import cors from 'cors'


const app = express()
app.use(cors())
app.use(express.json())

const db = new sqlite3.Database('database/data.db')

app.get('/api/data', (req, res) => {
    db.all('SELECT descricao, valor, data FROM transacoes', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message })
            return
        }
        
        res.json(rows)
    })
})

app.post('/api/data', async(req, res) => {
    const { descricao, valor, data } = req.body
    if (!descricao || !valor || !data) {
        return res.status(400).json({ error: 'Campos obrigatórios não enviados' })
    }
   
    db.run(
    `INSERT INTO transacoes (descricao, valor, data) VALUES (?,?,?)`,
    [descricao,valor,data],
    function (err){
        if (err){
            return res.status(500).json({ error: err.message })
        }
        res.status(201).json({ id: this.lastID, descricao, valor, data })
    }
    )
    res.status(200)
   
        
   
    
        
    
})


app.listen(3030, () => {
    console.log('Servidor aberto em http://localhost:3030')
})