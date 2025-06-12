

export interface IApi<T> { 
    get: (filters: Record<string, unknown>) => Promise<T>
    // post: (data: T) => Promise<T>
    // put: (data: T) => Promise<T>
    // delete: (id: string) => Promise<T>
}


export class Api<T> implements IApi<T> {
    private url: string;

    constructor(url: string) {
        this.url = url;
    }
    
    async get(filters?: Record<string, unknown>): Promise<T> {
        let uri  = this.url;
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
    
    // async post(data: Record<string, unknown>):  Promise<T> {
    //     const response = await fetch(this.url, {
    //         method: 'POST',
    //         body: JSON.stringify(data)
    //     });
    //     return response.json();     
    // }

    // async put(data: Record<string, unknown>): Promise<T> {
    //     const response = await fetch(this.url, {
    //         method: 'PUT',
    //         body: JSON.stringify(data)
    //     });
    //     return response.json();
    // }

    // async delete(id: string): Promise<T> {
    //     const response = await fetch(this.url + '/' + id, {
    //         method: 'DELETE'
    //     });
    //     return response.json();
    // }
    
}


