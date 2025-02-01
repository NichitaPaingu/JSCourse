/**
 * @typedef {Object} Transaction
 * @property {string} id - Уникальный идентификатор
 * @property {Date} date - Дата транзакции
 * @property {number} amount - Сумма транзакции
 * @property {string} category - Категория транзакции
 * @property {string} description - Описание транзакции
 */

/** @type {Transaction[]} */
let transactions = [];

/**
 * Генерирует уникальный ID для транзакций
 * @returns {string} Уникальный идентификатор
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Форматирует дату в читаемую строку
 * @param {Date} date - Дата для форматирования
 * @returns {string} Отформатированная строка даты
 */
function formatDate(date) {
    return new Intl.DateTimeFormat('ru-RU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}



/**
 * Создает сокращенное описание
 * @param {string} description - Полное описание
 * @returns {string} Сокращенное описание
 */
function truncateDescription(description) {
    const words = description.split(' ');
    return words.slice(0, 4).join(' ') + (words.length > 4 ? '...' : '');
}

/**
 * Добавляет новую транзакцию
 * @param {Event} event - Событие отправки формы
 */
function addTransaction(event) {
    event.preventDefault();

    const transaction = {
        id: generateId(),
        date: new Date(),
        amount: parseFloat(document.getElementById('amount').value),
        category: document.getElementById('category').value,
        description: document.getElementById('description').value
    };

    transactions.push(transaction);
    addTransactionToTable(transaction);
    calculateTotal();
    event.target.reset();
}

/**
 * Добавляет транзакцию в таблицу
 * @param {Transaction} transaction - Транзакция для добавления
 */
function addTransactionToTable(transaction) {
    const tbody = document.querySelector('#transactionsTable tbody');
    const row = document.createElement('tr');
    
    row.className = transaction.amount >= 0 ? 'positive' : 'negative';
    row.dataset.id = transaction.id;
    
    row.innerHTML = `
        <td>${transaction.id}</td>
        <td>${formatDate(transaction.date)}</td>
        <td>${transaction.category}</td>
        <td>${truncateDescription(transaction.description)}</td>
        <td>${transaction.amount}</td>
        <td><button class="delete-btn">Удалить</button></td>
    `;

    tbody.appendChild(row);
}

/**
 * Вычисляет и отображает общий баланс
 */
function calculateTotal() {
    const total = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    document.getElementById('totalBalance').textContent = total;
    document.getElementById('totalBalance').className = `balance ${total >= 0 ? 'positive' : 'negative'}`;
}

/**
 * Удаляет транзакцию
 * @param {string} id - ID транзакции для удаления
 */
function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    document.querySelector(`tr[data-id="${id}"]`).remove();
    calculateTotal();
}

/**
 * Показывает детали транзакции в модальном окне
 * @param {string} id - ID транзакции для отображения
 */
function showTransactionDetails(id) {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;

    const modal = document.getElementById('transactionModal');
    const details = document.getElementById('transactionDetails');
    
    details.innerHTML = `
        <p><strong>ID:</strong> ${transaction.id}</p>
        <p><strong>Дата:</strong> ${formatDate(transaction.date)}</p>
        <p><strong>Категория:</strong> ${transaction.category}</p>
        <p><strong>Сумма:</strong> ${transaction.amount}</p>
        <p><strong>Описание:</strong> ${transaction.description}</p>
    `;
    
    modal.style.display = 'block';
}

// Обработчики событий
document.getElementById('transactionForm').addEventListener('submit', addTransaction);

document.getElementById('transactionsTable').addEventListener('click', (event) => {
    const row = event.target.closest('tr');
    if (!row) return;

    if (event.target.classList.contains('delete-btn')) {
        deleteTransaction(row.dataset.id);
    } else {
        showTransactionDetails(row.dataset.id);
    }
});

document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('transactionModal').style.display = 'none';
});

window.addEventListener('click', (event) => {
    const modal = document.getElementById('transactionModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});