import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  RestClient,
  RestError,
  getUser,
  login as loginREST,
  signUp as signUpREST,
} from '../rest';

const TOKEN_LOCAL_STORAGE_KEY = 'token';

export type AuthUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
};

type SignUpArgs = {
  [key in 'email' | 'password' | 'firstName' | 'lastName']: string;
};

type AuthStateSetters = {
  signUp: (_args: SignUpArgs) => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  rest: RestClient;
};

export type AuthState = (
  | {
      user: AuthUser;
      token: string;
      isLoggedIn: true;
    }
  | {
      user: null;
      token: null;
      isLoggedIn: false;
    }
) &
  AuthStateSetters;

const AuthContext = createContext<AuthState>({
  user: null,
  token: null,
  signUp: _args => Promise.resolve(),
  login: (_email, _pass) => Promise.resolve(),
  logout: () => {},
  isLoggedIn: false,
  isLoading: false,
  rest: null!,
});

export const AuthProvider = ({children}: PropsWithChildren<{}>) => {
  const [isLoading, setIsLoading] = useState(true);

  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );
  const [user, setUser] = useState<AuthUser | null>(null);
  const [restClient, setRestClient] = useState<RestClient>(null!);

  useEffect(() => {
    const on401 = () => {
      console.log('got 401, logging out');
      logout();
      return false;
    };

    const restClient = new RestClient(token, on401);
    setRestClient(restClient);

    if (!token) {
      setIsLoading(false);
      return;
    }

    getUser(token)
      .then(user => setUser(user))
      .finally(() => setIsLoading(false));
  }, [token]);

  const signUp = async (signUpArgs: {
    [key in 'email' | 'password' | 'firstName' | 'lastName']: string;
  }) => {
    setIsLoading(true);
    const token = await signUpREST(signUpArgs);
    setIsLoading(false);

    setToken(token.token);
    localStorage.setItem(TOKEN_LOCAL_STORAGE_KEY, token.token);
  };

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    const token = await loginREST(email, pass);
    setIsLoading(false);

    setToken(token.token);
    localStorage.setItem(TOKEN_LOCAL_STORAGE_KEY, token.token);
  };

  const logout = () => {
    setToken(null);
    setUser(null);

    localStorage.removeItem(TOKEN_LOCAL_STORAGE_KEY);
  };

  const value: AuthState = {
    user: user!,
    token: token!,
    signUp,
    login,
    logout,
    isLoggedIn: !!token as true,
    isLoading,
    rest: restClient,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
export const useRest = () => useContext(AuthContext).rest;
