import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import {RestClient, RestError} from '../rest';

const TOKEN_LOCAL_STORAGE_KEY = 'token';

export type AuthUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  isClubAdmin: boolean;
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

export const AuthProvider = ({children}: PropsWithChildren) => {
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

    restClient
      .getUser()
      .then(user => setUser(user))
      .finally(() => setIsLoading(false));
  }, [token]);

  const signUp = async (
    signUpArgs: {
      [key in 'email' | 'password' | 'firstName' | 'lastName']: string;
    }
  ) => {
    setIsLoading(true);
    try {
      const token = await restClient.signUp(signUpArgs);
      setToken(token.token);
      localStorage.setItem(TOKEN_LOCAL_STORAGE_KEY, token.token);
    } catch (err) {
      if (err instanceof RestError) {
        console.error('Failed to sign up user:', err);
        throw err;
      }

      console.error('Unhandled error in signUp:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const token = await restClient.login({email, password});
      setToken(token.token);
      localStorage.setItem(TOKEN_LOCAL_STORAGE_KEY, token.token);
    } catch (err) {
      if (err instanceof RestError) {
        console.error('Failed to log in:', err);
        throw err;
      }

      console.error('Unhandled error:', err);
    } finally {
      setIsLoading(false);
    }
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
    isLoggedIn: (!!token && !!user) as true,
    isLoading,
    rest: restClient,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
export const useRest = () => useContext(AuthContext).rest;
