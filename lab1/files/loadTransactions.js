const fs = require('fs');
const path = require('path');


/**
 * Загружает транзакции из JSON файла
 * @returns {Array<Object>} Массив транзакций
 * @throws {Error} Ошибка при чтении или парсинге файла
 */
const loadTransactions = () => {
    const filePath = path.join(__dirname, 'transaction.json');
    console.log(filePath);
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
};

module.exports = loadTransactions;