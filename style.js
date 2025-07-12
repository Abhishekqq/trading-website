document.addEventListener("DOMContentLoaded", function () {
    const counters = document.querySelectorAll('.highlight-number');
    counters.forEach(counter => {
        let target = +counter.getAttribute('data-target');
        let isDecimal = counter.getAttribute('data-decimal');
        let isPlus = counter.getAttribute('data-plus');
        let count = 0;
        let step = isDecimal ? 0.001 : Math.ceil(target / 100);

        function updateCounter() {
            if (isDecimal) {
                count += step;
                if (count < target) {
                    counter.innerText = count.toFixed(2) + '%';
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target + '%';
                }
            } else if (isPlus) {
                count += Math.ceil(target / 100);
                if (count < target) {
                    counter.innerText = count.toLocaleString() + '+';
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target.toLocaleString() + '+';
                }
            } else {
                count += step;
                if (count < target) {
                    counter.innerText = count + (target === 24 ? '/7' : '+');
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target + (target === 24 ? '/7' : '+');
                }
            }
        }
        updateCounter();
    });

    // Initialize AOS (Animate On Scroll)
    if (window.AOS) {
        AOS.init();
    }

    // Optional: Smooth scroll for nav links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Random market data
    const marketData = [
        { market: "BTC/USDT", price: 67234.12, change: 2.15, volume: 125000000 },
        { market: "ETH/USDT", price: 3521.44, change: -1.12, volume: 89000000 },
        { market: "BNB/USDT", price: 412.33, change: 0.87, volume: 45000000 },
        { market: "SOL/USDT", price: 145.67, change: 3.21, volume: 32000000 },
        { market: "XRP/USDT", price: 0.624, change: -0.45, volume: 21000000 },
        { market: "DOGE/USDT", price: 0.152, change: 5.12, volume: 18000000 },
        { market: "ADA/USDT", price: 0.482, change: -2.34, volume: 17000000 },
        { market: "MATIC/USDT", price: 0.921, change: 1.09, volume: 16000000 },
        { market: "LTC/USDT", price: 92.14, change: 0.00, volume: 15000000 },
        { market: "DOT/USDT", price: 7.12, change: 4.56, volume: 14000000 }
    ];

    // Fill table
    function fillMarketsTable(data) {
        const tbody = document.querySelector('#marketsTable tbody');
        tbody.innerHTML = '';
        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="market-name">${row.market}</td>
                <td>$${row.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 6})}</td>
                <td class="${row.change > 0 ? 'market-up' : row.change < 0 ? 'market-down' : ''}">${row.change > 0 ? '+' : ''}${row.change}%</td>
                <td>$${row.volume.toLocaleString()}</td>
                <td><button class="trade-btn" data-market="${row.market}">Trade</button></td>
            `;
            tbody.appendChild(tr);
        });

        // Attach modal event to all trade buttons
        document.querySelectorAll('.trade-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const market = this.getAttribute('data-market');
                openTradeModal(market);
            });
        });
    }
    fillMarketsTable(marketData);

    // Sortable columns
    document.querySelectorAll('.markets-table th').forEach((th, idx) => {
        th.addEventListener('click', () => {
            let sorted = [...marketData];
            if (idx === 0) sorted.sort((a, b) => a.market.localeCompare(b.market));
            if (idx === 1) sorted.sort((a, b) => b.price - a.price);
            if (idx === 2) sorted.sort((a, b) => b.change - a.change);
            if (idx === 3) sorted.sort((a, b) => b.volume - a.volume);
            fillMarketsTable(sorted);
        });
    });

    // Modal functionality
    function openTradeModal(market) {
        const modal = document.getElementById('tradeModal');
        modal.style.display = 'flex';
        modal.querySelector('.trade-modal-market').innerText = `Market: ${market}`;
    }
    function closeTradeModal() {
        document.getElementById('tradeModal').style.display = 'none';
    }
    // Assign event handlers for trade modal buttons
    function assignTradeModalHandlers() {
        const tradeModalClose = document.querySelector('.trade-modal-close');
        const tradeModalConfirm = document.querySelector('.trade-modal-confirm');

        if (tradeModalClose) {
            tradeModalClose.onclick = closeTradeModal;
        }
        if (tradeModalConfirm) {
            tradeModalConfirm.onclick = closeTradeModal;
        }
    }

    // Assign event handlers for order modal buttons
    function assignOrderModalHandlers() {
        const orderModalClose = document.querySelector('#orderModal .trade-modal-close');
        const orderModalConfirm = document.querySelector('#orderModal .trade-modal-confirm');

        if (orderModalClose) {
            orderModalClose.onclick = closeOrderModal;
        }
        if (orderModalConfirm) {
            orderModalConfirm.onclick = closeOrderModal;
        }
    }

    window.onclick = function(event) {
        const tradeModal = document.getElementById('tradeModal');
        const orderModal = document.getElementById('orderModal');
        if (event.target === tradeModal) closeTradeModal();
        if (event.target === orderModal) closeOrderModal();
    };

    // Order form popup modal
    document.querySelector('.order-form').addEventListener('submit', function(e) {
        e.preventDefault();
        document.getElementById('orderModal').style.display = 'flex';
    });

    assignTradeModalHandlers();
    assignOrderModalHandlers();

    function closeOrderModal() {
        document.getElementById('orderModal').style.display = 'none';
    }

    // // Advanced order form submission
    // document.querySelector('.advanced-order-form').addEventListener('submit', function(e) {
    //     e.preventDefault();
    //     alert('Buy order placed! (You can replace this with a custom modal)');
    // });
    // document.querySelector('.order-btn.sell-btn').addEventListener('click', function() {
    //     alert('Sell order placed! (You can replace this with a custom modal)');
    // });


    // JS for Success Message
    const form = document.getElementById('contactForm');
    const successMsg = document.getElementById('successMessage');

    if (form && successMsg) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        if (name) {
          successMsg.style.display = 'block';
          form.reset();
          setTimeout(() => {
            successMsg.style.display = 'none';
          }, 3000);
        }
      });
    }

    // Mobile menu toggle
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const navbar = document.querySelector('.navbar');

    if (hamburgerMenu && navbar) {
      hamburgerMenu.addEventListener('click', () => {
        hamburgerMenu.classList.toggle('active');
        navbar.classList.toggle('active');
      });

      // Accessibility: toggle menu on Enter or Space key
      hamburgerMenu.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          hamburgerMenu.classList.toggle('active');
          navbar.classList.toggle('active');
        }
      });
    }
});
