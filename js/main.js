document.getElementById('roiForm').addEventListener('submit', function(e) {
    e.preventDefault();
    calcularROI();
});

function calcularROI() {
    const inversionInicial = parseFloat(document.getElementById('inversionInicial').value);
    const costosAnuales = parseFloat(document.getElementById('costosAnuales').value);
    const ahorrosAnuales = parseFloat(document.getElementById('ahorrosAnuales').value);
    
    const beneficioNetoAnual = ahorrosAnuales - costosAnuales;
    const tablaBody = document.getElementById('tablaBody');
    tablaBody.innerHTML = '';
    
    // Calcular punto de inflexión
    const puntoInflexion = inversionInicial / beneficioNetoAnual;
    
    // Generar tabla de 5 años
    for (let año = 1; año <= 5; año++) {
        const ingresosAcumulados = ahorrosAnuales * año;
        const inversionTotal = inversionInicial + (costosAnuales * año);
        const beneficioNeto = ingresosAcumulados - inversionTotal;
        const roi = (beneficioNeto / inversionTotal) * 100;
        
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>Año ${año}</td>
            <td>${formatearMoneda(inversionTotal)}</td>
            <td class="${beneficioNeto >= 0 ? 'roi-positivo' : 'roi-negativo'}">${formatearMoneda(beneficioNeto)}</td>
            <td class="${roi >= 0 ? 'roi-positivo' : 'roi-negativo'}">${roi.toFixed(2)}%</td>
        `;
        tablaBody.appendChild(fila);
    }
    
    // Mostrar punto de inflexión
    const puntoInflexionElement = document.getElementById('puntoInflexion');
    if (puntoInflexion <= 5) {
        const años = Math.floor(puntoInflexion);
        const meses = Math.round((puntoInflexion - años) * 12);
        
        if (años === 0) {
            puntoInflexionElement.textContent = `${meses} meses`;
        } else if (meses === 0) {
            puntoInflexionElement.textContent = `${años} año${años > 1 ? 's' : ''}`;
        } else {
            puntoInflexionElement.textContent = `${años} año${años > 1 ? 's' : ''} y ${meses} mes${meses > 1 ? 'es' : ''}`;
        }
        puntoInflexionElement.style.color = '#27ae60';
    } else {
        puntoInflexionElement.textContent = 'Superior a 5 años';
        puntoInflexionElement.style.color = '#e67e22';
    }
    
    document.getElementById('resultados').classList.remove('oculto');
    document.getElementById('resultados').scrollIntoView({ behavior: 'smooth' });
}

function formatearMoneda(valor) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2
    }).format(valor);
}