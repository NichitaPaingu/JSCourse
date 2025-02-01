const TransactionAnalyzer = require('./TransactionAnalyzer');
const loadTransactions = require('./loadTransactions');
const Menu = require('./Menu');


try {
    const transactions = loadTransactions();
    const analyzer = new TransactionAnalyzer(transactions);
    Menu(analyzer);
} catch (error) {
    console.error('Ошибка при загрузке транзакций:', error);
}
