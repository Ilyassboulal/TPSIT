
// Import Chart.js library
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
document.head.appendChild(script);

// Initialize the theme
const themeToggleButton = document.getElementById('toggle-theme');
themeToggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Initialize Chart.js after loading
script.onload = () => {
    const ctx = document.getElementById('price-chart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["Petrolio", "Tech", "Bitcoin", "Ethereum", "Oro", "Immobili"],
            datasets: [{
                label: 'Prezzi Attuali',
                data: [prices.oil, prices.tech, prices.bitcoin, prices.ethereum, prices.gold, prices["real-estate"]],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Update the chart on price change
    setInterval(() => {
        chart.data.datasets[0].data = [prices.oil, prices.tech, prices.bitcoin, prices.ethereum, prices.gold, prices["real-estate"]];
        chart.update();
    }, 7000);
};
let cash = 1000;
let portfolio = { oil: 0, tech: 0, bitcoin: 0, ethereum: 0, gold: 0, "real-estate": 0 };
let prices = { oil: 50, tech: 100, bitcoin: 20000, ethereum: 1500, gold: 1500, "real-estate": 500000 };
let playerName = "Giocatore";

// Funzione per aggiornare l'interfaccia utente
function updateUI() {
  document.getElementById('cash').textContent = cash;
  document.getElementById('portfolio').textContent = calculatePortfolioValue();
  document.getElementById('oil-price').textContent = prices.oil;
  document.getElementById('tech-price').textContent = prices.tech;
  document.getElementById('bitcoin-price').textContent = prices.bitcoin;
  document.getElementById('ethereum-price').textContent = prices.ethereum;
  document.getElementById('gold-price').textContent = prices.gold;
  document.getElementById('real-estate-price').textContent = prices["real-estate"];
  updateAssetList();
}

// Funzione per aggiornare il nome del giocatore
function updatePlayerName() {
  playerName = document.getElementById('name').value || "Giocatore";
  document.getElementById('player-greeting').textContent = `Benvenuto, ${playerName}!`;
}

// Funzione per aggiornare la lista degli asset
function updateAssetList() {
  const assetsList = document.getElementById('assets-list');
  assetsList.innerHTML = ""; // Svuota la lista

  // Mostra tutti gli asset posseduti dal giocatore
  for (let asset in portfolio) {
    if (portfolio[asset] > 0) {
      const listItem = document.createElement('li');
      listItem.textContent = `${capitalize(asset)}: ${portfolio[asset]} unità - Valore: €${portfolio[asset] * prices[asset]}`;
      assetsList.appendChild(listItem);
    }
  }
}

// Funzione per capitalizzare i nomi degli asset
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).replace('-', ' ');
}

// Funzione per calcolare il valore totale del portafoglio
function calculatePortfolioValue() {
  return portfolio.oil * prices.oil + portfolio.tech * prices.tech +
         portfolio.bitcoin * prices.bitcoin + portfolio.ethereum * prices.ethereum +
         portfolio.gold * prices.gold + portfolio["real-estate"] * prices["real-estate"];
}

// Funzione di acquisto
function buy(asset) {
  if (cash >= prices[asset]) {
    cash -= prices[asset];
    portfolio[asset]++;
    logEvent(`Acquistato 1 unità di ${asset}.`);
    updateUI();
  } else {
    logEvent("Non hai abbastanza denaro!");
  }
}

// Funzione di vendita
function sell(asset) {
  if (portfolio[asset] > 0) {
    cash += prices[asset];
    portfolio[asset]--;
    logEvent(`Venduto 1 unità di ${asset}.`);
    updateUI();
  } else {
    logEvent(`Non possiedi alcuna unità di ${asset} da vendere.`);
  }
}

// Funzione di vendita di tutte le unità di un asset
function sellAll(asset) {
  if (portfolio[asset] > 0) {
    cash += prices[asset] * portfolio[asset];
    portfolio[asset] = 0;
    logEvent(`Venduto tutte le unità di ${asset}.`);
    updateUI();
  } else {
    logEvent(`Non possiedi alcuna unità di ${asset} da vendere.`);
  }
}

// Funzione per registrare gli eventi di mercato
function logEvent(message) {
  const eventLog = document.getElementById('event-log');
  eventLog.textContent = message;
}

// Funzione per simulare eventi di mercato
function marketEvent() {
  const events = [
    {
      message: "Il governo degli Stati Uniti annuncia l'acquisto di Bitcoin, facendo schizzare il suo valore!",
      change: { bitcoin: 1000, tech: -10 }
    },
    {
      message: "Una crisi economica globale porta ad una diminuzione del valore delle azioni tech.",
      change: { tech: -50, oil: 20 }
    },
    {
      message: "Una scoperta scientifica rivoluzionaria aumenta il valore del petrolio.",
      change: { oil: 30 }
    },
    {
      message: "L'oro viene riconosciuto come una risorsa scarsa, il suo valore cresce vertiginosamente.",
      change: { gold: 100 }
    },
    {
      message: "Un boom immobiliare fa crescere vertiginosamente il valore degli immobili.",
      change: { "real-estate": 50000 }
    },
    {
      message: "Ethereum subisce una grande innovazione e il suo valore sale enormemente.",
      change: { ethereum: 300 }
    }
  ];

  // Selezione un evento casuale
  const randomEvent = events[Math.floor(Math.random() * events.length)];

  // Modifica i prezzi degli asset in base all'evento
  for (let asset in randomEvent.change) {
    prices[asset] += randomEvent.change[asset];
    prices[asset] = Math.max(prices[asset], 0); // Evita valori negativi
  }

  logEvent(randomEvent.message);
  updateUI();
}

// Inizia gli eventi di mercato
setInterval(marketEvent, 7000); // Ogni 7 secondi

// Aggiorna l'interfaccia utente iniziale
updateUI();

// New functionality: Dynamic pricing and rewards
let profit = 0;
let level = 1;
const REWARD_INTERVAL = 500; // Reward every 500 profit
const LEVEL_INTERVAL = 1000; // Level up every 1000 profit

// Function to handle rewards
function checkRewards() {
    if (profit >= level * LEVEL_INTERVAL) {
        level++;
        logEvent(`🎉 Complimenti! Sei salito al livello ${level}. Continua così!`);
    }
    if (profit % REWARD_INTERVAL === 0) {
        const reward = Math.floor(Math.random() * 100) + 50; // Random reward between 50 and 150
        cash += reward;
        logEvent(`💎 Hai guadagnato un premio di €${reward}!`);
    }
}

// Extended market events
const extendedEvents = [
    { message: "Una nuova tecnologia rivoluzionaria fa decollare le azioni tech!", change: { tech: 150 } },
    { message: "Un disastro naturale fa crollare il prezzo del petrolio.", change: { oil: -20 } },
    { message: "Bitcoin accettato come valuta ufficiale in un nuovo paese!", change: { bitcoin: 5000 } },
    { message: "L'oro viene considerato una risorsa in eccesso, prezzo in calo.", change: { gold: -30 } },
    { message: "Il valore immobiliare cresce grazie a una domanda enorme.", change: { "real-estate": 100000 } },
    { message: "Ethereum lancia una nuova versione, il prezzo aumenta.", change: { ethereum: 200 } },
    { message: "Un attacco hacker fa crollare il valore di Bitcoin!", change: { bitcoin: -3000 } },
    { message: "Nuova scoperta di petrolio, il prezzo cala leggermente.", change: { oil: -10 } },
    { message: "Una pandemia globale rallenta la crescita economica generale.", change: { tech: -50, bitcoin: -2000, oil: -15 } },
    { message: "Politiche fiscali favorevoli aumentano il valore degli immobili.", change: { "real-estate": 70000 } },
    { message: "Scandalo in un'azienda tech, le azioni crollano.", change: { tech: -80 } },
    { message: "Il petrolio viene riconosciuto come risorsa chiave, il prezzo cresce.", change: { oil: 25 } },
    { message: "Bitcoin raggiunge un nuovo massimo storico!", change: { bitcoin: 10000 } },
    { message: "Ethereum è colpito da problemi tecnici, il valore scende.", change: { ethereum: -100 } },
    { message: "Un nuovo materiale rende l'oro meno richiesto.", change: { gold: -50 } },
    { message: "Il mercato tech vive una rinascita spettacolare.", change: { tech: 200 } },
    { message: "Crisi geopolitica: immobili in forte calo.", change: { "real-estate": -150000 } },
    { message: "Un programma governativo aumenta il valore del petrolio.", change: { oil: 40 } },
    { message: "La comunità scientifica apprezza Ethereum, il valore aumenta.", change: { ethereum: 300 } },
    { message: "Bitcoin dimezzato, molti lo considerano una risorsa limitata!", change: { bitcoin: 8000 } }
];

// Override marketEvent function to use extended events
function marketEvent() {
    const randomEvent = extendedEvents[Math.floor(Math.random() * extendedEvents.length)];
    for (let asset in randomEvent.change) {
        prices[asset] += randomEvent.change[asset];
        prices[asset] = Math.max(prices[asset], 1); // Prevent prices from hitting 0
    }
    logEvent(randomEvent.message);
    updateUI();
}

// Adjusted buy and sell functions to track profit and handle rewards
function buy(asset) {
    if (cash >= prices[asset]) {
        cash -= prices[asset];
        portfolio[asset]++;
        profit -= prices[asset];
        logEvent(`Acquistato 1 unità di ${asset}.`);
        checkRewards();
        updateUI();
    } else {
        logEvent("Non hai abbastanza denaro!");
    }
}

function sell(asset) {
    if (portfolio[asset] > 0) {
        cash += prices[asset];
        portfolio[asset]--;
        profit += prices[asset];
        logEvent(`Venduto 1 unità di ${asset}.`);
        checkRewards();
        updateUI();
    } else {
        logEvent(`Non possiedi alcuna unità di ${asset} da vendere.`);
    }
}

// Enhance UI on load
updateUI();
