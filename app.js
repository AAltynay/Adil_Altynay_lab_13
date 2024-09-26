const exchangeRatesElement = document.getElementById('exchange-rates');
const currencyFromSelect = document.getElementById('currency-from');
const currencyToSelect = document.getElementById('currency-to');
const convertBtn = document.getElementById('convert-btn');
const conversionResult = document.getElementById('conversion-result');

const apiKey = '1c22f42743c53799e73ddde8'; 
let conversionRates = {}; 

async function fetchExchangeRates() {
    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/KZT`);
        if (!response.ok) throw new Error('Ошибка при получении данных');

        const data = await response.json();
        if (data.result === "error") {
            throw new Error(`Ошибка: ${data['error-type']}`);
        }
        
        updateExchangeRates(data.conversion_rates);
    } catch (error) {
        exchangeRatesElement.textContent = error.message; 
        console.error(error); 
    }
}

function updateExchangeRates(rates) {
    conversionRates = rates; 
    exchangeRatesElement.innerHTML = `<p>1 KZT = ${rates.USD} USD</p><p>1 KZT = ${rates.EUR} EUR</p>`;
    
 
    currencyFromSelect.innerHTML = '';
    currencyToSelect.innerHTML = '';
    
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

    
    if (!conversionRates[fromCurrency] || !conversionRates[toCurrency]) {
        conversionResult.textContent = 'Ошибка: выбранная валютная пара не найдена.';
        return; 
    }

    if (!isNaN(amount) && amount > 0) {
        const fromRate = conversionRates[fromCurrency]; 
        const toRate = conversionRates[toCurrency]; 
        
        if (fromRate && toRate) {
            const rate = toRate / fromRate; 
            const result = (amount * rate).toFixed(2);
            conversionResult.textContent = `${amount} ${fromCurrency} = ${result} ${toCurrency}`;
        }
    } else {
        conversionResult.textContent = 'Введите корректную сумму';
    }
});

fetchExchangeRates();
