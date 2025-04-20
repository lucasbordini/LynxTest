import type { AuthRequest } from '../models/request/auth-request.js';
import type { AuthTokenResponse } from '../models/response/auth-token-response.js';
import { api } from './api/index.js';

export const authService = {
  /**
   * Realiza a autenticação do usuário
   * @param authRequest Dados de autenticação
   * @returns Resposta com o token de acesso
   */
  async login(authRequest: AuthRequest): Promise<AuthTokenResponse> {
    return api.post<AuthTokenResponse>('/oauth/token', authRequest);
  },
};
