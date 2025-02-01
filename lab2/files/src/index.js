import { getRandomActivity } from './activity.js';

/**
 * Обновляет отображение активности в DOM
 * @param {{word: string, activity: string}} data - Данные активности для отображения
 */
function updateActivity(data) {
    const activityElement = document.getElementById('activity');
    activityElement.textContent = data.activity;
    console.log('Сгенерировано из слова:', data.word); // Для отладки
}

/**
 * Получает и отображает новую активность
 */
async function displayNewActivity() {
    const activityElement = document.getElementById('activity');
    activityElement.textContent = 'Loading...';
    
    try {
        const activityData = await getRandomActivity();
        updateActivity(activityData);
    } catch (error) {
        activityElement.textContent = 'An error occurred. Please try again.';
    }
}

// Ждем полной загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    // Добавляем обработчик события клика на кнопку
    document.getElementById('newActivityBtn').addEventListener('click', displayNewActivity);

    // Начальная загрузка активности
    displayNewActivity();

    // Обновляем активность каждую минуту
    setInterval(displayNewActivity, 60000);
});