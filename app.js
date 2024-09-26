const exchangeRatesElement = document.getElementById('exchange-rates');
const currencyFromSelect = document.getElementById('currency-from');
const currencyToSelect = document.getElementById('currency-to');
const convertBtn = document.getElementById('convert-btn');
const conversionResult = document.getElementById('conversion-result');

const apiKey = '1c22f42743c53799e73ddde8'; // Замените на ваш API ключ

async function fetchExchangeRates() {
    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/KZT`);
        if (!response.ok) throw new Error('Ошибка при получении данных');

        const data = await response.json();
        updateExchangeRates(data.conversion_rates);
    } catch (error) {
        exchangeRatesElement.textContent = error.message;
    }
}

function updateExchangeRates(rates) {
    exchangeRatesElement.innerHTML = `<p>1 KZT = ${rates.USD} USD</p><p>1 KZT = ${rates.EUR} EUR</p>`;
    
    for (const currency in rates) {
        const optionFrom = document.createElement('option');
        optionFrom.value = currency;
        optionFrom.textContent = currency;
        currencyFromSelect.appendChild(optionFrom);

        const optionTo = document.createElement('option');
        optionTo.value = currency;
        optionTo.textContent = currency;
        currencyToSelect.appendChild(optionTo);
    }

    currencyFromSelect.value = 'USD';
    currencyToSelect.value = 'EUR';
}

convertBtn.addEventListener('click', () => {
    const amount = parseFloat(document.getElementById('amount').value);
    const fromCurrency = currencyFromSelect.value;
    const toCurrency = currencyToSelect.value;
    const rate = parseFloat(currencyToSelect.options[currencyToSelect.selectedIndex].text);

    if (!isNaN(amount) && amount > 0) {
        const result = (amount * rate).toFixed(2);
        conversionResult.textContent = `${amount} ${fromCurrency} = ${result} ${toCurrency}`;
    } else {
        conversionResult.textContent = 'Введите корректную сумму';
    }
});

fetchExchangeRates();
