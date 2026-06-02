/**
 * Paperclip API Client
 * Verbindet GitHub Pages UI mit Paperclip Backend
 */

class PaperclipAPI {
    constructor(baseUrl = 'https://shingle-subsiding-senator.ngrok-free.dev') {
        this.baseUrl = baseUrl;
        this.authToken = null;
    }

    async login(email, password) {
        const res = await fetch(`${this.baseUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.token) {
            this.authToken = data.token;
            localStorage.setItem('paperclip_token', data.token);
        }
        return data;
    }

    async request(endpoint, options = {}) {
        const token = this.authToken || localStorage.getItem('paperclip_token');
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const res = await fetch(`${this.baseUrl}${endpoint}`, {
                ...options,
                headers
            });
            if (res.status === 401) {
                console.warn('Auth required - showing demo data');
                return null;
            }
            return await res.json();
        } catch (e) {
            console.error('API Error:', e);
            return null;
        }
    }

    // Demo Daten wenn API nicht erreichbar
    getDemoData() {
        return {
            agents: [
                { id: 1, name: 'Tobu-Trader', role: 'BTC Trading Bot', status: 'active', lastActivity: '2 min ago' },
                { id: 2, name: 'Tobu-Analyst', role: 'Signal Detection', status: 'active', lastActivity: '5 min ago' },
                { id: 3, name: 'Tobu-Monitor', role: 'Position Monitor', status: 'paused', lastActivity: '1 hour ago' }
            ],
            goals: [
                { id: 1, name: 'BTC Paper Trading', progress: 75, status: 'active', tasks: 12 },
                { id: 2, name: 'Strategy Optimization', progress: 30, status: 'active', tasks: 5 }
            ],
            tasks: [
                { id: 1, name: 'Signal Check 4H', status: 'completed', result: 'No signal', time: '15:27' },
                { id: 2, name: 'Position Monitor', status: 'completed', result: 'All OK', time: '15:00' },
                { id: 3, name: 'Balance Update', status: 'pending', result: '-', time: '16:00' }
            ],
            activity: [
                { type: 'trade', title: 'Paper Trade Executed', desc: 'Bought 0.001 BTC @ $67,599', time: '15:27' },
                { type: 'signal', title: 'Signal Detected', desc: 'Wick strategy triggered', time: '14:30' },
                { type: 'system', title: 'Bot Started', desc: 'Connected to Binance Testnet', time: '12:00' }
            ],
            metrics: {
                agents: 2,
                tasksToday: 12,
                apiCosts: 0.34,
                successRate: 98.5
            }
        };
    }

    async getDashboard() {
        const data = await this.request('/api/v1/dashboard');
        return data || this.getDemoData();
    }

    async getAgents() {
        const data = await this.request('/api/v1/agents');
        return data?.agents || this.getDemoData().agents;
    }

    async getGoals() {
        const data = await this.request('/api/v1/goals');
        return data?.goals || this.getDemoData().goals;
    }
}

// Export für Browser
if (typeof window !== 'undefined') {
    window.PaperclipAPI = PaperclipAPI;
}
