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
      // Make get user here, and then setUser(response.user)
    }
  }, []);

  async function signIn({ email, password }: ISignInData) {
    // Receive email and password and
    // make the signinRequest here sending email and password
    // and return token and user data
    const { data } = await api.post("user/authenticate", {
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
    destroyCookie(undefined, "jasfa.user");
    router.push("/users");
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
