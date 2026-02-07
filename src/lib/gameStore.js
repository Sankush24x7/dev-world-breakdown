import { initialStats } from './gameData.js';

class GameStore {
    constructor() {
        this.stats = this.loadStats();
        this.listeners = [];
    }

    loadStats() {
        if (typeof window === 'undefined') return initialStats;
        const saved = localStorage.getItem('dev_world_stats');
        return saved ? JSON.parse(saved) : initialStats;
    }

    saveStats() {
        if (typeof window === 'undefined') return;
        localStorage.setItem('dev_world_stats', JSON.stringify(this.stats));
        this.notify();
    }

    updateXP(amount) {
        this.stats.xp += amount;
        this.checkLevelUp();
        this.saveStats();
    }

    updateHealth(amount) {
        this.stats.health = Math.max(0, Math.min(100, this.stats.health + amount));
        this.saveStats();
    }

    checkLevelUp() {
        // Simple level logic: Level = 1 + floor(XP / 100)
        const newLevel = Math.floor(this.stats.xp / 100) + 1;
        if (newLevel > this.stats.level) {
            this.stats.level = newLevel;
            this.updateRank();
        }
    }

    updateRank() {
        const ranks = [
            "Junior Dev Intern",
            "Junior Developer",
            "Mid-Level Developer",
            "Senior Developer",
            "Tech Lead",
            "Architect",
            "CTO",
            "Legendary Engineer"
        ];
        const rankIndex = Math.min(Math.floor(this.stats.level / 10), ranks.length - 1);
        this.stats.title = ranks[rankIndex];
    }

    completeLevel(levelId) {
        if (!this.stats.completedLevels.includes(levelId)) {
            this.stats.completedLevels.push(levelId);
            this.updateXP(50); // Base XP for completion
        }
    }

    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    notify() {
        this.listeners.forEach(callback => callback(this.stats));
    }
}

export const gameStore = new GameStore();
