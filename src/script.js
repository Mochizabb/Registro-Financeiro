fetch('http://localhost:3030/api/data')
  .then(function(response){
    if (response.ok == true){
      return response.json()
    }
  })

  .then(function(data){
    divisor(data)
  })

  //separar os dados
  function divisor(data){
        //sortear por data
        const divisorData = data.sort((a,b) => new Date(b.data) - new Date(a.data))
        const tbody = document.querySelector('#historicoTable tbody')
        tbody.innerHTML = '' //limpar rows

        divisorData.forEach(row => {
            const entrada = Number(row.entradas) || 0
            const saida = Number(row.saidas) || 0
            const tr = document.createElement('tr')
            tr.innerHTML = `
                <td>${row.descricao}</td>
                <td>${entrada !== 0 ? '+' + entrada.toFixed(2) : '-'}</td>
                <td>${saida !== 0 ? '-' + saida.toFixed(2) : '-'}</td>
                <td>${row.data}</td>
            `
            tbody.appendChild(tr)
        })
        
    }

    //formulario de envio
document.querySelector('#transacaoForm .entrada').addEventListener('click', async (e) => {
    await enviarTransacao('entradas');
});

document.querySelector('#transacaoForm .saida').addEventListener('click', async (e) => {
    await enviarTransacao('saidas');
});

async function enviarTransacao(tipo) {
    const form = document.getElementById('transacaoForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    data[tipo] = parseFloat(data.valor); // Cria "entrada" ou "saida" com o valor
    delete data.valor; // Remove o campo "valor"

    try {
        const response = await fetch('http://localhost:3030/api/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const transacaoSalva = await response.json();
            // Atualize a tabela/histórico conforme necessário
            form.reset();
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}