

export interface IApi<T> { 
    get: (url: string, filters?: Record<string, unknown>) => Promise<T>
    post: (url: string, data: Record<string, unknown>) => Promise<T>
}

export class Api<T> implements IApi<T> {
    
    private baseUrl: string;

    constructor() {
        
        this.baseUrl = 'https://memory-game-5x7j.onrender.com';
    }
    
    async get(url: string, filters?: Record<string, unknown>): Promise<T> {
        let uri  = `${this.baseUrl}${url}`;
        if(filters) {
            const query = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                query.set(key, value as string);
            });
            uri = `${uri}?${query.toString()}`;
        }
        const response = await fetch(uri, {
            method: 'GET',
        });

        
        return await response.json();
    }
    
    async post<T>(url: string, data: Record<string, unknown>):  Promise<T> {
        const response = await fetch(`${this.baseUrl}${url}`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        try {
            return response.json();     
        } catch {
            return response.text() as unknown as T;
        }
    }
 
}




