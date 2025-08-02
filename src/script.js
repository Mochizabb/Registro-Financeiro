document.getElementById('transacaoForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    data.valor = parseFloat(data.valor); // Converter para número
    
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