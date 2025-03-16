// Se bitcoinjs-lib è caricato da <script>, lo troviamo in window.bitcoinjs
const bitcoin = window.bitcoinjs || null;

async function aggiornaPrezzo() {
  try {
    const currency = document.getElementById("currency").value;
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=${currency}`
    );
    const data = await response.json();

    const symbol = {
      usd: "$",
      eur: "€",
      gbp: "£",
      jpy: "¥",
      chf: "CHF"
    };

    document.getElementById("btc-price").innerText =
      data.bitcoin[currency] + " " + symbol[currency];
  } catch (error) {
    document.getElementById("btc-price").innerText =
      "Errore nel caricamento!";
    console.error("Errore aggiornando il prezzo:", error);
  }
}

async function caricaGrafico() {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7"
    );
    const data = await response.json();

    if (!data.prices || data.prices.length === 0) {
      console.error("Nessun dato ricevuto per il grafico.");
      return;
    }

    const labels = data.prices.map((p) =>
      new Date(p[0]).toLocaleDateString()
    );
    const prezzi = data.prices.map((p) => p[1]);

    const ctx = document.getElementById("btcChart").getContext("2d");

    // Se esiste già un grafico creato, lo distruggiamo prima di crearne uno nuovo
    if (window.myChart) {
      window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Prezzo Bitcoin (Ultimi 7 Giorni)",
            data: prezzi,
            borderColor: "orange", // colore linea
            borderWidth: 2,
            fill: false
          }
        ]
      },
      options: {
        // Queste opzioni rendono il grafico responsive
        responsive: true,
        // Se vuoi mantenere il rapporto di aspetto tipico (16:9), metti true
        // Se vuoi adattarlo liberamente all’altezza del contenitore, metti false
        maintainAspectRatio: false, 

        scales: {
          x: {
            title: {
              display: true,
              text: "Data"
            }
          },
          y: {
            title: {
              display: true,
              text: "Prezzo in USD"
            }
          }
        }
      }
    });
  } catch (error) {
    console.error("Errore nel caricamento del grafico:", error);
  }
}

// All’avvio della pagina, aggiorno il prezzo e carico il grafico
window.onload = () => {
  aggiornaPrezzo();
  caricaGrafico();
};
