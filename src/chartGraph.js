(async function() {
  const data = [
    { year: 2020, count: 50 },
    { year: 2021, count: 120 },
    { year: 2022, count: 80 },
    { year: 2023, count: 200 },
    { year: 2024, count: 150 },
    { year: 2025, count: 300 }
  ];

  Chart.defaults.color = '#f2f2f2';
  Chart.defaults.font.family = 'Segoe UI, Arial, sans-serif';
  Chart.defaults.font.size = 16;

  new Chart(
    document.getElementById('acquisitions'),
    {
      type: 'bar',
      data: {
        labels: data.map(row => row.year),
        datasets: [
          {
            label: 'Transações por Mês',
            data: data.map(row => row.count),
            borderColor: [
              '#2979ff',              
              '#ff1744',             
            ],
            backgroundColor: [  
              'rgba(41,121,255,0.7)',
              'rgba(255,23,68,0.7)',
            ],
            borderWidth: 2
          }
        ]
      },
      options: {
        plugins: {
          legend: {
            labels: {
              color: '#fff',
              font: {
                size: 18,
                weight: 'bold'
              }
            }
          },
          title: {
            display: true,
            text: 'Transações Financeiras por Mês',
            color: '#fff',
            font: {
              size: 22,
              weight: 'bold'
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: '#fff',
              font: {
                size: 15
              }
            }
          },
          y: {
            ticks: {
              color: '#fff',
              font: {
                size: 15
              }
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.34)'
            }
          }
        }
      }
    }
  );
})();
