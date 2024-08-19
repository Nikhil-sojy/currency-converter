document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('converter-form');
    const fromCurrencySelect = document.getElementById('from-currency');
    const toCurrencySelect = document.getElementById('to-currency');
    const resultDiv = document.getElementById('result');
    const API_URL = 'https://api.exchangerate-api.com/v4/latest/USD'; // Example API

    // Populate currency options
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            const currencies = Object.keys(data.rates);
            currencies.forEach(currency => {
                const option = document.createElement('option');
                option.value = currency;
                option.textContent = currency;
                fromCurrencySelect.appendChild(option.cloneNode(true));
                toCurrencySelect.appendChild(option);
            });
        })
        .catch(error => {
            resultDiv.textContent = 'Error fetching currency data.';
            console.error('Error:', error);
        });

    form.addEventListener('submit', event => {
        event.preventDefault();
        const amount = parseFloat(document.getElementById('amount').value);
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;

        if (amount && fromCurrency && toCurrency) {
            fetch(API_URL)
                .then(response => response.json())
                .then(data => {
                    const rate = data.rates[toCurrency] / data.rates[fromCurrency];
                    const convertedAmount = (amount * rate).toFixed(2);
                    resultDiv.textContent = `${formatCurrency(amount, fromCurrency)} = ${formatCurrency(convertedAmount, toCurrency)}`;
                })
                .catch(error => {
                    resultDiv.textContent = 'Error fetching exchange rates.';
                    console.error('Error:', error);
                });
        } else {
            resultDiv.textContent = 'Please enter amount and select currencies.';
        }
    });

    function formatCurrency(amount, currency) {
        const options = { style: 'currency', currency: currency };
        return new Intl.NumberFormat('en-US', options).format(amount);
    }
});
