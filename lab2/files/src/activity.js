/**
 * Fetches a random word and generates an activity
 * @returns {Promise<{word: string, activity: string}>} Promise that resolves to activity data
 * @throws {Error} If the API request fails
 */
export async function getRandomActivity() {
    try {
        const response = await fetch('https://random-word-api.herokuapp.com/word');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const [word] = await response.json();
        
        const activities = [
            `try to draw a "${word}"`,
            `write a story about "${word}"`,
            `research what "${word}" means`,
            `make up a song about "${word}"`,
            `create a riddle using "${word}"`,
            `explain "${word}" to someone`,
            `invent a game with "${word}"`
        ];
        
        const activity = activities[Math.floor(Math.random() * activities.length)];
        
        return {
            word,
            activity
        };
    } catch (error) {
        console.error('Error fetching activity:', error);
        throw error;
    }
}
