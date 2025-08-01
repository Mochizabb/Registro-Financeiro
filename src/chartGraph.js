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
    console.log(data)
    createChart(data)
  })

function createChart(data){
    new Chart(ctx, {
    type: 'bar',
    data: {
    labels: data.map(row => row.data) ,
      datasets: [{
        label: 'Valor',
        data:   data.map(row => row.valor),
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      },
      maintainAspectRatio: false
    }
  });
}


setTimeout(createChart, 3000);