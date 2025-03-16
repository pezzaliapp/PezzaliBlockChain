// Importa BitcoinJS (solo per browser moderni)
const bitcoin = window.bitcoinjs ? window.bitcoinjs : require('https://cdn.jsdelivr.net/npm/bitcoinjs-lib@5.2.0');

async function aggiornaPrezzo() {
    try {
        let currency = document.getElementById("currency").value;
        let response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=${currency}`);
        let data = await response.json();
        
        let symbol = {
            "usd": "$",
            "eur": "€",
            "gbp": "£",
            "jpy": "¥",
            "chf": "CHF"
        };

        document.getElementById("btc-price").innerText = data.bitcoin[currency] + " " + symbol[currency];
    } catch (error) {
        document.getElementById("btc-price").innerText = "Errore nel caricamento!";
    }
}

async function caricaGrafico() {
    try {
        let response = await fetch("https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7");
        let data = await response.json();
        
        if (!data.prices || data.prices.length === 0) {
            console.error("Nessun dato ricevuto per il grafico.");
            return;
        }

        let labels = data.prices.map(p => new Date(p[0]).toLocaleDateString());
        let prezzi = data.prices.map(p => p[1]);

        let ctx = document.getElementById("btcChart").getContext("2d");
        if (window.myChart) {
            window.myChart.destroy(); // Rimuove eventuali grafici precedenti
        }

        window.myChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: "Prezzo Bitcoin (Ultimi 7 Giorni)",
                    data: prezzi,
                    borderColor: "orange",
                    borderWidth: 2,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { title: { display: true, text: "Data" } },
                    y: { title: { display: true, text: "Prezzo in USD" } }
                }
            }
        });

    } catch (error) {
        console.error("Errore nel caricamento del grafico:", error);
    }
}
window.onload = () => {
    aggiornaPrezzo();
    caricaGrafico();
};
