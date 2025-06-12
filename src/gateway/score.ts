import { Api, api, IApi } from "./api";


interface IScoreResponse {
    name: string;
    score: number;
    firstFound: string;
    lastFound: string;
    createdAt: string;
}
export class Score {
    
    static instance: Score;
    private api: IApi<IScoreResponse>;

    constructor() {
        this.api = new Api<IScoreResponse>();
    }

    static getInstance() {
        if (!Score.instance) {
            Score.instance = new Score();
            
        }
        return Score.instance;
    }


    async sendScore(data: Record<string, unknown>) {
        const response = await this.api.post('/api-docs/api/scores', data).catch(error => {
            throw new Error(`Erro ao enviar score: ${error}`);
        });
        return response;
    }
}