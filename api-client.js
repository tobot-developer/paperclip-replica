class PaperclipAPI {
    constructor(baseUrl = 'https://many-bugs-decide.loca.lt') {
        this.baseUrl = baseUrl;
    }

    async request(endpoint, options = {}) {
        try {
            const res = await fetch(`${this.baseUrl}${endpoint}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });
            return await res.json();
        } catch (e) {
            console.error('API Error:', e);
            return null;
        }
    }

    async getDashboard() { return await this.request('/api/v1/dashboard'); }
    async getAgents() { 
        const data = await this.request('/api/v1/agents');
        return data?.agents || [];
    }
    async getGoals() {
        const data = await this.request('/api/v1/goals');
        return data?.goals || [];
    }
    async startAgent(id) {
        return await this.request(`/api/v1/agents/${id}/action`, {
            method: 'POST',
            body: JSON.stringify({ action: 'start' })
        });
    }
    async stopAgent(id) {
        return await this.request(`/api/v1/agents/${id}/action`, {
            method: 'POST',
            body: JSON.stringify({ action: 'stop' })
        });
    }
}

if (typeof window !== 'undefined') window.PaperclipAPI = PaperclipAPI;
