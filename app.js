// Application Data
const appData = {
  popularStocks: [
    {"symbol": "RELIANCE.NS", "name": "Reliance Industries Ltd", "price": 2485.50, "change": 1.2, "volume": 12500000},
    {"symbol": "TCS.NS", "name": "Tata Consultancy Services", "price": 3654.75, "change": -0.8, "volume": 3200000},
    {"symbol": "INFY.NS", "name": "Infosys Limited", "price": 1456.30, "change": 2.1, "volume": 8500000},
    {"symbol": "HDFCBANK.NS", "name": "HDFC Bank Limited", "price": 1643.80, "change": 0.5, "volume": 15600000},
    {"symbol": "ITC.NS", "name": "ITC Limited", "price": 412.25, "change": -1.5, "volume": 18900000},
    {"symbol": "SBIN.NS", "name": "State Bank of India", "price": 587.90, "change": 3.2, "volume": 22300000},
    {"symbol": "BHARTIARTL.NS", "name": "Bharti Airtel Limited", "price": 896.45, "change": 0.9, "volume": 9800000},
    {"symbol": "HINDUNILVR.NS", "name": "Hindustan Unilever Ltd", "price": 2234.15, "change": -0.3, "volume": 4200000},
    {"symbol": "MARUTI.NS", "name": "Maruti Suzuki India Ltd", "price": 10567.30, "change": 1.8, "volume": 1800000},
    {"symbol": "WIPRO.NS", "name": "Wipro Limited", "price": 442.60, "change": -2.1, "volume": 12100000}
  ],
  marketIndices: [
    {"name": "NIFTY 50", "value": 19389.70, "change": 0.85, "symbol": "^NSEI"},
    {"name": "SENSEX", "value": 65344.20, "change": 0.72, "symbol": "^BSESN"},
    {"name": "NIFTY BANK", "value": 44256.35, "change": 1.12, "symbol": "^NSEBANK"}
  ],
  predictionModels: [
    {"name": "LSTM Neural Network", "accuracy": "87.3%", "description": "Deep learning model for time series prediction"},
    {"name": "Random Forest", "accuracy": "82.1%", "description": "Ensemble learning method using decision trees"},
    {"name": "XGBoost", "accuracy": "84.7%", "description": "Gradient boosting framework for regression"},
    {"name": "Support Vector Regression", "accuracy": "79.5%", "description": "Regression analysis using support vector machines"}
  ],
  technicalIndicators: {
    RSI: 64.2,
    MACD: {"signal": "BUY", "value": 12.34},
    Moving_Averages: {
      SMA_20: 2456.78,
      SMA_50: 2398.45,
      SMA_200: 2234.12
    },
    Bollinger_Bands: {
      upper: 2567.89,
      middle: 2485.50,
      lower: 2403.11
    }
  },
  marketNews: [
    {"title": "RBI maintains repo rate at 6.5%, focuses on inflation control", "time": "2 hours ago", "sentiment": "neutral"},
    {"title": "IT stocks rally on strong Q2 results, TCS leads gains", "time": "4 hours ago", "sentiment": "positive"},
    {"title": "FII inflows continue for third consecutive week", "time": "6 hours ago", "sentiment": "positive"},
    {"title": "Oil marketing companies under pressure due to crude price volatility", "time": "8 hours ago", "sentiment": "negative"}
  ]
};

// Global variables
let currentChart = null;
let selectedStock = null;
let selectedPredictionStock = null;
let currentTimeframe = '1M';

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing application...');
  initializeNavigation();
  populateDashboard();
  initializeStockSearch();
  initializePredictionControls();
  initializePortfolio();
  
  // Start real-time updates after a short delay
  setTimeout(startRealTimeUpdates, 2000);
});

// Navigation functionality
function initializeNavigation() {
  console.log('Initializing navigation...');
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.content-section');

  console.log('Found nav items:', navItems.length);
  console.log('Found sections:', sections.length);

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSection = item.getAttribute('data-section');
      console.log('Navigating to section:', targetSection);

      // Update active nav item
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      // Show target section
      sections.forEach(section => section.classList.remove('active'));
      const targetElement = document.getElementById(targetSection);
      if (targetElement) {
        targetElement.classList.add('active');
        console.log('Successfully navigated to:', targetSection);
      } else {
        console.error('Target section not found:', targetSection);
      }
    });
  });
}

// Populate dashboard data
function populateDashboard() {
  console.log('Populating dashboard...');
  populateStocksGrid();
  populateNewsList();
  updateMarketIndices();
}

function populateStocksGrid() {
  const stocksGrid = document.getElementById('stocks-grid');
  if (!stocksGrid) {
    console.error('Stocks grid not found');
    return;
  }
  
  stocksGrid.innerHTML = '';

  appData.popularStocks.forEach(stock => {
    const stockCard = createStockCard(stock);
    stocksGrid.appendChild(stockCard);
  });
  console.log('Populated stocks grid with', appData.popularStocks.length, 'stocks');
}

function createStockCard(stock) {
  const card = document.createElement('div');
  card.className = 'stock-card';
  
  // Add click handler for stock selection
  card.addEventListener('click', () => {
    console.log('Stock card clicked:', stock.symbol);
    selectStock(stock);
  });

  const changeClass = stock.change >= 0 ? 'positive' : 'negative';
  const changeSymbol = stock.change >= 0 ? '+' : '';

  card.innerHTML = `
    <div class="stock-info">
      <div>
        <div class="stock-name">${stock.name}</div>
        <div class="stock-symbol">${stock.symbol}</div>
      </div>
      <div class="stock-price">
        <div class="price-value">₹${stock.price.toFixed(2)}</div>
        <div class="price-change ${changeClass}">${changeSymbol}${stock.change}%</div>
      </div>
    </div>
  `;

  return card;
}

function populateNewsList() {
  const newsList = document.getElementById('news-list');
  if (!newsList) {
    console.error('News list not found');
    return;
  }
  
  newsList.innerHTML = '';

  appData.marketNews.forEach(news => {
    const newsItem = document.createElement('div');
    newsItem.className = 'news-item';

    newsItem.innerHTML = `
      <div class="news-title">${news.title}</div>
      <div class="news-meta">
        <span class="news-time">${news.time}</span>
        <span class="news-sentiment ${news.sentiment}">${news.sentiment}</span>
      </div>
    `;

    newsList.appendChild(newsItem);
  });
  console.log('Populated news list with', appData.marketNews.length, 'items');
}

// Stock search and selection
function initializeStockSearch() {
  console.log('Initializing stock search...');
  const searchInput = document.getElementById('stock-search');
  const popularSelect = document.getElementById('popular-stocks');

  if (!searchInput || !popularSelect) {
    console.error('Search elements not found');
    return;
  }

  // Populate popular stocks dropdown
  appData.popularStocks.forEach(stock => {
    const option = document.createElement('option');
    option.value = stock.symbol;
    option.textContent = `${stock.symbol} - ${stock.name}`;
    popularSelect.appendChild(option);
  });

  // Search input functionality
  searchInput.addEventListener('input', handleStockSearch);
  searchInput.addEventListener('focus', () => {
    console.log('Search input focused');
  });

  popularSelect.addEventListener('change', handlePopularStockSelect);

  // Initialize chart controls
  initializeChartControls();
  console.log('Stock search initialized successfully');
}

function handleStockSearch(e) {
  const query = e.target.value.toLowerCase();
  console.log('Search query:', query);
  
  if (query.length >= 2) {
    const matchingStock = appData.popularStocks.find(stock => 
      stock.symbol.toLowerCase().includes(query) || 
      stock.name.toLowerCase().includes(query)
    );
    if (matchingStock) {
      console.log('Found matching stock:', matchingStock.symbol);
      selectStock(matchingStock);
    }
  }
}

function handlePopularStockSelect(e) {
  const symbol = e.target.value;
  console.log('Popular stock selected:', symbol);
  
  if (symbol) {
    const stock = appData.popularStocks.find(s => s.symbol === symbol);
    if (stock) {
      selectStock(stock);
    }
  }
}

function selectStock(stock) {
  console.log('Selecting stock:', stock.symbol);
  selectedStock = stock;
  
  displaySelectedStock(stock);
  updateStockChart(stock);
  updateTechnicalIndicators(stock);
  
  // Switch to analysis section
  navigateToSection('analysis');
}

function navigateToSection(sectionName) {
  const navItem = document.querySelector(`[data-section="${sectionName}"]`);
  if (navItem) {
    console.log('Programmatically navigating to:', sectionName);
    navItem.click();
  } else {
    console.error('Navigation item not found for section:', sectionName);
  }
}

function displaySelectedStock(stock) {
  const stockInfo = document.getElementById('selected-stock-info');
  if (!stockInfo) {
    console.error('Selected stock info element not found');
    return;
  }
  
  stockInfo.classList.add('visible');

  const changeClass = stock.change >= 0 ? 'positive' : 'negative';
  const changeSymbol = stock.change >= 0 ? '+' : '';

  stockInfo.innerHTML = `
    <div class="stock-header">
      <div class="stock-title">
        <h3>${stock.name}</h3>
        <div class="stock-exchange">${stock.symbol}</div>
      </div>
      <div class="stock-current-price">
        <div class="current-price">₹${stock.price.toFixed(2)}</div>
        <div class="price-change ${changeClass}">${changeSymbol}${stock.change}%</div>
      </div>
    </div>
    <div class="stock-details">
      <div class="detail-item">
        <span>Volume:</span>
        <span>${formatVolume(stock.volume)}</span>
      </div>
      <div class="detail-item">
        <span>Market Cap:</span>
        <span>₹${(stock.price * 1000000000 / 1000000).toFixed(0)}M</span>
      </div>
    </div>
  `;
  console.log('Displayed selected stock info for:', stock.symbol);
}

function formatVolume(volume) {
  if (volume >= 10000000) {
    return (volume / 10000000).toFixed(1) + 'Cr';
  } else if (volume >= 100000) {
    return (volume / 100000).toFixed(1) + 'L';
  } else {
    return volume.toLocaleString();
  }
}

// Chart functionality
function initializeChartControls() {
  const timeframeButtons = document.querySelectorAll('.timeframe-buttons .btn');
  const chartTypeButtons = document.querySelectorAll('.chart-type-buttons .btn');

  console.log('Found timeframe buttons:', timeframeButtons.length);
  console.log('Found chart type buttons:', chartTypeButtons.length);

  timeframeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      timeframeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTimeframe = btn.getAttribute('data-period');
      console.log('Timeframe changed to:', currentTimeframe);
      
      if (selectedStock) {
        updateStockChart(selectedStock);
      }
    });
  });

  chartTypeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      chartTypeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      console.log('Chart type changed to:', btn.getAttribute('data-type'));
      
      if (selectedStock) {
        updateStockChart(selectedStock);
      }
    });
  });
}

function updateStockChart(stock) {
  const canvas = document.getElementById('stock-chart');
  if (!canvas) {
    console.error('Stock chart canvas not found');
    return;
  }
  
  const ctx = canvas.getContext('2d');
  
  if (currentChart) {
    currentChart.destroy();
  }

  const chartData = generateChartData(stock, currentTimeframe);
  console.log('Generating chart for:', stock.symbol, 'timeframe:', currentTimeframe);
  
  currentChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartData.labels,
      datasets: [{
        label: `${stock.symbol} Price`,
        data: chartData.prices,
        borderColor: '#32B4CD',
        backgroundColor: 'rgba(50, 180, 205, 0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index'
      },
      plugins: {
        legend: {
          labels: {
            color: '#f5f5f5'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#a7a9a9'
          },
          grid: {
            color: 'rgba(167, 169, 169, 0.1)'
          }
        },
        y: {
          ticks: {
            color: '#a7a9a9',
            callback: function(value) {
              return '₹' + value.toFixed(2);
            }
          },
          grid: {
            color: 'rgba(167, 169, 169, 0.1)'
          }
        }
      }
    }
  });
  console.log('Chart updated successfully');
}

function generateChartData(stock, timeframe) {
  const periods = {
    '1D': 24,
    '5D': 120,
    '1M': 30,
    '3M': 90,
    '6M': 180,
    '1Y': 365
  };

  const dataPoints = periods[timeframe] || 30;
  const labels = [];
  const prices = [];
  
  const basePrice = stock.price;
  let currentPrice = basePrice * (1 - stock.change / 100);

  for (let i = dataPoints; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    labels.push(date.toLocaleDateString());
    
    // Generate realistic price movement
    const volatility = 0.02; // 2% daily volatility
    const randomChange = (Math.random() - 0.5) * volatility;
    currentPrice *= (1 + randomChange);
    prices.push(Math.max(0, currentPrice));
  }

  // Ensure the last price matches current stock price
  prices[prices.length - 1] = basePrice;

  return { labels, prices };
}

function updateTechnicalIndicators(stock) {
  const indicatorsGrid = document.getElementById('indicators-grid');
  if (!indicatorsGrid) {
    console.error('Indicators grid not found');
    return;
  }
  
  indicatorsGrid.innerHTML = '';

  const indicators = [
    { name: 'RSI (14)', value: appData.technicalIndicators.RSI.toFixed(1), signal: getRSISignal(appData.technicalIndicators.RSI) },
    { name: 'MACD', value: appData.technicalIndicators.MACD.value.toFixed(2), signal: appData.technicalIndicators.MACD.signal.toLowerCase() },
    { name: 'SMA 20', value: '₹' + appData.technicalIndicators.Moving_Averages.SMA_20.toFixed(2), signal: getSMASignal(stock.price, appData.technicalIndicators.Moving_Averages.SMA_20) },
    { name: 'SMA 50', value: '₹' + appData.technicalIndicators.Moving_Averages.SMA_50.toFixed(2), signal: getSMASignal(stock.price, appData.technicalIndicators.Moving_Averages.SMA_50) },
    { name: 'Bollinger Upper', value: '₹' + appData.technicalIndicators.Bollinger_Bands.upper.toFixed(2), signal: 'resistance' },
    { name: 'Bollinger Lower', value: '₹' + appData.technicalIndicators.Bollinger_Bands.lower.toFixed(2), signal: 'support' }
  ];

  indicators.forEach(indicator => {
    const card = document.createElement('div');
    card.className = 'indicator-card';
    card.innerHTML = `
      <div class="indicator-name">${indicator.name}</div>
      <div class="indicator-value">${indicator.value}</div>
      <div class="indicator-signal ${indicator.signal}">${indicator.signal}</div>
    `;
    indicatorsGrid.appendChild(card);
  });
  console.log('Updated technical indicators');
}

function getRSISignal(rsi) {
  if (rsi > 70) return 'sell';
  if (rsi < 30) return 'buy';
  return 'hold';
}

function getSMASignal(price, sma) {
  if (price > sma * 1.02) return 'buy';
  if (price < sma * 0.98) return 'sell';
  return 'hold';
}

// Prediction functionality
function initializePredictionControls() {
  console.log('Initializing prediction controls...');
  
  // Populate prediction stock selector
  const predictionStockSelect = document.getElementById('prediction-stock-select');
  if (predictionStockSelect) {
    appData.popularStocks.forEach(stock => {
      const option = document.createElement('option');
      option.value = stock.symbol;
      option.textContent = `${stock.symbol} - ${stock.name}`;
      predictionStockSelect.appendChild(option);
    });

    predictionStockSelect.addEventListener('change', (e) => {
      const symbol = e.target.value;
      if (symbol) {
        selectedPredictionStock = appData.popularStocks.find(s => s.symbol === symbol);
        console.log('Prediction stock selected:', selectedPredictionStock?.symbol);
      }
    });
  }
  
  const predictBtn = document.getElementById('predict-btn');
  if (!predictBtn) {
    console.error('Predict button not found');
    return;
  }
  
  predictBtn.addEventListener('click', handlePrediction);

  // Modal close functionality
  const modalClose = document.getElementById('modal-close');
  const modal = document.getElementById('prediction-modal');
  
  if (modalClose && modal) {
    modalClose.addEventListener('click', () => {
      modal.classList.add('hidden');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });
  }
  console.log('Prediction controls initialized');
}

function handlePrediction() {
  console.log('Handling prediction request...');
  
  const stockToPredict = selectedPredictionStock || selectedStock;
  
  if (!stockToPredict) {
    alert('Please select a stock for prediction from the dropdown above');
    return;
  }

  const horizonSelect = document.getElementById('prediction-horizon');
  const modelSelect = document.getElementById('ml-model');
  
  if (!horizonSelect || !modelSelect) {
    console.error('Prediction form elements not found');
    return;
  }

  const horizon = horizonSelect.value;
  const model = modelSelect.value;
  
  console.log('Prediction parameters:', { stock: stockToPredict.symbol, horizon, model });

  showPredictionLoading();
  
  // Simulate ML prediction process
  setTimeout(() => {
    const prediction = generatePrediction(stockToPredict, horizon, model);
    displayPredictionResults(prediction, stockToPredict, horizon, model);
    showModelPerformance(model);
  }, 3000);
}

function showPredictionLoading() {
  const loading = document.getElementById('prediction-loading');
  const output = document.getElementById('prediction-output');
  const performance = document.getElementById('model-performance');

  if (loading) loading.classList.add('show');
  if (output) output.classList.remove('show');
  if (performance) performance.classList.remove('show');
  
  console.log('Showing prediction loading...');
}

function generatePrediction(stock, horizon, model) {
  const modelAccuracy = {
    'lstm': 0.873,
    'rf': 0.821,
    'xgb': 0.847,
    'svr': 0.795
  };

  const accuracy = modelAccuracy[model] || 0.8;
  const volatility = 0.02 * Math.sqrt(horizon / 7); // Volatility increases with time
  
  // Generate prediction with some randomness based on current trend
  const trend = stock.change > 0 ? 0.001 : -0.001; // Slight trend based on current movement
  const randomFactor = (Math.random() - 0.5) * volatility;
  const predictedPrice = stock.price * (1 + trend * horizon + randomFactor);

  const confidence = accuracy * (1 - volatility / 2); // Confidence decreases with volatility
  const confidenceInterval = predictedPrice * volatility;

  return {
    predictedPrice: Math.max(0, predictedPrice),
    confidence: confidence * 100,
    lowerBound: Math.max(0, predictedPrice - confidenceInterval),
    upperBound: predictedPrice + confidenceInterval,
    recommendation: getRecommendation(stock.price, predictedPrice),
    accuracy: accuracy * 100
  };
}

function getRecommendation(currentPrice, predictedPrice) {
  const change = (predictedPrice - currentPrice) / currentPrice;
  if (change > 0.05) return { action: 'BUY', class: 'buy' };
  if (change < -0.05) return { action: 'SELL', class: 'sell' };
  return { action: 'HOLD', class: 'hold' };
}

function displayPredictionResults(prediction, stock, horizon, model) {
  const loading = document.getElementById('prediction-loading');
  const output = document.getElementById('prediction-output');
  
  if (loading) loading.classList.remove('show');
  if (output) output.classList.add('show');

  const modelNames = {
    'lstm': 'LSTM Neural Network',
    'rf': 'Random Forest',
    'xgb': 'XGBoost',
    'svr': 'Support Vector Regression'
  };

  if (output) {
    output.innerHTML = `
      <div class="prediction-header">
        <div>
          <h4>${stock.symbol} - ${horizon} Day Prediction</h4>
          <p>Model: ${modelNames[model]}</p>
        </div>
        <div class="predicted-price">₹${prediction.predictedPrice.toFixed(2)}</div>
      </div>
      
      <div class="prediction-details">
        <div class="prediction-metric">
          <h5>Confidence</h5>
          <div class="value">${prediction.confidence.toFixed(1)}%</div>
        </div>
        <div class="prediction-metric">
          <h5>Lower Bound</h5>
          <div class="value">₹${prediction.lowerBound.toFixed(2)}</div>
        </div>
        <div class="prediction-metric">
          <h5>Upper Bound</h5>
          <div class="value">₹${prediction.upperBound.toFixed(2)}</div>
        </div>
        <div class="prediction-metric">
          <h5>Recommendation</h5>
          <div class="prediction-recommendation ${prediction.recommendation.class}">${prediction.recommendation.action}</div>
        </div>
      </div>
    `;
  }
  
  console.log('Prediction results displayed');
}

function showModelPerformance(model) {
  const performance = document.getElementById('model-performance');
  if (!performance) {
    console.error('Model performance element not found');
    return;
  }
  
  performance.classList.add('show');

  const metrics = generateModelMetrics(model);
  const metricsGrid = performance.querySelector('.metrics-grid');

  if (metricsGrid) {
    metricsGrid.innerHTML = '';
    Object.entries(metrics).forEach(([key, value]) => {
      const metricCard = document.createElement('div');
      metricCard.className = 'metric-card';
      metricCard.innerHTML = `
        <div class="metric-label">${key}</div>
        <div class="metric-value">${value}</div>
      `;
      metricsGrid.appendChild(metricCard);
    });
  }
  
  console.log('Model performance displayed');
}

function generateModelMetrics(model) {
  const baseMetrics = {
    'lstm': { 'Accuracy': '87.3%', 'RMSE': '2.45', 'MAE': '1.89', 'R²': '0.891' },
    'rf': { 'Accuracy': '82.1%', 'RMSE': '3.12', 'MAE': '2.34', 'R²': '0.823' },
    'xgb': { 'Accuracy': '84.7%', 'RMSE': '2.78', 'MAE': '2.01', 'R²': '0.856' },
    'svr': { 'Accuracy': '79.5%', 'RMSE': '3.45', 'MAE': '2.67', 'R²': '0.798' }
  };

  return baseMetrics[model] || baseMetrics['lstm'];
}

// Portfolio functionality
function initializePortfolio() {
  console.log('Initializing portfolio...');
  populateWatchlist();
}

function populateWatchlist() {
  const watchlistTable = document.getElementById('watchlist-table');
  if (!watchlistTable) {
    console.error('Watchlist table not found');
    return;
  }
  
  const watchlistStocks = appData.popularStocks.slice(0, 5); // Show first 5 stocks in watchlist
  
  watchlistTable.innerHTML = `
    <div class="table-header">
      <div>Symbol</div>
      <div>Price</div>
      <div>Change</div>
      <div>Volume</div>
      <div>Action</div>
    </div>
  `;

  watchlistStocks.forEach(stock => {
    const row = document.createElement('div');
    row.className = 'table-row';
    
    const changeClass = stock.change >= 0 ? 'positive' : 'negative';
    const changeSymbol = stock.change >= 0 ? '+' : '';

    row.innerHTML = `
      <div>
        <div class="stock-name" style="font-weight: 500;">${stock.symbol}</div>
        <div style="font-size: 12px; color: var(--color-text-secondary);">${stock.name}</div>
      </div>
      <div>₹${stock.price.toFixed(2)}</div>
      <div class="${changeClass}">${changeSymbol}${stock.change}%</div>
      <div>${formatVolume(stock.volume)}</div>
      <div>
        <button class="btn btn--sm btn--primary" onclick="selectStockFromWatchlist('${stock.symbol}')">Analyze</button>
      </div>
    `;

    watchlistTable.appendChild(row);
  });
  
  console.log('Populated watchlist with', watchlistStocks.length, 'stocks');
}

// Global function for watchlist button clicks
function selectStockFromWatchlist(symbol) {
  const stock = appData.popularStocks.find(s => s.symbol === symbol);
  if (stock) {
    console.log('Selecting stock from watchlist:', symbol);
    selectStock(stock);
  }
}

// Utility functions
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
}

// Real-time data simulation
function startRealTimeUpdates() {
  console.log('Starting real-time updates...');
  
  setInterval(() => {
    // Simulate real-time price updates
    appData.popularStocks.forEach(stock => {
      const volatility = 0.001; // 0.1% per update
      const randomChange = (Math.random() - 0.5) * volatility;
      const newPrice = stock.price * (1 + randomChange);
      const priceChange = ((newPrice - stock.price) / stock.price) * 100;
      
      stock.price = Math.max(0, newPrice);
      stock.change = priceChange;
    });

    // Update market indices
    appData.marketIndices.forEach(index => {
      const volatility = 0.0005;
      const randomChange = (Math.random() - 0.5) * volatility;
      const newValue = index.value * (1 + randomChange);
      const change = ((newValue - index.value) / index.value) * 100;
      
      index.value = Math.max(0, newValue);
      index.change = change;
    });

    // Update displays if dashboard is active
    const dashboardSection = document.getElementById('dashboard');
    if (dashboardSection && dashboardSection.classList.contains('active')) {
      populateStocksGrid();
      updateMarketIndices();
    }

    // Update selected stock if in analysis
    if (selectedStock) {
      const updatedStock = appData.popularStocks.find(s => s.symbol === selectedStock.symbol);
      if (updatedStock) {
        selectedStock = updatedStock;
        displaySelectedStock(selectedStock);
      }
    }
  }, 5000); // Update every 5 seconds
}

function updateMarketIndices() {
  const indexCards = [
    { id: 'nifty-card', index: appData.marketIndices[0] },
    { id: 'sensex-card', index: appData.marketIndices[1] },
    { id: 'banknifty-card', index: appData.marketIndices[2] }
  ];

  indexCards.forEach(({ id, index }) => {
    const card = document.getElementById(id);
    if (card) {
      const valueElement = card.querySelector('.index-value');
      const changeElement = card.querySelector('.index-change');
      
      if (valueElement && changeElement) {
        valueElement.textContent = index.value.toLocaleString('en-IN', { 
          minimumFractionDigits: 2,
          maximumFractionDigits: 2 
        });
        
        const changeClass = index.change >= 0 ? 'positive' : 'negative';
        const changeSymbol = index.change >= 0 ? '+' : '';
        
        changeElement.textContent = `${changeSymbol}${index.change.toFixed(2)}%`;
        changeElement.className = `index-change ${changeClass}`;
      }
    }
  });
}

// Handle window resize for responsive charts
window.addEventListener('resize', function() {
  if (currentChart) {
    currentChart.resize();
  }
});

// Make functions available globally
window.selectStockFromWatchlist = selectStockFromWatchlist;