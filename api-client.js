class PaperclipAPI {
    constructor(baseUrl = 'https://lemon-lands-argue.loca.lt') {
        this.baseUrl = baseUrl;
        this.ws = null;
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

    async getDashboard() {
        return await this.request('/api/v1/dashboard');
    }

    async getAgents() {
        const data = await this.request('/api/v1/agents');
        return data?.agents || [];
    }

    async getGoals() {
        const data = await this.request('/api/v1/goals');
        return data?.goals || [];
    }

    async getTasks() {
        const data = await this.request('/api/v1/tasks');
        return data?.tasks || [];
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

    connectWebSocket() {
        const wsUrl = this.baseUrl.replace('https', 'wss').replace('http', 'ws');
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => console.log('WebSocket connected');
        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('WebSocket data:', data);
            // Update UI here
        };
        this.ws.onerror = (error) => console.error('WebSocket error:', error);
    }
}

if (typeof window !== 'undefined') {
    window.PaperclipAPI = PaperclipAPI;
}
