document.getElementById('roiForm').addEventListener('submit', function(e) {
    e.preventDefault();
    calcularROI();
});

function calcularROI() {
    const inversionInicial = parseFloat(document.getElementById('inversionInicial').value);
    const costosAnuales = parseFloat(document.getElementById('costosAnuales').value);
    const ahorrosAnuales = parseFloat(document.getElementById('ahorrosAnuales').value);
    
    const beneficioNetoAnual = ahorrosAnuales - costosAnuales;
    
    let puntoInflexion = null;
    let inversionAcumulada = inversionInicial;
    
    const tablaBody = document.getElementById('tablaBody');
    tablaBody.innerHTML = '';
    
    for (let año = 1; año <= 5; año++) {
        inversionAcumulada += costosAnuales;
        const ingresosAcumulados = beneficioNetoAnual * año;
        const inversionTotal = inversionInicial + (costosAnuales * año);
        
        // ROI = [(Ingresos - Inversión) / Inversión] x 100
        const roi = ((ingresosAcumulados - inversionTotal) / inversionTotal) * 100;
        const beneficioNeto = ingresosAcumulados - inversionTotal;
        
        if (puntoInflexion === null && beneficioNeto >= 0) {
            const añosExactos = inversionInicial / beneficioNetoAnual;
            puntoInflexion = añosExactos;
        }
        
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>Año ${año}</td>
            <td>${formatearMoneda(inversionAcumulada)}</td>
            <td class="${beneficioNeto >= 0 ? 'roi-positivo' : 'roi-negativo'}">${formatearMoneda(beneficioNeto)}</td>
            <td class="${roi >= 0 ? 'roi-positivo' : 'roi-negativo'}">${roi.toFixed(2)}%</td>
        `;
        tablaBody.appendChild(fila);
    }
    
    const puntoInflexionElement = document.getElementById('puntoInflexion');
    if (puntoInflexion !== null && puntoInflexion <= 5) {
        const años = Math.floor(puntoInflexion);
        const meses = Math.round((puntoInflexion - años) * 12);
        
        if (años === 0) {
            puntoInflexionElement.textContent = `${meses} meses`;
        } else if (meses === 0) {
            puntoInflexionElement.textContent = `${años} año${años > 1 ? 's' : ''}`;
        } else {
            puntoInflexionElement.textContent = `${años} año${años > 1 ? 's' : ''} y ${meses} mes${meses > 1 ? 'es' : ''}`;
        }
    } else if (puntoInflexion === null || puntoInflexion > 5) {
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