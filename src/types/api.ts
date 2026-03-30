// Base response type
export interface ApiResponse<T = unknown> {
  status: string;
  data: T;
}

export interface TShockResponse {
  status: string;
  error?: string;
}

export interface MessageResponse extends TShockResponse {
  response: string;
}

export interface CommandResult extends TShockResponse {
  response: string;
}

export interface TokenTestResponse extends TShockResponse {
  response: string;
  associateduser: string;
}
