// Se bitcoinjs-lib è stato caricato da <script>, lo troviamo in window.bitcoinjs
// (verifica nel tuo browser console log se si chiama "bitcoinjs" o "bitcoin" a seconda della versione)
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

    // Estraggo date e prezzi
    const labels = data.prices.map((p) =>
      new Date(p[0]).toLocaleDateString()
    );
    const prezzi = data.prices.map((p) => p[1]);

    const ctx = document.getElementById("btcChart").getContext("2d");

    // Se esiste già un grafico, lo distruggo per evitare conflitti
    if (window.myChart) {
      window.myChart.destroy();
    }

    // Creo il nuovo grafico
    window.myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Prezzo Bitcoin (Ultimi 7 Giorni)",
            data: prezzi,
            borderColor: "orange", // Puoi cambiare o rimuovere se preferisci
            borderWidth: 2,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
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

// All'avvio della pagina, aggiorno il prezzo e carico il grafico
window.onload = () => {
  aggiornaPrezzo();
  caricaGrafico();
};
