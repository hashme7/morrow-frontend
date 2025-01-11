
export interface LoginState {
  email: string;
  password: string;
  isLoggedIn: boolean;
  role: string | null;
  errorMessage: string | null;
}



export interface LoginResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  userId:string;
}

export interface LogoutResponse {
  message: string;
}

export interface TokenValidityResponse {
  userId: string;
  valid: boolean;
}

export interface gitHubLoginResponse {
  message:string,
  accessToken?:string,
  refreshToken?:string,
  userId:string,
}


export interface IGoogleResponse {
  clientId?: string ;
  credential?: string;
  select_by?: string;
}

