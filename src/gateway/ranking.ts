import { Api, IApi } from "./api";

export interface IRanking { 
        name: string,
        score: number,
        firstFound: string,
        lastFound: string,
        createdAt: string
      
}


export interface IRankingResponse {
    rankings: IRanking[]
    pagination: { 
        page: number,
        limit: number,
        total: number,
        hasMore: boolean
    }
}

export class Ranking {
    private api: IApi<IRankingResponse>;
    static instance: Ranking;

    constructor() {
        this.api = new Api('https://memory-game-5x7j.onrender.com/rankings');
    }

    static getInstance() {
        if (!Ranking.instance) {
            Ranking.instance = new Ranking();
        }
        return Ranking.instance;
    }

    async getRanking(page: number = 1, limit: number = 10): Promise<IRankingResponse> {
        
        const ranking = await this.api.get({ page, limit });
        
        return ranking;
    }
}