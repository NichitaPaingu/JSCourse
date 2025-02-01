class TransactionAnalyzer {
    #transactions;
    /**
     * Создает экземпляр анализатора транзакций
     * @param {Array<Object>} transactions - Массив транзакций
     * @param {string} transactions[].transaction_id - Уникальный идентификатор транзакции
     * @param {string} transactions[].transaction_date - Дата транзакции в формате YYYY-MM-DD
     * @param {number} transactions[].transaction_amount - Сумма транзакции
     * @param {string} transactions[].transaction_type - Тип транзакции (debit/credit)
     * @param {string} transactions[].transaction_description - Описание транзакции
     * @param {string} transactions[].merchant_name - Название продавца
     * @param {string} transactions[].card_type - Тип карты
     */
    constructor(transactions = []) {
        this.#transactions = transactions;
    }

    //Метод номер 1 
    /**
     * Возвращает массив уникальных типов транзакций
     * @returns {Array<string>} Массив типов транзакций (например, ['debit', 'credit'])
     */
    getUniqueTransactionTypes() {
        return [...new Set(this.#transactions.map(transaction => transaction.transaction_type))];
    }


    //Метод номер 2
    /**
     * Вычисляет общую сумму всех транзакций
     * @returns {number} Общая сумма транзакций
     */
    calculateTotalAmount() {
        return this.#transactions.reduce((sum, transaction) => sum + transaction.transaction_amount, 0);
    }


    //Метод номер 3
    /**
     * Вычисляет сумму транзакций за указанный период
     * @param {number} [year] - Год (опционально)
     * @param {number} [month] - Месяц (1-12, опционально)
     * @param {number} [day] - День месяца (опционально)
     * @returns {number} Сумма транзакций за указанный период
     */
    calculateTotalAmountByDate(year, month, day) {
        return this.#transactions
            .filter(t => {
                const date = new Date(t.transaction_date);
                return (!year || date.getFullYear() === year) &&
                    (!month || date.getMonth() + 1 === month) &&
                    (!day || date.getDate() === day);
            })
            .reduce((sum, transaction) => sum + transaction.transaction_amount, 0);
    }

    //Метод номер 4
    /**
     * Возвращает транзакции указанного типа
     * @param {string} type - Тип транзакции ('debit' или 'credit')
     * @returns {Array<Object>} Массив транзакций указанного типа
     */
    getTransactionsByType(type) {
        return this.#transactions.filter(transaction => transaction.transaction_type === type);
    }


    //Метод номер 5
    /**
     * Находит транзакции в указанном диапазоне дат
     * @param {string|Date} startDate - Начальная дата
     * @param {string|Date} endDate - Конечная дата
     * @returns {Array<Object>} Массив транзакций в указанном диапазоне
     */
    getTransactionsInDateRange(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return this.#transactions.filter(transaction => {
            const date = new Date(transaction.transaction_date);
            return date >= start && date <= end;
        });
    }

    //Метод номер 6
    getTransactionsByMerchant(merchantName) {
        return this.#transactions.filter(transaction => transaction.merchant_name === merchantName);
    }

    //Метод номер 7
    /**
     * Вычисляет среднюю сумму транзакций
     * @returns {number} Средняя сумма транзакций
     */
    calculateAverageTransactionAmount() {
        if (this.#transactions.length === 0) return 0;
        const total = this.calculateTotalAmount();
        return total / this.#transactions.length;
    }

    //Метод номер 8
    /**
         * Возвращает транзакции в указанном диапазоне сумм
         * @param {number} minAmount - Минимальная сумма
         * @param {number} maxAmount - Максимальная сумма
         * @returns {Array<Object>} Массив транзакций в указанном диапазоне
         */
    getTransactionsByAmountRange(minAmount, maxAmount) {
        return this.#transactions.filter(transaction => 
            transaction.transaction_amount >= minAmount && 
            transaction.transaction_amount <= maxAmount
        );
    }
    
    //Метод номер 9
    /**
         * Вычисляет общую сумму дебетовых транзакций
         * @returns {number} Общая сумма дебетовых транзакций
         */
    calculateTotalDebitAmount() {
        const debitTransactions = this.getTransactionsByType('debit');
        return debitTransactions.reduce((sum, transaction) => sum + transaction.transaction_amount, 0);
    }
    //Метод номер 10
    /**
     * Находит месяц с наибольшим количеством транзакций
     * @returns {number} Номер месяца (1-12)
     */
    findMostTransactionsMonth() {
        const monthCounts = {};
        this.#transactions.forEach(transaction => {
            const month = new Date(transaction.transaction_date).getMonth() + 1;
            monthCounts[month] = (monthCounts[month] || 0) + 1;
        });

        let maxMonth = 1;
        let maxCount = 0;
        for (const [month, count] of Object.entries(monthCounts)) {
            if (count > maxCount) {
                maxCount = count;
                maxMonth = parseInt(month);
            }
        }
        return maxMonth;
    }
    //Метод номер 11
    /**
         * Находит месяц с наибольшим количеством дебетовых транзакций
         * @returns {number} Номер месяца (1-12)
         */
    findMostDebitTransactionMonth() {
        const debitTransactions = this.getTransactionsByType('debit');
        const analyzer = new TransactionAnalyzer(debitTransactions);
        return analyzer.findMostTransactionsMonth();
    }
    //Метод номер 12
    /**
         * Определяет преобладающий тип транзакций
         * @returns {string} 'debit', 'credit' или 'equal'
         */
    mostTransactionTypes() {
        const debitCount = this.getTransactionsByType('debit').length;
        const creditCount = this.getTransactionsByType('credit').length;

        if (debitCount > creditCount) return 'debit';
        if (creditCount > debitCount) return 'credit';
        return 'equal';
    }
    //Метод номер 13
    /**
         * Возвращает транзакции до указанной даты
         * @param {string|Date} date - Дата
         * @returns {Array<Object>} Массив транзакций до указанной даты
         */
    getTransactionsBeforeDate(date) {
        const targetDate = new Date(date);
        return this.#transactions.filter(transaction => 
            new Date(transaction.transaction_date) < targetDate
        );
    }
    //Метод номер 14
    /**
         * Находит транзакцию по ID
         * @param {string} id - Идентификатор транзакции
         * @returns {Object|undefined} Найденная транзакция или undefined
         */
    findTransactionById(id) {
        return this.#transactions.find(transaction => transaction.transaction_id === id);
    }

    //Метод номер 15
    /**
         * Возвращает массив описаний всех транзакций
         * @returns {Array<string>} Массив описаний транзакций
         */
    mapTransactionDescriptions() {
        return this.#transactions.map(transaction => transaction.transaction_description);
    }

    //Метод номер 16
    /**
     * Добавляет новую транзакцию в список
     * @param {Object} transaction - Объект транзакции
     * @param {string} transaction.transaction_id - Уникальный идентификатор транзакции
     * @param {string} transaction.transaction_date - Дата транзакции в формате YYYY-MM-DD
     * @param {number} transaction.transaction_amount - Сумма транзакции
     * @param {string} transaction.transaction_type - Тип транзакции (debit/credit)
     * @param {string} transaction.transaction_description - Описание транзакции
     * @param {string} transaction.merchant_name - Название продавца
     * @param {string} transaction.card_type - Тип карты
     * @throws {Error} Если транзакция не соответствует требуемому формату
     */
    addTransaction(transaction) {
        this.#validateTransaction(transaction); // Приватный метод валидации
        this.#transactions.push(transaction);
    }
    // Приватный метод для валидации транзакции
    #validateTransaction(transaction) {
        const requiredFields = [
            'transaction_id',
            'transaction_date',
            'transaction_amount',
            'transaction_type',
            'transaction_description',
            'merchant_name',
            'card_type'
        ];

        for (const field of requiredFields) {
            if (!(field in transaction)) {
                throw new Error(`Отсутствует обязательное поле: ${field}`);
            }
        }

        if (!['debit', 'credit'].includes(transaction.transaction_type)) {
            throw new Error('Неверный тип транзакции');
        }

        if (typeof transaction.transaction_amount !== 'number' || transaction.transaction_amount < 0) {
            throw new Error('Сумма транзакции должна быть положительным числом');
        }
    }

    //метод номер 17
    /**
     * Возвращает копию массива транзакций
     * @returns {Array<Object>} Копия массива транзакций
     */
    getAllTransactions() {
        return [...this.#transactions]; // Возвращаем копию массива
    }
}


module.exports = TransactionAnalyzer;