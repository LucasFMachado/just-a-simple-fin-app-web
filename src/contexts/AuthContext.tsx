import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import { useRouter } from "next/router";
import { api } from "../services/api";

interface IUser {
  id: string;
  name: string;
  email: string;
}

interface ISignInData {
  email: string;
  password: string;
}

interface IAuthContext {
  isAuthenticated: boolean;
  user: IUser | null;
  signIn: (credentials: ISignInData) => Promise<void>;
  signOut: () => void;
}

interface IAuthProvider {
  children: ReactNode;
}

export const AuthContext = createContext({} as IAuthContext);

export function AuthProvider({ children }: IAuthProvider) {
  const [user, setUser] = useState<IUser | null>(null);
  const router = useRouter();

  const isAuthenticated = !!user;

  useEffect(() => {
    const { "jasfa.token": token } = parseCookies();

    if (token) {
      api
        .get("/users/me")
        .then(({ data }) => {
          data && setUser(data);
        })
        .catch(() => {
          signOut();
        });
    }
  }, []);

  async function signIn({ email, password }: ISignInData) {
    const { data } = await api.post("users/authenticate", {
      email,
      password,
    });

    const { token, user } = data;

    setCookie(undefined, "jasfa.token", token, {
      maxAge: 60 * 60 * 1, // 1 hour
    });

    api.defaults.headers["Authorization"] = `Bearer ${token}`;

    setUser(user);

    router.push("/dashboard");
  }

  function signOut() {
    destroyCookie(undefined, "jasfa.token");
    router.push("/users");
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
