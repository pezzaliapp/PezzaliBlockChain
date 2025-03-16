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
        let prezzi = data.prices.map(p => ({ x: new Date(p[0]), y: p[1] }));

        let ctx = document.getElementById("btcChart").getContext("2d");
        if (window.myChart) window.myChart.destroy(); // Rimuove eventuali grafici precedenti
        window.myChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: prezzi.map(p => p.x.toLocaleDateString()),
                datasets: [{
                    label: "Prezzo Bitcoin (Ultimi 7 Giorni)",
                    data: prezzi.map(p => p.y),
                    borderColor: "orange",
                    borderWidth: 2,
                    fill: false
                }]
            },
            options: {
                scales: {
                    x: { type: "category" },
                    y: { beginAtZero: false }
                }
            }
        });
    } catch (error) {
        console.error("Errore nel caricamento del grafico:", error);
    }
}

// Funzione per generare un indirizzo Bitcoin
function generaWalletBitcoin() {
    const keyPair = bitcoin.ECPair.makeRandom();
    const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
    
    // Mostra l’indirizzo generato
    document.getElementById("btc-address").innerText = address;

    // Genera il QR Code per il nuovo indirizzo
    document.getElementById("btc-qr").src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=bitcoin:${address}`;
}

// Esegui le funzioni al caricamento della PWA
window.onload = () => {
    aggiornaPrezzo();
    caricaGrafico();
    generaWalletBitcoin();
};
