export interface IAuthMechanism {
  validateUser(email: string, password: string): Promise<any>;
  generateToken(payload: any): string;
  verifyToken(token: string): any;
}