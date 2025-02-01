
const readline = require('readline');
/**
 * Создает интерактивное меню для работы с транзакциями
 * @param {TransactionAnalyzer} analyzer - Экземпляр анализатора транзакций
 */
function createMenu(analyzer) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const menu = `
Выберите метод (введите номер):
1.  Показать уникальные типы транзакций
2.  Показать общую сумму всех транзакций
3.  Показать сумму транзакций за период (2019, 1, 1)
4.  Показать транзакции определенного типа (debit)
5.  Показать транзакции в диапазоне дат (2019-01-01 до 2019-01-31)
6.  Показать транзакции по продавцу (SuperMart)
7.  Показать среднюю сумму транзакций
8.  Показать транзакции в диапазоне сумм (100-200)
9.  Показать сумму дебетовых транзакций
10. Показать месяц с наибольшим количеством транзакций
11. Показать месяц с наибольшим количеством дебетовых транзакций
12. Показать преобладающий тип транзакций
13. Показать транзакции до даты (2019-01-15)
14. Найти транзакцию по ID (1)
15. Показать все описания транзакций
16. Добавить новую транзакцию
17. Показать все транзакции
0.  Выход

Ваш выбор: `;

    function showMenu() {
        rl.question(menu, (choice) => {
            switch (choice) {
                case '1':
                    console.log('\nУникальные типы транзакций:', 
                        analyzer.getUniqueTransactionTypes());
                    break;
                case '2':
                    console.log('\nОбщая сумма всех транзакций:', 
                        analyzer.calculateTotalAmount());
                    break;
                case '3':
                    console.log('\nСумма транзакций за 1 января 2019:', 
                        analyzer.calculateTotalAmountByDate(2019, 1, 1));
                    break;
                case '4':
                    console.log('\nДебетовые транзакции:', 
                        analyzer.getTransactionsByType('debit').length, 'шт.');
                    break;
                case '5':
                    console.log('\nТранзакции с 1 по 31 января 2019:', 
                        analyzer.getTransactionsInDateRange('2019-01-01', '2019-01-31').length, 'шт.');
                    break;
                case '6':
                    console.log('\nТранзакции SuperMart:', 
                        analyzer.getTransactionsByMerchant('SuperMart'));
                    break;
                case '7':
                    console.log('\nСредняя сумма транзакций:', 
                        analyzer.calculateAverageTransactionAmount());
                    break;
                case '8':
                    console.log('\nТранзакции от 100 до 200:', 
                        analyzer.getTransactionsByAmountRange(100, 200).length, 'шт.');
                    break;
                case '9':
                    console.log('\nСумма дебетовых транзакций:', 
                        analyzer.calculateTotalDebitAmount());
                    break;
                case '10':
                    console.log('\nМесяц с наибольшим количеством транзакций:', 
                        analyzer.findMostTransactionsMonth());
                    break;
                case '11':
                    console.log('\nМесяц с наибольшим количеством дебетовых транзакций:', 
                        analyzer.findMostDebitTransactionMonth());
                    break;
                case '12':
                    console.log('\nПреобладающий тип транзакций:', 
                        analyzer.mostTransactionTypes());
                    break;
                case '13':
                    console.log('\nТранзакции до 15 января 2019:', 
                        analyzer.getTransactionsBeforeDate('2019-01-15').length, 'шт.');
                    break;
                case '14':
                    console.log('\nТранзакция с ID 1:', 
                        analyzer.findTransactionById('1'));
                    break;
                case '15':
                    console.log('\nПервые 5 описаний транзакций:', 
                        analyzer.mapTransactionDescriptions().slice(0, 5));
                    break;
                case '16':
                    console.log('\nДобавление новой транзакции:');
                    const askTransactionData = async () => {
                        try {
                            const transaction = {};
                            
                            // Последовательно запрашиваем все поля
                            const allTransactions = analyzer.getAllTransactions();
                            const maxId = Math.max(...allTransactions.map(t => parseInt(t.transaction_id)));
                            transaction.transaction_id = (maxId + 1).toString();
                            
                            console.log(`\nГенерируется новая транзакция с ID: ${transaction.transaction_id}`);


                            //запрашиваем дату
                            transaction.transaction_date = await askQuestion(rl, 'Введите дату (YYYY-MM-DD): ');
                            
                            // Запрашиваем сумму и преобразуем в число
                            const amountStr = await askQuestion(rl, 'Введите сумму: ');
                            transaction.transaction_amount = parseFloat(amountStr);
                            
                            // Запрашиваем тип с проверкой
                            let type;
                            do {
                                type = await askQuestion(rl, 'Введите тип (debit/credit): ');
                            } while (!['debit', 'credit'].includes(type));
                            transaction.transaction_type = type;
                            
                            transaction.transaction_description = await askQuestion(rl, 'Введите описание: ');
                            transaction.merchant_name = await askQuestion(rl, 'Введите название продавца: ');
                            transaction.card_type = await askQuestion(rl, 'Введите тип карты: ');
                
                            // Пытаемся добавить транзакцию
                            analyzer.addTransaction(transaction);
                            console.log('\nТранзакция успешно добавлена!');
                            
                        } catch (error) {
                            console.error('\nОшибка при добавлении транзакции:', error.message);
                        }
                        
                        // Возвращаемся в меню
                        rl.question('\nНажмите Enter для продолжения...', () => {
                            showMenu();
                        });
                    };
                
                    // Вспомогательная функция для запроса данных
                    function askQuestion(rl, question) {
                        return new Promise((resolve) => {
                            rl.question(question, (answer) => {
                                resolve(answer.trim());
                            });
                        });
                    }
                
                    askTransactionData();
                    break;
                case '17':
                    console.log('\nВсе транзакции:', 
                        analyzer.getAllTransactions());
                    break;
                case '0':
                    console.log('\nДо свидания!');
                    rl.close();
                    return;
                default:
                    console.log('\nНеверный выбор. Попробуйте снова.');
            }
            
            rl.question('\nНажмите Enter для продолжения...', () => {
                showMenu();
            });
        });
    }

    showMenu();
}

module.exports = createMenu;