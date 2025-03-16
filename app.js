async function aggiornaPrezzo() {
    try {
        let response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd");
        let data = await response.json();
        document.getElementById("btc-price").innerText = data.bitcoin.usd + " USD";
    } catch (error) {
        document.getElementById("btc-price").innerText = "Errore nel caricamento!";
    }
}

async function caricaGrafico() {
    let response = await fetch("https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7");
    let data = await response.json();
    let prezzi = data.prices.map(p => ({ x: new Date(p[0]), y: p[1] }));

    let ctx = document.getElementById("btcChart").getContext("2d");
    new Chart(ctx, {
        type: "line",
        data: {
            datasets: [{
                label: "Prezzo Bitcoin (Ultimi 7 Giorni)",
                data: prezzi,
                borderColor: "orange",
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            scales: {
                x: { type: "time", time: { unit: "day" } },
                y: { beginAtZero: false }
            }
        }
    });
}

window.onload = () => {
    aggiornaPrezzo();
    caricaGrafico();
};
