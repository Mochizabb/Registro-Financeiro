
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
        const divisorData = data.sort((a,b) => new Date(a.data) - new Date(b.data))
        const tbody = document.querySelector('#historicoTable tbody')
        tbody.innerHTML = '' //limpar rows

        divisorData.forEach(row => {
            const tr = document.createElement('tr')
            tr.innerHTML = `
                <td>${row.descricao}</td>
                <td>${Number(row.valor).toFixed(2)}</td>
                <td>${row.data}</td>
            `
            tbody.appendChild(tr)
        })
        
    }
    /*function divisor(data){
        // Sort data by date or any other criteria if needed
        const sortedData = data.sort((a, b) => new Date(b.data) - new Date(a.data));
        const tbody = document.querySelector('#historicoTable tbody');
        tbody.innerHTML = ''; // Clear previous rows if any

        sortedData.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.descricao}</td>
                <td>${Number(row.valor).toFixed(2)}</td>
                <td>${row.data}</td>
            `;
            tbody.appendChild(tr);
        });
    }*/




// method post pra enviar dados pra API
document.getElementById('transacaoForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    data.valor = parseFloat(data.valor);

    try {
        const response = await fetch('http://localhost:3030/api/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Sucesso!');
            e.target.reset();
        }
    } catch (error) {
        console.error('Erro:', error);
    }
});