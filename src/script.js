//Variáveis globais para controle
let transacoes = [];
let transacaoParaDeletar = null;
let linhaParaDeletar = null;

//consumo da API
fetch('http://localhost:3030/api/data')
  .then(function(response){
    if (response.ok == true){
      return response.json()
    }
  })
  .then(function(data){
    transacoes = data; // Armazenar dados globalmente
    divisor(data)
  })

//separar os dados - MODIFICADO para incluir ícones de ação
function divisor(data){
    //sortear por data
    const divisorData = data.sort((a,b) => new Date(b.data) - new Date(a.data))
    const tbody = document.querySelector('#historicoTable tbody')
    tbody.innerHTML = '' //limpar rows

    divisorData.forEach((row, index) => {
        const entrada = Number(row.entradas) || 0
        const saida = Number(row.saidas) || 0
        const tr = document.createElement('tr')
        tr.dataset.index = index; // Adicionar índice para identificação
        
        tr.innerHTML = `
            <td>${row.descricao}</td>
            <td>${entrada !== 0 ? '+R$ ' + entrada.toFixed(2) : '-'}</td>
            <td>${saida !== 0 ? '-R$ ' + saida.toFixed(2) : '-'}</td>
            <td>${row.data}</td>
            <td class="acoes-coluna">
                <div class="acoes-icons">
                    <button class="icon-btn edit-btn" title="Editar" onclick="editarLinha(this)">
                        ✏️
                    </button>
                    <button class="icon-btn delete-btn" title="Deletar" onclick="abrirModalDelete(this)">
                        🗑️
                    </button>
                </div>
            </td>
        `
        tbody.appendChild(tr)
    })
}

//formulario de envio por tipo
document.querySelector('#transacaoForm .entrada').addEventListener('click', async (e) => {
    await enviarTransacao('entradas');
});

document.querySelector('#transacaoForm .saida').addEventListener('click', async (e) => {
    await enviarTransacao('saidas');
});

// Função POST atualizada para sincronizar com transacoes[]
async function enviarTransacao(tipo) {
    const form = document.getElementById('transacaoForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    data[tipo] = parseFloat(data.valor);
    delete data.valor;
    
    // ✅ Garantir que campos não existentes sejam 0
    data.entradas = data.entradas || 0;
    data.saidas = data.saidas || 0;

    try {
        const response = await fetch('http://localhost:3030/api/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const transacaoSalva = await response.json();
            
            // ✅ ADICIONAR NA VARIÁVEL GLOBAL
            transacoes.push(transacaoSalva);
            
            form.reset();
            divisor(transacoes); // Atualizar tabela
            showNotification('Transação adicionada com sucesso!', 'success');
        } else {
            showNotification('Erro ao adicionar transação', 'error');
        }
    } catch (error) {
        console.error('Erro:', error);
        showNotification('Erro de conexão', 'error');
    }
}

// Função DELETE atualizada
function abrirModalDelete(btn) {
    const tr = btn.closest('tr');
    const index = parseInt(tr.dataset.index);
    
    // ✅ BUSCAR NA VARIÁVEL GLOBAL ATUALIZADA
    const transacao = transacoes[index];
    
    if (!transacao) {
        showNotification('Transação não encontrada!', 'error');
        return;
    }
    
    transacaoParaDeletar = transacao;
    linhaParaDeletar = tr;
    
    const valor = transacao.entradas || transacao.saidas || 0;
    
    document.getElementById('modalMessage').innerHTML = `
        <strong>Descrição:</strong> ${transacao.descricao}<br>
        <strong>Valor:</strong> R$ ${valor.toFixed(2).replace('.', ',')}<br>
        <strong>Data:</strong> ${transacao.data}
    `;
    
    document.getElementById('confirmModal').style.display = 'block';
}

// DELETE enviará exatamente os dados da transação
async function confirmDelete() {
    if (!transacaoParaDeletar) return;
    
    console.log('🗑️ Deletando transação:', transacaoParaDeletar);
    
    try {
        // ✅ ENVIAR TODOS OS CAMPOS DA TRANSAÇÃO
        const response = await fetch('http://localhost:3030/api/data', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                descricao: transacaoParaDeletar.descricao,
                entradas: transacaoParaDeletar.entradas || 0,
                saidas: transacaoParaDeletar.saidas || 0,
                data: transacaoParaDeletar.data
            })
        });
        
        if (response.ok) {
            // ✅ REMOVER DA VARIÁVEL GLOBAL TAMBÉM
            const index = transacoes.findIndex(t => 
                t.descricao === transacaoParaDeletar.descricao &&
                t.data === transacaoParaDeletar.data &&
                t.entradas === transacaoParaDeletar.entradas &&
                t.saidas === transacaoParaDeletar.saidas
            );
            
            if (index > -1) {
                transacoes.splice(index, 1);
            }
            
            divisor(transacoes); // Atualizar tabela
            showNotification('Transação deletada com sucesso!', 'success');
        } else {
            showNotification(`Erro ao deletar (${response.status})`, 'error');
        }
        
    } catch (error) {
        console.error('Erro na requisição:', error);
        showNotification('Erro de conexão', 'error');
    }
    
    closeModal();
}

// Fechar modal
function closeModal() {
    document.getElementById('confirmModal').style.display = 'none';
    transacaoParaDeletar = null;
    linhaParaDeletar = null;
}

// Editar linha (modo inline)
function editarLinha(btn) {
    const tr = btn.closest('tr');
    const index = parseInt(tr.dataset.index);
    const transacao = transacoes[index];
    
    // Salvar dados originais
    tr.dataset.originalData = JSON.stringify(transacao);
    
    const entradas = transacao.entradas || 0;
    const saidas = transacao.saidas || 0;
    
    tr.classList.add('editing');
    tr.innerHTML = `
        <td><input type="text" value="${transacao.descricao}" class="edit-descricao"></td>
        <td><input type="number" value="${entradas}" step="0.01" class="edit-entradas"></td>
        <td><input type="number" value="${saidas}" step="0.01" class="edit-saidas"></td>
        <td><input type="date" value="${transacao.data}" class="edit-data"></td>
        <td class="acoes-coluna">
            <div class="save-cancel-btns">
                <button class="save-btn" title="Salvar" onclick="salvarEdicao(this)">✓</button>
                <button class="cancel-btn" title="Cancelar" onclick="cancelarEdicao(this)">✕</button>
            </div>
        </td>
    `;
    
    // Focar no primeiro campo
    tr.querySelector('.edit-descricao').focus();
}

// Salvar edição
async function salvarEdicao(btn) {
    const tr = btn.closest('tr');
    const index = parseInt(tr.dataset.index);
    const transacaoOriginal = transacoes[index];
    
    // Coletar novos dados
    const novaDescricao = tr.querySelector('.edit-descricao').value;
    const novasEntradas = parseFloat(tr.querySelector('.edit-entradas').value) || 0;
    const novasSaidas = parseFloat(tr.querySelector('.edit-saidas').value) || 0;
    const novaData = tr.querySelector('.edit-data').value;
    
    if (!novaDescricao || !novaData) {
        showNotification('Preencha todos os campos obrigatórios!', 'error');
        return;
    }
    
    const dadosAtualizados = {
        descricao: novaDescricao,
        entradas: novasEntradas,
        saidas: novasSaidas,
        data: novaData
    };
    
    try {
        // Simular PUT usando filtro composto + novos dados
        const payload = {
            filtro: {
                descricao: transacaoOriginal.descricao,
                entradas: transacaoOriginal.entradas || 0,
                saidas: transacaoOriginal.saidas || 0,
                data: transacaoOriginal.data
            },
            novos_dados: dadosAtualizados
        };
        
        console.log('📝 Editando transação:', payload);
        
        // Se sua API não suporta PUT, você pode implementar como DELETE + POST
        // Por enquanto, vou usar PUT
        const response = await fetch('http://localhost:3030/api/data', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (response.ok) {
            showNotification('Transação editada com sucesso!', 'success');
            await recarregarDados();
        } else {
            showNotification(`Erro ao editar (${response.status})`, 'error');
            cancelarEdicao(btn);
        }
        
    } catch (error) {
        console.error('Erro:', error);
        showNotification('Erro de conexão', 'error');
        cancelarEdicao(btn);
    }
}

// Cancelar edição
function cancelarEdicao(btn) {
    const tr = btn.closest('tr');
    const index = parseInt(tr.dataset.index);
    const originalData = JSON.parse(tr.dataset.originalData);
    
    tr.classList.remove('editing');
    
    const entrada = Number(originalData.entradas) || 0;
    const saida = Number(originalData.saidas) || 0;
    
    tr.innerHTML = `
        <td>${originalData.descricao}</td>
        <td>${entrada !== 0 ? '+R$ ' + entrada.toFixed(2) : '-'}</td>
        <td>${saida !== 0 ? '-R$ ' + saida.toFixed(2) : '-'}</td>
        <td>${originalData.data}</td>
        <td class="acoes-coluna">
            <div class="acoes-icons">
                <button class="icon-btn edit-btn" title="Editar" onclick="editarLinha(this)">
                    ✏️
                </button>
                <button class="icon-btn delete-btn" title="Deletar" onclick="abrirModalDelete(this)">
                    🗑️
                </button>
            </div>
        </td>
    `;
}

// Sistema de notificações
function showNotification(message, type = 'success') {
    // Remove notificação existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
    const modal = document.getElementById('confirmModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Adicionar suporte ao ESC para fechar modal
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('confirmModal');
        if (modal.style.display === 'block') {
            closeModal();
        }
    }
});