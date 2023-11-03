import { httpTool } from './../$http/index';
export enum AuthStatus {
  'Unauthorized',
  'Authorized',
}

interface AuthrizationUtil {
  status: AuthStatus;
  authorizeFromToken(token: string): boolean;
  authorizeFromStorage(): boolean;
  revoke(): boolean;
}

class AuthorizationUtil implements AuthrizationUtil {
  private localTokenKey = 'token';
  status: AuthStatus;

  authorizeFromToken(token: string): boolean {
    httpTool.setAuthorization(token);
    return true;
  }

  authorizeFromStorage(): boolean {
    const token = localStorage.getItem(this.localTokenKey);
    if (token) {
      return this.authorizeFromToken(token);
    }
    return false;
  }

  revoke(): boolean {
    localStorage.removeItem(this.localTokenKey);
    httpTool.removeAuthorization();
    return true;
  }

  constructor() {
    if (this.authorizeFromStorage() === true) {
      this.status = AuthStatus.Authorized;
    } else {
      this.status = AuthStatus.Unauthorized;
    }
  }
}

const useAuthrization = () => {
  return new AuthorizationUtil();
};

export default useAuthrization;
