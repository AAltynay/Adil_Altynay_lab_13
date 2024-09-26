const exchangeRatesDiv = document.getElementById('exchange-rates');
const currencyFromSelect = document.getElementById('currency-from');
const currencyToSelect = document.getElementById('currency-to');
const amountInput = document.getElementById('amount');
const convertBtn = document.getElementById('convert-btn');
const conversionResultDiv = document.getElementById('conversion-result');

const baseCurrency = 'KZT';
let rates = {};

// Функция для получения курсов валют
async function fetchExchangeRates() {
    try {
        const response = await fetch(`https://open.er-api.com/v6/latest/${baseCurrency}`);
        if (!response.ok) throw new Error('Ошибка при получении данных');
        
        const data = await response.json();
        rates = data.rates;

        displayExchangeRates();
        populateCurrencySelects();
    } catch (error) {
        exchangeRatesDiv.textContent = `Ошибка: ${error.message}`;
    }
}

// Отображение курсов валют
function displayExchangeRates() {
    exchangeRatesDiv.innerHTML = `
        <h2>Курсы к ${baseCurrency}</h2>
        <ul>
            <li>Доллар: ${rates['USD']}</li>
            <li>Евро: ${rates['EUR']}</li>
        </ul>
    `;
}

// Заполнение селектов валют
function populateCurrencySelects() {
    const currencies = Object.keys(rates);
    currencies.forEach(currency => {
        const optionFrom = new Option(currency, currency);
        const optionTo = new Option(currency, currency);
        currencyFromSelect.add(optionFrom);
        currencyToSelect.add(optionTo);
    });

    currencyFromSelect.value = 'USD';
    currencyToSelect.value = 'EUR';
}

// Конвертация валют
function convertCurrency() {
    const amount = parseFloat(amountInput.value);
    const fromCurrency = currencyFromSelect.value;
    const toCurrency = currencyToSelect.value;

    if (!isNaN(amount)) {
        const convertedAmount = (amount * rates[toCurrency] / rates[fromCurrency]).toFixed(2);
        conversionResultDiv.textContent = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
    } else {
        conversionResultDiv.textContent = 'Введите корректную сумму';
    }
}

convertBtn.addEventListener('click', convertCurrency);

// Инициализация
fetchExchangeRates();
