export type AuthResponse<T> = {
  message: string;
  user: T;
  token: string;
};
