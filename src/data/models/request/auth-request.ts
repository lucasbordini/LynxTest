export interface AuthRequest {
  client_id: string;
  client_secret: string;
  audience: string;
  grant_type: string;
  sender_id: string;
}
