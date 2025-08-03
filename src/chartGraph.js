  Chart.defaults.color = '#f2f2f2';
  Chart.defaults.font.family = 'Segoe UI, Arial, sans-serif';
  Chart.defaults.font.size = 16;


  const ctx = document.getElementById('graph');

  fetch('http://localhost:3030/api/data')
  .then(function(response){
    if (response.ok == true){
      return response.json()
    }
  })

  .then(function(data){
    createChart(agruparDados(data))
  })

// agrupar os dados em uma unica barra do grafico
function agruparDados(data){
  const agrupados = {}
  data.forEach(row => {
    if (!agrupados[row.data]){
      agrupados[row.data] = { entradas: 0, saidas: 0}
    }
    agrupados[row.data].entradas += Number(row.entradas) || 0
    agrupados[row.data].saidas += Number(row.saidas) || 0
  })
  return Object.entries(agrupados).map(([data, valores]) => ({
    data,
    entradas: valores.entradas,
    saidas: valores.saidas
  }))
}
  
function createChart(data){
    new Chart(ctx, {
    type: 'bar',
    data: {
    labels: data.map(row => row.data), // Descrições como labels
    datasets: [
  {
    label: 'Entradas',
    data: data.map(row => row.entradas),
    backgroundColor: 'rgba(0, 255, 64, 0.7)', // Verde
  },
  {
    label: 'Saídas', 
    data: data.map(row => row.saidas),
    backgroundColor: 'rgba(255, 64, 64, 0.7)', // Vermelho
  }
]

      
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      },
      maintainAspectRatio: false,
       plugins: {
            title: {
                display: true,
                text: 'Grafico de Gastos'
            }
          }
    }
  });
}