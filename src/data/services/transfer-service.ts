import type { CorridorResponse } from '../models/response/corridor-response.js';
import { api } from './api/index.js';
import { authManager } from '../../domain/managers/auth-manager.js';
import type { QuoteResponse } from '../models/response/quote-response.js';

class TransferService {
  private static instance: TransferService;
  private _token: string | null = null;

  private constructor() {}

  private get token(): string {
    if (!this._token) {
      this._token = authManager.getToken()?.access_token ?? '';
    }
    return this._token!;
  }

  public static getInstance(): TransferService {
    if (!TransferService.instance) {
      TransferService.instance = new TransferService();
    }
    return TransferService.instance;
  }

  public async getCorridors(): Promise<CorridorResponse> {
    const headers = {
      Authorization: `Bearer ${this.token}`,
    };
    return api.get<CorridorResponse>('/corridors', headers);
  }

  public async getQuote(
    amount: string,
    country: string,
    currency: string,
    source: string,
  ) {
    const headers = {
      Authorization: `Bearer ${this.token}`,
    };
    return api.get<QuoteResponse>(
      `/quotes?amount=${amount}&dstCountryIso3Code=${country}&dstCurrencyIso3Code=${currency}&srcCurrencyIso3Code=${source}`,
      headers,
    );
  }
}

export const transferService = TransferService.getInstance();
