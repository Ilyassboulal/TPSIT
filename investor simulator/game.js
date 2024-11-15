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
