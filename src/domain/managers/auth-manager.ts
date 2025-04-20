import type { AuthTokenResponse } from '../../data/models/response/auth-token-response.ts';

/**
 * Singleton para gerenciar o token de autenticação
 */
class AuthManager {
  private static instance: AuthManager;
  private authToken: AuthTokenResponse | null = null;

  private constructor() {}

  /**
   * Obtém a instância única do AuthManager
   */
  public static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  /**
   * Salva o token de autenticação
   * @param token Token de autenticação
   */
  public saveToken(token: AuthTokenResponse): void {
    this.authToken = token;
  }

  /**
   * Obtém o token de autenticação
   * @returns Token de autenticação ou null se não estiver autenticado
   */
  public getToken(): AuthTokenResponse | null {
    return this.authToken;
  }

  /**
   * Verifica se o token está válido
   * @returns Verdadeiro se o token estiver válido
   */
  public isTokenValid(): boolean {
    if (!this.authToken) return false;

    const now = Date.now() / 1000;
    const expirationTime = this.authToken.expires_in;

    return expirationTime > now;
  }

  /**
   * Limpa o token de autenticação
   */
  public clearToken(): void {
    this.authToken = null;
  }
}

export const authManager = AuthManager.getInstance();
