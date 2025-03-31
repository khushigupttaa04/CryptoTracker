const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

function CryptoTracker() {
    const [cryptos, setCryptos] = React.useState([]);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [darkMode, setDarkMode] = React.useState(false);
    const [watchList, setWatchList] = React.useState(new Set());
    const chartRef = React.useRef(null);

    React.useEffect(() => {
        async function fetchCryptos() {
            try {
                const response = await fetch(`${COINGECKO_API_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100`);
                const data = await response.json();
                setCryptos(data);
            } catch (error) {
                console.error("Failed to fetch cryptos:", error);
            }
        }
        fetchCryptos();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.body.classList.toggle('dark-mode', !darkMode);
    };

    const filteredCryptos = cryptos.filter(crypto =>
        crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleWatchList = (cryptoId) => {
        const newWatchList = new Set(watchList);
        if (newWatchList.has(cryptoId)) {
            newWatchList.delete(cryptoId);
        } else {
            newWatchList.add(cryptoId);
        }
        setWatchList(newWatchList);
    };

    const renderChart = (prices) => {
        const ctx = document.getElementById('priceChart');
        if (!ctx) return;

        if (chartRef.current) {
          chartRef.current.destroy();
        }
        chartRef.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: prices.map((_, index) => `Day ${index + 1}`).reverse(),
                datasets: [{
                    label: 'Price',
                    data: prices.reverse(),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    const showPriceHistory = async (cryptoId) => {
      try {
        const response = await fetch(`${COINGECKO_API_URL}/coins/${cryptoId}/market_chart?vs_currency=usd&days=7`);
        const data = await response.json();
        const prices = data.prices.map(item => item[1]);
        renderChart(prices);

      } catch(error){
         console.error("Failed to fetch price history",error)
      }

    }

    return (
        <div className={darkMode ? 'dark-mode' : ''}>
            <div className="container">
                <h1>CryptoTracker</h1>

                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search Cryptocurrencies"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <button onClick={toggleDarkMode}>Toggle Dark Mode</button>
                </div>

                <div className="crypto-list">
                    {filteredCryptos.map(crypto => (
                        <div key={crypto.id} className="crypto-card">
                            <h2>{crypto.name} ({crypto.symbol.toUpperCase()})</h2>
                            <p>Price: ${crypto.current_price}</p>
                            <p>Market Cap: ${crypto.market_cap}</p>
                            <p>Volume: ${crypto.total_volume}</p>
                            <button
                              className={`watchlist-button ${watchList.has(crypto.id) ? 'active' : ''}`}
                              onClick={() => toggleWatchList(crypto.id)}
                            >
                              {watchList.has(crypto.id) ? 'Remove from Watchlist' : 'Add to Watchlist'}
                            </button>
                            <button onClick={() => showPriceHistory(crypto.id)}>View Price History</button>
                        </div>
                    ))}
                </div>
                <div className="chart-container">
                  <canvas id="priceChart"></canvas>
                </div>
            </div>
        </div>
    );
}

ReactDOM.render(<CryptoTracker />, document.getElementById('root'));
